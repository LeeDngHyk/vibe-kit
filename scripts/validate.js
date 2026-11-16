#!/usr/bin/env node
// 키트 저장소의 형식 검증.
//
//   node scripts/validate.js          검사만 한다. 문제가 있으면 종료 코드 1
//   node scripts/validate.js --sync   catalog/TOOLS.md의 "채택" 줄로 adopted-tools.md를 다시 만든 뒤 검사한다
//   node scripts/validate.js --cli    위 검사에 더해 `claude plugin validate`도 실행한다(Claude Code가 설치돼 있을 때)
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PLUGIN = path.join(ROOT, 'plugins', 'vibe-kit');
const TOOLS = path.join(ROOT, 'catalog', 'TOOLS.md');
const ADOPTED = path.join(PLUGIN, 'skills', 'setup', 'adopted-tools.md');
const STATUSES = ['후보', '시험 중', '채택', '보류', '거절', '퇴출'];
const errors = [];
const fail = (msg) => errors.push(msg);
const relPath = (f) => path.relative(ROOT, f).split(path.sep).join('/');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.work') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// --- 1. 있어야 하는 파일
const REQUIRED = [
  '.claude-plugin/marketplace.json',
  'plugins/vibe-kit/.claude-plugin/plugin.json',
  'plugins/vibe-kit/skills/setup/SKILL.md',
  'plugins/vibe-kit/skills/retro/SKILL.md',
  'plugins/vibe-kit/skills/freshness/SKILL.md',
  'plugins/vibe-kit/skills/scout/SKILL.md',
  'plugins/vibe-kit/agents/researcher.md',
  'plugins/vibe-kit/agents/reviewer.md',
  'plugins/vibe-kit/hooks/hooks.json',
  'plugins/vibe-kit/hooks/session-start.js',
  'catalog/TOOLS.md',
  'catalog/POLICY.md',
  'docs/STATE.md',
  'docs/LEARNINGS.md',
  'docs/STACK.md',
  'server/README.md',
  'server/run.js',
  'server/projects.json',
  'README.md',
];
for (const f of REQUIRED) if (!fs.existsSync(path.join(ROOT, f))) fail(`있어야 하는 파일이 없음: ${f}`);

const files = walk(ROOT);

// --- 2. JSON 파일이 올바른가, 빈 파일은 없는가
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  if (text.trim() === '') fail(`내용이 없는 빈 파일: ${relPath(f)}`);
  if (f.endsWith('.json')) {
    try {
      JSON.parse(text);
    } catch (e) {
      fail(`JSON 형식 오류: ${relPath(f)}: ${e.message}`);
    }
  }
}

// --- 3. 마켓플레이스 항목 이름과 플러그인 이름이 같은가, 버전을 적지 않았는가
try {
  const market = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin', 'marketplace.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(path.join(PLUGIN, '.claude-plugin', 'plugin.json'), 'utf8'));
  const entry = (market.plugins || []).find((p) => p.source === './plugins/vibe-kit');
  if (!entry) fail('marketplace.json에 ./plugins/vibe-kit 항목이 없음');
  else if (entry.name !== manifest.name) fail(`마켓플레이스 항목 이름(${entry.name})과 플러그인 이름(${manifest.name})이 다름`);
  if (manifest.version || (entry && entry.version)) {
    fail('version을 적지 않는다(커밋을 따라가는 방식). README.md의 "버전" 절 참고');
  }
} catch (e) {
  /* 위 2에서 이미 보고됨 */
}

