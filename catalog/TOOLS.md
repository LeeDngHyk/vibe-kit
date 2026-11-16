# 검토한 도구

`scout` 스킬이 본 도구를 모두 적는다. 거절한 것도 남겨 같은 것을 다시 검토하지 않게 한다.

- **상태**: 후보(아직 평가 전), 시험 중, 채택, 보류(지금은 아니지만 다시 볼 것), 거절, 퇴출(채택했다가 뺀 것).
- **해당하는 프로젝트**: 이 도구를 제안할 프로젝트의 형태나 언어. "모든 프로젝트"도 된다.
- **설치**: 채택한 것만 적는다. 설치 명령이나 `<플러그인>@<마켓플레이스>`.
- **컨텍스트 비용**: 매 세션 읽히는 양의 어림(낮음·중간·높음과 근거).
- **확인 날짜**와 **출처 주소**: 공식 출처를 직접 열어 확인한 날짜와 그 주소. 확인하지 않았으면 "미확인".
- 상태가 "채택"인 줄은 `node scripts/validate.js --sync`로 `plugins/vibe-kit/skills/setup/adopted-tools.md`에 옮겨진다.
- 역할마다 "채택"은 하나만 둔다. 디자인 분야는 역할을 잘게 나눠 여럿을 둘 수 있다: 화면 만들기(디자인 방향), 화면 점검·다듬기, 디자인 값·참고 자료, 움직임, 플랫폼별 관례(모바일·데스크톱).
- 디자인 분야의 기록과 채택은 `catalog/POLICY.md`의 "디자인 분야" 절을 따른다(변경 제안 없이 바로 올림).

