`sona-cli`는 Sona의 stateless 명령줄 전사 Host입니다. Sona의 SQLite 애플리케이션 데이터베이스, 프로젝트 데이터베이스 및 히스토리 저장소, 동기화 상태 또는 Online LLM 작업을 열거나 관리하지 않습니다. 전사 결과는 `stdout` 또는 명시적으로 지정한 출력 파일에 기록됩니다.

독립 실행형 CLI에는 다음 명령이 포함됩니다.

- `path-status`
- `init-config`
- `models list|download|delete`
- `diagnostics`
- `export transcript`
- `serve` (로컬 ASR을 사용하는 로컬 REST 전사)
- `transcribe` (로컬 또는 온라인 batch ASR)
- `transcribe-live` (로컬 또는 온라인 streaming ASR)

## 실행 방법

- 패키지 빌드: 같은 플랫폼의 installer output에 포함된 `sona-cli` binary를 사용합니다.
- 소스 빌드: `cargo run -p sona-cli -- <command> ...`

예시:

```bash
cargo run -p sona-cli -- path-status ./models
cargo run -p sona-cli -- init-config
cargo run -p sona-cli -- models list --json
cargo run -p sona-cli -- diagnostics
cargo run -p sona-cli -- transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
cargo run -p sona-cli -- transcribe ./sample.wav --online-provider groq-whisper
cargo run -p sona-cli -- transcribe-live --online-provider volcengine-doubao
cargo run -p sona-cli -- export transcript --input ./segments.json --output ./transcript.vtt
cargo run -p sona-cli -- serve --host 127.0.0.1 --port 14200
```

## Stateless 범위

CLI는 SQLite, History, Tag, 애플리케이션 backup/recovery, Sync, Online LLM을 의도적으로 제외합니다. Desktop 애플리케이션 데이터 디렉터리를 만들거나 수정하지 않습니다. `export transcript`와 `stdout`/파일 출력을 사용해 다른 도구와 조합하세요.

## 명령

### `path-status`

공유 runtime status contract를 통해 파일 시스템 경로 하나를 확인하고 JSON을 `stdout`에 출력합니다.

```bash
sona-cli path-status ./models
```

### `init-config`

로컬 전사와 로컬 API server를 위한 주석 포함 TOML 설정 템플릿을 만듭니다.

```bash
sona-cli init-config
sona-cli init-config ./sona-cli.toml --force
```

기존 파일은 `--force`를 지정하지 않으면 덮어쓰지 않습니다. 상태 텍스트는 `stderr`에 기록됩니다.

### `models`

로컬 ASR preset model을 나열하거나 다운로드 또는 삭제합니다. 선택한 model 디렉터리만 다루며 SQLite 애플리케이션 상태는 변경하지 않습니다.

```bash
sona-cli models list --mode offline --type whisper
sona-cli models list --language zh --installed --json
sona-cli models download sherpa-onnx-whisper-turbo
sona-cli models delete sherpa-onnx-whisper-turbo --yes
```

### `diagnostics`

Host가 제공한 정보로 diagnostics snapshot을 만듭니다. 애플리케이션 데이터베이스는 읽지 않습니다.

### `export transcript`

공유 Core export service를 통해 transcript segment JSON 배열을 내보냅니다.

```bash
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.srt --mode bilingual
```

`--format`을 지정하지 않으면 출력 파일 확장자에서 형식을 추론합니다. 지원 형식은 `json`, `txt`, `srt`, `vtt`, `md`이며 지원 모드는 `original`, `translation`, `bilingual`입니다.

### `transcribe`

로컬 오디오 파일 하나를 전사합니다. 로컬 ASR에서는 비디오 파일도 입력할 수 있습니다. `--online-provider`가 없으면 설치된 로컬 Sherpa preset을 사용합니다.

```bash
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
sona-cli transcribe ./sample.wav --config ./sona-cli.toml --output ./out.srt
```

`--online-provider`를 지정하면 로컬 파일을 선택한 provider에 업로드하고 결과를 `stdout` 또는 지정한 출력 파일에 기록합니다.

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

온라인 batch는 `volcengine-doubao`, `groq-whisper`, `mistral-voxtral`을 지원합니다.

| Provider | 기본 환경 변수 |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

다른 환경 변수를 사용하려면 `--api-key-env NAME`을 지정합니다. `--online-config FILE`은 endpoint/model 같은 비밀이 아닌 override를 담은 JSON object를 받지만 `apiKey` 또는 `api_key`를 포함할 수 없습니다.

온라인 provider를 선택하면 `--model-id`, `--models-dir`, VAD/구두점 option, thread count, GPU mode, `--save-wav` 같은 로컬 전용 flag는 거부됩니다. 기존 출력 파일을 바꾸려면 `--force`가 필요합니다.

### `transcribe-live`

마이크 입력 또는 `stdin`의 headerless 16 kHz mono signed 16-bit little-endian PCM을 실시간으로 전사합니다.

```bash
sona-cli transcribe-live --list-input-devices
sona-cli transcribe-live \
  --model-id sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17 \
  --device "Studio Mic" --duration 60 --output ./live.srt

ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli transcribe-live --input stdin \
    --model-id sherpa-onnx-streaming-paraformer-trilingual-zh-cantonese-en \
    --output-format ndjson
```

온라인 streaming은 현재 `volcengine-doubao`만 지원합니다.

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli transcribe-live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

마이크 입력은 기본 CPAL 입력 장치를 사용합니다. `--device`를 지정할 때는 `--list-input-devices`가 반환한 정확한 이름을 사용하세요. `--output-format`은 `text` 또는 `ndjson`, `--output`의 최종 snapshot은 `json`, `txt`, `srt`, `vtt`, `md`를 지원합니다. `--format`에는 `--output`도 필요합니다. Ctrl+C, `stdin` EOF, `--duration`은 session을 flush/stop한 뒤 종료합니다.

온라인 credential과 비밀이 아닌 설정 규칙은 `transcribe`와 같습니다. 온라인 streaming에서 로컬 model 또는 runtime flag를 사용하면 거부됩니다.

### `serve`

공유 로컬 HTTP API server를 실행합니다. CLI server는 로컬 ASR 전용이며 Online ASR 또는 WebSocket streaming을 노출하지 않습니다. Online ASR에는 `transcribe` 또는 `transcribe-live`를 직접 사용하세요.

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

## 출력과 오류

`transcribe`는 기본적으로 JSON을 `stdout`에 기록합니다. `transcribe-live`는 live text 또는 NDJSON event를 출력하고 선택적으로 최종 파일을 쓸 수 있습니다. 검증 오류는 종료 코드 2, model 오류는 3, network/provider 오류는 4, 파일 시스템/입력 오류는 5입니다.

명령별 사용법은 `sona-cli <command> --help`에서 확인하세요.
