Sona는 음성-텍스트 작업을 기본적으로 내 컴퓨터 안에 두고 싶은 사람을 위한 개인정보 보호 중심 전사 편집기입니다. 이 가이드는 실제 제품 흐름을 기준으로 정리되어 있어, 지금 필요한 부분으로 바로 이동할 수 있습니다.

## 지금 작업에 맞는 페이지 고르기

- 새로 설치했거나 처음 실행하는 경우: [시작하기](guide:getting-started)
- 지금 바로 말소리를 녹음하는 경우: [Live Record](guide:live-record)
- 이미 있는 오디오나 비디오 파일로 작업하는 경우: [Batch Import](guide:batch-import)
- 문장, 타임스탬프, 화자 라벨, 재생, Version Snapshots를 검토하는 경우: [편집과 재생](guide:edit-and-playback)
- 선택형 LLM 기반 정리나 이중 언어 출력을 추가하는 경우: [AI Polish와 번역](guide:ai-polish-and-translate)
- 저장된 녹음, 프로젝트, `Inbox` 항목을 정리하는 경우: [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)
- 완성본을 내보내거나 `Dashboard`, `Diagnostics`, `Backup & Restore`, 알림 진입점을 찾는 경우: [내보내기와 설정](guide:export-and-settings)
- 원문 전사는 그대로 두고 옆에 요약이 필요한 경우: [AI Summary](guide:ai-summary)
- 주로 플로팅 자막이나 다른 앱 받아쓰기가 필요한 경우: [Live Caption과 Voice Typing](guide:live-caption-and-voice-typing)
- 주로 hotwords, text replacement, speaker profiles, `Auto-Polish` 조정이 필요한 경우: [용어와 고급 설정](guide:vocabulary-and-advanced-settings)
- 터미널에서 오프라인 일괄 전사를 실행하려는 경우: [CLI 가이드](guide:cli-guide)
- 막힌 부분을 해결하려는 경우: [FAQ와 문제 해결](guide:faq)

## Sona 워크플로 한 줄 요약

1. [시작하기](guide:getting-started)를 마쳐 오프라인 모델 설정을 준비합니다.
2. [Live Record](guide:live-record) 또는 [Batch Import](guide:batch-import)로 전사를 만듭니다.
3. 필요하면 화자 검토나 버전 되돌리기를 포함해 [편집과 재생](guide:edit-and-playback)에서 전사를 다듬습니다.
4. LLM 기반 정리나 번역이 필요할 때만 [AI Polish와 번역](guide:ai-polish-and-translate)을 사용합니다.
5. 저장된 작업을 다시 열거나, 프로젝트 context를 전환하거나, 현재 편집기 밖에서 항목을 정리하려면 [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)를 사용합니다.
6. [내보내기와 설정](guide:export-and-settings)에서 마무리하고, Sona가 복구, 업데이트, 자동화 결과를 표시할 때는 헤더 알림 센터를 확인합니다.

`AI Summary`, `Live Caption`, `Voice Typing`, speaker profiles, vocabulary tuning은 핵심 전사 흐름 주변의 보조 기능입니다. 대부분의 경우 먼저 기본 전사 흐름을 작동시킨 뒤 필요한 확장 페이지를 여는 편이 가장 쉽습니다.

## 이 가이드가 잘 다루는 내용

- 로컬 전사를 위한 권장 첫 실행 경로
- 실시간 녹음과 대기열 기반 파일 전사의 차이
- 편집기, 작업공간 정리, 번역, 내보내기 단계가 서로 맞물리는 방식
- 편집과 전달 과정에서 speaker review, speaker profiles, version snapshots가 들어가는 위치
- 일상 사용에서 중요한 지원 화면: `Dashboard`, `Diagnostics`, `Backup & Restore`, `Automation`, 알림 센터

## 함께 볼 수 있는 다른 문서

- 명령줄 일괄 전사: [CLI 가이드](guide:cli-guide)
- 로컬 HTTP API 연동: [HTTP API 가이드](guide:api-guide)
- 소스 빌드와 개발 명령: [프로젝트 README](readme)

> Sona의 기본 경로는 단순합니다. 로컬 전사를 설정하고, 전사를 만들거나 다시 열고, 편집기에서 검토한 뒤 필요에 따라 작업공간 정리, 정리, 번역, 요약, 내보내기를 사용합니다.
