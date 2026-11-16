#!/usr/bin/env node
// 계속 배우기 훅(UserPromptSubmit).
// 사용자의 말이 교정("아니, 그게 아니라…")이나 계속 지켜 달라는 요청("앞으로는 항상…")으로 보이면,
// 그 일을 끝낼 때 배운 점을 기록하라고 모델에게 한 줄 알려 준다. 기록은 모델이 한다.
//
// 원칙:
//  - 키트 환경이 있는 프로젝트(docs/agent/LEARNINGS.md)와 키트 저장소에서만 동작한다. 그 밖에서는 조용하다.
//  - 사용자의 말을 어디에도 저장하지 않는다. 이 자리에서 무늬만 보고 버린다.
//  - 빠르고, 실패해도 종료 코드 0으로 끝내 작업을 막지 않는다.
//  - 잘못 짚을 수 있다. 그래서 "교정이 아니면 무시하라"고 함께 알려 준다.
'use strict';

const fs = require('fs');
const path = require('path');

// 교정으로 보이는 말. 한국어와 영어만 본다(다른 언어에서는 조용하다).
const CORRECTION = [
  /(^|[\s,.!?])(아니|아냐|아닌데|아니라고)([\s,.!?]|$)/,
  /그게 아니라|그거 말고|그게 아니고|그렇게 말고|이게 아니라/,
  /다시 (해|만들|써|고쳐|작성)|원래대로|되돌려|취소해/,
  /틀렸|잘못(됐|했)|안 되잖|안되잖/,
  /하지 ?마|하지 말(라|랬|고)|왜 (또|자꾸|계속)|또 (그러|틀|빼먹|까먹)/,
  /(내가|아까|전에|분명) .{0,12}(말했|그랬|얘기했|부탁했)|말했잖|몇 번(을|이나|째)/,
  /\b(no|nope),? (that|this|it|you|not|don'?t|i )/i,
  /\b(that'?s|this is|it'?s) (not|wrong|incorrect)\b|\bnot what i (asked|meant|wanted)\b/i,
  /\b(i (already )?(told|said|asked)|as i said|like i said|again,)\b/i,
  /\b(revert|undo|roll ?back) (that|this|it|the)\b|\bstop (doing|adding|changing|using)\b/i,
];
// 계속 지켜 달라는 요청으로 보이는 말.
const STANDING = [
  /앞으로(는|도)?[\s,]|이제부터|다음부터|계속 지켜|기억해 ?(둬|줘|라)/,
  // "항상", "절대" 같은 말은 요청하는 끝말과 함께일 때만 본다("항상 켜져 있는 서버"는 지속 요청이 아니다).
  /(항상|매번|절대|반드시) .{0,30}(해 ?줘|해라|하지 ?마|하지 말|써 ?줘|써라|지켜|말아 ?줘)/,
  /\b(from now on|going forward|always |never |every time|remember (to|that)|make sure (to|you) always)\b/i,
];

function main() {
  let input = {};
  try {
    input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch (e) {
    return;
  }
  const prompt = typeof input.prompt === 'string' ? input.prompt : '';
  if (!prompt || prompt.startsWith('/')) return; // 슬래시 명령은 보지 않는다.

  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const isKitRepo =
    fs.existsSync(path.join(root, 'catalog', 'TOOLS.md')) && fs.existsSync(path.join(root, 'plugins', 'vibe-kit'));
  const file = isKitRepo ? path.join('docs', 'LEARNINGS.md') : path.join('docs', 'agent', 'LEARNINGS.md');
  if (!fs.existsSync(path.join(root, file))) return;

  // 붙여 넣은 긴 글은 교정이 아니라 자료일 때가 많다. 앞부분만 본다.
  const head = prompt.slice(0, 400);
  const standing = STANDING.some((re) => re.test(head));
  const correction = CORRECTION.some((re) => re.test(head));
  if (!standing && !correction) return;

  const where = file.split(path.sep).join('/');
  const kind = standing
    ? '계속 지켜 달라는 요청(확신 0.9로 기록)'
    : '교정(같은 내용이 이미 있으면 그 항목의 관찰 횟수와 확신을 올리고, 없으면 확신 0.3으로 새로 기록)';
  const text =
    `[vibe-kit] 방금 사용자의 말은 ${standing ? '계속 지켜 달라는 요청' : '교정'}으로 보입니다. ` +
    `요청한 일을 먼저 하세요. 일을 끝낼 때 ${where}에 배운 점을 적습니다: ${kind}. ` +
    '형식은 그 파일 첫머리에 있습니다. 근거 칸에는 사용자의 말을 그대로 옮기되 비밀값은 옮기지 않습니다. ' +
    '교정이나 지속 요청이 아니라고 판단되면 이 안내를 무시하고, 기록했다는 말은 답 끝에 한 줄로만 합니다.';

  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: text } })
  );
}

try {
  main();
} catch (e) {
  // 훅 실패가 작업을 막지 않게 한다.
}
process.exitCode = 0;
