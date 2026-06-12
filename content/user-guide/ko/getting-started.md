Sona를 처음 여는 경우, 이 페이지가 사용할 수 있는 로컬 전사 설정까지 가는 가장 짧은 경로입니다.

## 이런 경우에 적합합니다

- 데스크톱 앱을 처음 설치한 경우
- 모델을 직접 고르기보다 권장 오프라인 설정을 쓰고 싶은 경우
- 가능한 빨리 `Live Record`에 도달하고 싶은 경우

## 시작하기 전에

- Sona가 내 컴퓨터에서 정상적으로 열려야 합니다.
- 온보딩 중 권장 모델 팩을 다운로드하려면 인터넷 연결을 유지하세요.

## 데스크톱 앱 설치

1. [Sona Downloads](/downloads)를 열고 데스크톱 시스템에 맞는 빌드를 고릅니다. 사이트가 릴리스 세부 정보를 불러오지 못하면 [GitHub Releases](https://github.com/AirSodaz/sona/releases/latest)를 대신 사용하세요.
2. 앱을 실행합니다.
3. 소스에서 직접 빌드하는 경우 [프로젝트 README](readme)를 사용하세요.

Windows SmartScreen, macOS Gatekeeper, Linux 실행 권한 안내가 표시되면 먼저 설치 파일이 Sona Downloads 또는 GitHub Releases에서 온 것인지 확인한 뒤 운영체제 안내를 따르세요. 시스템 보호를 전역으로 끄지 마세요.

## `First Run Setup` 완료

1. Sona가 실행될 때 `First Run Setup`이 나타날 때까지 기다립니다.
2. 환영 단계를 확인합니다. Sona의 권장 첫 성공 경로는 `Microphone -> Live Record`입니다.
3. `Continue`를 클릭합니다.
4. 모델 단계에서 `Download Recommended Models`를 클릭합니다. 필요한 모델이 이미 있으면 Sona가 대신 `Continue`를 표시할 수 있습니다.
5. 권장 오프라인 모델이 다운로드되고 압축 해제될 때까지 기다립니다.
6. 마이크 단계로 계속 진행하고 마이크 접근을 허용합니다.
7. 마이크 권한이 거부되었다면 운영체제 권한 문제를 고친 뒤 `Try Permission Again`을 사용합니다.
8. `Live Record`에 사용할 마이크를 선택합니다.
9. `Start with Live Record`를 클릭합니다.

## 다음에 일어나는 일

- Sona가 로컬 전사를 위한 권장 오프라인 설정을 적용합니다.
- 앱이 `Live Record`에서 열립니다.
- 설정이 아직 끝나지 않았다면 알림 배너로 나중에 온보딩을 다시 열 수 있습니다.

## 설정 후 이어 보기 좋은 페이지

- 바로 음성을 캡처하려면 [Live Record](guide:live-record)로 이동하세요.
- 이미 전사할 파일이 있다면 [Batch Import](guide:batch-import)로 이동하세요.
- 설정이 계속 다시 열리거나 모델이 여전히 누락되어 보이면 [FAQ와 문제 해결](guide:faq)을 사용하세요.

## 참고

- 온보딩 중 `Later`를 눌러 나중에 배너에서 다시 돌아올 수 있습니다.
- 알림 배너를 숨기면 설정이 완료될 때까지 홈 화면에 다시 나타나지 않습니다.
- 모델은 나중에 `Settings > Model Settings`에서 바꿀 수 있습니다.
- 기본 마이크는 나중에 `Settings > Input Device`에서 바꿀 수 있습니다.
- 모델 다운로드가 멈춘다면 인터넷 연결과 모델 호스트 접근 가능 여부를 확인한 뒤 온보딩을 다시 시도하세요. 그래도 실패하면 `Settings > Model Settings`에서 모델을 다운로드하거나 선택하고, `Settings > General > Diagnostics`에서 세부 정보를 확인하세요.
- 나중에 명령줄 일괄 전사가 필요하면 사이트 안의 [CLI 가이드](guide:cli-guide)로 이어가세요.