// --- 4. 스킬과 서브에이전트의 머리말
function frontmatter(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const fields = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2];
  }
  return fields;
}
for (const name of ['setup', 'retro', 'freshness', 'scout']) {
  const f = path.join(PLUGIN, 'skills', name, 'SKILL.md');
  if (!fs.existsSync(f)) continue;
  const fm = frontmatter(f);
  if (!fm) fail(`머리말(--- 사이의 항목)이 첫 줄에서 시작하지 않음: ${relPath(f)}`);
  else {
    if (!fm.description) fail(`description이 없음: ${relPath(f)}`);
    else if (fm.description.length > 1536) fail(`description이 1,536자를 넘음: ${relPath(f)}`);
  }
}
// 스킬 글 안의 프로젝트 경로 변수는 스킬을 읽을 때 실제 경로로 바뀌어 버린다. 설정에 옮겨 적을 값은 본 파일에 둔다.
for (const name of ['setup', 'retro', 'freshness', 'scout']) {
  const f = path.join(PLUGIN, 'skills', name, 'SKILL.md');
  if (fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('${CLAUDE_' + 'PROJECT_DIR}')) {
    fail(`스킬 글에 프로젝트 경로 변수가 있음(읽을 때 실제 경로로 바뀜). 본 파일로 옮긴다: ${relPath(f)}`);
  }
}
for (const name of ['researcher', 'reviewer']) {
  const f = path.join(PLUGIN, 'agents', `${name}.md`);
  if (!fs.existsSync(f)) continue;
  const fm = frontmatter(f);
  if (!fm) fail(`머리말이 없음: ${relPath(f)}`);
  else {
    if (fm.name !== name) fail(`name이 파일 이름과 다름: ${relPath(f)}`);
    if (!fm.description) fail(`description이 없음: ${relPath(f)}`);
    if (!fm.tools) fail(`tools가 없음(도구를 좁혀야 함): ${relPath(f)}`);
    // 모델은 고정된 이름 대신 별칭이나 "부모와 같음"으로 지정한다.
    if (fm.model && !['inherit', 'sonnet', 'opus', 'haiku', 'fable'].includes(fm.model)) {
      fail(`model은 별칭이나 inherit로 적는다: ${relPath(f)}`);
    }
    for (const ignored of ['permissionMode', 'hooks', 'mcpServers']) {
      if (ignored in fm) fail(`플러그인 서브에이전트에서 무시되는 항목: ${ignored}: ${relPath(f)}`);
    }
  }
}

// --- 5. 절대 경로, 이 컴퓨터의 사용자 이름, 비밀값이 없는가
const user = (() => {
  try {
    return os.userInfo().username;
  } catch (e) {
    return '';
  }
})();
// 사용자 이름 검사는 개인을 가리키는 이름일 때만 한다. 서버나 클라우드의 흔한 계정 이름
// (root 등)은 개인 정보가 아니고 보통 낱말과 겹쳐서 검사하지 않는다.
// 다른 낱말의 일부로 들어간 것은 잡지 않도록 낱말 경계로 찾는다.
const GENERIC_USERS = new Set([
  'root', 'admin', 'administrator', 'user', 'users', 'guest', 'default', 'public', 'system',
  'ubuntu', 'debian', 'centos', 'fedora', 'ec2-user', 'azureuser', 'runner', 'runneradmin',
  'node', 'claude', 'agent', 'build', 'builder', 'docker', 'vscode', 'codespace', 'gitpod',
  'circleci', 'jenkins', 'nobody', 'daemon', 'service', 'test', 'tester', 'developer',
  'vibekit', 'vibe-kit', // server/README.md가 만들라고 안내하는 전용 계정 이름
]);
const userPattern =
  user && user.length >= 4 && !GENERIC_USERS.has(user.toLowerCase())
    ? new RegExp(`(?<![A-Za-z0-9])${user.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9])`, 'i')
    : null;
