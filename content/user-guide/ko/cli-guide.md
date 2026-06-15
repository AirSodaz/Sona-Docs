`sona`는 기본 데스크톱 실행 파일을 통해 오프라인 전사 command를 제공합니다. Packaged install은 `sona`를 shell `PATH`에 추가하지 않으므로, 설치된 앱 binary에 CLI subcommand를 붙여 실행하세요. Source build는 Cargo로 같은 command를 실행할 수 있습니다.

CLI 범위는 의도적으로 좁습니다. 단일 파일과 directory 오프라인 전사, preset model listing/download/deletion, headless HTTP API server startup을 제공합니다. Live recording, LLM polish, LLM translation은 포함하지 않습니다.

## 실행 방법

- Windows: 설치 directory에서 `Sona.exe transcribe ...` 실행
- macOS: `/Applications/Sona.app/Contents/MacOS/Sona transcribe ...` 실행
- Linux packages: 설치 위치의 packaged `Sona` binary에 CLI subcommand를 붙여 실행
- AppImage: mounted AppImage executable에 CLI subcommand를 붙여 실행
- Source: `cargo run --manifest-path src-tauri/Cargo.toml -- transcribe ./sample.mp4 -c ./sona-cli.toml`

## 자주 쓰는 command

### 파일 전사

```bash
sona transcribe ./sample.mp4 \
  -c ./sona-cli.toml \
  --output ./sample.srt
```

`--output`이 없으면 transcription은 JSON을 `stdout`에 씁니다. `--output`이 있으면 `--format`이 제공되지 않는 한 파일 확장자에서 format을 추론합니다. 기존 output file은 기본적으로 보호됩니다. 덮어쓸 의도가 있을 때만 `--force`를 전달하세요.

### Directory 전사

```bash
sona transcribe \
  --input-dir ./media \
  --output-dir ./transcripts \
  --format srt \
  --recursive \
  --jobs 1 \
  -c ./sona-cli.toml
```

Directory mode는 지원되는 media file마다 transcript 하나를 `--output-dir`에 씁니다. 기본적으로 direct children만 scan하며, subdirectories까지 포함하려면 `--recursive`를 추가합니다. Transcript content는 파일에 쓰이고, JSON success/failure summary는 `stdout`에 출력됩니다.

여러 input file이나 glob pattern을 전달할 수도 있습니다. 이 경우 directory mode와 같은 batch output planning을 사용하며 `--output-dir`가 필요합니다.

```bash
sona transcribe ./media/*.wav ./media/interview.mp4 --output-dir ./transcripts --format srt
```

### Model list, download, delete

```bash
sona models list --mode offline --type whisper
sona models list --language zh --installed
sona models list --json
sona models download sherpa-onnx-whisper-turbo
sona models delete sherpa-onnx-whisper-turbo
```

`models list`는 기본적으로 읽기 쉬운 table을 출력합니다. Script가 `install_path`를 포함한 전체 machine-readable shape를 필요로 하면 `--json`을 사용하세요.
`models download`는 선택한 preset이 필요로 하는 `silero-vad`나 default punctuation model 같은 companion model을 자동으로 다운로드합니다.
`models delete`는 지정한 model만 제거합니다. Companion model은 자동 삭제하지 않습니다.

### API server 시작

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

HTTP API endpoint와 request example은 [HTTP API 가이드](guide:api-guide)를 계속 읽으세요.

### Config template 만들기

```bash
sona init-config
sona init-config ./sona-cli.toml --force
```

`init-config`는 English-commented TOML template을 기본적으로 `sona-cli.toml`에 씁니다. 다른 위치에 쓰려면 path를 전달하세요. Existing file은 기본적으로 보호되며, overwrite하려면 `--force`가 필요합니다. Template은 flat TOML이며 `transcribe`와 `serve`에서 함께 재사용할 수 있습니다. 각 command는 자신이 지원하는 key만 읽고 unrelated key는 무시합니다.

## Config file

`-c` 또는 `--config`로 TOML file을 전달합니다. Command-line flag는 config file 값을 override합니다. Commented starter template은 `sona init-config`로 만들 수 있습니다.

Generated template의 minimal excerpt:

