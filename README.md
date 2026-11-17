# vibe-kit

어떤 프로젝트에서든 바이브 코딩(사람이 목표를 말하고 AI가 코드를 쓰는 방식) 환경을 만들어 주는 Claude Code 플러그인이다. 이 저장소 하나가 플러그인 보관소이자 마켓플레이스(플러그인을 설치할 수 있게 해 주는 목록)다. 내용물은 마크다운, JSON, Node.js 스크립트뿐이다.

## 무엇이 들어 있나

| 이름 | 하는 일 | 쓰는 법 |
|---|---|---|
| `setup` | 프로젝트 폴더에 맞는 환경(`AGENTS.md`, `CLAUDE.md`, `.claude/`, `docs/agent/`)을 만든다 | 프로젝트에서 `/vibe-kit:setup` |
| `improve` | 이미 돌아가는 프로젝트를 살펴보고 나아질 곳을 쉬운 말로 된 목록으로 보여 준 뒤, 고른 것만 하나씩 고치고 확인한다 | 프로젝트에서 `/vibe-kit:improve` |
| `clarify` | 모호한 요청에서 바라는 것을 알아낸다. 스스로 먼저 알아내고, 필요할 때만 선택지로 묻고, "이렇게 이해했습니다"로 확인한다 | Claude가 필요할 때 스스로 쓴다. `/vibe-kit:clarify`로 불러도 된다 |
| `retro` | 일하면서 생긴 실수와 교정을 확신 점수와 함께 기록하고, 근거가 쌓이면 지시와 설정을 고친다 | 작업이 끝났을 때 `/vibe-kit:retro` |
| `freshness` | 만들기 전에 이미 있는 것을 먼저 찾고, 기억이 아니라 현재 문서로 도구와 의존성을 확인하고 기록한다 | 새 기능을 시작할 때, 그리고 주 1회 `/vibe-kit:freshness` |
| `scout` | 새 플러그인과 도구를 찾아 평가하고 이 저장소에 변경 제안으로 올린다 | 이 저장소에서 주 1회 `/vibe-kit:scout` |
| `researcher` | 파일을 많이 읽는 탐색과 긴 문서 조사를 맡는 서브에이전트(읽기 전용) | Claude가 필요할 때 부른다 |
| `reviewer` | 규모가 있는 변경을 끝내기 전에 검토하는 서브에이전트 | Claude가 필요할 때 부른다 |
| 세션 시작 훅 | 세션을 열 때 오늘 날짜, 마지막 점검일, 미처리 배운 점, 확신이 높은 배움, 다음 할 일을 몇 줄로 알려 준다 | 자동 |
| 계속 배우기 훅 | 사용자의 말이 교정이나 계속 지켜 달라는 요청으로 보이면, 그 일을 끝낼 때 배운 점을 기록하라고 알려 준다. 사용자의 말은 저장하지 않는다 | 자동 |

## 새 컴퓨터에 설치하기

### 1. 준비물

