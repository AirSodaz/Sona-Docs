이미 오디오나 비디오 파일이 있고 Sona가 백그라운드에서 처리하길 원한다면 `Batch Import`를 사용하세요.

## 이런 경우에 적합합니다

- 녹음된 회의, 강의, 팟캐스트, 인터뷰
- 로컬 미디어 파일에서 자막을 준비하는 작업
- 여러 파일을 대기열에 넣고 차례로 끝내야 하는 흐름

## 파일을 넣기 전에

- `Settings > Model Settings`에서 `Batch Import Model`을 설정하세요.
- 파일이 지원되는 오디오 또는 비디오 형식인지 확인하세요.

## 대기열에 파일 추가

1. `Batch Import` 탭을 엽니다.
2. 가져오기 영역에 파일을 놓거나 `Select File`을 클릭합니다.
3. 하나 이상의 파일을 대기열에 추가합니다.
4. 대기열 사이드바와 활성 항목 상태 화면을 확인합니다.
5. 대기열을 더 늘리고 싶으면 `Add More Files`를 사용합니다.

## 가져오기 동작 조정

1. 새 작업의 `Subtitle Mode`나 `Language`를 바꾸고 싶으면 `Parameter Settings`를 클릭합니다.
2. 대기열 상태를 확인하세요: `Pending`, `Processing`, `Complete`, `Failed`.

## 파일 처리가 끝난 뒤

- 완료된 항목은 기본 전사 편집기에 로드됩니다.
- 이후 [편집과 재생](guide:edit-and-playback), [AI Polish와 번역](guide:ai-polish-and-translate), [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox), [내보내기와 설정](guide:export-and-settings)으로 이어갈 수 있습니다.

## 팁

- 오프라인 batch 모델이 설정되어 있지 않으면 Sona는 가져오기를 시작하는 대신 온보딩을 다시 엽니다.
- `Settings > Model Settings`의 `VAD Buffer Size`와 `Max Concurrent Transcriptions`는 batch 동작에 영향을 줍니다.
- 기존 미디어에서 자막 파일을 만들 때 기본 경로는 `Batch Import`와 내보내기입니다.