```toml
models_dir = "C:/Users/you/AppData/Local/com.asoda.sona/models"
model_id = "sherpa-onnx-whisper-turbo"
vad_model_id = "silero-vad"
punctuation_model_id = "sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8"
language = "auto"
threads = 4
enable_itn = false
vad_buffer_size = 5.0
gpu_acceleration = "auto"
hotwords = "Sona,offline ASR"
format = "srt"
quiet = false
jobs = 1

host = "127.0.0.1"
port = 14200
api_key = ""
ip_whitelist = "localhost"
max_streaming = 2
max_concurrent = 2
max_queue_size = 100
max_upload_size_mb = 50
job_ttl_minutes = 60
```

### `transcribe` config keys

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `models_dir` | Optional | Filesystem path | Desktop app models directory, when inferable | CLI가 desktop model을 찾지 못할 때 명시적으로 전달하세요. |
| `model_id` | Required unless `--model-id` is passed | Offline preset model id | None | Id를 찾으려면 `sona models list --mode offline`을 사용하세요. |
| `vad_model_id` | Optional | Preset model id | `silero-vad` when required | 선택한 model이 VAD를 필요로 할 때 사용하며 default를 override합니다. |
| `punctuation_model_id` | Optional | Preset model id | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` when required | 선택한 model이 punctuation을 필요로 할 때 사용하며 default를 override합니다. |
| `language` | Optional | `auto` or a model language code, such as `zh`, `en`, `ja` | `auto` | Automatic language detection을 override합니다. |
| `threads` | Optional | Integer greater than `0` | `4` | Recognizer thread count입니다. |
| `enable_itn` | Optional | `true` or `false` | `false` | Inverse text normalization을 활성화합니다. |
| `hotwords` | Optional | Comma-separated words | None | Custom ASR hotwords입니다. 현재 Transducer와 Qwen3 model에서 지원됩니다. |
| `quiet` | Optional | `true` or `false` | `false` | 설정하면 transcription progress를 숨깁니다. CLI `--quiet`도 이를 활성화합니다. |
| `jobs` | Optional | Integer greater than `0` | `1` | Directory, multiple-input, glob mode에서 최대 concurrent file jobs입니다. CLI `--jobs`가 override합니다. |
| `vad_buffer_size` | Optional | Number greater than `0` | `5.0` | VAD buffer size in seconds입니다. |
| `gpu_acceleration` | Optional | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | Windows에서 `auto`는 CUDA를 먼저 시도하고, bundled runtime이 DirectML을 지원하면 DirectML을 시도한 뒤 CPU로 fallback합니다. GPU acceleration을 끄려면 `cpu`를 사용하세요. |
| `format` | Optional | `json`, `txt`, `srt`, `vtt`, `md` | `json` on stdout or in directory mode, otherwise inferred from `--output` | Output extension inference를 override합니다. |

### `serve` config keys

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `host` | Optional | Bind address | `0.0.0.0` | Local-only access에는 `127.0.0.1`을 사용하세요. |
| `port` | Optional | TCP port `0` to `65535` | `14200` | API server port입니다. |
| `api_key` | Optional | String | Empty | Empty면 request가 Bearer auth로 보호되지 않습니다. |
| `models_dir` | Optional | Filesystem path | Desktop app models directory, when inferable | Installed models를 resolve할 때 사용합니다. |
| `ip_whitelist` | Optional | Comma-separated rules | `localhost` | `localhost`, exact IPs, CIDR, `*`, `192.168.*` 같은 IPv4 wildcard를 지원합니다. |
| `max_streaming` | Optional | Non-negative integer | `2` | 최대 concurrent streaming WebSocket connections입니다. |
| `max_concurrent` | Optional | Non-negative integer | `2` | 최대 concurrent batch jobs입니다. |
| `max_queue_size` | Optional | Non-negative integer | `100` | `0`이면 queue가 사실상 unlimited입니다. |
| `max_upload_size_mb` | Optional | Non-negative integer | `50` | `0`이면 upload size limit을 비활성화합니다. |
| `job_ttl_minutes` | Optional | Non-negative integer | `60` | `0`이면 completed/failed job cleanup을 비활성화합니다. |
| `gpu_acceleration` | Optional | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | Local batch와 streaming jobs의 server-level default입니다. Windows `auto`는 CUDA, available DirectML, CPU 순서로 사용합니다. |
| `vad_model_id` | Optional | Preset model id | `silero-vad` | API server jobs의 default VAD companion model입니다. |
| `punctuation_model_id` | Optional | Preset model id | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | API server jobs의 default punctuation companion입니다. |

## Parameters

### Global

```text
sona
  -V, --version
  -v, --verbose
  -h, --help
  help
