<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center">오픈 소스 AI 코딩 에이전트.</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://github.com/LogicLyra/opencode-classic/actions/workflows/release-classic.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/LogicLyra/opencode-classic/release-classic.yml?style=flat-square&branch=dev" /></a>
</p>

> [!IMPORTANT]
> OpenCode Classic는 업스트림을 추적하는 비공식 Linux 중심 포크입니다. 기본적으로 클래식 데스크톱 레이아웃을 사용하며, 재디자인된 레이아웃은 설정에서 사용할 수 있습니다. 릴리스와 업데이터는 [`LogicLyra/opencode-classic`](https://github.com/LogicLyra/opencode-classic)에서 독립적으로 관리됩니다. 각 번역 README의 포크 고유 섹션과 설치 링크는 영어와 동기화되며, 더 깊은 내용은 업스트림에서 상속되어 늦어질 수 있습니다.


<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

### OpenCode에서 설정 가져오기

OpenCode Classic Desktop은 내장 서버에 별도의 프로필을 사용합니다.
**설정 > 채팅 가져오기**와 첫 실행 대화상자에서 **채팅만**과
**전체(전체 설정)**를 제공합니다. **채팅만**에는 다음 병합 동작이
적용됩니다:
첫 실행 시 또는 **설정 > 채팅 가져오기**에서 **기본 OpenCode 데이터베이스
확인**을 선택하거나 `.db` 파일을 선택하세요. 먼저 OpenCode를 닫고, 원본,
대상, 수량을 검토한 다음 **가져올 수 있는 채팅 가져오기**를 선택하세요.

- 기본 원본은 `$XDG_DATA_HOME/opencode/opencode.db`, 즉 보통
  `~/.local/share/opencode/opencode.db`입니다. 사용자 지정 경로나 개발
  채널 데이터베이스에는 파일을 선택하세요. 대상은 현재 내장 데스크톱
  서버의 데이터베이스로, Classic 데스크톱 프로필의 `sidecar` 디렉터리
  안에 있습니다. 이 가져오기 도구는 원격 및 실험적 백그라운드 서버
  연결을 지원하지 않습니다.
- 가져오기 도구는 일치하는 SQLite 스키마와 마이그레이션 기록을
  지원합니다. 원본 파일을 마이그레이션하지 않으며 레거시 JSON 저장소를
  가져오지 않습니다. 호환성 검사에 실패하면 호환되는 OpenCode와 Classic
  버전을 사용하고 다시 미리보기하세요.
- 완료된 로컬 채팅은 ID, 제목, 타임스탬프, 메시지, 파트, v2 기록, 할 일,
  원래 프로젝트 경로를 유지합니다. 이미 있는 채팅 ID는 전체적으로
  건너뛰며, 다시 가져와도 이미 가져온 채팅은 업데이트되지 않습니다.
  원본은 WAL 기록을 포함해 읽기 전용이며, 각 가져오기는 원자적으로
  커밋됩니다.
- 대기 중인 프롬프트, 미완료 작업 또는 명시적 작업 공간 배치가 있는
  채팅은 제외되고 집계됩니다. 가져오기는 프롬프트를 시작하거나 명령을
  실행하지 않습니다. 로그인 정보, 계정 상태, 권한, 프로젝트 명령, 공유
  소유권, 외부 첨부, Git 스냅샷, 데스크톱 초안은 복사되지 않습니다.
  별도로 로그인하고 프로젝트 폴더는 원래 경로에 두세요. 과거 실행 취소
  스냅샷은 사용할 수 없으며, 포함된 첨부 데이터는 기록에 남지만 외부
  파일은 계속 존재해야 합니다.
- Classic에서 원래 프로젝트 폴더를 열면 가져온 채팅이 보입니다. 이것은
  일회성 복사이며 앱 간 지속 동기화가 아닙니다.

#### 전체(전체 설정)

먼저 OpenCode를 닫고 다른 쓰기 프로세스를 중지하세요. **기본 설정
미리보기**를 선택하거나 **설정 폴더 선택**으로 OpenCode의 **데이터**,
**구성**, **상태** 폴더를 선택하세요. 보통 `~/.local/share/opencode`,
`~/.config/opencode`, `~/.local/state/opencode`에 있으며 XDG 재정의가
존중됩니다. 수량을 검토하고 이 설정을 신뢰함을 확인한 뒤 네이티브
대화상자에서 확인하고, Classic을 다시 시작해 준비된 프로필을 활성화
하세요.

- 비어 있는 Classic 내장 Linux 프로필이 필요합니다. 기존 채팅, 공급자,
  사용자 지정 설정, 계정, 등록된 프로젝트는 결코 덮어쓰지 않습니다.
  생성된 기본 구성/플러그인 파일은 부트스트랩 상태로 인식됩니다.
- 애플리케이션의 19개 데이터베이스 테이블 전부, 공급자 `auth.json`,
  클라우드 계정, 통합 로그인 정보, 권한, 공유 메타데이터, 구성 파일
  (JSONC 포함), 에이전트, skills, 플러그인, 상태, 플랜, 도구 출력,
  작업 공간 파일, 스냅샷을 복사합니다. 대기 중인 프롬프트는 큐에
  남으며 가져오기가 실행하지 않습니다.
- 외부 프로젝트 경로는 같은 머신에서 변경되지 않습니다. 내부 경로,
  권한 패턴, 스냅샷 키는 다시 매핑됩니다. 연결된 작업 트리는 개인 Git
  메타데이터를 받고, 스냅샷 객체 alternates는 실체화되어 사본이 원본
  객체 저장소에 의존하지 않습니다.
- SQLite는 원본 DB/WAL의 개인 사본을 읽습니다. 원본 DB, WAL, 공유
  메모리 파일은 변경되지 않습니다. 준비는 개인 권한과 영구 소유권
  저널을 사용합니다. 활성화는 내장 서버가 시작되기 전에 수행되며
  중단된 디렉터리 이름 변경을 복구합니다. 원래의 빈/부트스트랩
  프로필은 검사를 위해 Classic 데스크톱 프로필의
  `.profile-import-retained-<operation-id>` 아래 보존되며 자동 삭제되지
  않습니다.
- 로그인 정보는 보호된 로컬 파일로 남습니다. 전체 설정은 실행 가능한
  동작도 보존합니다. 계정 새로 고침, 의존성 설치, 플러그인, MCP 연결,
  프로젝트 명령, Git 훅/헬퍼, 권한 부여는 활성화 후 정상 사용 중
  작동할 수 있습니다. 신뢰하는 설정만 가져오세요. 두 앱을 모두 사용하면
  OAuth 토큰 회전으로 다시 로그인해야 할 수 있습니다.
- 로그, 캐시, 프로세스 잠금은 다시 생성됩니다. 시스템 프로그램, 셸
  환경 변수, 업스트림 데스크톱 창/사이드바 기본 설정, 데스크톱 초안은
  복사되지 않습니다. 외부 프로젝트 파일은 이미 원래 경로에서 공유되고
  있습니다. 원래 프로젝트 폴더를 열어 채팅에 접근하세요.
- 일치하는 SQLite 마이그레이션 기록과 스키마가 필요합니다. 전체 설정은
  현재 `opencode.db`를 읽습니다. 환경에서 제공되는 데이터베이스/구성/
  인증 재정의는 사용 전에 제거해야 합니다. 레거시 JSON 전용 저장소,
  순환 또는 지원되지 않는 Git 객체 참조, 장치 노드, 50 GiB 또는
  500,000개 항목을 넘는 프로필은 구체적인 사유와 함께 거부됩니다.
  외부 심볼릭 링크는 그대로 복사(실체화)되며, 끊어진 링크, 소켓, FIFO는
  건너뛰고 요약에 집계됩니다. 64 MB까지의 구성 파일이 지원됩니다.
  준비에는 추가 디스크 공간이 필요합니다.
- 가져오기 전에 OpenCode를 닫으세요. 실행 중인 인스턴스가 감지되면
  미리보기가 경고하고, 스냅샷 사본은 자동으로 재시도되며, 계속 기록되는
  원본은 닫으라는 전용 사용 중 오류를 보고합니다.

독립 실행형 Classic CLI는 재정의하지 않는 한 OpenCode의 기본 XDG 루트를
계속 사용합니다. `uninstall` 명령은 `--force`를 포함해 기본적으로 데이터,
로그인 정보, 구성, 캐시, 상태를 보존합니다. 공유 루트를 삭제하려면
`--remove-shared-data`가 필요하며, `--keep-data`와 `--keep-config`는 각
루트에 대해 해당 요청을 무시합니다. `uninstall --dry-run`으로 경로를
확인하세요. 업스트림 자체의 제거 도구는 공유 CLI 데이터를 삭제할 수
있습니다. 이 포크는 알 수 없는 마이그레이션이 포함된 데이터베이스 열기를
거부합니다. 마이그레이션 저널을 편집하거나 삭제하는 대신 Classic을
업데이트하세요.

### 설치

```bash
curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```

> [!WARNING]
> `opencode-ai` npm 패키지와 기존 Homebrew, Scoop, Chocolatey, AUR, Nix 패키지는 업스트림 OpenCode를 배포하며 OpenCode Classic이 아닙니다.

### 데스크톱 앱 (BETA)

OpenCode Classic 데스크톱 빌드는 Linux만 지원하며 [포크의 릴리스 페이지](https://github.com/LogicLyra/opencode-classic/releases)에서 제공됩니다.

| 플랫폼    | 다운로드                                             |
| --------- | ---------------------------------------------------- |
| Linux x64 | `opencode-classic-desktop-linux-*`(`.deb` 또는 `.rpm`) |

AppImage는 의도적으로 배포하지 않습니다. Ubuntu 24.04 이상에서는 기본 AppArmor 정책하에서 Electron AppImage가 Chromium 샌드박싱을 비활성화하도록 강제할 수 있습니다. 설치된 deb와 RPM 형식은 배포판이 기대하는 샌드박스 통합을 유지합니다.

유지 관리자는 [Linux VM 릴리스 QA 런북](docs/linux-vm-qa.md)으로 빌드, 패키징, 설치된 deb, 시각 릴리스 검사를 완전히 재현할 수 있습니다.

#### 설치 디렉터리

설치 스크립트는 설치 경로에 대해 다음 우선 순서를 따릅니다:

1. `$OPENCODE_INSTALL_DIR` - 사용자 지정 설치 디렉터리
2. `$XDG_BIN_DIR` - XDG Base Directory Specification을 준수하는 경로
3. `$HOME/bin` - 표준 사용자 바이너리 디렉터리(존재하거나 생성 가능한 경우)
4. `$HOME/.opencode/bin` - 기본 대체

```bash
# 예시
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://github.com/LogicLyra/opencode-classic/releases/latest/download/install | bash
```
### Agents

OpenCode 에는 내장 에이전트 2개가 있으며 `Tab` 키로 전환할 수 있습니다.

- **build** - 기본값, 개발 작업을 위한 전체 권한 에이전트
- **plan** - 분석 및 코드 탐색을 위한 읽기 전용 에이전트
  - 기본적으로 파일 편집을 거부
  - bash 명령 실행 전에 권한을 요청
  - 낯선 코드베이스를 탐색하거나 변경을 계획할 때 적합

또한 복잡한 검색과 여러 단계 작업을 위한 **general** 서브 에이전트가 포함되어 있습니다.
내부적으로 사용되며, 메시지에서 `@general` 로 호출할 수 있습니다.

[agents](https://opencode.ai/docs/agents) 에 대해 더 알아보세요.

### 문서

OpenCode 설정에 대한 자세한 내용은 [**문서**](https://opencode.ai/docs) 를 참고하세요.

### 기여하기

OpenCode 에 기여하고 싶다면, Pull Request 를 제출하기 전에 [contributing docs](./CONTRIBUTING.md) 를 읽어주세요.

### OpenCode 기반으로 만들기

OpenCode 와 관련된 프로젝트를 진행하면서 이름에 "opencode"(예: "opencode-dashboard" 또는 "opencode-mobile") 를 포함한다면, README 에 해당 프로젝트가 OpenCode 팀이 만든 것이 아니며 어떤 방식으로도 우리와 제휴되어 있지 않다는 점을 명시해 주세요.

---

**커뮤니티에 참여하기** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
