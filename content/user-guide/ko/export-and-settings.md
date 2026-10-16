이 페이지는 워크플로의 마지막 단계인 완성된 전사 내보내기, 최종 화자/버전 확인, 자주 필요한 설정 위치 찾기, `Dashboard`, `Diagnostics`, `Backup & Restore`, `Automation`, 알림 같은 지원 화면 위치를 다룹니다.

## 완성된 전사 내보내기

화자 라벨이 전달이나 검토 과정에서 중요하다면 내보내기 전에 전사 헤더에서 `Speaker Review`를 여세요. 저장된 non-draft 전사에서 일부 행을 복구하거나 bulk rewrite를 되돌려야 하면 먼저 `Version Snapshots`를 엽니다.

1. 헤더의 `Export` 버튼을 클릭합니다.
2. `Export Transcript` modal에서 `Filename`을 입력합니다.
3. `Export Directory`를 선택합니다.
4. 출력 형식을 고릅니다: `SubRip (.srt)`, `WebVTT (.vtt)`, `JSON (.json)`, `Plain Text (.txt)`, `Markdown (.md)`.
5. 내보내기 모드를 고릅니다: `Original`, `Translation`, `Bilingual`.
6. `Export`를 클릭합니다.
7. 파일을 쓰지 않고 선택한 모드의 plain text가 필요하면 `Copy to Clipboard`를 사용합니다.

## 내보내기로 얻는 것

- Sona가 선택한 경로와 형식으로 전사를 씁니다.
- `Markdown (.md)`는 화자 라벨을 굵은 라벨로 보존하고 Markdown 편집기에서 읽기 쉽게 유지합니다.
- 번역 텍스트가 있으면 번역만 또는 이중 언어 출력으로 내보낼 수 있습니다.
- `Copy to Clipboard`는 선택한 내보내기 모드의 최종 세그먼트 텍스트를 plain text로 복사합니다.
- `Translation`과 `Bilingual`은 하나 이상의 세그먼트에 번역 텍스트가 있을 때만 나타납니다.

## 언제 `Projects`로 돌아가나요

- 저장된 녹음과 가져온 파일을 다시 열거나, 이름을 바꾸거나, 이동하거나, 정렬하려면 [프로젝트와 Inbox](guide:workspace-projects-and-inbox)로 돌아가세요.
- 프로젝트 context와 `Inbox` 정리도 지금은 `Projects`(프로젝트 센터) 안에 있습니다.

## 범주별로 정리된 설정 화면

Sona 데스크톱의 설정 사이드바는 5개의 명명된 범주로 구분됩니다:

### 1. 일반 (General)
- `Settings > General`: 테마, 앱 언어, 글꼴, 부팅 시 자동 시작, 백그라운드 무음 실행(트레이 최소화 실행), 업데이트 확인, `Diagnostics`, `Backup & Restore`
- `Settings > Dashboard`: 전체 콘텐츠 개요, 화자 coverage, LLM 사용 추세
- `Settings > About`: 버전 정보, 릴리스 노트, 라이선스, 업데이트 확인

### 2. 인식 및 음성 (Recognition & Speech)
- `Settings > Input Device`: 마이크 선택, 시스템 오디오 선택, microphone boost, `Keep Microphone Active`, 녹음 중 음소거
- `Settings > Subtitle Settings`: 플로팅 자막 동작, 창 모양 스타일, 클릭 통과, 글꼴 크기
- `Settings > Voice Typing`: `Voice Typing` 켜기, 전역 바로가기 키, `Push to Talk` / `Toggle`, 상황별 프리셋, 준비 상태 확인
- `Settings > Model Settings`: `Live Record Model`, `Batch Import Model`, CTC 강제 정렬, 화자 분리 민감도, `Batch VAD Segmentation`, `VAD Buffer Size`, 모델 관리
- `Settings > Vocabulary`: `인식 및 교정`, `프롬프트 및 컨텍스트`, `화자 프로필`의 3개 하위 탭으로 구성되며 통합 사전(시각 모드 및 YAML 소스 듀얼 모드) 지원

