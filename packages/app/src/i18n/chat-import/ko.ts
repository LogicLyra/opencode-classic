export const dict = {
  "profileImport.mode": "가져오기 모드",
  "profileImport.chats": "채팅만",
  "profileImport.everything": "전체(전체 설정)",
  "profileImport.description":
    "호환되는 OpenCode 설정을 빈 Classic 데스크톱 프로필에 복사합니다: 채팅, 공급자 로그인 정보, 클라우드 계정, 권한, 전역 구성, 에이전트, skills, 플러그인, 플랜, 스냅샷, 작업 공간 파일. 원본은 변경되지 않습니다. 미리보기는 가져온 명령을 실행하지 않으며 공급자에 연결하지 않습니다.",
  "profileImport.boundaries":
    "먼저 OpenCode를 닫고 해당 파일 편집을 중지하세요. OpenCode 저장소 외부의 프로젝트 폴더는 원래 경로에 그대로 남습니다. 환경 변수, 시스템에 설치된 도구, 업스트림 데스크톱 창 기본 설정은 복사되지 않습니다. 로그, 캐시, 프로세스 잠금은 다시 생성됩니다. OAuth 공급자는 다시 로그인해야 할 수 있습니다. 사용자 지정 폴더는 다음 순서로 선택됩니다: 데이터, 구성, 그다음 상태.",
  "profileImport.detect": "기본 설정 미리보기",
  "profileImport.browse": "설정 폴더 선택",
  "profileImport.busy":
    "전체 설정의 유효성을 검사하거나 준비하는 중입니다. 완료될 때까지 Classic을 열어 두세요.",
  "profileImport.cancelled":
    "호환되는 원본을 찾지 못했거나 폴더 선택이 취소되었습니다.",
  "profileImport.staged":
    "설정이 준비되고 확인되었습니다. 서버가 시작되기 전에 활성화하려면 Classic을 다시 시작하세요. 다시 시작하기 전에 Classic에 데이터를 추가하지 마세요. 활성화 시 대상이 비어 있는지 다시 확인합니다.",
  "profileImport.activated":
    "전체 설정이 성공적으로 활성화되었습니다. 프로젝트 폴더는 원래 경로에서 계속 사용할 수 있습니다. 가져온 내부 작업 공간은 독립적인 사본을 갖습니다.",
  "profileImport.data": "원본 데이터 폴더",
  "profileImport.config": "원본 구성 폴더",
  "profileImport.state": "원본 상태 폴더",
  "profileImport.providers": "저장된 공급자 로그인 정보",
  "profileImport.accounts": "클라우드 계정",
  "profileImport.workspaces": "작업 공간",
  "profileImport.files": "파일 및 링크",
  "profileImport.bytes": "복사 크기(바이트)",
  "profileImport.plugins": "구성된 플러그인",
  "profileImport.mcp": "MCP 항목",
  "profileImport.commands": "프로젝트 명령",
  "profileImport.permissions": "권한 기록",
  "profileImport.pending": "대기 중인 프롬프트",
  "profileImport.git": "Git 체크아웃",
  "profileImport.consent":
    "OpenCode를 닫았으며 로그인 정보, 계정 새로 고침, 종속성, 플러그인, MCP 서버, 프로젝트 명령, Git 훅, 기존 권한을 포함하여 이 전체 설정을 신뢰합니다. 활성화 후 정상 사용 중에 이들이 실행될 수 있습니다. 대기 중인 프롬프트는 다시 시작될 때까지 대기열에 남습니다.",
  "profileImport.confirm": "전체 설정 준비",
  "profileImport.restart": "다시 시작하고 설정 활성화",
  "profileImport.error.unavailable":
    "전체 가져오기에는 기본 제공 Linux 데스크톱 서버와 파일 기반 구성이 필요합니다. 환경에서 제공하는 구성 또는 인증 재정의는 가져오기 전에 제거해야 합니다.",
  "profileImport.error.nonempty":
    "Classic에 이미 설정 데이터가 포함되어 있습니다. 전체 가져오기는 이를 덮어쓰지 않습니다. 호환되는 대화를 병합하려면 채팅만을 사용하거나 빈 Classic 프로필로 시작하세요.",
  "profileImport.error.incompatible":
    "원본 데이터베이스 스키마가 이 Classic 버전과 일치하지 않습니다. 전체 가져오기에는 호환되는 SQLite 설정이 필요합니다. 원본 마이그레이션은 시도되지 않았습니다.",
  "profileImport.error.invalid":
    "설정의 유효성을 검사할 수 없습니다. 파일 권한, 데이터베이스 무결성, 구성 문법을 확인하세요. 실행 중인 Classic 프로필은 교체되지 않았습니다.",
  "profileImport.error.changed":
    "원본이 변경되었거나 이 미리보기가 만료되었습니다. OpenCode와 다른 쓰기 프로세스를 닫고 다시 미리보기하세요.",
  "profileImport.error.busy":
    "다른 가져오기, 활성 파일 잠금 또는 대기 중인 활성화가 이 작업을 방해합니다. 다시 시도하기 전에 OpenCode를 닫고 Classic을 다시 시작하세요.",
  "profileImport.liveWarning":
    "OpenCode가 현재 실행 중인 것 같습니다. 데이터베이스가 계속 변경되어 준비가 실패할 수 있습니다. 안정적인 가져오기를 위해 확인하기 전에 OpenCode(모든 창)를 닫고 서버를 중지하세요.",
  "profileImport.detail.count": "영향을 받는 항목: {{count}}",
  "profileImport.materialized": "복사된 외부 링크",
  "profileImport.skipped": "건너뛴 런타임 파일",
  "profileImport.error.source-busy":
    "원본에 계속 기록되고 있습니다(OpenCode 인스턴스가 실행 중일 가능성이 높습니다). OpenCode와 해당 서버를 닫은 다음 미리보기와 확인을 다시 수행하세요.",
  "profileImport.error.links":
    "설정에 복사할 수 없는 링크가 포함되어 있습니다: 심볼릭 링크 순환, 또는 사본이 정확해야 하는 Git 메타데이터 내부의 링크.",
  "profileImport.error.git-objects":
    "설정의 Git 메타데이터가 지원되지 않는 레이아웃을 사용합니다(alternates 항목, worktree 포인터, 안전하게 비공개로 만들 수 없는 객체 저장소).",
  "profileImport.error.special-files":
    "설정에 안전하게 복사할 수 없는 장치 노드 또는 기타 특수 파일이 포함되어 있습니다.",
  "profileImport.error.limit":
    "설정이 가져오기 제한(50 GiB 또는 500,000개 항목)을 초과합니다. 큰 백업 파일을 제거하거나 폴더 범위를 좁힌 다음 다시 미리보기하세요.",
  "profileImport.error.oversized-file":
    "구성 또는 메타데이터 파일이 읽기 제한(구성은 64 MB, Git 메타데이터는 16 MB)을 초과합니다. 분할하거나 줄인 다음 다시 미리보기하세요.",
  "profileImport.error.unsupported":
    "이 설정에는 지원되지 않는 링크, 순환 Git 객체 alternates, 특수 파일이 포함되어 있거나 가져오기 제한(50 GiB / 500,000개 항목)을 초과합니다. 외부 심볼릭 링크는 가져오기 전에 실제 파일로 변환되어야 합니다. 원본 파일은 변경되지 않았습니다.",
  "profileImport.error.space":
    "이 설정을 준비할 충분한 여유 디스크 공간이 없습니다. 공간을 확보하고 다시 미리보기하세요.",
  "chatImport.tab": "채팅 가져오기",
  "chatImport.title": "OpenCode에서 채팅 가져오기",
  "chatImport.description":
    "OpenCode Classic Desktop은 자체 채팅 데이터베이스를 유지합니다. 원본을 변경하거나 기존 Classic 채팅을 대체하지 않고 OpenCode에서 호환되는 로컬 채팅을 미리보고 복사합니다. 언제든지 설정에서 여기로 돌아올 수 있습니다.",
  "chatImport.scope":
    "가져오기 전에 OpenCode를 닫으세요. 완료된 로컬 채팅과 해당 기록이 복사됩니다. 대기열에 있거나, 진행 중이거나, 작업 공간 세션은 제외됩니다. 로그인 정보, 권한, 프로젝트 명령, 외부 파일, 실행 취소 스냅샷은 가져오지 않습니다. 별도로 로그인하고 프로젝트 폴더는 원래 경로에 두세요.",
  "chatImport.localOnly":
    "채팅을 가져오려면 기본 제공 로컬 데스크톱 서버를 선택하세요. 이 가져오기 도구는 원격 및 백그라운드 서버 연결을 지원하지 않습니다.",
  "chatImport.detect": "기본 OpenCode 데이터베이스 확인",
  "chatImport.browse": "데이터베이스 파일 선택",
  "chatImport.confirm": "가져올 수 있는 채팅 가져오기",
  "chatImport.busy":
    "채팅을 확인하거나 가져오는 중입니다. 앱을 닫기 전에 기다려 주세요.",
  "chatImport.noSource":
    "데이터베이스를 찾지 못했거나 선택하지 않았습니다. 계속하려면 OpenCode .db 파일을 선택하세요.",
  "chatImport.complete":
    "가져오기가 완료되었습니다. 원래 프로젝트 폴더를 열면 해당 채팅을 찾을 수 있습니다. 가져오기를 반복하면 Classic에 이미 있는 채팅 ID는 건너뜁니다.",
  "chatImport.source": "원본 데이터베이스",
  "chatImport.destination": "Classic 데이터베이스",
  "chatImport.total": "원본의 채팅",
  "chatImport.eligible": "가져오기 가능",
  "chatImport.existing": "이미 있음",
  "chatImport.excluded": "제외됨(대기 중, 진행 중 또는 작업 공간)",
  "chatImport.imported": "가져옴",
  "chatImport.error.unavailable":
    "가져오기는 기본 제공 Linux 데스크톱 서버가 완전히 시작된 후에만 사용할 수 있습니다.",
  "chatImport.error.incompatible":
    "데이터베이스의 스키마가 다르거나 지원되지 않습니다. 호환되는 최신 OpenCode 및 Classic 버전을 사용하고 다시 미리보기하세요. 레거시 JSON 저장소는 지원되지 않으며 원본은 마이그레이션되지 않았습니다.",
  "chatImport.error.invalid":
    "데이터베이스를 읽거나 유효성을 검사할 수 없습니다. 선택한 파일, 권한, 사용 가능한 디스크 공간을 확인하세요. 확정되지 않은 가져오기는 롤백됩니다. 다시 시도하기 전에 다시 미리보기하세요.",
  "chatImport.error.sameFile":
    "원본과 대상이 같은 데이터베이스입니다. 복사가 필요하지 않습니다.",
  "chatImport.error.conflict":
    "충돌하는 프로젝트 또는 메시지 ID로 인해 이 가져오기가 중단되었습니다. 부분 가져오기는 확정되지 않았습니다. 기존 Classic 채팅은 보존되었습니다.",
  "chatImport.error.busy":
    "데이터베이스가 사용 중이거나 작업이 너무 오래 걸렸습니다. OpenCode를 닫고 다른 가져오기가 완료될 때까지 기다린 다음 다시 미리보기하세요. 다시 시도하면 이미 확정된 채팅은 건너뜁니다.",
  "chatImport.error.expired":
    "이 미리보기가 만료되었거나 원본이 변경되었습니다. 가져오기 전에 데이터베이스를 다시 미리보기하세요.",
}
