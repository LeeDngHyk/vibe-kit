# 검토한 도구

`scout` 스킬이 본 도구를 모두 적는다. 거절한 것도 남겨 같은 것을 다시 검토하지 않게 한다.

- **상태**: 후보(아직 평가 전), 시험 중, 채택, 보류(지금은 아니지만 다시 볼 것), 거절, 퇴출(채택했다가 뺀 것).
- **해당하는 프로젝트**: 이 도구를 제안할 프로젝트의 형태나 언어. "모든 프로젝트"도 된다.
- **설치**: 채택한 것만 적는다. 설치 명령이나 `<플러그인>@<마켓플레이스>`.
- **컨텍스트 비용**: 매 세션 읽히는 양의 어림(낮음·중간·높음과 근거).
- **확인 날짜**와 **출처 주소**: 공식 출처를 직접 열어 확인한 날짜와 그 주소. 확인하지 않았으면 "미확인".
- 상태가 "채택"인 줄은 `node scripts/validate.js --sync`로 `plugins/vibe-kit/skills/setup/adopted-tools.md`에 옮겨진다.
- 역할마다 "채택"은 하나만 둔다.

| 이름 | 역할 | 상태 | 해당하는 프로젝트 | 설치 | 컨텍스트 비용 | 이유 | 확인 날짜 | 출처 주소 |
|---|---|---|---|---|---|---|---|---|
| superpowers | 일하는 절차 묶음(계획, 테스트 주도, 디버깅 스킬) | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT, 최근 올림 2026-11-03). 키트의 일하는 방식(AGENTS.md, retro)과 역할이 겹쳐 시험으로 비교 필요 | 2026-11-16 | https://github.com/obra/superpowers |
| frontend-design | 화면 디자인 품질 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재(Anthropic 제공). visual-design 규칙과 겹치는지 시험 필요 | 2026-11-16 | https://github.com/anthropics/claude-plugins-official |
| context7 | 라이브러리 최신 문서 조회 | 후보 | 외부 라이브러리를 쓰는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT). 외부 서버에 조회 내용을 보내는 연결이라 수집 정보 확인 필요. freshness의 문서 확인을 도울 수 있음 | 2026-11-16 | https://github.com/upstash/context7 |
| security-guidance | 코드 변경의 보안 점검 | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재(Anthropic 제공), 공식 문서에 안내 페이지 있음. 수정 때와 종료 때 훅이 돌아 속도 영향 시험 필요 | 2026-11-16 | https://code.claude.com/docs/en/security-guidance.md |
| 언어 서버 플러그인들 | 타입 오류 확인과 기호 탐색 | 후보 | 해당 언어의 프로젝트 | - | 미확인 | 공식 마켓플레이스에 언어별로 등재(typescript, pyright, gopls, rust-analyzer, clangd, jdtls, kotlin, swift, csharp, php, ruby, lua). 각 언어 서버를 따로 설치해야 함. 언어별로 시험 필요 | 2026-11-16 | https://code.claude.com/docs/en/plugins/code-intelligence.md |
| github | 저장소 호스팅 연동 | 후보 | 깃허브를 쓰는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT). 키트는 이미 gh 명령줄 도구를 쓰므로 그보다 나은 점이 있는지 시험 필요 | 2026-11-16 | https://github.com/github/github-mcp-server |
| playwright | 브라우저 자동 조작과 화면 확인 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(Apache-2.0). 웹의 확인 수단 후보. chrome-devtools-mcp와 같은 역할이라 둘을 비교 시험해 하나만 | 2026-11-16 | https://github.com/microsoft/playwright-mcp |
| chrome-devtools-mcp | 브라우저 자동 조작과 화면 확인 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(Apache-2.0). playwright와 같은 역할이라 둘을 비교 시험해 하나만 | 2026-11-16 | https://github.com/ChromeDevTools/chrome-devtools-mcp |
| impeccable | 화면 디자인 품질 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 공식 마켓플레이스에 없음(커뮤니티), 저장소 유지 중(Apache-2.0). frontend-design과 같은 역할이라 비교 시험해 하나만 | 2026-11-16 | https://github.com/pbakaus/impeccable |
| ui-ux-pro-max | 화면 디자인 품질 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 공식 마켓플레이스에 없음(커뮤니티), 저장소 유지 중(MIT). frontend-design과 같은 역할이라 비교 시험해 하나만 | 2026-11-16 | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| rtk | 명령 출력 줄이기(컨텍스트 절약) | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스에 없음(커뮤니티), 저장소 유지 중(Apache-2.0). 플러그인이 아니라 따로 설치하는 실행 파일이고 명령을 가로채 실행하므로 실행 범위와 세 운영체제 지원 확인 필요 | 2026-11-16 | https://github.com/rtk-ai/rtk |
| modern-web-guidance | 웹 모범 사례 최신화 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 목록의 설명: 에이전트가 웹 모범 사례를 최신으로 유지하게 함. freshness와 역할이 겹칠 수 있어 시험 필요. 실행 코드 범위 미확인 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| claude-code-setup | 훅·스킬·서브에이전트 추천 | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 목록의 설명: 훅, 스킬, 서브에이전트를 추천. setup 스킬과 역할이 겹쳐 시험 필요 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| claude-md-management | CLAUDE.md 점검과 관리 | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 목록의 설명: CLAUDE.md 감사·유지. setup·retro와 겹치는지 시험 필요 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| serena | 의미 기반 코드 분석과 탐색 | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 목록의 설명: 의미 기반 코드 분석·탐색. 언어 서버 플러그인과 역할이 겹쳐 비교 시험 필요. 실행 코드 범위 미확인 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
