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
    lines.push(
      `[vibe-kit] 오늘은 ${now}. 이 폴더에는 키트 환경이 아직 없습니다. ` +
        '사용자가 환경을 원하면 /vibe-kit:setup 실행을 한 줄로 안내하세요. 원하지 않으면 다시 권하지 않습니다.'
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
    const open = openLearnings(readText(path.join(dir, 'LEARNINGS.md')));
    lines.push(`미처리 배운 점: ${open}건` + (open >= 3 ? ' → /vibe-kit:retro 실행을 제안하세요.' : ''));
    const next = firstNextStep(state);
    lines.push(`다음 할 일: ${next || '없음'}`);
  }

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
