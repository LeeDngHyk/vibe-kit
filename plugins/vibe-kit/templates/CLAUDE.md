@AGENTS.md

## Claude Code

- 상태 기록은 `docs/agent/`에 있다: `STATE.md`(한 일·다음 할 일·열린 질문), `STACK.md`(쓰는 도구와 확인 날짜), `LEARNINGS.md`(배운 점).
- 작업 단위가 끝났거나 사용자가 같은 내용을 두 번 교정했으면 `/vibe-kit:retro`를 실행한다.
- 주 1회 점검, 새 의존성 확인, 만들기 전에 먼저 찾아보기는 `/vibe-kit:freshness`로 한다.
- 사용자의 말이 교정으로 보이면 키트의 훅이 알려 준다. 그 일을 끝낼 때 `LEARNINGS.md`에 적고, 확신이 높은 배움은 세션을 열 때 자동으로 안내된다.
- 파일을 많이 읽는 탐색과 긴 문서 조사는 `vibe-kit:researcher`, 규모가 있는 변경을 끝내기 전 검토는 `vibe-kit:reviewer` 서브에이전트에 맡긴다. 작은 작업에는 쓰지 않는다.
- `.claude/`의 설정·규칙 변경은 새 세션부터 적용된다.
