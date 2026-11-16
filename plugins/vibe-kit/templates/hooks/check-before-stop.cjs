#!/usr/bin/env node
// 종료 전 검사 훅(Stop).
// 같은 폴더의 vibe-kit.json에 적힌 검사 명령(타입 검사, 테스트 등)을 차례로 실행한다.
//   "check": { "commands": ["<명령>", ...], "timeoutSeconds": 120 }
// 하나라도 실패하면 Claude가 멈추지 않고 그 출력을 보고 고치게 한다.
// 한 번 막은 뒤 다시 불리면(stop_hook_active) 그냥 통과시켜 끝없이 막지 않는다.
// Claude Code도 연속 8번까지만 막도록 제한한다.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function tail(text, max) {
  if (!text) return '';
  return text.length > max ? '…' + text.slice(-max) : text;
}

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  if (!input.stop_hook_active) {
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'vibe-kit.json'), 'utf8'));
    const check = config.check || {};
    const commands = check.commands || [];
    const timeout = (check.timeoutSeconds || 120) * 1000;
    const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
    for (const command of commands) {
      // Windows에서는 셸의 오류 안내가 깨지지 않도록 출력 글자 집합을 UTF-8로 맞춘다.
      const line = process.platform === 'win32' ? `chcp 65001>nul & ${command}` : command;
      const r = spawnSync(line, { cwd: root, shell: true, encoding: 'utf8', timeout });
      if (r.error && r.error.code === 'ETIMEDOUT') continue; // 시간 초과는 실패로 보지 않는다.
      if (r.status !== 0) {
        const output = tail(`${r.stdout || ''}\n${r.stderr || ''}`.trim(), 3000);
        process.stdout.write(
          JSON.stringify({
            decision: 'block',
            reason:
              `종료 전 검사가 실패했습니다: ${command}\n\n${output}\n\n` +
              '원인을 고친 뒤 다시 끝내세요. 이번 변경과 무관한 기존 실패라면 고치지 말고 그 사실을 보고에 적으세요. ' +
              '어느 쪽이든 마지막 답에는 사용자가 원래 요청한 일의 결과를 처음부터 다시 다 적고, 이 검사 이야기는 그 뒤에 짧게 덧붙이세요. 검사 이야기만 남기면 원래 답이 묻힙니다.',
          })
        );
        break;
      }
    }
  }
} catch (e) {
  // 검사 자체의 오류는 작업을 막지 않는다.
}
process.exitCode = 0;
