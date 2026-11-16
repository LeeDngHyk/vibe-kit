# 키트의 상태

키트 저장소에서 에이전트가 한 일과 이어서 할 일을 적는다. 세션 시작 때 "다음 할 일"의 첫 항목이 자동으로 안내된다.

## 지금까지 한 일

- 2026-11-16: 키트를 처음 만들었다. 플러그인(스킬 4개, 서브에이전트 2개, 세션 시작 훅), 도구 목록과 반영 정책, 서버 준비물, 형식 검증 스크립트.
- 2026-11-16: 서버가 생기기 전까지 쓸 클라우드 예약 작업을 등록했다. 매주 목요일 오후 2시(한국 시간)에 `scout`를 돌리고(처음에는 월요일 오전 4시였고 같은 날 바꿈), 변경 제안은 만들되 병합하지 않는다. 관리 화면은 claude.ai의 예약 작업 목록(이름: vibe-kit 주간 scout).

- 2026-11-16: 사용자 요청으로 ECC의 세 기능을 옮겼다. 계속 배우기(교정으로 보이는 말에 반응하는 훅, 확신 점수, 세션 시작 때 확신 높은 배움 안내)와 먼저 찾아보고 만들기(`freshness`에 절 추가, `AGENTS.md` 본에 한 줄)는 생각만 가져와 다시 만들었고, 디자인 스킬은 따로 시험해 도구 목록에 반영한다.

## 다음 할 일

- 실제 프로젝트에서 `/vibe-kit:setup`을 써 보고 막히는 곳을 `docs/LEARNINGS.md`에 적는다.
- retro 절차에 "지시 파일의 명령과 전제가 지금도 맞는지 실행해 확인"을 더하는 변경 제안을 만든다(사용자가 병합).
- 세션 시작 훅의 "환경 없음" 안내가 무관한 작업의 답에 붙는 문제를 고치는 변경 제안을 만든다(사용자가 병합).
- 웹이 아닌 화면용 디자인 도구가 아직 없다. apple-design-skill이 시험에서 가장 좋았으나 라이선스가 없어 보류 중. 사용자에게 쓸지 묻고, 라이선스가 있는 다른 후보(ECC의 swiftui-patterns·liquid-glass-design·accessibility, 공식 마켓플레이스의 expo)를 시험한다.
- oil-ui의 "여러 방향을 나란히 비교" 기능을 대화형 세션에서 시험한다.
- 채택한 디자인 도구 셋(frontend-design, impeccable, hallmark)을 실제 프로젝트에서 써 보고 `docs/LEARNINGS.md`에 적는다. 설치본(스크립트 포함)의 동작은 아직 시험하지 못했다.
- 계속 배우기 훅이 실제 작업에서 교정을 제대로 짚는지 본다(놓친 교정, 잘못 짚은 말을 `docs/LEARNINGS.md`에 적는다). 낱말 무늬는 한국어와 영어만 본다.
- 남은 후보 시험: 브라우저 확인 도구 둘(playwright, chrome-devtools-mcp)의 비교, 언어 서버 플러그인(언어 서버가 있는 프로젝트에서), security-guidance(대화형 세션에서), 커뮤니티 후보(impeccable, ui-ux-pro-max, rtk, superpowers, context7, serena, modern-web-guidance).

## 열려 있는 질문

- 없음

## 실행 기록

`scout`와 정기 실행의 기록이다. 형식: `- 날짜 | 무엇 | 결과 | 한 일, 만든 변경 제안, 실패 원인`

<!-- 실행 기록: 새 줄을 이 표시 바로 아래에 넣는다 -->
- 2026-11-16 | scout ECC 디자인 스킬 시험(손으로 실행) | 성공 | ECC의 낱개 스킬 셋의 글만 받아 격리 폴더에서 시험(대화 없는 실행 3번, 어림 약 0.59달러). 채택 2: ECC design-system(디자인 값·참고 자료), ECC accessibility(접근성). 보류 1: ECC frontend-design-direction. 낱개 스킬을 복사해 들이는 절차를 setup에 더함. 변경 제안: feat/learning-and-search-first
- 2026-11-16 | scout 디자인 2차 시험(손으로 실행) | 성공 | 새 후보 다섯 개의 스킬 글만 받아(스크립트는 받지도 실행하지도 않음) 격리 폴더에서 시험: 웹 화면 만들기 2(oil-ui, hallmark), 다듬기 1(unslop), React Native 화면 검토 3(스킬 없이, apple-design-skill, mobile-app-ui-design). 대화 없는 실행 6번, 어림 약 1.96달러. 화면은 띄워 눈으로 비교. 채택 1: hallmark(화면 만들기의 대안). 보류 3: unslop, apple-design-skill, mobile-app-ui-design. 시험 중 1: oil-ui. 기본 가지에 바로 올림. 되돌리기: 이 커밋을 git revert
- 2026-11-16 | scout 디자인 재검토(손으로 실행) | 성공 | 사용자 지시로 디자인 분야를 다시 봄. 같은 소개 페이지 과제를 네 방식으로 실행해 화면을 띄워 비교하고, impeccable의 점검·다듬기를 따로 시험(대화 없는 실행 5번, 어림 약 1.25달러). 채택 2: frontend-design(화면 만들기), impeccable(점검·다듬기). 새 디자인 후보 11개와 ECC를 기록. 정책에 "디자인 분야" 절을 더해 디자인 도구는 변경 제안 없이 바로 올리게 함. 이 변경도 그 지시에 따라 기본 가지에 바로 올림. 되돌리기: 이 커밋을 git revert
- 2026-11-16 | scout 후보 시험(손으로 실행) | 성공 | 격리된 임시 폴더에서 대화 없는 실행 6번(모델 별칭 sonnet, 합계 약 0.84달러 어림). security-guidance·frontend-design은 쓰기 전후 비교, claude-code-setup·claude-md-management는 예시 프로젝트에서 읽기 전용 실행. 채택 0, 보류 3, 거절 1. 언어 서버 플러그인과 브라우저 확인 도구 둘은 시험하지 못함. 변경 제안: scout/2026-11-16-first-trials
- 2026-11-16 | scout(클라우드 예약) | 성공 | 공식 마켓플레이스 목록과 변경 내역을 직접 열어 확인. 기존 후보 11개 모두 계속 등재, 새 후보 4개 기록(modern-web-guidance, claude-code-setup, claude-md-management, serena). 시험·설치 안 함. 목록 뒷부분과 변경 내역 2.1.319 이전은 읽지 못함. 변경 제안: scout/2026-11-16-weekly-survey
- 2026-11-16 | scout(손으로 실행) | 성공 | 후보 11개의 등재 여부·유지 상태·라이선스를 공식 마켓플레이스와 각 저장소에서 확인해 기록. 시험을 하지 못해 채택 제안은 없음(이 컴퓨터의 명령줄 Claude Code가 로그인돼 있지 않아 격리 시험 실행 불가). 변경 제안: scout/2026-11-16-first-survey
