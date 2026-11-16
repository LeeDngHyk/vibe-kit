# 서버에 옮기기

키트의 정기 작업을 24시간 켜져 있는 서버에서 돌리는 방법이다. 서버에 필요한 것은 **이 저장소 내려받기**와 **인증** 두 가지뿐이다. 다른 컴퓨터에만 있는 상태에는 기대지 않는다.

정기 작업은 두 가지다.

- `scout`: 이 저장소에서 새 도구를 찾아 평가하고 변경 제안을 올린다(주 1회).
- `freshness`: `projects.json`에 적힌 프로젝트마다 의존성과 릴리스 안내를 점검해 기록을 변경 제안으로 올린다(주 1회).

아래는 Linux 서버 기준이다. 명령은 2026-11-16에 공식 문서에서 확인했다. 달라졌으면 문서를 따른다: <https://code.claude.com/docs/llms.txt>

## 1. 전용 사용자 계정 만들기

정기 작업은 관리자 권한이 없는 전용 계정으로 돌린다. 에이전트가 실행하는 명령이 그 계정의 권한 안에 머물게 하기 위해서다.

```bash
sudo adduser --disabled-password --gecos "" vibekit
```

```bash
sudo -iu vibekit
```

이후 명령은 모두 이 계정에서 실행한다.

## 2. 필요한 프로그램 설치

git, Node.js, GitHub CLI(`gh`, 저장소가 깃허브에 있을 때)를 배포판의 패키지 관리 도구로 설치한다. 그다음 Claude Code를 설치한다.

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

```bash
claude --version
```

## 3. Claude Code 인증 (화면 없는 환경)

서버에는 브라우저가 없으므로, **브라우저가 있는 컴퓨터에서** 1년짜리 토큰을 만든다.

```bash
claude setup-token
```

브라우저에서 승인하면 터미널에 토큰이 나온다. 이 명령은 토큰을 어디에도 저장하지 않으니 바로 복사한다. 이 토큰은 구독(Pro, Max, Team 등)으로 인증하며 모델 요청만 할 수 있다.

서버에서 토큰을 환경 변수 `CLAUDE_CODE_OAUTH_TOKEN`에 둔다. **저장소 안의 파일에는 넣지 않는다.** 전용 계정만 읽을 수 있는 파일에 둔다.

```bash
mkdir -p ~/.config/vibe-kit && chmod 700 ~/.config/vibe-kit
```

```bash
printf 'export CLAUDE_CODE_OAUTH_TOKEN=%s\n' '여기에-토큰' > ~/.config/vibe-kit/env && chmod 600 ~/.config/vibe-kit/env
```

확인:

```bash
. ~/.config/vibe-kit/env && claude -p "한 낱말로 대답: 준비됐나요?"
```

주의: 실행 스크립트는 `--bare` 방식을 쓰지 않는다. 그 방식은 이 토큰과 플러그인을 읽지 않는다. 토큰은 1년 뒤 만료되니 만든 날짜를 적어 두고 갱신한다.

## 4. git 인증

저장소를 받고, 가지를 올리고, 변경 제안을 만들 수 있어야 한다.

- 깃허브: 이 저장소(와 관리할 프로젝트 저장소)에만 권한을 준 토큰으로 로그인한다.

  ```bash
  gh auth login
  ```

  ```bash
  gh auth setup-git
  ```

- 다른 git 서버: 암호를 묻지 않는 SSH 키를 등록한다. 이 경우 변경 제안은 자동으로 만들어지지 않고 가지만 올라간다.

커밋에 남을 이름을 정한다.

```bash
git config --global user.name "vibe-kit server" && git config --global user.email "vibekit@localhost"
```

## 5. 키트 내려받기

`<저장소 주소>` 자리에 이 저장소의 주소를 넣는다.

```bash
git clone <저장소 주소> ~/vibe-kit
```

```bash
cd ~/vibe-kit && node scripts/validate.js
```

"검증 통과"가 나오면 된 것이다. 정기 실행은 이 폴더의 플러그인을 직접 불러오므로(`--plugin-dir`) 서버에 플러그인을 따로 설치하지 않아도 된다. 서버에서 대화형으로도 쓰려면 저장소 뿌리의 `README.md`대로 설치한다.

## 6. 먼저 손으로 한 번 실행

실행할 명령만 보기:

```bash
cd ~/vibe-kit && node server/run.js all --dry-run
```

실제로 한 번 실행:

```bash
cd ~/vibe-kit && . ~/.config/vibe-kit/env && node server/run.js scout
```

끝나면 저장소에 `scout/<날짜>-...` 가지와 변경 제안이 생기고, `docs/STATE.md`의 "실행 기록"에 한 줄이 더해진다.

## 7. 정기 실행 등록

주 1회, 월요일 새벽 4시에 돌리는 예다. `crontab -e`로 아래 줄을 더한다.

