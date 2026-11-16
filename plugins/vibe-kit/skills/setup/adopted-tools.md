# 채택한 도구

`catalog/TOOLS.md`에서 상태가 "채택"인 줄만 옮긴 것이다. 이 파일은 손으로 고치지 않는다. 키트 저장소에서 `node scripts/validate.js --sync`를 실행하면 다시 만들어진다.

setup은 이 표에 있는 것 중 프로젝트의 형태와 언어에 해당하는 것만, 역할마다 하나씩 제안한다.

| 이름 | 역할 | 해당하는 프로젝트 | 설치 | 컨텍스트 비용 | 근거와 실행 범위 | 확인 날짜 | 출처 주소 |
|---|---|---|---|---|---|---|---|
| frontend-design | 화면 만들기(디자인 방향) | 화면이 있는 프로젝트 | `claude plugin install frontend-design@claude-plugins-official --scope project` | 낮음(항상 약 80토큰, 부를 때 약 2.7천) | 공식 마켓플레이스, Anthropic 제공, 글로 된 스킬 하나뿐(스크립트·훅 없음). 2차 시험(2026-11-16, 가계부 소개 페이지, 개인 디자인 스킬이 섞이지 않게 막고 실행): 스킬 없이 만든 화면·impeccable·design-taste-frontend가 모두 크림색과 초록의 비슷한 화면으로 모인 반면, 이것만 고유 글꼴과 예산을 동전으로 보여 주는 표현 등 뚜렷이 다른 방향을 냄. 휴대폰 너비에서 가로 넘침 없음. 한계: 과제 하나·실행 한 번 | 2026-11-16 | https://github.com/anthropics/claude-plugins-official |
| impeccable | 화면 점검·다듬기 | 화면이 있는 프로젝트 | `claude plugin marketplace add pbakaus/impeccable` 뒤 `claude plugin install impeccable@impeccable --scope project` | 미측정(스킬 1개에 명령 24개, 참고 문서는 부를 때만 읽힘) | 커뮤니티(공식 마켓플레이스 미등재), Apache-2.0, 유지 중. 저장소에 Claude 플러그인 목록 있음. 스크립트 포함(브라우저에서 화면을 살피는 JS와 명령줄 도구)이라 실행 범위가 글만 있는 스킬보다 넓음. 시험(2026-11-16): 스킬 없이 만든 화면에 critique와 polish를 시키니 실제 문제 6가지를 찾아 고침(알림 말풍선이 금액을 가림, 고정 머리글이 제목을 가림, 터치 기기의 hover, 작은 터치 영역, 읽히지 않아야 할 장식 등). 만들기 용도로는 스킬 없이 만든 것과 비슷한 화면이 나와, 점검·다듬기 역할로만 채택 | 2026-11-16 | https://github.com/pbakaus/impeccable |
