#!/usr/bin/env node
// 수정 후 자동 정리 훅(PostToolUse, Write|Edit).
// 같은 폴더의 vibe-kit.json에 적힌 포맷터 명령을 방금 고친 파일에 실행한다.
//   "format": { "command": "<포맷터 명령>", "extensions": [".확장자", ...] }
// 명령 끝에 파일 경로가 붙는다. 명령이 비어 있으면 아무것도 하지 않는다.
// 어떤 경우에도 종료 코드 0으로 끝내 작업을 막지 않는다.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  const file = input.tool_input && input.tool_input.file_path;
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'vibe-kit.json'), 'utf8'));
  const format = config.format || {};
  if (file && format.command && fs.existsSync(file)) {
    const exts = format.extensions || [];
    const ext = path.extname(file).toLowerCase();
    if (exts.length === 0 || exts.map((e) => e.toLowerCase()).includes(ext)) {
      const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
      spawnSync(`${format.command} "${file.replace(/"/g, '\\"')}"`, {
        cwd: root,
        shell: true,
        stdio: 'ignore',
        timeout: 30000,
      });
    }
  }
} catch (e) {
  // 정리 실패는 작업을 막지 않는다.
}
process.exitCode = 0;
