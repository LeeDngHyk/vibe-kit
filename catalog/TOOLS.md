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
| frontend-design | 화면 디자인 품질 | 보류 | 화면이 있는 프로젝트 | - | 낮음(항상 약 80토큰, 부를 때 약 2.7천) | 격리 시험(2026-11-16): 같은 빵집 첫 화면 과제에서 플러그인 유무에 따른 차이가 코드 수준에서는 뚜렷하지 않음(둘 다 디자인 값을 변수로 모으고 명조·고딕 조합, 반응형, 움직임 줄이기 대응). 화면을 눈으로 비교하지 못했고 한 과제·한 모델뿐이라 결론 보류 | 2026-11-16 | https://github.com/anthropics/claude-plugins-official |
| context7 | 라이브러리 최신 문서 조회 | 후보 | 외부 라이브러리를 쓰는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT). 외부 서버에 조회 내용을 보내는 연결이라 수집 정보 확인 필요. freshness의 문서 확인을 도울 수 있음 | 2026-11-16 | https://github.com/upstash/context7 |
| security-guidance | 코드 변경의 보안 점검 | 보류 | 모든 프로젝트 | - | 낮음(모델이 읽는 글 0토큰, 훅 4개) | 격리 시험(2026-11-16): 위험을 유도하는 서버 과제에서 플러그인 없이도 안전한 코드가 나와 차이를 보지 못함. 대화 없는 실행에서는 플러그인에 로그인 정보가 전달되지 않아 핵심인 종료 때 검토가 돌지 않았고 무늬 경고만 동작. Python과 bash가 필요하고 세션 시작 때 상태 폴더에 가상 환경을 만들며(30~60초), 턴마다 추가 모델 호출 비용이 듦. 대화형 세션에서 다시 시험 필요 | 2026-11-16 | https://code.claude.com/docs/en/security-guidance.md |
| 언어 서버 플러그인들 | 타입 오류 확인과 기호 탐색 | 후보 | 해당 언어의 프로젝트 | - | 미확인 | 공식 마켓플레이스에 언어별로 등재. 2026-11-16 시험하지 못함: 플러그인은 설정뿐이고 언어 서버 실행 파일을 컴퓨터에 따로 설치해야 하는데, 시험 컴퓨터에 없었고 설치는 격리 범위를 벗어남. 실제 프로젝트에 언어 서버가 이미 있을 때 시험 | 2026-11-16 | https://code.claude.com/docs/en/plugins/code-intelligence.md |
| github | 저장소 호스팅 연동 | 후보 | 깃허브를 쓰는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT). 키트는 이미 gh 명령줄 도구를 쓰므로 그보다 나은 점이 있는지 시험 필요 | 2026-11-16 | https://github.com/github/github-mcp-server |
| playwright | 브라우저 자동 조작과 화면 확인 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(Apache-2.0). 웹의 확인 수단 후보. chrome-devtools-mcp와 같은 역할이라 둘을 비교 시험해 하나만 | 2026-11-16 | https://github.com/microsoft/playwright-mcp |
| chrome-devtools-mcp | 브라우저 자동 조작과 화면 확인 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(Apache-2.0). playwright와 같은 역할이라 둘을 비교 시험해 하나만 | 2026-11-16 | https://github.com/ChromeDevTools/chrome-devtools-mcp |
| impeccable | 화면 디자인 품질 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 공식 마켓플레이스에 없음(커뮤니티), 저장소 유지 중(Apache-2.0). frontend-design과 같은 역할이라 비교 시험해 하나만 | 2026-11-16 | https://github.com/pbakaus/impeccable |
| ui-ux-pro-max | 화면 디자인 품질 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 공식 마켓플레이스에 없음(커뮤니티), 저장소 유지 중(MIT). frontend-design과 같은 역할이라 비교 시험해 하나만 | 2026-11-16 | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| rtk | 명령 출력 줄이기(컨텍스트 절약) | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스에 없음(커뮤니티), 저장소 유지 중(Apache-2.0). 플러그인이 아니라 따로 설치하는 실행 파일이고 명령을 가로채 실행하므로 실행 범위와 세 운영체제 지원 확인 필요 | 2026-11-16 | https://github.com/rtk-ai/rtk |
| modern-web-guidance | 웹 모범 사례 최신화 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 목록의 설명: 에이전트가 웹 모범 사례를 최신으로 유지하게 함. freshness와 역할이 겹칠 수 있어 시험 필요. 실행 코드 범위 미확인 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| claude-code-setup | 훅·스킬·서브에이전트 추천 | 거절 | 모든 프로젝트 | - | 낮음(항상 약 140토큰, 부를 때 약 4.1천) | 격리 시험(2026-11-16): 키트의 setup과 역할이 겹침. 31줄짜리 예시 프로젝트에 훅 2개, 스킬 2개, 서브에이전트 1개, 외부 연결 1개를 권해 "적게 둔다" 원칙과 맞지 않음. 권고만 하고 만들지는 않음. 다시 볼 조건: setup이 놓치는 추천을 꾸준히 내는 근거가 생길 때 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| claude-md-management | CLAUDE.md 점검과 관리 | 보류 | 모든 프로젝트 | - | 낮음(항상 약 180토큰, 부를 때 약 2.2천) | 격리 시험(2026-11-16): 지시 파일을 기준별로 채점하고 문서와 실제의 어긋남(없는 .claude 폴더를 전제한 문장, 비어 있는 확인 날짜)을 실제로 찾아냄. retro에는 없는 점검이라 쓸모가 있으나, 플러그인을 들이는 대신 retro 절차에 "지시 파일의 명령과 전제가 지금도 맞는지 실행해 확인"을 더하는 쪽을 먼저 검토 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| serena | 의미 기반 코드 분석과 탐색 | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 목록의 설명: 의미 기반 코드 분석·탐색. 언어 서버 플러그인과 역할이 겹쳐 비교 시험 필요. 실행 코드 범위 미확인 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