| 이름 | 역할 | 상태 | 해당하는 프로젝트 | 설치 | 컨텍스트 비용 | 이유 | 확인 날짜 | 출처 주소 |
|---|---|---|---|---|---|---|---|---|
| superpowers | 일하는 절차 묶음(계획, 테스트 주도, 디버깅 스킬) | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT, 최근 올림 2026-11-03). 키트의 일하는 방식(AGENTS.md, retro)과 역할이 겹쳐 시험으로 비교 필요 | 2026-11-16 | https://github.com/obra/superpowers |
| frontend-design | 화면 만들기(디자인 방향) | 채택 | 화면이 있는 프로젝트 | `claude plugin install frontend-design@claude-plugins-official --scope project` | 낮음(항상 약 80토큰, 부를 때 약 2.7천) | 공식 마켓플레이스, Anthropic 제공, 글로 된 스킬 하나뿐(스크립트·훅 없음). 2차 시험(2026-11-16, 가계부 소개 페이지, 개인 디자인 스킬이 섞이지 않게 막고 실행): 스킬 없이 만든 화면·impeccable·design-taste-frontend가 모두 크림색과 초록의 비슷한 화면으로 모인 반면, 이것만 고유 글꼴과 예산을 동전으로 보여 주는 표현 등 뚜렷이 다른 방향을 냄. 휴대폰 너비에서 가로 넘침 없음. 한계: 과제 하나·실행 한 번 | 2026-11-16 | https://github.com/anthropics/claude-plugins-official |
| context7 | 라이브러리 최신 문서 조회 | 후보 | 외부 라이브러리를 쓰는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT). 외부 서버에 조회 내용을 보내는 연결이라 수집 정보 확인 필요. freshness의 문서 확인을 도울 수 있음 | 2026-11-16 | https://github.com/upstash/context7 |
| security-guidance | 코드 변경의 보안 점검 | 보류 | 모든 프로젝트 | - | 낮음(모델이 읽는 글 0토큰, 훅 4개) | 격리 시험(2026-11-16): 위험을 유도하는 서버 과제에서 플러그인 없이도 안전한 코드가 나와 차이를 보지 못함. 대화 없는 실행에서는 플러그인에 로그인 정보가 전달되지 않아 핵심인 종료 때 검토가 돌지 않았고 무늬 경고만 동작. Python과 bash가 필요하고 세션 시작 때 상태 폴더에 가상 환경을 만들며(30~60초), 턴마다 추가 모델 호출 비용이 듦. 대화형 세션에서 다시 시험 필요 | 2026-11-16 | https://code.claude.com/docs/en/security-guidance.md |
| 언어 서버 플러그인들 | 타입 오류 확인과 기호 탐색 | 후보 | 해당 언어의 프로젝트 | - | 미확인 | 공식 마켓플레이스에 언어별로 등재. 2026-11-16 시험하지 못함: 플러그인은 설정뿐이고 언어 서버 실행 파일을 컴퓨터에 따로 설치해야 하는데, 시험 컴퓨터에 없었고 설치는 격리 범위를 벗어남. 실제 프로젝트에 언어 서버가 이미 있을 때 시험 | 2026-11-16 | https://code.claude.com/docs/en/plugins/code-intelligence.md |
| github | 저장소 호스팅 연동 | 후보 | 깃허브를 쓰는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(MIT). 키트는 이미 gh 명령줄 도구를 쓰므로 그보다 나은 점이 있는지 시험 필요 | 2026-11-16 | https://github.com/github/github-mcp-server |
| playwright | 브라우저 자동 조작과 화면 확인 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(Apache-2.0). 웹의 확인 수단 후보. chrome-devtools-mcp와 같은 역할이라 둘을 비교 시험해 하나만 | 2026-11-16 | https://github.com/microsoft/playwright-mcp |
| chrome-devtools-mcp | 브라우저 자동 조작과 화면 확인 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 등재, 저장소 유지 중(Apache-2.0). playwright와 같은 역할이라 둘을 비교 시험해 하나만 | 2026-11-16 | https://github.com/ChromeDevTools/chrome-devtools-mcp |
| impeccable | 화면 점검·다듬기 | 채택 | 화면이 있는 프로젝트 | `claude plugin marketplace add pbakaus/impeccable` 뒤 `claude plugin install impeccable@impeccable --scope project` | 미측정(스킬 1개에 명령 24개, 참고 문서는 부를 때만 읽힘) | 커뮤니티(공식 마켓플레이스 미등재), Apache-2.0, 유지 중. 저장소에 Claude 플러그인 목록 있음. 스크립트 포함(브라우저에서 화면을 살피는 JS와 명령줄 도구)이라 실행 범위가 글만 있는 스킬보다 넓음. 시험(2026-11-16): 스킬 없이 만든 화면에 critique와 polish를 시키니 실제 문제 6가지를 찾아 고침(알림 말풍선이 금액을 가림, 고정 머리글이 제목을 가림, 터치 기기의 hover, 작은 터치 영역, 읽히지 않아야 할 장식 등). 만들기 용도로는 스킬 없이 만든 것과 비슷한 화면이 나와, 점검·다듬기 역할로만 채택 | 2026-11-16 | https://github.com/pbakaus/impeccable |
| ui-ux-pro-max | 디자인 값·참고 자료 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 커뮤니티, MIT, 유지 중. 저장소에 Claude 플러그인 목록 있음. 스크립트 165개(대부분 Python)를 실행하는 구조라 내용물 확인과 격리 시험이 먼저 필요. 2026-11-16에는 내려받아 실행하지 않음 | 2026-11-16 | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| rtk | 명령 출력 줄이기(컨텍스트 절약) | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스에 없음(커뮤니티), 저장소 유지 중(Apache-2.0). 플러그인이 아니라 따로 설치하는 실행 파일이고 명령을 가로채 실행하므로 실행 범위와 세 운영체제 지원 확인 필요 | 2026-11-16 | https://github.com/rtk-ai/rtk |
| modern-web-guidance | 웹 모범 사례 최신화 | 후보 | 웹 | - | 미확인 | 공식 마켓플레이스 목록의 설명: 에이전트가 웹 모범 사례를 최신으로 유지하게 함. freshness와 역할이 겹칠 수 있어 시험 필요. 실행 코드 범위 미확인 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| claude-code-setup | 훅·스킬·서브에이전트 추천 | 거절 | 모든 프로젝트 | - | 낮음(항상 약 140토큰, 부를 때 약 4.1천) | 격리 시험(2026-11-16): 키트의 setup과 역할이 겹침. 31줄짜리 예시 프로젝트에 훅 2개, 스킬 2개, 서브에이전트 1개, 외부 연결 1개를 권해 "적게 둔다" 원칙과 맞지 않음. 권고만 하고 만들지는 않음. 다시 볼 조건: setup이 놓치는 추천을 꾸준히 내는 근거가 생길 때 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| claude-md-management | CLAUDE.md 점검과 관리 | 보류 | 모든 프로젝트 | - | 낮음(항상 약 180토큰, 부를 때 약 2.2천) | 격리 시험(2026-11-16): 지시 파일을 기준별로 채점하고 문서와 실제의 어긋남(없는 .claude 폴더를 전제한 문장, 비어 있는 확인 날짜)을 실제로 찾아냄. retro에는 없는 점검이라 쓸모가 있으나, 플러그인을 들이는 대신 retro 절차에 "지시 파일의 명령과 전제가 지금도 맞는지 실행해 확인"을 더하는 쪽을 먼저 검토 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| serena | 의미 기반 코드 분석과 탐색 | 후보 | 모든 프로젝트 | - | 미확인 | 공식 마켓플레이스 목록의 설명: 의미 기반 코드 분석·탐색. 언어 서버 플러그인과 역할이 겹쳐 비교 시험 필요. 실행 코드 범위 미확인 | 2026-11-16 | https://raw.githubusercontent.com/anthropics/claude-plugins-official/main/.claude-plugin/marketplace.json |
| design-taste-frontend (tasteskill) | 화면 만들기(디자인 방향) | 보류 | 웹(회사·제품 소개 페이지) | - | 미측정(파일 1,631개, 39MB) | 사용자 컴퓨터에 개인 스킬로 이미 있음. 배포 출처를 확인하지 못함. 시험(2026-11-16): 스킬 없이 만든 것과 비슷한 화면이 나옴. 이 스킬의 핵심인 브라우저 검사 단계는 시험 조건(명령 실행 불가)에서 돌지 않아 제 실력을 보지 못함. 무겁고 웹 소개 페이지 전용이라 범용 키트의 기본 제안으로는 보류 | 2026-11-16 | 미확인 |
| hallmark | 화면 만들기(디자인 방향) | 후보 | 화면이 있는 프로젝트 | - | 미확인 | "AI가 만든 티"를 없애는 디자인 스킬. MIT, 유지 중, Claude 플러그인 목록 있음. 파일 860개·64MB·스크립트 50개로 무거움. frontend-design과 같은 역할이라 비교 시험 필요 | 2026-11-16 | https://github.com/Nutlope/hallmark |
| unslop | 화면 점검·다듬기 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | AI가 만든 티가 나는 화면을 다시 디자인하는 스킬. CC-BY-4.0(출처 표시 필요), 유지 중, 파일 29개로 가벼움, 스크립트 6개. impeccable과 같은 역할이라 비교 시험 필요 | 2026-11-16 | https://github.com/heydamir/unslop |
| oil-ui | 화면 만들기(디자인 방향) | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 서로 다른 디자인 방향 여럿을 만들어 나란히 비교하고 고르게 하는 스킬. MIT, 유지 중, 파일 54개, 스크립트 18개. "한 방향으로 모이는" 문제를 직접 겨냥해 시험 우선순위 높음 | 2026-11-16 | https://github.com/oil-oil/oil-ui |
| hue | 디자인 값·참고 자료 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 브랜드를 읽어 디자인 시스템(색·글꼴·간격 값)을 만들어 주는 스킬. MIT, 유지 중, 파일 56개, 스크립트 1개 | 2026-11-16 | https://github.com/dominikmartn/hue |
| DESIGN.md 형식 | 디자인 값·참고 자료 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 시각 정체성을 에이전트에게 알려 주는 파일 형식의 명세(Google Labs). Apache-2.0. 도구가 아니라 형식이므로, setup이 만드는 visual-design 규칙을 이 형식에 맞출지 검토. 모음집: https://github.com/VoltAgent/awesome-design-md (MIT) | 2026-11-16 | https://github.com/google-labs-code/design.md |
| oil-motion | 움직임 | 후보 | 웹 | - | 미확인 | 스크롤과 마우스를 따라 움직이는 웹 애니메이션 스킬. MIT, 파일 86개, 스크립트 43개 | 2026-11-16 | https://github.com/oil-oil/oil-motion |
| apple-design-skill | 플랫폼별 관례(모바일·데스크톱) | 후보 | 모바일 앱, 데스크톱 앱 | - | 미확인 | Apple의 화면 지침에 비춰 화면을 검토하는 스킬(Flutter, Tauri, Electron, React Native). 웹이 아닌 프로젝트의 빈틈을 메울 후보. 라이선스 표기가 없어 채택 전 확인 필요 | 2026-11-16 | https://github.com/dickwu/apple-design-skill |
| mobile-app-ui-design | 플랫폼별 관례(모바일·데스크톱) | 후보 | 모바일 앱 | - | 미확인 | 모바일 앱 화면 디자인 스킬. 파일 5개로 아주 가볍고 스크립트 없음. 라이선스 표기가 없어 채택 전 확인 필요 | 2026-11-16 | https://github.com/ceorkm/mobile-app-ui-design |
| ux-ui-agent-skills | 디자인 값·참고 자료 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 디자인 값, 부품 52개, 접근성 기준을 담은 스킬 27개 묶음. MIT. 파일 2,707개·스크립트 121개·훅 설정 포함으로 무겁고 실행 범위가 넓어 우선순위 낮음 | 2026-11-16 | https://github.com/plugin87/ux-ui-agent-skills |
| superdesign | 화면 만들기(디자인 방향) | 후보 | 화면이 있는 프로젝트 | - | 미확인 | 공식 마켓플레이스 등재(디자인 분류). 외부 서비스의 캔버스에서 화면을 디자인하는 방식이라 계정과 외부 전송이 필요한지 확인 필요 | 2026-11-16 | https://github.com/superdesigndev/superdesign-skill |
| stitch-skills | 디자인 값·참고 자료 | 후보 | 화면이 있는 프로젝트 | - | 미확인 | Google의 Stitch 외부 연결과 함께 쓰는 스킬 모음. Apache-2.0. 사용자가 이미 Stitch 연결을 쓰고 있어 궁합 확인 가치 있음 | 2026-11-16 | https://github.com/google-labs-code/stitch-skills |
| ECC (Everything Claude Code) | 종합 묶음(스킬·배움·기억·보안) | 후보 | 모든 프로젝트 | - | 높음으로 추정(스킬 1,068개, 서브에이전트 71개, 명령 98개, 규칙 144개) | 사용자가 "만들고 싶은 기능이 잘 있다"며 참고하라고 알려 준 저장소(2026-11-16). MIT, 유지 중. 키트와 겹치는 것: 세션을 지켜보며 작은 배움(확신 점수 포함)을 쌓고 스킬로 키우는 계속 배우기, 세션 간 기억, 먼저 찾아보고 만드는 절차, 검증 순환, 골라서 설치하는 안내. 통째로 들이면 "적게 둔다" 원칙과 컨텍스트 비용에 걸리므로, 기능별로 가려 retro·freshness에 옮길 생각을 뽑는 참고 자료로 먼저 씀 | 2026-11-16 | https://github.com/affaan-m/ECC |
