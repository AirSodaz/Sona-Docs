Sona의 정리와 번역 기능은 선택 기능입니다. 로컬 전사는 이 기능 없이도 동작하지만, AI 단계에는 `Settings > LLM Service`의 provider 설정이 필요합니다. 이 페이지는 `LLM Polish`와 `Translate`에 집중합니다. 전사 옆에 요약이 필요한 경우 [AI Summary](guide:ai-summary)로 바로 이동하세요.

## 이런 경우에 적합합니다

- 로컬 전사 뒤 문장을 정리할 때
- 원문 전사를 보이는 상태로 번역 세그먼트를 만들 때
- 정리와 번역을 같은 편집기 흐름 안에서 처리하고 싶은 팀

## 시작하기 전에

- [Live Record](guide:live-record), [Batch Import](guide:batch-import), [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)에서 만든 전사 세그먼트가 이미 있어야 합니다.
- 필요한 기능을 `Settings > LLM Service`에서 설정할 준비가 되어 있어야 합니다.

## Provider 먼저 연결

1. `Settings > LLM Service`를 엽니다.
2. `Feature Models`에서 `Polish Model`과 `Translation Model`에 사용할 모델을 선택합니다.
3. `Provider Credentials`에서 사용할 provider를 열고 `Base URL`, `API Key`, `Endpoint`, `Deployment Name` 또는 provider별 필드를 입력합니다.
4. 선택한 모델이 지원하면 `Reasoning Mode`를 켜고 `Reasoning Level`을 고릅니다.
5. `Test Connection`을 클릭합니다.
6. 필요한 feature model이 지정된 뒤 기본 작업공간으로 돌아갑니다.

## 더 깨끗한 초안이 필요할 때 polish 실행

1. `Settings > LLM Service`에서 `Polish Model`이 지정되어 있는지 확인합니다.
2. 앱에서 `LLM Polish` 동작을 엽니다.
3. 필요한 동작을 고릅니다: `LLM Polish`, `Re-transcribe`, `Undo`, `Redo`, `Advanced Settings`.
4. `Auto-Polish`, `Auto-Polish Frequency`, `Keywords`, `Scenario Presets`, `Custom Context`를 관리하려면 `Advanced Settings`를 엽니다. 더 자세한 조정 화면은 [용어와 고급 설정](guide:vocabulary-and-advanced-settings)에 모아 두었습니다.

## 이중 언어 출력이 필요할 때 번역 실행

1. `Settings > LLM Service`에서 `Translation Model`이 지정되어 있는지 확인합니다.
2. `Translate` 버튼을 클릭합니다.
3. 대상 언어를 고릅니다.
4. `Start Translation` 또는 `Retranslate`를 클릭합니다.
5. 편집기에서 이중 언어 표시를 조절하려면 `Show Translations` 또는 `Hide Translations`를 사용합니다.

## AI 단계가 바꾸는 것

- `LLM Polish`는 전사 텍스트를 그 자리에서 업데이트합니다.
- `Translate`는 세그먼트별 번역 텍스트를 저장하고 원문 아래에 표시할 수 있습니다.

## 참고

- `Polish Model`과 `Translation Model`은 따로 설정됩니다. 하나의 provider가 둘 다 처리할 수도 있고, 기능별로 나눌 수도 있습니다.
- 번역은 `Google Translate (Free)` 또는 `Google Translate (API)` 같은 전용 번역 provider를 사용할 수 있지만, polish에는 LLM을 사용할 수 있는 provider와 모델이 필요합니다.
- 번역 대상 언어에는 현재 `Chinese (Simplified)`, `English`, `Japanese`, `Korean`, `French`, `German`, `Spanish`가 포함됩니다.
- `Re-transcribe`는 현재 전사가 저장된 workspace 항목에서 온 경우에만 사용할 수 있습니다.
- 필요한 것이 전사 텍스트 rewrite가 아니라 전사 옆 요약이라면 [AI Summary](guide:ai-summary)로 이어가세요.
- 실제로 필요한 것이 `Auto-Polish`, keywords, custom context라면 [용어와 고급 설정](guide:vocabulary-and-advanced-settings)으로 이어가세요.
- 텍스트가 괜찮아지면 [내보내기와 설정](guide:export-and-settings)으로 이동하세요.
