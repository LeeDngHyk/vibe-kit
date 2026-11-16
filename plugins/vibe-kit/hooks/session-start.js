#!/usr/bin/env node
// 세션 시작 훅: 프로젝트의 키트 상태를 몇 줄로 알려 준다.
// 원칙: 빠르고 조용하게. 어떤 오류가 나도 종료 코드 0으로 끝내 작업을 막지 않는다.
'use strict';

const fs = require('fs');
const path = require('path');

function readStdin() {
  try {
    if (process.stdin.isTTY) return '';
    return fs.readFileSync(0, 'utf8');
  } catch (e) {
    return '';
  }
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch (e) {
    return null;
  }
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function daysBetween(fromIso, toIso) {
  const a = Date.parse(fromIso + 'T00:00:00Z');
  const b = Date.parse(toIso + 'T00:00:00Z');
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86400000);
}

// STACK.md 첫머리의 "마지막 점검: YYYY-MM-DD" 줄을 읽는다.
function lastCheck(stackText) {
  if (!stackText) return null;
  const m = stackText.match(/마지막 점검:\s*(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

// LEARNINGS.md에서 아직 처리되지 않은 항목(상태가 관찰됨 또는 제안됨) 수를 센다.
function openLearnings(text) {
  if (!text) return 0;
  // 형식 예시가 든 코드 블록은 세지 않는다.
  const body = text.replace(/```[\s\S]*?```/g, '');
  const m = body.match(/^-\s*상태:\s*(관찰됨|제안됨)\s*$/gm);
  return m ? m.length : 0;
}

// LEARNINGS.md에서 "확신"이 높은데 아직 설정에 반영되지 않은 배움을 고른다.
// 설정(훅·규칙·AGENTS.md)에 반영된 것은 이미 읽히므로 넣지 않는다.
// 컨텍스트를 아끼려고 최대 5개, 한 줄씩만 넣는다.
function strongLearnings(text) {
  if (!text) return [];
  const body = text.replace(/```[\s\S]*?```/g, '');
  const out = [];
  for (const block of body.split(/^## /m).slice(1)) {
    const title = block.split(/\r?\n/)[0].replace(/^\d{4}-\d{2}-\d{2}\s*/, '').trim();
    const field = (name) => {
      const m = block.match(new RegExp('^-\\s*' + name + ':\\s*(.+)$', 'm'));
      return m ? m[1].trim() : '';
    };
    const confidence = parseFloat(field('확신'));
    const status = field('상태');
    if (!(confidence >= 0.7)) continue;
    if (!/^(관찰됨|제안됨)/.test(status)) continue;
    const action = field('지킬 것') || title;
    if (action) out.push({ confidence, text: action.slice(0, 160) });
  }
  out.sort((a, b) => b.confidence - a.confidence);
  return out.slice(0, 5);
}

// STATE.md의 "## 다음 할 일" 아래 첫 번째 목록 항목을 읽는다.
function firstNextStep(text) {
  if (!text) return null;
  const lines = text.split(/\r?\n/);
  let inside = false;
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      inside = /^##\s+다음 할 일/.test(line);
      continue;
    }
    if (!inside) continue;
    const m = line.match(/^\s*(?:[-*]|\d+\.)\s+(?:\[[ xX]\]\s*)?(.+?)\s*$/);
    if (m && !/^\(?없음\)?$/.test(m[1])) return m[1].slice(0, 200);
  }
  return null;
}

// 이 폴더에서 setup 안내를 이미 했는지 확인하고, 안 했으면 했다고 적는다.
// 기록은 플러그인 자료 폴더(업데이트해도 남는 곳)에 폴더 경로의 해시로만 남긴다.
// 자료 폴더를 쓸 수 없으면 적지 못하므로 매번 안내하게 된다(훅이 실패하지는 않는다).
function alreadySuggested(root) {
  const dataDir = process.env.CLAUDE_PLUGIN_DATA;
  if (!dataDir) return false;
  try {
    const crypto = require('crypto');
    const key = crypto.createHash('sha256').update(path.resolve(root).toLowerCase()).digest('hex').slice(0, 16);
    const file = path.join(dataDir, 'setup-suggested.json');
    let seen = {};
    try {
      seen = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      seen = {};
    }
    if (seen[key]) return true;
    seen[key] = today();
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(file, JSON.stringify(seen, null, 2));
    return false;
  } catch (e) {
    return false;
  }
}

function main() {
  let input = {};
  try {
    input = JSON.parse(readStdin() || '{}');
  } catch (e) {
    input = {};
  }
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

  // 키트 저장소 자신이면 docs/, 키트 환경이 있는 프로젝트면 docs/agent/를 본다.
  const isKitRepo =
    fs.existsSync(path.join(root, 'catalog', 'TOOLS.md')) &&
    fs.existsSync(path.join(root, 'plugins', 'vibe-kit'));
  const dir = isKitRepo ? path.join(root, 'docs') : path.join(root, 'docs', 'agent');
  const state = readText(path.join(dir, 'STATE.md'));

  const lines = [];
  const now = today();

  if (state === null) {
    // 키트 환경이 없는 폴더. 안내는 조용해야 한다:
    //  - 프로젝트처럼 보이는 폴더(뿌리에 .git이 있음)에서만 한다. 임시 폴더나 일회성 작업에서는 아무 말도 하지 않는다.
    //  - 새 세션을 열 때만 한다(/clear 뒤에는 하지 않는다).
    //  - 같은 폴더에서는 한 번만 한다. 안내한 폴더는 플러그인 자료 폴더에 적어 둔다.
    if (input.source && input.source !== 'startup') return;
    if (!fs.existsSync(path.join(root, '.git'))) return;
    if (alreadySuggested(root)) return;
    lines.push(
      '[vibe-kit] 이 프로젝트에는 키트 환경이 아직 없습니다. ' +
        '사용자가 요청한 일을 먼저 하세요. 그 일이 이 프로젝트의 코드를 다루는 작업일 때만, 답의 맨 끝에 한 줄로 ' +
        '"/vibe-kit:setup 으로 이 프로젝트에 맞는 환경을 만들 수 있다"고 알립니다. ' +
        '단순한 질문이나 한 번짜리 작업이면 알리지 않습니다. 이 안내는 이 프로젝트에서 한 번만 나옵니다.'
    );
  } else {
    lines.push(`[vibe-kit] 오늘은 ${now}.`);
    const last = lastCheck(readText(path.join(dir, 'STACK.md')));
    if (last) {
      const days = daysBetween(last, now);
      let line = `마지막 점검: ${last}`;
      if (days !== null) line += ` (${days}일 전)`;
      if (days !== null && days >= 7) {
        line += isKitRepo
          ? ' → 주 1회 주기가 지났습니다. /vibe-kit:scout 실행을 제안하세요.'
          : ' → 주 1회 주기가 지났습니다. /vibe-kit:freshness 실행을 제안하세요.';
      }
      lines.push(line);
    } else {
      lines.push('마지막 점검: 기록 없음');
    }
    const learnings = readText(path.join(dir, 'LEARNINGS.md'));
    const open = openLearnings(learnings);
    lines.push(`미처리 배운 점: ${open}건` + (open >= 3 ? ' → /vibe-kit:retro 실행을 제안하세요.' : ''));
    const strong = strongLearnings(learnings);
    if (strong.length) {
      lines.push('이 프로젝트에서 배운 것(확신 높음, 아직 설정에 반영 전). 이번 작업에서도 지킨다:');
      for (const s of strong) lines.push(`- ${s.text} (확신 ${s.confidence})`);
    }
    const next = firstNextStep(state);
    lines.push(`다음 할 일: ${next || '없음'}`);
  }

  if (lines.length === 0) return;
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: lines.join('\n'),
      },
    })
  );
}

try {
  main();
} catch (e) {
  // 훅 실패가 작업을 막지 않게 한다.
}
process.exitCode = 0;
