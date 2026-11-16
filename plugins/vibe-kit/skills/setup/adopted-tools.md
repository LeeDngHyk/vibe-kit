# 채택한 도구

`catalog/TOOLS.md`에서 상태가 "채택"인 줄만 옮긴 것이다. 이 파일은 손으로 고치지 않는다. 키트 저장소에서 `node scripts/validate.js --sync`를 실행하면 다시 만들어진다.

setup은 이 표에 있는 것 중 프로젝트의 형태와 언어에 해당하는 것만, 역할마다 하나씩 제안한다.

| 이름 | 역할 | 해당하는 프로젝트 | 설치 | 컨텍스트 비용 | 근거와 실행 범위 | 확인 날짜 | 출처 주소 |
|---|---|---|---|---|---|---|---|
| frontend-design | 화면 만들기(디자인 방향) | 화면이 있는 프로젝트 | `claude plugin install frontend-design@claude-plugins-official --scope project` | 낮음(항상 약 80토큰, 부를 때 약 2.7천) | 공식 마켓플레이스, Anthropic 제공, 글로 된 스킬 하나뿐(스크립트·훅 없음). 2차 시험(2026-11-16, 가계부 소개 페이지, 개인 디자인 스킬이 섞이지 않게 막고 실행): 스킬 없이 만든 화면·impeccable·design-taste-frontend가 모두 크림색과 초록의 비슷한 화면으로 모인 반면, 이것만 고유 글꼴과 예산을 동전으로 보여 주는 표현 등 뚜렷이 다른 방향을 냄. 휴대폰 너비에서 가로 넘침 없음. 한계: 과제 하나·실행 한 번 | 2026-11-16 | https://github.com/anthropics/claude-plugins-official |
| impeccable | 화면 점검·다듬기 | 화면이 있는 프로젝트 | `claude plugin marketplace add pbakaus/impeccable` 뒤 `claude plugin install impeccable@impeccable --scope project` | 미측정(스킬 1개에 명령 24개, 참고 문서는 부를 때만 읽힘) | 커뮤니티(공식 마켓플레이스 미등재), Apache-2.0, 유지 중. 저장소에 Claude 플러그인 목록 있음. 스크립트 포함(브라우저에서 화면을 살피는 JS와 명령줄 도구)이라 실행 범위가 글만 있는 스킬보다 넓음. 시험(2026-11-16): 스킬 없이 만든 화면에 critique와 polish를 시키니 실제 문제 6가지를 찾아 고침(알림 말풍선이 금액을 가림, 고정 머리글이 제목을 가림, 터치 기기의 hover, 작은 터치 영역, 읽히지 않아야 할 장식 등). 만들기 용도로는 스킬 없이 만든 것과 비슷한 화면이 나와, 점검·다듬기 역할로만 채택 | 2026-11-16 | https://github.com/pbakaus/impeccable |
| hallmark | 화면 만들기(대안: 절제된 방향과 디자인 값 정리) | 화면이 있는 프로젝트 | `claude plugin marketplace add Nutlope/hallmark` 뒤 `claude plugin install hallmark@hallmark --scope project` | 미측정(스킬 글 약 18KB, 참고 문서 60개는 부를 때만 읽힘) | 커뮤니티(공식 마켓플레이스 미등재), MIT, 유지 중, Claude 플러그인 목록 있음. 실행 범위: 스크립트 포함(화면 캡처, 린터, 테마 고르기). 이미지 생성 기능은 외부 서비스(Together AI)를 쓰므로 켜면 외부로 전송됨, 쓰기 전 확인 필요. 시험(2026-11-16, 스킬 글과 참고 문서만 불러옴, 스크립트는 실행하지 않음): 가계부 소개 페이지에서 따뜻한 종이색과 테라코타 한 가지의 절제된 화면을 냄. 스킬 없이 만든 화면(크림색+초록)과도, frontend-design(연보라+노랑, 큰 표현)과도 다른 방향. 디자인 값 변수 42개, 접근성 속성 19개로 넷 중 가장 정돈됨. 지어낸 후기·사용자 수를 넣지 않고 "예시 화면"이라고 밝힘. 휴대폰 너비 가로 넘침 없음. frontend-design과 같은 역할이지만 방향이 뚜렷이 달라 대안으로 채택. 한계: 과제 하나·실행 한 번, 스크립트 포함 설치본은 시험하지 못함 | 2026-11-16 | https://github.com/Nutlope/hallmark |
