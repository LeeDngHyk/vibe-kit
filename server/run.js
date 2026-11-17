#!/usr/bin/env node
// 정기 실행 스크립트. Claude Code를 대화 없이 실행해 키트의 순환을 돌린다.
//
//   node server/run.js scout       키트 저장소에서 도구 탐색(scout)을 한 번 돌린다
//   node server/run.js freshness   server/projects.json의 프로젝트마다 최신 점검(freshness)을 돌린다
//   node server/run.js all         위 둘을 차례로 돌린다
//   node server/run.js scout --dry-run   실행할 명령만 보여 주고 끝낸다
//
// 서버에서도, 개인 컴퓨터에서도 같은 방식으로 돈다. 필요한 것은 이 저장소와 인증 두 가지다.
// 인증 토큰은 환경 변수(CLAUDE_CODE_OAUTH_TOKEN)에 두고 저장소에는 넣지 않는다.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const WORK = path.join(__dirname, '.work');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const baseSettings = JSON.parse(fs.readFileSync(path.join(__dirname, 'unattended.settings.json'), 'utf8'));
const DRY = process.argv.includes('--dry-run');
// 시험할 때만 쓰는 덮어쓰기: VIBE_KIT_TIMEOUT_MINUTES=0.1 처럼 주면 그 값을 시간 상한으로 쓴다.
const TIMEOUT_MINUTES = Number(process.env.VIBE_KIT_TIMEOUT_MINUTES) > 0 ? Number(process.env.VIBE_KIT_TIMEOUT_MINUTES) : config.timeoutMinutes;

