`AI Summary`는 전사가 이미 있고, 그 옆에 더 짧은 요약을 두고 싶을 때 쓰는 기능입니다. 전사를 rewrite하지 않으며, 자동으로 내보내기 결과에 포함되지도 않습니다.

## 이런 경우에 적합합니다

- 회의, 강의, 인터뷰의 핵심을 빠르게 훑을 때
- 원문 전사를 그대로 두고 별도 요약을 추가할 때
- 다른 요약 도구로 옮기지 않고 같은 편집기 안에 머물고 싶을 때

## 시작하기 전에

- [Live Record](guide:live-record), [Batch Import](guide:batch-import), [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)에서 만든 전사 세그먼트가 이미 있어야 합니다.
- `Settings > LLM Service`에서 `Summary Model`을 설정할 준비가 되어 있어야 합니다.

## 먼저 summary model 지정

1. `Settings > LLM Service`를 엽니다.
2. `Feature Models`에서 `Summary Model`에 모델을 지정합니다.
3. `Provider Credentials`에서 사용할 provider를 열고 필요한 연결 정보를 입력합니다.
4. 선택한 모델이 지원하면 `Reasoning Mode`를 켜고 `Reasoning Level`을 고릅니다.
5. `Test Connection`을 클릭합니다.
6. `Summary Model`을 사용할 수 있게 되면 기본 작업공간으로 돌아갑니다.

## 현재 summary 생성 또는 업데이트

1. 이미 세그먼트가 있는 전사를 엽니다.
2. 전사 화면에서 summary editor를 엽니다.
3. 다음 생성에 다른 summary prompt를 쓰고 싶으면 `General`, `Meeting`, `Lecture` 템플릿을 전환합니다.
4. 현재 summary를 만들려면 `Generate`를 클릭합니다. 나중에 같은 summary를 교체하려면 `Regenerate`를 사용합니다.
5. 문구를 직접 조정하고 싶으면 summary를 바로 편집합니다. Sona는 editor에서 focus가 벗어날 때 자동 저장합니다.
6. 다른 곳에서 재사용하려면 `Copy`를 클릭합니다.

## Summary가 유지하는 상태

- `AI Summary`는 원문 전사를 바꾸지 않고 전사 옆에 현재 summary 기록 하나를 유지합니다.
- 현재 summary는 전사와 분리되어 있지만, 재사용 전에 문구를 바꾸고 싶으면 직접 편집할 수 있습니다.
- 나중에 전사가 편집, polished, re-transcribed되면 이전 summary는 그대로 보이지만, 수동으로 regenerate할 때까지 outdated warning을 표시합니다.

## 참고

- `Summary Model`은 `Polish Model`, `Translation Model`과 별도로 설정됩니다. 하나의 provider가 모두 처리할 수도 있고, 기능별로 나눌 수도 있습니다.
- `AI Summary`에는 LLM-capable provider와 모델이 필요합니다. Google Translate provider는 summary에 지원되지 않습니다.
- `AI Summary` 설정이 아직 완전하지 않아도 summary를 수동으로 작성하거나 고칠 수 있습니다.
- 템플릿 변경은 다음 생성 대상 또는 프로젝트 기본값을 바꿉니다. 템플릿마다 별도 저장 summary를 만드는 것은 아닙니다.
- 전사 옆 요약이 아니라 전사 텍스트 rewrite가 목적이면 [AI Polish와 번역](guide:ai-polish-and-translate)으로 이어가세요.
- 다음 단계가 내보내기라면 [내보내기와 설정](guide:export-and-settings)으로 돌아가세요.
- Summary 출력은 내보낸 파일에 자동 포함되지 않습니다. 다른 곳에서 쓰려면 panel에서 복사하세요.