const PATTERNS = [
  [/(?<![A-Za-z])[A-Za-z]:\\(?:Users|Workspace|Documents and Settings)\\/i, 'Windows 절대 경로'],
  [/\/(?:Users|home)\/(?!you\b|\.\.\.)[A-Za-z0-9._-]+\//, '사용자 폴더 절대 경로'],
  [/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/, '깃허브 토큰'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/, '깃허브 토큰'],
  [/\bsk-ant-[A-Za-z0-9_-]{20,}/, 'Anthropic 키 또는 토큰'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS 키'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, '개인 키'],
  [/https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/(?:claude-)?vibe-kit\b/i, '고정된 키트 저장소 주소(개인 서버로 옮길 수 있어야 함)'],
];
for (const f of files) {
  if (!/\.(md|json|js|txt|ya?ml)$/.test(f) && path.basename(f) !== '.gitignore') continue;
  const text = fs.readFileSync(f, 'utf8');
  text.split(/\r?\n/).forEach((line, i) => {
    for (const [re, label] of PATTERNS) if (re.test(line)) fail(`${label}: ${relPath(f)}:${i + 1}`);
    if (userPattern && userPattern.test(line)) {
      fail(`이 컴퓨터의 사용자 이름: ${relPath(f)}:${i + 1}`);
    }
  });
}

// --- 6. TOOLS.md 표와 adopted-tools.md
function toolRows() {
  const rows = [];
  for (const line of fs.readFileSync(TOOLS, 'utf8').split(/\r?\n/)) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells[0] === '이름' || /^-+$/.test(cells[0])) continue;
    rows.push({ line, cells });
  }
  return rows;
}
function adoptedText(rows) {
  const head =
    '# 채택한 도구\n\n' +
    '`catalog/TOOLS.md`에서 상태가 "채택"인 줄만 옮긴 것이다. 이 파일은 손으로 고치지 않는다. ' +
    '키트 저장소에서 `node scripts/validate.js --sync`를 실행하면 다시 만들어진다.\n\n' +
    'setup은 이 표에 있는 것 중 프로젝트의 형태와 언어에 해당하는 것만, 역할마다 하나씩 제안한다.\n\n' +
    '| 이름 | 역할 | 해당하는 프로젝트 | 설치 | 컨텍스트 비용 | 확인 날짜 |\n|---|---|---|---|---|---|\n';
  const adopted = rows.filter((r) => r.cells[2] === '채택');
  const body = adopted.map((r) => `| ${[r.cells[0], r.cells[1], r.cells[3], r.cells[4], r.cells[5], r.cells[7]].join(' | ')} |\n`).join('');
  return head + body + (adopted.length ? '' : '\n(아직 채택한 도구가 없다.)\n');
}
if (fs.existsSync(TOOLS)) {
  const rows = toolRows();
  const roles = {};
  for (const r of rows) {
    const name = r.cells[0];
    if (r.cells.length !== 9) fail(`TOOLS.md: 칸 수가 9가 아님: ${name}`);
    else {
      if (!STATUSES.includes(r.cells[2])) fail(`TOOLS.md: 상태가 올바르지 않음(${r.cells[2]}): ${name}`);
      if (r.cells[2] === '채택') {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(r.cells[7])) fail(`TOOLS.md: 채택한 도구에 확인 날짜가 없음: ${name}`);
        if (!/^https?:\/\//.test(r.cells[8])) fail(`TOOLS.md: 채택한 도구에 출처 주소가 없음: ${name}`);
        if (r.cells[4] === '-' || r.cells[4] === '') fail(`TOOLS.md: 채택한 도구에 설치 방법이 없음: ${name}`);
        (roles[r.cells[1]] = roles[r.cells[1]] || []).push(name);
      }
    }
  }
  for (const [role, names] of Object.entries(roles)) {
    if (names.length > 1) fail(`TOOLS.md: 같은 역할(${role})에 채택이 둘 이상: ${names.join(', ')}`);
  }
  const expected = adoptedText(rows);
  if (process.argv.includes('--sync')) {
    fs.writeFileSync(ADOPTED, expected);
    console.log('adopted-tools.md를 다시 만들었습니다.');
  } else if (!fs.existsSync(ADOPTED) || fs.readFileSync(ADOPTED, 'utf8').replace(/\r\n/g, '\n') !== expected) {
    fail('adopted-tools.md가 TOOLS.md의 "채택" 줄과 다름. node scripts/validate.js --sync 를 실행한다');
  }
}