// claude 실행 파일을 찾는다. Windows에서 셸을 거쳐 실행하면 시간 상한을 넘겼을 때 셸만 끝나고
// claude 프로세스가 남으므로, 실행 파일(.exe)을 찾을 수 있으면 셸 없이 직접 실행한다.
function claudeCommand() {
  if (process.platform !== 'win32') return { command: 'claude', shell: false };
  const found = spawnSync('where', ['claude'], { encoding: 'utf8' });
  const exe = (found.stdout || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((s) => s.toLowerCase().endsWith('.exe'));
  return exe ? { command: exe, shell: false } : { command: 'claude', shell: true };
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function sh(command, cwd) {
  const r = spawnSync(command, { cwd, shell: true, encoding: 'utf8' });
  return { ok: r.status === 0, out: `${r.stdout || ''}${r.stderr || ''}`.trim() };
}

// 경로를 실행 폴더 기준 상대 경로로 바꾼다(빈칸이 든 절대 경로를 명령줄에 넣지 않기 위해).
function rel(from, to) {
  return path.relative(from, to).split(path.sep).join('/') || '.';
}

// Claude Code를 대화 없이 한 번 실행한다. 요청문은 표준 입력으로 넘긴다.
function runClaude(cwd, prompt, settingsFile) {
  const args = [
    '-p',
    '--plugin-dir', rel(cwd, path.join(ROOT, 'plugins', 'vibe-kit')),
    '--settings', rel(cwd, settingsFile),
    '--permission-mode', 'acceptEdits', // 작업 폴더 안의 파일 수정은 묻지 않는다
    '--permission-prompts', 'none', // 승인이 필요한 나머지는 묻지 않고 거부한다
    '--max-turns', String(config.maxTurns),
    '--max-budget-usd', String(config.maxBudgetUsd),
    '--output-format', 'json',
  ];
  if (config.model) args.push('--model', config.model);
  if (DRY) {
    console.log(`[미리 보기] (${rel(ROOT, cwd)}) claude ${args.join(' ')}`);
    return { ok: true, denied: [], deniedCount: 0, summary: '미리 보기', cost: 0 };
  }
  const exe = claudeCommand();
  const r = spawnSync(exe.command, args, {
    cwd,
    input: prompt,
    encoding: 'utf8',
    shell: exe.shell,
    timeout: TIMEOUT_MINUTES * 60 * 1000,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.error) {
    // 시간 상한을 넘겼을 때, Windows에서는 셸만 끝나고 그 아래의 claude 프로세스가 남는다.
    // 남은 프로세스가 계속 일하며 사용량을 쓰지 않도록 프로세스 묶음 전체를 끝낸다.
    if (r.error.code === 'ETIMEDOUT' && exe.shell && r.pid) {
      spawnSync('taskkill', ['/F', '/T', '/PID', String(r.pid)], { stdio: 'ignore' });
    }
    const why = r.error.code === 'ETIMEDOUT' ? `시간 상한(${TIMEOUT_MINUTES}분) 초과` : r.error.message;
    return { ok: false, denied: [], deniedCount: 0, summary: why, cost: 0 };
  }
  let result = null;
  try {
    result = JSON.parse(r.stdout);
  } catch (e) {
    /* JSON이 아니면 아래에서 원문 끝부분을 쓴다 */
  }
  const text = result && typeof result.result === 'string' ? result.result : `${r.stdout || ''}${r.stderr || ''}`;
  const ok = r.status === 0 && !(result && result.is_error);
  // 승인이 필요해 거부된 호출. 실행은 끝까지 가도 할 일을 못 했을 수 있으므로 따로 센다.
  const denials = result && Array.isArray(result.permission_denials) ? result.permission_denials : [];
  const denied = denials
    .map((d) => {
      const input = d && d.tool_input ? d.tool_input.command || d.tool_input.file_path || d.tool_input.url || '' : '';
      return `${(d && d.tool_name) || '?'}: ${String(input).replace(/\s+/g, ' ').slice(0, 80)}`;
    })
    .slice(0, 5);
  return {
    ok,
    denied,
    deniedCount: denials.length,
    summary: text.trim().slice(-600) || '(출력 없음)',
    cost: result && result.total_cost_usd ? result.total_cost_usd : 0,
  };
}

// 실패한 실행을 docs/STATE.md의 실행 기록에 남긴다. 성공한 실행의 기록은 스킬이 직접 남긴다.
function recordFailure(what, summary, label) {
  const file = path.join(ROOT, 'docs', 'STATE.md');
  const line = `- ${today()} | ${what} | ${label || '실패'} | ${summary.replace(/\s+/g, ' ').slice(0, 300)}\n`;
  let text = fs.readFileSync(file, 'utf8');
  const marker = '<!-- 실행 기록: 새 줄을 이 표시 바로 아래에 넣는다 -->\n';
  text = text.includes(marker) ? text.replace(marker, marker + line) : text + '\n' + line;
  fs.writeFileSync(file, text);
  sh('git add docs/STATE.md', ROOT);
  sh(`git commit -m "chore(kit): ${what} ${label || '실패'} 기록"`, ROOT);
  const pushed = sh('git push', ROOT);
  if (!pushed.ok) console.error('기록을 원격에 올리지 못했습니다: ' + pushed.out);
}

// 기록만 바꾼 변경 제안을 검사해 병합한다(catalog/POLICY.md의 "스스로 병합한다").
// 모델에게 병합 권한을 주지 않고, 바뀐 파일을 이 스크립트가 직접 검사한다.
const RECORD_ONLY = [/^catalog\/TOOLS\.md$/, /^docs\/(STATE|STACK|LEARNINGS)\.md$/];
function mergeRecordOnlyProposals() {
  const remote = sh('git remote get-url origin', ROOT);
  if (!remote.ok || !/github\.com/.test(remote.out) || !sh('gh --version', ROOT).ok) {
    console.log('원격이 깃허브가 아니거나 gh가 없어 자동 병합을 건너뜁니다. 올라간 가지를 직접 확인하세요.');
    return;
  }
  const list = sh('gh pr list --state open --json number,headRefName,files', ROOT);
  if (!list.ok) return console.error('변경 제안 목록을 읽지 못했습니다: ' + list.out);
  for (const pr of JSON.parse(list.out)) {
    if (!pr.headRefName.startsWith('scout/')) continue;
    const files = (pr.files || []).map((f) => f.path);
    const recordOnly = files.length > 0 && files.every((f) => RECORD_ONLY.some((re) => re.test(f)));
    if (!recordOnly) {
      console.log(`#${pr.number} (${pr.headRefName}): 기록 밖의 파일을 바꿉니다. 사용자가 병합할 때까지 둡니다.`);
      continue;
    }
    const base = sh('git rev-parse --abbrev-ref HEAD', ROOT).out;
    const checked =
      sh(`git fetch origin ${pr.headRefName}`, ROOT).ok && sh(`git checkout --detach origin/${pr.headRefName}`, ROOT).ok;
    const valid = checked && sh('node scripts/validate.js', ROOT).ok;
    sh(`git checkout ${base}`, ROOT);
    if (!valid) {
      console.log(`#${pr.number}: 형식 검증을 통과하지 못해 병합하지 않습니다.`);
      continue;
    }
    const merged = sh(`gh pr merge ${pr.number} --squash --delete-branch`, ROOT);
    console.log(merged.ok ? `#${pr.number}: 기록 갱신이라 스스로 병합했습니다.` : `#${pr.number}: 병합 실패: ${merged.out}`);
  }
  sh('git pull --ff-only', ROOT);
}

function runScout() {
  console.log('== scout: 도구 탐색 ==');
  if (!DRY) {
    // 커밋하지 않은 수정이 있으면 시작하지 않는다. 실행 중에 가지를 오가므로 섞이면 잃을 수 있다.
    const dirty = sh('git status --porcelain', ROOT);
    if (dirty.out) {
      console.error('커밋하지 않은 수정이 있어 시작하지 않습니다. 먼저 커밋하거나 치워 두세요:\n' + dirty.out);
      return false;
    }
    sh('git pull --ff-only', ROOT);
  }
  const prompt =
    '이것은 사람이 없는 정기 실행이다. 질문하지 말고, 승인이 필요한 일은 하지 말고 보고에 모아 둔다.\n' +
    'vibe-kit 플러그인의 scout 스킬을 실행하라(/vibe-kit:scout). 스킬의 절차와 catalog/POLICY.md를 따른다.\n' +
    '명령 실행 규칙: 이 실행은 허용 목록에 있는 명령만 실행할 수 있고, 목록은 명령 하나씩과 맞춰 본다. ' +
    '그러니 셸 명령은 한 번에 하나만 실행한다. &&, ;, | 로 여러 명령을 잇거나 cd 를 앞에 붙이면 통째로 거부된다. ' +
    '예: git switch -c <가지> 를 실행하고, 그다음 git add <파일> 을 따로, 그다음 git commit -m "..." 을 따로, 그다음 git push -u origin <가지> 를 따로, 그다음 gh pr create ... 를 따로 실행한다. ' +
    '웹에서 무엇을 가져올 때는 curl 이 아니라 웹 조회 도구를 쓴다. 파일을 고칠 때는 셸이 아니라 파일 편집 도구를 쓴다. ' +
    '어떤 명령이 거부되면 같은 명령을 되풀이하지 말고, 하나씩 나눠 다시 해 보고, 그래도 안 되면 보고에 적는다.\n' +
    '기본 가지에 바로 올리는 것은 이 실행에서 막혀 있다. 디자인 도구의 기록도 가지와 변경 제안으로 올린다.\n' +
    '변경 제안은 만들되 병합하지 않는다. 병합은 이 실행이 끝난 뒤 실행 스크립트가 바뀐 파일을 검사해서 한다.\n' +
    '마지막에 한 일, 만든 변경 제안, 실패한 것과 원인을 한국어로 짧게 보고하라.';
  const r = runClaude(ROOT, prompt, path.join(__dirname, 'unattended.settings.json'));
  console.log(r.summary);
  if (DRY) return true;
  // 가지에 담기지 않고 남은 수정은 지우지 않고 따로 보관한다(git stash list로 볼 수 있다).
  if (sh('git status --porcelain', ROOT).out) {
    sh(`git stash push -u -m "scout-leftover-${today()}"`, ROOT);
    console.log('가지에 담기지 않은 수정이 남아 보관했습니다: git stash list 로 확인하세요.');
  }
  const base = sh('git symbolic-ref --short refs/remotes/origin/HEAD', ROOT);
  if (base.ok) sh(`git checkout ${base.out.replace(/^origin\//, '')}`, ROOT);
  if (r.deniedCount > 0) {
    console.log(`거부된 호출 ${r.deniedCount}건:`);
    for (const d of r.denied) console.log('  - ' + d);
  }
  if (!r.ok) recordFailure('scout', r.summary);
  else if (r.deniedCount > 0) {
    // 실행은 끝났지만 일부 명령이 거부됐다. 할 일을 못 했을 수 있으니 기록하고, 올라온 것이 있으면 병합 검사는 한다.
    recordFailure('scout', `거부된 호출 ${r.deniedCount}건(${r.denied.join(' / ')}). 허용 목록(server/unattended.settings.json)을 확인할 것`, '일부 거부됨');
    mergeRecordOnlyProposals();
  } else mergeRecordOnlyProposals();
  return r.ok && r.deniedCount === 0;
}

function runFreshness() {
  console.log('== freshness: 프로젝트 최신 점검 ==');
  const { projects } = JSON.parse(fs.readFileSync(path.join(__dirname, 'projects.json'), 'utf8'));
  if (!projects || projects.length === 0) {
    console.log('관리 대상 프로젝트가 없습니다. server/projects.json에 더하세요.');
    return true;
  }
  fs.mkdirSync(WORK, { recursive: true });
  let allOk = true;
  for (const project of projects) {
    if (!/^[A-Za-z0-9._-]+$/.test(project.name || '')) {
      console.error(`이름이 올바르지 않아 건너뜁니다(영문·숫자·점·밑줄·붙임표만): ${project.name}`);
      allOk = false;
      continue;
    }
    console.log(`-- ${project.name} --`);
    const dir = path.join(WORK, project.name);
    if (!DRY) {
      const got = fs.existsSync(dir) ? sh('git pull --ff-only', dir) : sh(`git clone "${project.repo}" "${project.name}"`, WORK);
      if (!got.ok) {
        recordFailure(`freshness(${project.name})`, '저장소를 내려받지 못함: ' + got.out);
        allOk = false;
        continue;
      }
    }
    // 프로젝트마다 허용 명령을 더한 설정 파일을 만든다.
    const settings = JSON.parse(JSON.stringify(baseSettings));
    settings.permissions.allow = settings.permissions.allow.concat(project.allow || []);
    const settingsFile = path.join(WORK, `settings-${project.name}.json`);
    if (!DRY) fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
    const prompt =
      '이것은 사람이 없는 정기 실행이다. 질문하지 말고, 승인이 필요한 일은 하지 말고 보고에 모아 둔다.\n' +
      'vibe-kit 플러그인의 freshness 스킬을 정기 점검 방식으로 실행하라(/vibe-kit:freshness audit).\n' +
      '명령 실행 규칙: 이 실행은 허용 목록에 있는 명령만 실행할 수 있고, 목록은 명령 하나씩과 맞춰 본다. ' +
      '그러니 셸 명령은 한 번에 하나만 실행한다. &&, ;, | 로 여러 명령을 잇거나 cd 를 앞에 붙이면 통째로 거부된다. ' +
      '예: git switch -c <가지> 를 실행하고, 그다음 git add <파일> 을 따로, 그다음 git commit -m "..." 을 따로, 그다음 git push -u origin <가지> 를 따로, 그다음 gh pr create ... 를 따로 실행한다. ' +
      '웹에서 무엇을 가져올 때는 curl 이 아니라 웹 조회 도구를 쓴다. 파일을 고칠 때는 셸이 아니라 파일 편집 도구를 쓴다. ' +
      '어떤 명령이 거부되면 같은 명령을 되풀이하지 말고, 하나씩 나눠 다시 해 보고, 그래도 안 되면 보고에 적는다.\n' +

      '의존성을 설치하거나 버전을 올리지 않는다. docs/agent/의 기록만 고쳐 새 가지(freshness/<날짜>)에 커밋하고, 가지를 올려 변경 제안을 만든다.\n' +
      '마지막에 한 일, 만든 변경 제안, 실패한 것과 원인을 한국어로 짧게 보고하라.';
    const r = runClaude(DRY ? WORK : dir, prompt, settingsFile);
    console.log(r.summary);
    if (!DRY && r.deniedCount > 0) {
      console.log(`거부된 호출 ${r.deniedCount}건:`);
      for (const d of r.denied) console.log('  - ' + d);
    }
    if (!DRY && !r.ok) {
      recordFailure(`freshness(${project.name})`, r.summary);
      allOk = false;
    } else if (!DRY && r.deniedCount > 0) {
      recordFailure(`freshness(${project.name})`, `거부된 호출 ${r.deniedCount}건(${r.denied.join(' / ')})`, '일부 거부됨');
      allOk = false;
    }
  }
  return allOk;
}

const mode = process.argv[2];
let ok = true;
if (mode === 'scout') ok = runScout();
else if (mode === 'freshness') ok = runFreshness();
else if (mode === 'all') {
  const a = runScout();
  const b = runFreshness();
  ok = a && b;
} else {
  console.log('쓰는 법: node server/run.js <scout|freshness|all> [--dry-run]');
  console.log('  scout      키트 저장소에서 도구 탐색을 한 번 돌린다');
  console.log('  freshness  server/projects.json의 프로젝트마다 최신 점검을 돌린다');
  console.log('  all        둘을 차례로 돌린다');
  console.log('  --dry-run  실행할 명령만 보여 준다');
  process.exit(mode ? 2 : 0);
}
process.exit(ok ? 0 : 1);
