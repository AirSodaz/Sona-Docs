기본 흐름은 이해했지만 한 부분이 계속 막힐 때 이 페이지를 사용하세요.

## 어떤 데스크톱 빌드를 설치해야 하나요?

- 대부분의 사용자는 source build가 아니라 [Desktop downloads](/downloads) 또는 [GitHub Releases](https://github.com/AirSodaz/sona/releases/latest)의 최신 릴리스 빌드를 설치하면 됩니다.
- 운영체제, CPU 아키텍처, 선호 설치 형식에 맞는 빌드를 고르세요.
- Source builds와 development commands는 [프로젝트 README](readme)에 있습니다.

## Sona가 계속 setup을 끝내라고 합니다

- 온보딩 배너를 열고 모델과 마이크 단계를 완료하세요.
- 이전에 setup을 건너뛰었다면 `Settings > Model Settings`에서 `Live Record Model`과 `Batch Import Model`이 모두 설정되어 있는지 확인하세요.
- 알림 배너를 숨겼다면 Sona가 다시 안내할 때 배너 흐름이나 settings-related entry point에서 setup을 수동으로 다시 여세요.

## `Download Recommended Models`가 실패하거나 끝나지 않습니다

- Sona를 열어 둔 채 안정적인 네트워크를 유지하세요. 권장 모델 패키지는 다운로드와 압축 해제에 시간이 걸릴 수 있습니다.
- 디스크 여유 공간을 확인하고, 온보딩이 중단되었다면 `Settings > Model Settings`에서 다시 시도하세요.
- 반복해서 멈추면 `Diagnostics`를 열어 model download 또는 local runtime message를 확인한 뒤 다시 시도하세요.

## 모델은 다운로드됐는데 Sona가 여전히 누락됐다고 합니다

- `Settings > Model Settings`를 열고 올바른 slot이 선택되었는지 확인하세요: live transcription은 `Live Record Model`, file transcription은 `Batch Import Model`.
- 모델 폴더 안에 압축 해제된 파일이 아직 있는지 확인하세요. 다운로드 뒤 모델 폴더를 이동하거나 이름을 바꾸면 Sona가 경로를 잃을 수 있습니다.
- Sona 밖에서 모델을 다운로드했다면 first-run setup에 의존하지 말고 `Settings > Model Settings`에서 직접 선택하세요.

## `Live Record`가 시작되지 않습니다

- 운영체제의 마이크 권한을 확인하세요.
- `Live Record Model`이 설정되어 있는지 확인하세요.
- 입력 소스가 올바른지 확인하세요: `Microphone` 또는 `Desktop Audio`.

## `Live Record`는 시작되지만 마이크 소리가 들리지 않습니다

- `Settings > Input Device`를 열고 Sona가 사용할 실제 마이크를 선택하세요.
- 운영체제 마이크 권한을 확인하고 다른 앱이 장치를 독점하고 있지 않은지 확인하세요.
- 현재 소스가 `Desktop Audio`라면 `Microphone`으로 다시 바꿔 입력 경로를 확인하세요.
- 선택한 장치가 맞아 보이는데도 Sona가 입력 없음으로 표시하면 `Diagnostics`를 여세요.

## 로컬 전사 diagnostics는 어디에서 확인하나요?

- `Settings > General`을 열고 `Diagnostics`를 선택하세요.
- 로컬 전사 준비 상태, 모델 경로, 입력 장치 상태, packaged runtime environment를 확인하는 데 사용합니다.
- 도움을 요청할 때는 증상만 추측하지 말고 화면에 보이는 diagnostic message 또는 error text를 공유하세요.

## `Batch Import`가 시작되지 않습니다

- `Batch Import Model`이 설정되어 있는지 확인하세요.
- 파일 확장자가 지원되는지 확인하세요.
- Sona가 unsupported format을 표시하면 먼저 파일을 변환한 뒤 다시 시도하세요.

## `LLM Polish` 또는 `Translate`가 비활성화되거나 실패합니다

- `Settings > LLM Service`에 올바른 provider credentials가 있는지 확인하세요.
- 기능 자체에 모델이 지정되어 있는지 확인하세요: polish는 `Polish Model`, translation은 `Translation Model`.
- 다시 시도하기 전에 `Test Connection`을 사용하세요.
- `Ollama` 같은 custom endpoint 또는 local service를 쓰는 경우, 해당 서비스를 먼저 확인하세요.

## `Auto-Polish`를 찾을 수 없습니다

- `Auto-Polish`, frequency, keywords, scenario presets, custom context는 `LLM Polish > Advanced Settings`에서 엽니다.
- 이 controls가 어디에 들어가는지 지도가 필요하면 [용어와 고급 설정](guide:vocabulary-and-advanced-settings)으로 이어가세요.

## 내보내기에 `Original`만 보입니다

- `Translation`과 `Bilingual`은 전사에 번역 텍스트가 이미 있을 때만 나타납니다.

## `Speaker Review`가 비어 있거나 후보가 없습니다

- `Speaker Review`는 기존 speaker metadata를 그룹화합니다. 전사가 speaker attribution 없이 만들어졌다면 검토할 내용이 없을 수 있습니다.
- Candidate suggestions는 `Settings > Vocabulary`의 `Speaker Profiles`, 가져온 reference samples, 설정된 speaker models, 현재 프로젝트에서 활성화된 profiles에 따라 달라집니다.
- 편집기에 speaker badge가 보인다면 여전히 직접 클릭해 profile을 수동으로 지정할 수 있습니다.

## `Version Snapshots`를 찾을 수 없습니다

- `Version Snapshots`는 이미 전사 세그먼트가 있는 저장된 workspace 항목에서만 나타납니다.
- 임시 `current` 전사와 아직 진행 중인 live recording draft에서는 숨겨집니다.
- Snapshots는 `LLM Polish`, `Translate`, `Re-transcribe` 같은 bulk rewrite 전과 다른 snapshot에서 복원하기 전에 만들어집니다.

## 복원한 backup은 텍스트는 열리지만 오디오 재생이 없습니다

- Backup archives는 의도적으로 가볍습니다. config, workspace data, light history transcripts and summaries, automation state, dashboard LLM usage를 포함합니다.
- 원본 오디오 파일은 포함되지 않으므로 복원된 항목은 읽기와 편집용으로 다시 열릴 수 있지만, 원본 오디오가 다른 경로로 제공되기 전에는 playback이 없을 수 있습니다.

## 새 항목이 왜 먼저 `Inbox`에 나타나나요?

- `Inbox`는 아직 프로젝트에 배정되지 않은 녹음과 가져오기의 기본 보관 위치입니다.
- 새 항목이 자동으로 해당 프로젝트에 남길 원한다면 `Live Record` 또는 `Batch Import`를 시작하기 전에 특정 프로젝트를 여세요.
- 나중에 [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)에서 저장된 항목을 `Inbox`에서 프로젝트로 이동할 수도 있습니다.

## 프로젝트를 삭제하면 어떻게 되나요?

- 프로젝트 삭제는 프로젝트 자체를 제거하지만, 그 안에 있던 녹음이나 가져온 파일을 삭제하지는 않습니다.
- Sona는 해당 항목을 `Inbox`로 되돌리므로 나중에 다시 배정하거나 계속 사용할 수 있습니다.

## 녹음 중인데 `Draft` 항목이 보이는 이유는?

- 활성 live recording 중 Sona는 세션이 이미 `Workspace` 안에 저장된 위치를 갖도록 보이는 `Draft` 항목을 만들 수 있습니다.
- 녹음을 멈추면 두 번째 저장 사본을 만들지 않고 같은 항목을 완료합니다.
- 캡처가 실행 중인 동안에는 이 draft를 live session으로 다루면 됩니다. 완성된 전사는 같은 항목에 남습니다.

## `Live Caption`이 나타나지 않습니다

- [Live Record](guide:live-record)로 돌아가 그 페이지의 `Live Caption`이 켜져 있는지 확인하세요. `Settings > Subtitle Settings`는 창 동작과 모양만 제어합니다.
- 플로팅 system-audio subtitles만 필요하다면 먼저 녹음을 시작할 필요가 없습니다. `Live Caption`을 켜는 것으로 충분합니다.
- `Live Caption`은 같은 오프라인 live transcription setup에 의존하므로 `Live Record Model`이 설정되어 있는지 확인하세요.
- 페이지 toggle과 settings layer의 차이를 먼저 설명받고 싶으면 [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)으로 이어가세요.

## Voice Typing이 작동하지 않습니다

- `Settings > Voice Typing`에서 `Voice Typing`을 켜세요.
- 페이지가 표시하는 shortcut, model, VAD, input device, readiness state가 예상과 맞는지 확인하세요.
- Voice Typing은 같은 오프라인 전사 setup에 의존하므로 live transcription model이 설정되어 있어야 합니다.
- setup path나 mode choice 설명이 더 필요하면 [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)으로 이어가세요.

## 중단된 batch 또는 automation 작업은 어디에서 복구하나요?

- Sona가 pending recovery items를 알리면 헤더 알림 센터를 여세요.
- `Recovery Center`에서 중단된 batch와 automation 작업을 resume하거나 discard합니다.
- diagnostics나 backup을 찾던 중이라면 `Settings > General`로 이동하세요.

## 재생 controls가 없습니다

- 오디오 플레이어는 현재 전사에 저장된 녹음이나 처리된 파일 같은 오디오 source가 있을 때만 나타납니다.

## Sona를 빌드하거나 개발하고 싶습니다

- Source builds와 development commands는 [프로젝트 README](readme)를 사용하세요.
- Sona를 사용만 하려면 release build를 설치하세요. Source builds는 주로 contributors와 development work를 위한 것입니다.
