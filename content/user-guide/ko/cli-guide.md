`sona-cli`는 `sona-core` 기반의 Sona 독립형, 무상태(Stateless) 명령줄 음성 인식 호스트입니다. 로컬 프리셋 ASR 모델 또는 클라우드 온라인 제공자를 통해 오디오 파일, 디렉터리, 마이크 입력, 표준 입력 스트림을 전사할 수 있습니다. Sona의 SQLite 애플리케이션 데이터베이스, 프로젝트 데이터베이스, 기록 저장소, 동기화 상태, Online LLM 작업을 열거나 관리하지 않습니다. 전사 결과는 `stdout`이나 명시적으로 지정한 출력 파일로 작성됩니다.

독립형 CLI는 다음 핵심 명령을 제공합니다:

- `live` (호환 별칭 `transcribe-live`): 마이크 또는 표준 입력을 통한 실시간 스트리밍 음성 인식
- `transcribe`: 로컬 또는 클라우드 모델을 사용한 오디오/비디오 파일 및 디렉터리 배치 전사
- `models`: 프리셋 ASR 모델 목록 조회, 다운로드, 검증, 검색 및 삭제
- `export`: 전사 세그먼트 JSON을 SRT, VTT, TXT, MD 등으로 변환 (호환 별칭 `export transcript` 지원)
- `config`: TOML 설정 파일 확인 및 관리 (`init`, `check`, `show`, `get`, `set`, `unset`, `edit`, `path`)
- `doctor`: 호스트 환경 진단, 하드웨어 가속(CUDA, Metal, AVX2, NEON) 및 경로 상태 점검
- `devices`: 사용 가능한 오디오 입력 및 출력 장치 목록 확인
- `providers`: 구성된 클라우드 온라인 ASR 제공자 및 기능 상태 확인
- `update`: Minisign 서명 검증을 통한 안전한 업데이트 확인 및 적용
- `completion`: 셸 자동 완성 스크립트 생성 (bash, zsh, fish, powershell, elvish)
- `serve`: 로컬 REST API 서버 및 WebSocket 실시간 스트리밍 (`/v1/streaming`)
- `diagnostics`: 호스트 진단 스냅샷 계약 생성

## 실행 방법

- 패키지 빌드: 운영체제 설치 프로그램 산출물에 포함된 `sona-cli` 바이너리를 사용합니다.
- 소스 빌드: `cargo run -p sona-cli -- <command> ...`

예시:

```bash
sona-cli doctor
sona-cli config init
sona-cli models list
sona-cli models download whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav --online-provider groq-whisper
sona-cli live -m sensevoice
sona-cli live --online-provider volcengine-doubao
sona-cli export ./segments.json ./transcript.vtt
sona-cli serve --host 127.0.0.1 --port 14200
```

## 무상태 경계

CLI는 SQLite, History, Tag, 애플리케이션 backup/recovery, Sync, Online LLM을 의도적으로 제외합니다. 데스크톱 애플리케이션 데이터 디렉터리를 만들거나 묵시적으로 수정하지 않습니다. 출력은 `stdout`에 기록되거나 명시적으로 지정한 파일에 저장됩니다. `export` (또는 `export transcript`)와 `stdout`/파일 출력을 사용해 다른 도구와 유연하게 조합하세요.

## 설정 우선순위

설정 옵션은 다음 우선순위(높음에서 낮음)에 따라 해석됩니다:

1. 명시적 명령줄 인수: `-c / --config <PATH>`
2. 전역 환경 변수: `SONA_CONFIG`
3. 현재 작업 디렉터리의 설정 파일: `./sona-cli.toml`
4. 사용자 표준 설정 파일: `sona-cli.toml` (Linux: `~/.config/sona/sona-cli.toml`, macOS: `~/Library/Application Support/sona/sona-cli.toml`, Windows: `%APPDATA%\sona\sona-cli.toml` 또는 `%USERPROFILE%\.config\sona\sona-cli.toml`)
5. 내장 기본값: 설정 파일이 없으면 안전한 기본값으로 실행

