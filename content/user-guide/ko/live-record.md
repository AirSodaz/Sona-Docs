오디오를 캡처하는 동안 전사 세그먼트가 바로 나타나야 한다면 `Live Record`를 사용하세요.

## 이런 경우에 적합합니다

- 회의, 인터뷰, 강의, 음성 메모
- 캡처 중에도 타임스탬프를 유지해야 하는 작업
- 녹음이 끝난 뒤 보이는 live draft까지 포함해 모든 것을 Sona의 기본 작업공간에 두고 싶은 경우

## 시작하기 전에

- [시작하기](guide:getting-started)를 마치거나 `Settings > Model Settings`에서 `Live Record Model`을 직접 설정하세요.
- 마이크로 녹음하려면 운영체제가 마이크 권한을 허용했는지 확인하세요.

## 실시간 세션 녹음

1. `Live Record` 탭을 엽니다.
2. 녹음 시작 전 드롭다운에서 입력 소스를 고릅니다: `Microphone` 또는 `Desktop Audio`.
3. `Start Recording`을 클릭합니다.
4. Sona가 오디오를 캡처하는 동안 파형과 타이머를 확인합니다.
5. 세션을 끝내지 않고 잠시 멈추려면 `Pause`를 사용합니다.
6. 녹음을 마무리하려면 `Stop`을 사용합니다.

## 녹음 중 동작 조정

1. `Subtitle Mode` 또는 `Language`를 바꾸고 싶으면 `Parameter Settings`를 클릭합니다.
2. 실시간 사용 중 플로팅 자막 창이 필요하면 `Live Caption`을 켭니다.
3. 항상 위에 표시, 클릭 통과, 크기, 너비, 색상, 시작 동작 같은 자막 동작을 바꾸려면 `Settings > Subtitle Settings`를 엽니다.
4. 녹음 흐름보다 전체 `Live Caption` 동작이 목적이라면 [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)으로 이어가세요.

## `Live Caption`은 언제 쓰나요

- `Live Caption`은 `Live Record` 페이지의 `System Audio Captions` 토글이며, 시스템 오디오용 플로팅 자막 창이 필요할 때 유용합니다.
- 먼저 녹음을 시작하지 않아도 켤 수 있습니다. 나중에 `Live Record`를 시작하면 둘을 동시에 실행할 수 있습니다.
- `Settings > Subtitle Settings`는 시작 동작, 항상 위에 표시, 클릭 통과, 글꼴 크기, 너비, 색상, 배경 투명도를 제어합니다.
- 페이지 진입점과 설정 계층의 차이를 먼저 이해하거나 `Voice Typing`도 필요하다면 [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)으로 바로 이동하세요.
- `Live Caption`을 켰는데도 창이 나타나지 않으면 [FAQ와 문제 해결](guide:faq)을 확인하세요.

## 녹음 중과 녹음 후 얻는 것

- 오른쪽 편집기에 전사 세그먼트가 나타납니다.
- 캡처가 실행 중일 때 활성 세그먼트가 live recording 상태를 따라갑니다.
- 캡처가 아직 진행 중이어도 Sona는 세션을 [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)의 `Draft` 항목으로 표시할 수 있습니다.
- 녹음이 끝나면 전사는 편집, 정리, 번역, 내보내기, 이후 [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)에서 다시 열기에 사용할 수 있으며, Sona는 두 번째 저장 사본을 만들지 않고 같은 draft 항목을 완료합니다.
- 이미 프로젝트 안에 있지 않았다면 저장된 항목은 보통 `Inbox`에 들어갑니다.

## 팁

- 기본적으로 `Ctrl + Space`는 live recording을 시작하거나 중지합니다.
- 녹음 중에는 `Space`로 일시정지하거나 다시 시작합니다.
- `Parameter Settings`는 `Subtitle Mode`와 `Language` 같은 전사 동작만 다룹니다. 전체 LLM polish 흐름은 아닙니다.
- Sona가 모델 누락을 알리면 온보딩을 다시 열거나 `Settings > Model Settings`에서 모델을 설정하세요.
- 캡처 뒤에는 보통 [편집과 재생](guide:edit-and-playback)이 다음 실용적인 페이지입니다.