// --- 7. 훅 스크립트가 예시 입력으로 오류 없이 끝나는가
function runHook(script, input, cwd) {
  const r = spawnSync(process.execPath, [script], { input: JSON.stringify(input), encoding: 'utf8', cwd, timeout: 20000 });
  if (r.status !== 0) fail(`훅이 0이 아닌 종료 코드로 끝남(${r.status}): ${relPath(script)}\n${r.stderr}`);
  return r.stdout || '';
}
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vibe-kit-validate-'));
  const env = { ...process.env };
  delete process.env.CLAUDE_PROJECT_DIR;
  const start = path.join(PLUGIN, 'hooks', 'session-start.js');
  const startInput = (cwd, source) => ({ hook_event_name: 'SessionStart', source: source || 'startup', cwd });
  const expectContext = (out, label) => {
    try {
      const parsed = JSON.parse(out);
      if (!parsed.hookSpecificOutput || !parsed.hookSpecificOutput.additionalContext) throw new Error('additionalContext 없음');
    } catch (e) {
      fail(`session-start.js(${label}) 출력이 기대한 JSON이 아님: ${e.message}`);
    }
  };
  const expectSilent = (out, label) => {
    if (out.trim() !== '') fail(`session-start.js(${label})는 아무것도 출력하지 않아야 함`);
  };
  // 키트 저장소: 상태를 알려 준다.
  expectContext(runHook(start, startInput(ROOT), ROOT), '키트 저장소');
  // 키트 환경이 없는 임시 폴더(.git 없음): 조용하다.
  expectSilent(runHook(start, startInput(tmp), tmp), '임시 폴더');
  // 키트 환경이 없는 프로젝트(.git 있음): 한 번만 안내하고, 두 번째와 /clear 뒤에는 조용하다.
  const proj = path.join(tmp, 'proj');
  fs.mkdirSync(path.join(proj, '.git'), { recursive: true });
  process.env.CLAUDE_PLUGIN_DATA = path.join(tmp, 'data');
  expectSilent(runHook(start, startInput(proj, 'clear'), proj), '프로젝트, /clear 뒤');
  expectContext(runHook(start, startInput(proj), proj), '프로젝트, 첫 세션');
  expectSilent(runHook(start, startInput(proj), proj), '프로젝트, 두 번째 세션');
  // 키트 환경이 있는 프로젝트: 매번 상태를 알려 준다.
  fs.mkdirSync(path.join(proj, 'docs', 'agent'), { recursive: true });
  fs.writeFileSync(path.join(proj, 'docs', 'agent', 'STATE.md'), '# 상태\n\n## 다음 할 일\n\n- 예시\n');
  expectContext(runHook(start, startInput(proj), proj), '환경 있는 프로젝트');
  runHook(start, {}, tmp); // 입력이 비어도 끝나야 한다
  // 프로젝트 훅 본: ES 모듈 방식 프로젝트(package.json에 "type": "module") 안에 복사해도 돌아야 한다.
  const esm = path.join(tmp, 'esm', '.claude', 'hooks');
  fs.mkdirSync(esm, { recursive: true });
  fs.writeFileSync(path.join(tmp, 'esm', 'package.json'), '{"type":"module"}');
  fs.copyFileSync(path.join(PLUGIN, 'templates', 'hooks', 'vibe-kit.json'), path.join(esm, 'vibe-kit.json'));
  for (const name of ['format-after-edit.cjs', 'check-before-stop.cjs']) {
    fs.copyFileSync(path.join(PLUGIN, 'templates', 'hooks', name), path.join(esm, name));
    runHook(path.join(esm, name), { cwd: tmp, tool_input: { file_path: path.join(tmp, 'none.txt') } }, path.join(tmp, 'esm'));
  }
  process.env = env;
  fs.rmSync(tmp, { recursive: true, force: true });
}

// --- 8. (선택) Claude Code의 형식 검증
if (process.argv.includes('--cli')) {
  for (const target of ['.', './plugins/vibe-kit']) {
    const r = spawnSync(`claude plugin validate ${target}`, { cwd: ROOT, shell: true, encoding: 'utf8' });
    if (r.status !== 0) fail(`claude plugin validate ${target} 실패:\n${r.stdout}${r.stderr}`);
  }
}

if (errors.length) {
  console.error(`검증 실패: ${errors.length}건`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('검증 통과');
