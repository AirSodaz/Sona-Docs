`Live Caption`과 `Voice Typing`은 같은 오프라인 실시간 전사 설정에 의존하지만 쓰이는 화면은 다릅니다. 하나는 플로팅 실시간 자막을 보여 주고, 다른 하나는 다른 앱에 텍스트를 입력합니다.

## 이런 경우에 적합합니다

- 시스템 오디오를 플로팅 실시간 자막으로 보고 싶을 때
- 채팅 앱, 문서, form에 직접 받아쓰기하고 싶을 때
- 기본 녹음 흐름은 이미 알고 있고 한쪽 확장 기능만 필요한 경우

## 시작하기 전에

- [시작하기](guide:getting-started)를 마치거나 `Settings > Model Settings`에서 작동하는 `Live Record Model`을 설정하세요.
- 다른 앱에 텍스트를 보내려는 경우에도 이 기능은 같은 오프라인 live transcription stack에 의존합니다.

## `Live Caption` 시작 위치

1. [Live Record](guide:live-record)를 엽니다.
2. 이 페이지에서 `Live Caption` 또는 `System Audio Captions` 토글을 찾습니다.
3. 시스템 오디오용 플로팅 자막만 필요하다면 먼저 녹음을 시작할 필요가 없습니다. 토글을 켜는 것으로 충분합니다.
4. 나중에 `Live Record`를 시작하면 둘을 동시에 실행할 수 있습니다.

## `Settings > Subtitle Settings`가 제어하는 것

- 플로팅 자막 창의 동작을 제어합니다: 시작 동작, 항상 위에 표시, 클릭 통과, 글꼴 크기, 너비, 색상, 배경 투명도.
- 시작 토글을 제공하지는 않습니다. 실제 진입점은 [Live Record](guide:live-record) 페이지에 남아 있습니다.
- `Live Caption`이 이미 켜져 있는데도 창이 나타나지 않으면 [FAQ와 문제 해결](guide:faq)로 이어가세요.

## `Voice Typing` 시작 방법

1. `Settings > Voice Typing`을 엽니다.
2. `Voice Typing`을 켭니다.
3. 해당 페이지에서 global shortcut을 지정합니다.
4. `Push to Talk (Hold)` 또는 `Toggle (Press once)`를 선택합니다.
5. 하위 탭에서 상황별 프리셋, 프로젝트 용어 연동, 무음 자동 커밋 규칙을 구성합니다.
6. 그래도 준비되지 않았다면 페이지에 표시되는 readiness와 dependency status를 확인합니다.

## 애플리케이션 상황 인식 및 용어 연동

- **애플리케이션 컨텍스트 인식**: 음성 입력기는 현재 활성화된 프로그램 창을 감지하여 적절한 서식 및 구두점 규칙을 자동 적용합니다(예: 코드 편집기용 프로그래밍 기호 입력, 메신저용 자연스러운 구어 구두점).
- **프로젝트 스코프 및 핫워드 연동**: 통합 사전(`Settings > Vocabulary`)에 정의된 고유 용어와 교정 규칙을 `음성 입력`으로 한정하거나 현재 활성화된 프로젝트 컨텍스트와 동적으로 연동할 수 있습니다.
- **VAD 무음 자동 커밋**: 토글 모드에서 Silero VAD가 설정된 임계값을 초과하는 무음을 감지하면 단축키를 다시 누르지 않아도 보류 중인 버퍼를 자동으로 화면에 타이핑하여 커밋합니다.
## `Push to Talk`와 `Toggle`

- `Push to Talk (Hold)`는 짧게 말할 때 좋습니다. shortcut을 누르고 있는 동안에만 capture가 실행됩니다.
- `Toggle (Press once)`는 긴 받아쓰기에 더 좋습니다. 한 번 누르면 시작하고 다음 한 번으로 멈춥니다.
- 두 모드 모두 작동하는 `Live Record Model`, 필요한 `VAD` model, 사용 가능한 input device, background warm-up에 의존합니다.
- `Voice Typing`이 아직 준비되지 않았다면 같은 settings page가 blocker가 shortcut, model, VAD, input device, runtime warm-up 중 무엇인지 알려 줍니다.
- `Settings > Input Device > Keep Microphone Active`는 기본적으로 꺼져 있습니다. Idle 상태에서도 마이크를 warm 상태로 유지해 voice typing latency를 낮추고 싶으면 켜세요. 녹음, dictation, input preview를 하지 않을 때 Sona가 마이크를 release하길 원하면 꺼 둡니다.

## 어느 쪽을 선택할까요

- 시스템 오디오를 플로팅 텍스트로 보는 것이 목표라면 `Live Caption`에서 시작하세요.
- 말한 내용을 다른 앱 입력 필드에 넣는 것이 목표라면 `Voice Typing`에서 시작하세요.
- 기능이 켜져 있는데 기대대로 동작하지 않으면 [FAQ와 문제 해결](guide:faq)로 바로 이동하세요.