## 명령

### `config`

Sona CLI 설정 파일 검사 및 관리:

- `sona-cli config init`: 주석이 포함된 TOML 설정 템플릿 생성 (`-F/--force`로 덮어쓰기)
- `sona-cli config check`: 설정 파일 구문 및 섹션 유효성 검사
- `sona-cli config show`: 병합된 현재 활성 설정 표시
- `sona-cli config get <KEY>`: 특정 설정 속성 값 조회
- `sona-cli config set <KEY> <VALUE> [--global]`: 로컬 또는 전역으로 속성 값 유지
- `sona-cli config unset <KEY> [--global]`: 설정에서 속성 제거
- `sona-cli config edit`: 시스템 기본 편집기에서 설정 파일 열기
- `sona-cli config path`: 해석된 설정 파일 절대 경로 출력

```bash
sona-cli config init
sona-cli config check
sona-cli config set transcribe.model_id whisper-turbo
sona-cli config get transcribe.model_id
```

### `models`

선택된 모델 디렉터리의 로컬 ASR 프리셋 모델 관리:

- `sona-cli models list`: 사용 가능한 프리셋 모델 목록 확인 (`--mode live|batch`, `--installed`, `--json`)
- `sona-cli models download <MODEL>` (별칭 `install`): 체크섬 검증과 함께 모델 파일 다운로드
- `sona-cli models delete <MODEL>` (별칭 `rm`): 다운로드된 모델 파일 삭제 (`-F/--force`로 확인 생략)
- `sona-cli models info <MODEL>` (별칭 `show`): 모델 사양 및 동반 파일 세부 정보 확인
- `sona-cli models search <QUERY>`: 키워드 또는 언어로 모델 검색
- `sona-cli models verify <MODEL>`: 설치된 모델 파일의 무결성 및 체크섬 검증
- `sona-cli models path`: 활성 모델 디렉터리의 절대 경로 출력

```bash
sona-cli models list --mode batch
sona-cli models search korean
sona-cli models download whisper-turbo
sona-cli models verify whisper-turbo
sona-cli models delete whisper-turbo --force
```

### `transcribe`

로컬 ASR 모델 또는 클라우드 온라인 제공자를 사용하여 오디오 및 비디오 파일을 전사합니다. `--online-provider`를 지정하지 않으면 로컬 Sherpa 프리셋을 사용합니다:

```bash
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo -o ./transcript.srt
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
```

`--online-provider`를 지정하면 오디오를 선택한 클라우드 서비스에 업로드하고 결과를 출력합니다:

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

지원되는 배치 제공자는 `volcengine-doubao`, `groq-whisper`, `mistral-voxtral`입니다:

| 제공자 | 기본 환경 변수 |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

사용자 지정 환경 변수를 지정하려면 `--api-key-env NAME`을 사용합니다. `--online-config FILE`은 비밀값이 아닌 설정 재정의용 JSON 객체를 받으며 `apiKey`나 `api_key`를 포함할 수 없습니다.

온라인 제공자 선택 시 로컬 전용 플래그(`--model-id`, `--models-dir`, VAD/구두점 옵션, 스레드 수, GPU 모드, `--save-wav` 등)는 명시적으로 거부됩니다. 기존 파일을 덮어쓰려면 `--force`가 필요합니다.

### `transcribe-live`

`sona-cli live` (호환 별칭 `sona-cli transcribe-live`)는 마이크 입력 또는 표준 입력(`--input stdin`)에서 실시간 스트리밍 음성 인식을 수행합니다.

```bash
sona-cli live -m sensevoice
sona-cli live --device "Studio Mic" --duration 60 --output ./live.srt

ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin -m sensevoice --output-format ndjson
```

온라인 스트리밍 인식은 현재 `volcengine-doubao`를 지원합니다:

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

