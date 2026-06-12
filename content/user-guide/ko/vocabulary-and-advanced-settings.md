이 페이지는 조정 중심 기능인 `Hotwords`, `Text Replacement`, `Speaker Profiles`, `LLM Polish`의 `Advanced Settings`를 한곳에 모읍니다. 첫 실행 필수 단계는 아니지만, 인식, 화자 매칭, 정리 동작을 더 잘 제어하고 싶을 때 유용합니다.

## 이런 경우에 적합합니다

- 이름, 용어, 제품명이 반복해서 잘못 전사될 때
- 전사 뒤 문구를 일관되게 정리하고 싶을 때
- Sona가 이후 전사에서 추천하거나 매칭할 known speaker가 있을 때
- 기본 흐름을 넘어 `Auto-Polish`나 custom polish context를 조정하고 싶은 경우

## 먼저 알맞은 설정 영역 열기

- `Settings > Vocabulary`: `Hotwords`, `Text Replacement`, `Speaker Profiles` 관리
- `LLM Polish > Advanced Settings`: `Auto-Polish`, frequency, keywords, scenario presets, custom context 관리
- 기본 polish와 translation 흐름이 아직 필요하다면 [AI Polish와 번역](guide:ai-polish-and-translate)으로 돌아가세요.

## `Hotwords`가 유용한 경우

- 같은 이름이나 구문에서 인식이 계속 흔들릴 때 `Hotwords`에 반복 용어를 추가합니다.
- `Hotwords`는 한 줄에 하나씩 입력하며, `Term :2.0` 같은 weighted entries도 지원합니다.
- 현재 이 기능은 특히 Transducer와 Qwen3 ASR 모델에서 관련성이 큽니다.

## `Text Replacement`가 유용한 경우

- 전사 뒤 같은 용어가 계속 다른 형태로 나타날 때 `Text Replacement`를 사용합니다.
- 세그먼트 하나하나를 검토하는 일을 대체하기보다는 반복 cleanup pattern에 가장 잘 맞습니다.
- 초점이 직접 세그먼트 편집으로 옮겨졌다면 [편집과 재생](guide:edit-and-playback)으로 이어가세요.

## `Speaker Profiles`가 유용한 경우

- known speaker용 profile을 만들고, 그 사람의 로컬 reference audio sample을 하나 이상 가져옵니다.
- Sona는 가져온 sample을 앱이 관리하는 오디오로 정규화하고, speaker models가 설정되어 있을 때 candidate suggestions 또는 automatic matching에 profile을 사용합니다.
- Profile은 usable sample count와 duration에 따라 automatic matching 준비 완료, suggestions 제한, 아직 준비되지 않음으로 표시될 수 있습니다.
- 프로젝트는 어떤 speaker profiles를 활성화할지 선택할 수 있으므로, 클라이언트, 강의, 회의 시리즈마다 speaker set를 따로 둘 수 있습니다.
- Speaker profiles는 완벽한 자동 화자 attribution을 보장하지 않습니다. [편집과 재생](guide:edit-and-playback)에서 suggestion을 확인하거나, 다른 profile을 지정하거나, 그룹을 anonymous로 reset할 수 있습니다.

## 언제 `Advanced Settings`를 열까요

- 일회성 `LLM Polish`보다 더 많은 제어가 필요하고 `Auto-Polish`를 관리하고 싶을 때
- `Auto-Polish Frequency`, keywords, scenario presets, custom context를 조정하고 싶을 때
- Provider와 model setup은 끝났지만 polish 동작을 더 구체적인 use case에 맞추고 싶을 때

## 참고

- `Advanced Settings`는 여전히 [AI Polish와 번역](guide:ai-polish-and-translate) 워크플로에 속합니다. 기본 provider와 model setup을 대체하지 않습니다.
- Speaker profile readiness는 candidate quality와 automatic matching confidence에 영향을 주지만, 수동으로 profile을 할당할 수 있는지 여부를 막지는 않습니다.
- Polish 동작보다 전사 옆 요약이 목적이라면 [AI Summary](guide:ai-summary)로 전환하세요.
- 기능이 이미 설정되어 있는데도 올바르게 동작하지 않으면 [FAQ와 문제 해결](guide:faq)로 이어가세요.