```

Sona version을 출력하려면 `-V` 또는 `--version`을 사용합니다. 자세한 diagnostic logs를 켜려면 subcommand 앞에 `-v` 또는 `--verbose`를 둡니다. Command help를 보려면 `-h`, `--help`, `help`를 사용하세요.

```bash
sona --version
sona -V
sona -v models list
sona --verbose transcribe ./sample.mp4 -c ./sona-cli.toml
sona transcribe --help
```

Verbose diagnostics는 `stderr`로 출력됩니다. `models list`와 `--output` 없는 `transcribe`의 table 또는 JSON output 같은 command output은 계속 `stdout`에 남아 다른 도구로 pipe할 수 있습니다.

Advanced wrapper와 tests는 recognized CLI subcommand 없이 executable이 시작되더라도 CLI mode를 강제하려면 `SONA_FORCE_CLI=1`을 설정할 수 있습니다.

Shell completion script는 `sona completions <shell>`로 생성합니다. 지원 shell은 `bash`, `zsh`, `fish`, `powershell`, `elvish`이며 script는 `stdout`으로 출력됩니다.

### `transcribe`

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `<input>...` | Required unless `--input-dir` is passed | Local audio/video file paths or glob patterns | None | Input 하나는 single-file mode입니다. Multiple inputs 또는 glob patterns는 batch mode를 쓰며 `--output-dir`가 필요합니다. |
| `--input-dir <dir>` | Required for directory mode | Directory path | None | Directory 안의 supported media files를 전사합니다. |
| `-c, --config <path>` | Optional | TOML file path | None | Config에서 defaults를 로드합니다. |
| `--output <path>` | Optional | Filesystem path | `stdout` | Single-file mode 전용 output file path입니다. 파일이 이미 있으면 `--force` 없이는 error입니다. |
| `--output-dir <dir>` | Required with `--input-dir`, multiple inputs, or glob patterns | Directory path | None | Input file마다 transcript 하나를 씁니다. Planned output이 이미 있으면 `--force` 없이는 error입니다. |
| `--recursive` | Optional | Flag | Off | Subdirectories를 scan하고 relative output paths를 보존합니다. |
| `--jobs <n>` | Optional | Integer greater than `0` | `jobs` config or `1` | Batch mode의 최대 concurrent file jobs입니다. |
| `--format <format>` | Optional | `json`, `txt`, `srt`, `vtt`, `md` | `json` on stdout or in directory mode, otherwise inferred from `--output` | Config와 output extension inference를 override합니다. |
| `--language <code>` | Optional | `auto` or a model language code | `auto` | Config를 override합니다. |
| `--model-id <id>` | Required unless `model_id` is configured | Offline preset model id | None | Main transcription model입니다. |
| `--models-dir <path>` | Optional | Filesystem path | Desktop app models directory, when inferable | Config를 override합니다. |
| `--vad-model-id <id>` | Optional | Preset model id | `silero-vad` when required | Default VAD companion을 override합니다. |
| `--punctuation-model-id <id>` | Optional | Preset model id | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` when required | Default punctuation companion을 override합니다. |
| `--threads <n>` | Optional | Integer greater than `0` | `4` | Config를 override합니다. |
| `--enable-itn` | Optional | Flag | `false` | `--disable-itn`과 함께 쓸 수 없습니다. |
| `--disable-itn` | Optional | Flag | `false` | `enable_itn = true`를 override하며 `--enable-itn`과 함께 쓸 수 없습니다. |
| `--hotwords <words>` | Optional | Comma-separated words | None | `hotwords`를 override합니다. 현재 Transducer와 Qwen3 model에서 지원됩니다. |
| `--gpu-acceleration <provider>` | Optional | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | Config를 override합니다. Windows에서 `auto`는 CUDA를 먼저 시도하고, bundled runtime이 DirectML을 지원하면 DirectML을 시도한 뒤 CPU로 fallback합니다. Explicit `directml`은 manual DirectML request로 유지됩니다. |
| `--vad-buffer <seconds>` | Optional | Number greater than `0` | `5.0` | `vad_buffer_size`의 CLI name입니다. |
| `--save-wav <path>` | Optional | Filesystem path | None | CLI-only입니다. Intermediate resampled WAV를 저장합니다. `--input-dir`와 함께 쓸 수 없습니다. |
| `--quiet` | Optional | Flag | Off | Transcription progress를 숨기고 `quiet = false`를 override합니다. |
| `--force` | Optional | Flag | Off | Existing output files overwrite를 허용합니다. Duplicate planned batch outputs는 여전히 실패합니다. |