마이크 입력은 기본 CPAL 입력 장치를 사용합니다 (`--device`로 정확한 장치 이름을 전달할 수 있으며 `sona-cli devices`로 확인 가능). `--output-format`은 `text` 또는 `ndjson`을 지정할 수 있으며, `--output`으로 종료 시 `json`, `txt`, `srt`, `vtt`, `md` 파일을 저장할 수 있습니다. Ctrl+C, `stdin` EOF, `--duration` 만료 시 세션을 안전하게 플러시하고 종료합니다.

`transcribe`와 동일한 자격 증명 및 설정 규칙이 적용됩니다.

### `export transcript`

전사 세그먼트를 정형화된 자막이나 텍스트 파일로 내보냅니다. 권장되는 직접 인수 구문은 `sona-cli export <INPUT> [OUTPUT]`이며 호환 별칭 `sona-cli export transcript` 및 `sona-cli convert`도 완전히 지원됩니다:

```bash
sona-cli export ./segments.json ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export ./segments.json ./transcript.srt --mode bilingual
```

출력 형식은 확장자에서 자동으로 유추되거나 `--format <srt|vtt|txt|json|tsv|csv|md>`로 지정할 수 있습니다. 지원 모드는 `original`, `translation`, `bilingual`입니다.

### `doctor`

로컬 실행 환경에 대한 자동 상태 점검을 실행하여 호스트 플랫폼, CPU 아키텍처, SIMD 확장(AVX2, NEON), GPU/CUDA 가속, 오디오 장치, 설치된 모델 무결성 및 디렉터리 권한을 진단합니다:

```bash
sona-cli doctor
sona-cli doctor --strict
sona-cli doctor --json
```

### `devices`

호스트 시스템에서 감지된 오디오 입력 및 출력 장치를 나열합니다:

```bash
sona-cli devices
sona-cli devices --json
```

### `providers`

구성된 클라우드 온라인 ASR 제공자 및 연결/기능 상태를 확인합니다:

```bash
sona-cli providers
sona-cli providers --json
```

### `update`

Minisign 서명 검증을 통해 CLI 및 데스크톱 바이너리 업데이트를 확인하고 안전하게 설치합니다:

```bash
sona-cli update check
sona-cli update apply
```

### `completion`

자주 사용하는 셸에 맞는 자동 완성 스크립트를 생성합니다:

```bash
sona-cli completion bash > /etc/bash_completion.d/sona-cli
sona-cli completion zsh > ~/.zfunc/_sona-cli
sona-cli completion fish > ~/.config/fish/completions/sona-cli.fish
sona-cli completion powershell | Out-File -Append -Encoding utf8 $PROFILE
```

### `diagnostics`

지원 및 문제 해결을 위해 애플리케이션 데이터베이스에 접근하지 않는 정형화된 진단 스냅샷 JSON 객체를 작성합니다:

```bash
sona-cli diagnostics
```

### `serve`

공유 로컬 HTTP API 서버를 시작합니다. 로컬 REST 전사 및 WebSocket 실시간 스트리밍 (`/v1/streaming`)을 지원합니다:

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

전체 REST 및 WebSocket 엔드포인트 사양은 [HTTP API 가이드](guide:api-guide)를 참조하세요.

## 종료 코드 및 오류

- `0`: 성공
- `1`: 일반 실패 (`doctor --strict` 점검 실패, 직렬화 실패 등)
- `2`: 유효성 검사 또는 인수 오류 (잘못된 인수, 제공자 누락, 파일 없음)
- `3`: 모델 오류 (프리셋 누락, 다운로드 손상, 동반 파일 부재)
- `4`: 네트워크 또는 온라인 제공자 오류 (인증 실패, API 시간 초과)
- `5`: 파일 시스템 오류 (`--force` 없이 기존 파일 덮어쓰기 시도, 쓰기 실패)
- `130`: 취소됨 (Ctrl+C 신호로 중단됨)