- [Claude Code](https://code.claude.com/docs/en/setup.md) (설치 후 `claude --version`으로 확인, 로그인까지)
- git
- Node.js (훅과 스크립트가 Node.js로 돈다. `node --version`으로 확인. 없으면 훅만 조용히 건너뛰고 스킬은 그대로 쓸 수 있다)

### 2. 비공개 저장소를 받을 수 있게 git 인증 준비

이 저장소가 비공개면, Claude Code는 그 컴퓨터에 저장된 git 인증으로 저장소를 받는다. 설치 중에는 비밀번호를 물어볼 수 없으므로 미리 저장해 둔다.

- 깃허브에 있는 경우: [GitHub CLI](https://cli.github.com)를 설치하고 아래 두 명령을 실행한다.

  ```bash
  gh auth login
  ```

  ```bash
  gh auth setup-git
  ```

- 다른 git 서버에 있는 경우: SSH 키를 등록하거나(암호를 묻지 않게 `ssh-agent`에 올려 둔다), git 자격 증명 도우미에 접속 정보를 저장해 둔다.

확인: `git ls-remote <저장소 주소>`가 묻는 것 없이 가지 목록을 보여 주면 준비된 것이다.

### 3. 마켓플레이스 등록과 플러그인 설치

`<저장소 주소>` 자리에 이 저장소의 주소를 넣는다. 깃허브면 `소유자/저장소이름` 꼴로 줄여 써도 된다. 내려받은 폴더가 있으면 그 폴더 경로를 넣어도 된다.

```bash
claude plugin marketplace add <저장소 주소>
```

```bash
claude plugin install vibe-kit@vibe-kit
```

확인:

```bash
claude plugin details vibe-kit
```

스킬 6개(`setup`, `improve`, `clarify`, `retro`, `freshness`, `scout`)와 서브에이전트 2개(`researcher`, `reviewer`)가 보이면 된 것이다.

### 4. 자동 업데이트 켜기

내 마켓플레이스의 자동 업데이트는 처음에 꺼져 있고, 컴퓨터마다 직접 켜야 한다.

1. Claude Code 세션에서 `/plugin`을 연다.
2. **Marketplaces**에서 `vibe-kit`을 고른다.
3. **Enable auto-update**를 고른다.

켜지 않았으면 손으로 받는다.

```bash
claude plugin marketplace update vibe-kit
```

```bash
claude plugin update vibe-kit@vibe-kit
```

### 지우기

```bash
claude plugin marketplace remove vibe-kit
```

마켓플레이스와 함께 플러그인도 지워진다. 프로젝트에 만든 파일은 그대로 남는다.

## 프로젝트에서 쓰기

1. 프로젝트 폴더에서 Claude Code를 연다.
2. `/vibe-kit:setup`을 실행한다. 프로젝트를 읽고(빈 폴더면 목표를 묻고) 만들 파일과 확인 수단을 보여 준 뒤, 승인하면 만든다.
3. 새 세션을 연다. 설정과 규칙은 새 세션부터 적용된다.
4. 이미 만들어 둔 프로젝트라면 `/vibe-kit:improve`를 실행한다. 프로젝트를 살펴보고 나아질 곳을 목록으로 보여 준다. 번호로 고르면 그것만 고친다.
5. 바라는 것을 정확한 낱말로 말하지 않아도 된다. "여기 좀 깔끔하게", "뭔가 이상해"처럼 말하면 Claude가 먼저 살펴보고, 필요하면 고를 수 있는 물음으로 되묻는다.
6. 일하다가 작업 단위가 끝나면 `/vibe-kit:retro`, 주 1회는 `/vibe-kit:freshness`를 실행한다. 때가 되면 세션 시작 훅이 알려 준다.

## 저장소 구성

```text
.claude-plugin/marketplace.json   이 저장소를 마켓플레이스로 만드는 목록 파일
plugins/vibe-kit/                 플러그인 본체
  .claude-plugin/plugin.json        플러그인 이름과 설명
  skills/                           setup, improve, clarify, retro, freshness, scout
  agents/                           researcher, reviewer
  hooks/                            세션 시작 훅
  templates/                        setup이 프로젝트에 만들 파일의 본
catalog/
  TOOLS.md                          검토한 도구 목록(상태, 이유, 날짜, 출처)
  POLICY.md                         에이전트가 스스로 병합해도 되는 범위
  inbox/                            검토했으면 하는 후보 메모를 넣는 곳
docs/                             키트 자신의 상태(STATE), 배운 점(LEARNINGS), 버전 기록(STACK)
server/                           서버 설치 안내와 정기 실행 스크립트
scripts/validate.js               형식 검증
```

## 키트를 고칠 때

- 변경은 가지와 변경 제안(풀 리퀘스트)으로 올린다. 무엇을 스스로 병합하고 무엇을 사용자가 병합하는지는 [catalog/POLICY.md](catalog/POLICY.md)에 있다.
- 올리기 전에 검증한다.

  ```bash
  node scripts/validate.js --cli
  ```

- 검토했으면 하는 도구는 [catalog/inbox/](catalog/inbox/README.md)에 메모로 넣는다.

## 참고한 것

계속 배우기(확신 점수, 교정에서 배우기, 세션 시작 때 안내)와 먼저 찾아보고 만들기는 [ECC](https://github.com/affaan-m/ECC)(MIT)의 continuous-learning과 search-first에서 생각을 가져왔다. 코드는 가져오지 않았고, 세 운영체제에서 똑같이 돌고 상태를 저장소 안에 두도록 다시 만들었다.

## 버전

`plugin.json`과 `marketplace.json`에 `version`을 적지 않는다. 적지 않으면 설치한 컴퓨터들이 커밋을 따라 새 내용을 받는다. 번호를 적으면 번호를 올릴 때까지 새 커밋이 전달되지 않는데, 이 키트는 매주 스스로 조금씩 바뀌므로 커밋을 따라가는 쪽이 맞다. 특정 시점에 고정하고 싶은 컴퓨터는 등록할 때 주소 뒤에 `#<가지나 태그>`를 붙인다.

## 저장소를 옮길 때

저장소 안의 파일은 저장소 주소를 고정해 두지 않는다. 다른 git 서버로 옮기면 각 컴퓨터에서 마켓플레이스를 지우고 새 주소로 다시 등록하면 된다. 변경 제안을 자동으로 만드는 기능은 깃허브(`gh`)일 때만 돌고, 다른 서버에서는 가지만 올린다.

## 서버에서 돌리기

정기 실행(주 1회 `scout`, 프로젝트별 `freshness`)을 서버로 옮기는 방법은 [server/README.md](server/README.md)에 있다.