### 3. AI 및 자동화 (AI & Automation)
- `Settings > LLM Service`: 기능 모델 바인딩(llama.cpp 기반 로컬 GGUF 모델 및 aimux 기반 클라우드 다중 제공자), 추론 과정과 본문 분리, 제공자 자격 증명 관리
- `Settings > Automation`: Sona 실행 중 지정 폴더의 미디어를 자동으로 전사, 윤문, 번역하여 대상 프로젝트로 내보내는 자동화 규칙

### 4. 통합 및 동기화 (Integration & Sync)
- `Settings > Cloud Sync`: 종단간 암호화(E2EE) 기기 간 동기화 볼트, WebDAV 및 S3 호환 객체 스토리지(AWS S3, Cloudflare R2, MinIO 등) 지원, 마스터 비밀번호, 긴급 복구 키, 충돌 센터
- `Settings > API Server`: 로컬 HTTP API 호스트, 포트, 선택형 API Key, IP 허용 목록, REST 전사 및 WebSocket 실시간 스트리밍
- `Settings > MCP Server`: Model Context Protocol 서버 브리지 설정, 엔드포인트 모니터링, Agent 권한 스위치(텍스트 편집, 파괴적 작업, 모델 다운로드 등)

### 5. 시스템 및 고급 (System & Advanced)
- `Settings > Storage Management`: 데이터 및 모델 디렉터리 개요, 핫 리로드 스토리지 마이그레이션(앱 재시작 없이 진행 모달과 함께 디렉터리 이동), 순수 Rust 오디오 디코더 및 선택적 사용자 지정 FFmpeg 경로, 디스크 분석 및 정리 정책
- `Settings > Shortcuts`: 실시간 녹음, 재생, 검색, 프로젝트 탐색, 편집기 바로가기 키(취소선 `Ctrl + Shift + S` 지원)
## Diagnostics, backup, cloud sync, message center

- `Settings > General`에서 `Diagnostics`를 사용해 로컬 전사 체인, runtime readiness, packaging environment를 확인합니다.
- 같은 페이지의 `Backup & Restore`로 config, project data, light history transcripts and summaries, automation state, dashboard LLM usage를 담은 가벼운 archive를 내보내거나 가져옵니다.
- 가벼운 백업 archive는 텍스트 history와 summaries를 복원하지만 원본 오디오 파일은 복원하지 않습니다. 복원된 항목은 playback 없이 읽기와 편집용으로 열릴 수 있습니다.
- `Settings > Cloud Sync`는 독립적인 종단간 암호화(E2EE) 증분 동기화 시스템입니다. 전사 및 설정은 기기를 떠나기 전에 마스터 비밀번호로 암호화되며, 긴급 복구 키를 통한 접근 복구와 기기간 동시 수정을 중재하는 충돌 센터를 지원합니다. 녹음 오디오는 로컬 컴퓨터에만 유지되며 클라우드로 업로드되지 않습니다.
- 페이지 하단에서 기존 WebDAV 백업 아카이브의 1회성 마이그레이션 가져오기를 제공합니다(Sona는 더 이상 새로운 원격 전체 백업을 생성하지 않습니다).
- 헤더의 메시지 센터(Message Center)에서 일괄 전사, 자동화, LLM 작업을 중앙 관리하며, 실시간 진행률, 일괄 전사 실시간 취소, 완료 작업 지우기 메뉴를 지원합니다. 중단된 작업은 복구 센터에서 재개하거나 폐기할 수 있습니다.

## 확장 기능 때문에 온 경우

- 전사 옆 요약이 필요함: [AI Summary](guide:ai-summary)
- 플로팅 자막 또는 다른 앱 받아쓰기가 필요함: [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)
- watched-folder processing 또는 export automation이 필요함: 이 페이지의 `Settings > Automation`에서 시작
- `Hotwords`, `Text Replacement`, `Speaker Profiles`, `Auto-Polish`, custom context tuning이 필요함: [용어와 고급 설정](guide:vocabulary-and-advanced-settings)

## 참고

- 이 페이지는 전체 설정 매뉴얼이 아니라, 필요한 다음 위치를 안내하는 페이지입니다.
- 내보내기가 아니라 문제 해결이 목적이라면 [FAQ와 문제 해결](guide:faq)로 바로 이동하세요.
