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

## 먼저 익혀 두면 좋은 설정 영역

- `Settings > Dashboard`: 전체 콘텐츠 개요, 화자 coverage, LLM 사용 추세
- `Settings > General`: 테마, 앱 언어, 글꼴, tray 동작, 업데이트 확인, `Diagnostics`, `Backup & Restore`
- `Settings > Input Device`: 마이크 선택, 시스템 오디오 선택, microphone boost, `Keep Microphone Active`, 녹음 중 음소거
- `Settings > Subtitle Settings`: 플로팅 자막 동작. `Live Caption` 또는 `Voice Typing`이 주목적이면 [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)으로 이어가세요.
- `Settings > Voice Typing`: `Voice Typing` 켜기, global shortcut 지정, `Push to Talk (Hold)` 또는 `Toggle (Press once)` 선택, 준비 상태 확인
- `Settings > Model Settings`: `Live Record Model`, `Batch Import Model`, `Transcription Settings`, `ITN`, `Batch VAD Segmentation`, `VAD Buffer Size`, `Max Concurrent Transcriptions`, `Restore Default Settings`, 다운로드 가능한 recognition, punctuation, speaker, VAD models
- `Settings > Vocabulary`: `Text Replacement`, `Hotwords`, polish keyword sets, polish context presets, summary templates, `Speaker Profiles`. 실제 조정 사례는 [용어와 고급 설정](guide:vocabulary-and-advanced-settings)에 있습니다.
- `Settings > Automation`: Sona가 실행 중일 때 새 미디어를 전사, 정리, 번역, 내보내기할 수 있는 watched-folder rules
- `Settings > Storage Management`: 데이터 및 모델 디렉터리 개요, 사용자 지정 FFmpeg 경로, 디스크 사용량 분석, 오디오 보관 정리 정책, WebView 캐시 삭제
- `Settings > Cloud Sync`: 종단간 암호화(E2EE) 기기 간 동기화 볼트, 볼트 ID 및 페어링, 마스터 비밀번호 및 긴급 복구 키, 동기화 범위 사전 설정, 충돌 센터
- `Settings > API Server`: 로컬 HTTP API host, port, 선택형 API key, IP allowlist, server limits, server-level transcription defaults
- `Settings > LLM Service`: feature model bindings, reasoning options, provider credentials. 정리/번역은 [AI Polish와 번역](guide:ai-polish-and-translate), 요약은 [AI Summary](guide:ai-summary)을 보세요.
- `Settings > Shortcuts`: live recording, playback, search, project navigation, editor shortcuts (취소선 `Ctrl + Shift + S` 지원)
- `Settings > About`: source code, logs, update 관련 동작

## Diagnostics, backup, cloud sync, task center

- `Settings > General`에서 `Diagnostics`를 사용해 로컬 전사 체인, runtime readiness, packaging environment를 확인합니다.
- 같은 페이지의 `Backup & Restore`로 config, project data, light history transcripts and summaries, automation state, dashboard LLM usage를 담은 가벼운 archive를 내보내거나 가져옵니다.
- 가벼운 백업 archive는 텍스트 history와 summaries를 복원하지만 원본 오디오 파일은 복원하지 않습니다. 복원된 항목은 playback 없이 읽기와 편집용으로 열릴 수 있습니다.
- `Settings > Cloud Sync`는 독립적인 종단간 암호화(E2EE) 증분 동기화 시스템입니다. 전사 및 설정은 기기를 떠나기 전에 마스터 비밀번호로 암호화되며, 긴급 복구 키를 통한 접근 복구와 기기간 동시 수정을 중재하는 충돌 센터를 지원합니다. 녹음 오디오는 로컬 컴퓨터에만 유지되며 클라우드로 업로드되지 않습니다.
- 페이지 하단에서 기존 WebDAV 백업 아카이브의 1회성 마이그레이션 가져오기를 제공합니다(Sona는 더 이상 새로운 원격 전체 백업을 생성하지 않습니다).
- 헤더의 작업 센터(Task Center)에서 일괄 전사, 자동화, LLM 작업을 중앙 관리하며, 실시간 진행률 및 일괄 전사 시 실시간 취소를 지원합니다. 중단된 작업은 복구 센터에서 재개하거나 폐기할 수 있습니다.

## 확장 기능 때문에 온 경우

- 전사 옆 요약이 필요함: [AI Summary](guide:ai-summary)
- 플로팅 자막 또는 다른 앱 받아쓰기가 필요함: [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)
- watched-folder processing 또는 export automation이 필요함: 이 페이지의 `Settings > Automation`에서 시작
- `Hotwords`, `Text Replacement`, `Speaker Profiles`, `Auto-Polish`, custom context tuning이 필요함: [용어와 고급 설정](guide:vocabulary-and-advanced-settings)

## 참고

- 이 페이지는 전체 설정 매뉴얼이 아니라, 필요한 다음 위치를 안내하는 페이지입니다.
- 내보내기가 아니라 문제 해결이 목적이라면 [FAQ와 문제 해결](guide:faq)로 바로 이동하세요.
