Sona가 전사 세그먼트를 만든 뒤에는 편집기가 검토, 수정, 이동, 화자 확인, 큰 rewrite 이후 복구를 처리하는 중심 화면이 됩니다.

## 이런 경우에 적합합니다

- 세그먼트별로 문장을 확인할 때
- 전사 텍스트와 원래 타이밍 사이를 오갈 때
- 전사가 Sona 밖으로 나가기 전에 화자 라벨을 고칠 때
- polish, translation, re-transcription 뒤 `Version Snapshots`를 비교할 때
- 내보내기 전에 검색, 병합, 삭제, 가벼운 서식 조정을 할 때

## 편집 전에

- [Live Record](guide:live-record), [Batch Import](guide:batch-import), [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)에서 전사 내용을 불러옵니다.

## 전사 세그먼트 검토와 수정

1. 편집기에서 세그먼트 목록을 읽습니다.
2. 타임스탬프를 클릭해 재생 위치를 해당 순간으로 이동합니다.
3. 세그먼트 텍스트를 두 번 클릭하거나 편집 동작을 사용해 편집 모드로 들어갑니다.
4. `Enter`를 눌러 현재 세그먼트를 저장합니다.
5. `Shift + Enter`를 눌러 커서 위치에서 현재 세그먼트를 나눕니다.
6. 병합 동작으로 세그먼트를 다음 세그먼트와 합칩니다.
7. 삭제 동작을 사용해 확인 뒤 세그먼트를 제거합니다.

## 화자 라벨 검토

1. 세그먼트에 화자 배지가 있으면 배지를 클릭해 전체 화자 그룹을 `Speaker Profile`에 할당합니다.
2. 같은 메뉴에서 추가 global profiles를 표시하거나 해당 그룹을 익명 라벨로 되돌릴 수 있습니다.
3. 내보내기 전에 집중적인 화자 검토가 필요하면 전사 헤더에서 `Speaker Review`를 엽니다.
4. `Needs review`, `Suggestions`, `Anonymous`, `Identified`, `Reviewed`, `All`로 필터링합니다.
5. 각 그룹의 첫 세그먼트를 미리 보고, 첫 일치 세그먼트로 이동하고, 현재 라벨을 확인하고, 추천 후보를 적용하거나 다른 profile을 지정하거나 그룹을 익명으로 초기화합니다.

## Version Snapshots 사용

1. 전사가 저장된 non-draft workspace 항목이면 전사 헤더에서 `Version Snapshots`를 엽니다.
2. `LLM Polish`, `Translate`, `Re-transcribe` 같은 대량 rewrite 이전에 저장된 snapshot을 고릅니다.
3. snapshot과 현재 전사를 비교합니다.
4. 일부 rewrite만 되돌려야 하면 변경된 행을 선택해 복원합니다.
5. rewrite 전체를 버려야 하면 전사 전체를 되돌립니다.

## 검색과 재생

1. 전사 안에서 검색하려면 `Ctrl + F`를 누릅니다.
2. 오디오 파일이 있으면 오디오 플레이어로 재생, 일시정지, seek, 속도 변경, 볼륨 조절을 합니다.
3. 편집기를 떠나지 않고 일치하는 세그먼트 사이를 이동합니다.

## 편집기에서 유지되는 원칙

- 전사는 세그먼트 단위로 계속 편집할 수 있습니다.
- 화자 수정은 보이는 한 세그먼트가 아니라 전체 화자 그룹에 적용됩니다.
- 재생과 전사 이동은 타임스탬프를 통해 맞춰집니다.
- `Version Snapshots`에서 복원할 때 현재 전사를 먼저 저장하므로 rollback도 되돌릴 수 있습니다.
- 편집 툴바는 세그먼트를 실제로 편집 중일 때만 나타납니다.

## 팁

- 툴바는 `Undo`, `Redo`, `Bold`, `Italic`, `Underline`, 세그먼트 나누기를 지원합니다.
- `Speaker Profiles`는 [용어와 고급 설정](guide:vocabulary-and-advanced-settings)에서 만듭니다. Profiles는 추천과 자동 매칭에 도움을 주지만 수동 확인도 계속 가능합니다.
- `Version Snapshots`는 draft나 임시 `current` 전사가 아니라 저장된 workspace 항목에서만 나타납니다.
- 편집 뒤 선택형 LLM 정리나 번역을 추가하려면 [AI Polish와 번역](guide:ai-polish-and-translate)으로 이어가세요.
- 저장된 항목을 편집기 주변에서 다시 열거나 정리하려면 [Workspace, 프로젝트, Inbox](guide:workspace-projects-and-inbox)로 이어가세요.
- 작업이 끝났고 주로 파일을 꺼내야 한다면 [내보내기와 설정](guide:export-and-settings)으로 바로 이동하세요.
