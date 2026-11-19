# 키트가 기대는 것과 확인 기록

마지막 점검: 2026-11-19

키트가 쓰는 형식과 명령을 공식 문서에서 확인한 기록이다. 30일이 지났거나 오류가 형식 변경을 시사하면 다시 확인한다. 문서 색인: <https://code.claude.com/docs/llms.txt>

| 항목 | 쓰는 버전 | 확인한 최신 버전 | 확인 날짜 | 출처 주소 | 메모 |
|---|---|---|---|---|---|
| Claude Code | 2.1.305에서 만들고 시험함 | 미확인 | 2026-11-16 | https://code.claude.com/docs/en/setup.md | 아래 기능의 최소 버전 중 가장 높은 것은 2.1.302 |
| 플러그인 형식 (`plugin.json`, 폴더 구성) | - | - | 2026-11-16 | https://code.claude.com/docs/en/plugins/create.md | `name`만 필수. `version`을 빼면 커밋을 따라감 |
| 마켓플레이스 형식 (`marketplace.json`) | - | - | 2026-11-16 | https://code.claude.com/docs/en/plugins/create-marketplace.md | `name`, `owner`, `plugins` 필수. `source`는 저장소 뿌리 기준 상대 경로 |
| 비공개 마켓플레이스와 자동 업데이트 | - | - | 2026-11-16 | https://code.claude.com/docs/en/plugins/host-marketplace.md | 컴퓨터에 저장된 git 인증을 씀. 자동 업데이트는 기본 꺼짐, `/plugin`에서 켬 |
| 스킬 머리말 | - | - | 2026-11-16 | https://code.claude.com/docs/en/skills.md | `description`과 `when_to_use` 합쳐 1,536자 상한 |
| 서브에이전트 머리말 | - | - | 2026-11-16 | https://code.claude.com/docs/en/sub-agents.md | `model: inherit`. 플러그인 서브에이전트는 `permissionMode`, `hooks`, `mcpServers` 무시 |
| 훅 (SessionStart, UserPromptSubmit, PostToolUse, Stop) | - | - | 2026-11-16 | https://code.claude.com/docs/en/hooks.md | `args`를 주면 셸 없이 실행. Stop 훅은 연속 8번까지만 막음. UserPromptSubmit은 입력의 `prompt`로 사용자의 말을 받고 `additionalContext`로 안내를 더함(고르는 조건 없이 매번 돎) |
| 프로젝트 지시 파일 (`AGENTS.md`, `CLAUDE.md`, `.claude/rules/`) | - | - | 2026-11-16 | https://code.claude.com/docs/en/memory.md | `AGENTS.md`는 2.1.277부터 직접 읽힘. `CLAUDE.md`가 있으면 `@AGENTS.md` 불러오기 필요 |
| 권한 규칙 문법 | - | - | 2026-11-16 | https://code.claude.com/docs/en/permissions.md | `Bash(명령 *)`, `Read(**/.env)` |
| 대화 없는 실행 (`claude -p`) | - | - | 2026-11-16 | https://code.claude.com/docs/en/headless.md | `--permission-prompts none`(2.1.259부터), `--max-turns`, `--max-budget-usd`(어림값) |
| 화면 없는 인증 | - | - | 2026-11-16 | https://code.claude.com/docs/en/authentication.md | `claude setup-token` → `CLAUDE_CODE_OAUTH_TOKEN`. `--bare`는 이 토큰을 읽지 않음 |
| 예약 실행 | - | - | 2026-11-16 | https://code.claude.com/docs/en/routines.md | 클라우드 예약 작업은 `/schedule`, 최소 간격 1시간 |
| Node.js | 24에서 시험함 | 미확인 | 2026-11-16 | - | 스크립트는 내장 기능만 씀(설치할 패키지 없음) |