```cron
0 4 * * 1 . $HOME/.config/vibe-kit/env && cd $HOME/vibe-kit && node server/run.js all >> $HOME/vibe-kit-run.log 2>&1
```

등록 확인은 `crontab -l`, 지우기는 `crontab -e`에서 그 줄을 지운다.

## 관리 대상 프로젝트 더하기

`server/projects.json`에 프로젝트를 더한다. 처음에는 비어 있다.

```json
{
  "projects": [
    {
      "name": "my-project",
      "repo": "<프로젝트 저장소 주소>",
      "allow": ["Bash(<낡은 의존성을 보여 주는 명령> *)"]
    }
  ]
}
```

- `name`: 영문·숫자·점·밑줄·붙임표만. 작업 폴더 이름으로 쓰인다.
- `repo`: 서버의 git 인증으로 받을 수 있는 주소.
- `allow`: 그 프로젝트의 점검에 필요한 읽기 전용 명령만 더한다(없어도 된다). 설치나 버전을 올리는 명령은 넣지 않는다.
- 그 프로젝트에는 먼저 `/vibe-kit:setup`으로 환경(`docs/agent/`)이 만들어져 있어야 한다.

## 안전장치

| 장치 | 어디에 | 처음 값 |
|---|---|---|
| 질문 없이 진행: 승인이 필요한 호출은 묻지 않고 거부 | `run.js`의 `--permission-prompts none` | 켜짐 |
| 허용하는 명령을 좁힘 | `server/unattended.settings.json` | git 읽기·가지·커밋·올리기, `gh pr create`, 검증 스크립트, 웹 조회 |
| 막는 명령 | 같은 파일의 `deny` | 강제로 올리기, 기본 가지에 직접 올리기, 병합, 플러그인 설치, 비밀 파일 읽기 |
| 한 번 실행의 상한 | `server/config.json` | 80턴, 추정 비용 5달러, 45분 |
| 병합 | `run.js`가 바뀐 파일을 검사 | 기록 파일(`catalog/TOOLS.md`, `docs/*.md`)만 바꾼 `scout/` 가지만 검증 통과 후 병합. 나머지는 사용자가 병합 |

- 비용 상한은 Claude Code가 어림한 값 기준이라 실제 청구와 다를 수 있고, 상한을 조금 넘겨 멈출 수 있다.
- 서버의 자동 병합은 `catalog/POLICY.md`보다 좁다. 채택한 도구의 정보 갱신처럼 `adopted-tools.md`가 바뀌는 변경은 서버에서 병합하지 않고 사용자에게 넘긴다.
- 허용 목록은 명령 하나씩과 맞춰 본다. 여러 명령을 한 줄로 이으면 통째로 거부되므로, 실행 스크립트가 "명령은 한 번에 하나씩"이라고 알려 준다. 그래도 거부된 호출이 있으면 스크립트가 건수와 내용을 출력하고, `docs/STATE.md`에 "일부 거부됨"으로 기록하며, 종료 코드 1로 끝난다. 필요한 명령이 빠져 있으면 `server/unattended.settings.json`의 `allow`에 더한다.
- 실행 전에 커밋하지 않은 수정이 있으면 시작하지 않는다. 실행 뒤 가지에 담기지 않은 수정이 남으면 지우지 않고 `git stash`에 보관한다.

## 실행 기록 보기

서버에 접속하지 않아도 저장소에서 볼 수 있다.

- `docs/STATE.md`의 "실행 기록": 날짜, 한 일, 만든 변경 제안, 실패 원인.
- 저장소의 변경 제안 목록: 사용자가 병합해야 하는 것.

## 서버가 생기기 전

같은 스크립트를 개인 컴퓨터에서 그대로 쓴다.

- **손으로 실행**: 키트 폴더에서 `node server/run.js scout`. 로그인된 Claude Code가 있으면 토큰 없이 돈다.
- **운영체제의 예약 기능**: Windows는 작업 스케줄러, macOS는 launchd, Linux는 cron에 위 명령을 건다. 컴퓨터가 켜져 있을 때만 돈다.
- **컴퓨터가 꺼져 있어도 돌리기**: Claude Code의 클라우드 예약 작업을 쓴다. 키트 저장소에서 연 세션에 `/schedule 매주 월요일 오전 4시에 vibe-kit의 scout 스킬을 실행`처럼 말하면 만들어진다. 저장소를 새로 내려받아 돌기 때문에 서버 방식과 가장 비슷하다. 구독 사용량을 쓰고 최소 간격은 1시간이다. 이 방식에서는 `run.js`의 안전장치 대신 예약 작업의 권한 설정이 적용되므로, 병합은 사용자가 직접 한다.

어느 방식이든 정기 실행을 등록하는 일은 사용자의 승인을 받고 한다.