### `models list`

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `--models-dir <path>` | Optional | Filesystem path | Desktop app models directory, when inferable | Installed presets 감지에 사용합니다. |
| `--mode <mode>` | Optional | `streaming`, `offline` | All modes | Supported mode로 filter합니다. |
| `--type <type>` | Optional | Preset model type, such as `whisper`, `vad`, `punctuation` | All types | Model type으로 filter합니다. |
| `--language <code>` | Optional | Language token, such as `zh`, `en`, `ja`, `yue` | All languages | Supported language token으로 filter합니다. |
| `--installed` | Optional | Flag | Off | `models_dir`에 있는 model만 표시합니다. |
| `--json` | Optional | Flag | Off | 기본 table 대신 machine-readable JSON을 출력합니다. |
| Output | Always | Table or JSON | Table | `stdout`에 출력됩니다. |

### `models download`

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `<model_id>` | Required | Known preset model id | None | 다운로드할 main model입니다. |
| `--models-dir <path>` | Optional | Filesystem path | Desktop app models directory, when inferable | Target models directory입니다. |
| `--quiet` | Optional | Flag | Off | Per-download progress를 숨깁니다. |
| Companion downloads | Automatic | Required VAD and punctuation presets | Automatic | Main model 다운로드는 필요한 companion을 함께 다운로드합니다. |

### `models delete`

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `<model_id>` | Required | Known preset model id | None | 삭제할 model입니다. |
| `--models-dir <path>` | Optional | Filesystem path | Desktop app models directory, when inferable | Target models directory입니다. |
| `--yes` | Optional | Flag | Off | Interactive confirmation prompt를 건너뜁니다. |
| Missing install path | No | Known but not installed preset | Successful no-op | `stderr`에 notice를 출력하고 status 0으로 종료합니다. |
| Companion deletion | No | Required VAD and punctuation presets | Not deleted | 더 이상 필요 없으면 companion model을 명시적으로 삭제하세요. |

### `init-config`

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `[PATH]` | Optional | TOML file path | Current directory의 `sona-cli.toml` | Target template path입니다. Parent directories는 필요하면 생성됩니다. |
| `--force` | Optional | Flag | Off | Existing config file overwrite를 허용합니다. |
| Output | Always | Status text | `stderr` | Generated TOML은 `stdout`이 아니라 target file에 쓰입니다. |

### `serve`

| Parameter / config key | Required | Range | Default | Notes |
| --- | --- | --- | --- | --- |
| `-c, --config <path>` | Optional | TOML file path | None | Config에서 defaults를 로드합니다. |
| `--host <ip>` | Optional | Bind address | `0.0.0.0` | Config를 override합니다. |
| `--port <port>` | Optional | TCP port `0` to `65535` | `14200` | Config를 override합니다. |
| `--api-key <key>` | Optional | String | Empty | Empty면 Bearer auth가 없습니다. |
| `--models-dir <path>` | Optional | Filesystem path | Desktop app models directory, when inferable | Config를 override합니다. |
| `--ip-whitelist <rules>` | Optional | Comma-separated rules | `localhost` | `localhost`, exact IPs, CIDR, `*`, `192.168.*` 같은 IPv4 wildcard를 지원합니다. |
| `--max-streaming <n>` | Optional | Non-negative integer | `2` | 최대 concurrent streaming connections입니다. |
| `--max-concurrent <n>` | Optional | Non-negative integer | `2` | 최대 concurrent batch jobs입니다. |
| `--max-queue-size <n>` | Optional | Non-negative integer | `100` | `0`이면 queue가 사실상 unlimited입니다. |
| `--max-upload-size-mb <n>` | Optional | Non-negative integer | `50` | `0`이면 upload size limit을 비활성화합니다. |
| `--job-ttl-minutes <n>` | Optional | Non-negative integer | `60` | `0`이면 completed/failed job cleanup을 비활성화합니다. |
| `--gpu-acceleration <provider>` | Optional | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | Server-level default입니다. HTTP API request는 request별 GPU override를 받지 않습니다. Windows `auto`는 CUDA, available DirectML, CPU 순서로 사용합니다. |
| `--vad-model-id <id>` | Optional | Preset model id | `silero-vad` | API server jobs의 default VAD companion입니다. |
| `--punctuation-model-id <id>` | Optional | Preset model id | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | API server jobs의 default punctuation companion입니다. |

전체 clap-generated help text는 `sona <command> --help`로 확인하세요.
