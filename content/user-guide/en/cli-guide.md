`sona-cli` is Sona's standalone, stateless command-line speech-to-text host backed by `sona-core`. It transcribes audio files, directories, live microphone input, and standard input streams with local preset ASR models or online cloud providers. It does not open or manage the Sona SQLite application database, project database, history storage, sync state, or Online LLM tasks. Transcripts are written to `stdout` or to an explicitly supplied output file.

The standalone CLI ships these primary commands:

- `live` (or alias `transcribe-live`): real-time streaming speech recognition from mic or stdin
- `transcribe`: batch file or directory transcription with local or cloud models
- `models`: list, download, inspect, verify, search, and delete preset ASR models
- `export`: convert transcript segment JSON files into SRT, VTT, TXT, MD, etc. (supports alias `export transcript`)
- `config`: inspect and manage configuration TOML files (`init`, `check`, `show`, `get`, `set`, `unset`, `edit`, `path`)
- `doctor`: run host health diagnostics, inspect hardware acceleration (CUDA, Metal, AVX2, NEON), and verify paths
- `devices`: enumerate available audio input and output devices
- `providers`: inspect configured online cloud ASR providers and capabilities
- `update`: check and install safe package and binary updates with Minisign verification
- `completion`: generate shell auto-completion scripts (bash, zsh, fish, powershell, elvish)
- `serve`: local REST API server and WebSocket streaming (`/v1/streaming`)
- `diagnostics`: build a host diagnostics snapshot contract

## Run it

- Packaged builds: use the `sona-cli` binary bundled with the same-platform installer output.
- Source builds: `cargo run -p sona-cli -- <command> ...`

Examples:

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

## Stateless boundary

The CLI deliberately excludes SQLite, History, Tag, application backup/recovery, Sync, and Online LLM tasks. It will not create or silently mutate desktop application data directories. Output is emitted to `stdout` or written to explicitly specified target files. Use `export` (or `export transcript`) and `stdout`/file output to compose the CLI with other tools.

## Configuration precedence

Configuration options are resolved in the following priority order:

1. Explicit CLI argument: `-c / --config <PATH>`
2. Global environment variable: `SONA_CONFIG`
3. Local configuration file in current working directory: `./sona-cli.toml`
4. User standard configuration file: `sona-cli.toml` (Linux: `~/.config/sona/sona-cli.toml`, macOS: `~/Library/Application Support/sona/sona-cli.toml`, Windows: `%APPDATA%\sona\sona-cli.toml` or `%USERPROFILE%\.config\sona\sona-cli.toml`)
5. Built-in defaults: runs with safe defaults if no config file is found

## Commands

### `config`

Inspect and manage Sona CLI configuration files:

- `sona-cli config init`: generate a commented TOML starter file (use `-F/--force` to overwrite)
- `sona-cli config check`: validate configuration syntax and sections
- `sona-cli config show`: display active configuration merged with defaults
- `sona-cli config get <KEY>`: retrieve a specific configuration property
- `sona-cli config set <KEY> <VALUE> [--global]`: persist a property value locally or globally
- `sona-cli config unset <KEY> [--global]`: remove a property from configuration
- `sona-cli config edit`: open configuration file in system default editor
- `sona-cli config path`: print resolved configuration path

```bash
sona-cli config init
sona-cli config check
sona-cli config set transcribe.model_id whisper-turbo
sona-cli config get transcribe.model_id
```

### `models`

Manage preset local ASR models in the selected models directory:

- `sona-cli models list`: list available preset models (`--mode live|batch`, `--installed`, `--json`)
- `sona-cli models download <MODEL>` (alias `install`): download model files with checksum verification
- `sona-cli models delete <MODEL>` (alias `rm`): delete downloaded model files (`-F/--force` to skip confirmation)
- `sona-cli models info <MODEL>` (alias `show`): inspect detailed model specification and companions
- `sona-cli models search <QUERY>`: search models by keyword or language
- `sona-cli models verify <MODEL>`: verify file integrity and checksums of installed model files
- `sona-cli models path`: print absolute path to active models directory

```bash
sona-cli models list --mode batch
sona-cli models search chinese
sona-cli models download whisper-turbo
sona-cli models verify whisper-turbo
sona-cli models delete whisper-turbo --force
```

### `transcribe`

Transcribe audio or video files using local preset ASR models or cloud online providers. Without `--online-provider`, the command uses an installed local Sherpa preset:

```bash
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo -o ./transcript.srt
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
```

With `--online-provider`, the command uploads audio to the selected cloud provider and outputs the result:

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

Supported batch providers are `volcengine-doubao`, `groq-whisper`, and `mistral-voxtral`:

| Provider | Default environment variable |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

Use `--api-key-env NAME` to select a custom environment variable. `--online-config FILE` accepts a JSON object for non-secret endpoint/model overrides; it must not contain `apiKey` or `api_key`.

Local-only flags such as `--model-id`, `--models-dir`, VAD/punctuation options, thread count, GPU mode, and `--save-wav` are rejected when an online provider is selected. `--force` is required to replace an existing output file.

### `transcribe-live`

`sona-cli live` (with compatibility alias `sona-cli transcribe-live`) performs real-time speech recognition from microphone capture or standard input (`--input stdin`).

```bash
sona-cli live -m sensevoice
sona-cli live --device "Studio Mic" --duration 60 --output ./live.srt

ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin -m sensevoice --output-format ndjson
```

Online streaming currently supports `volcengine-doubao`:

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

Microphone input uses the default CPAL input device unless `--device` supplies an exact device name (run `sona-cli devices` to inspect). `--output-format` can be `text` or `ndjson`; `--output` writes a final `json`, `txt`, `srt`, `vtt`, or `md` snapshot. `--format` requires `--output`. Ctrl+C, `stdin` EOF, and `--duration` flush and stop the session cleanly before exiting.

The same online credential (`--api-key-env`) and non-secret config (`--online-config`) rules as `transcribe` apply.

### `export transcript`

Export transcript segments into formatted subtitle or text files. The modern command is `sona-cli export <INPUT> [OUTPUT]`, with compatibility aliases `sona-cli export transcript` and `sona-cli convert`:

```bash
sona-cli export ./segments.json ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export ./segments.json ./transcript.srt --mode bilingual
```

The output format is inferred from the file extension or specified via `--format <srt|vtt|txt|json|tsv|csv|md>`. Supported modes are `original`, `translation`, and `bilingual`.

### `doctor`

Run automated diagnostics checks on the local environment, inspecting host platform, CPU architecture, SIMD extensions (AVX2, NEON), GPU/CUDA acceleration, audio input/output devices, installed model integrity, and directory permissions:

```bash
sona-cli doctor
sona-cli doctor --strict
sona-cli doctor --json
```

### `devices`

List available audio input and output devices detected on the host system:

```bash
sona-cli devices
sona-cli devices --json
```

### `providers`

Inspect configured online cloud ASR providers and their connection/capability statuses:

```bash
sona-cli providers
sona-cli providers --json
```

### `update`

Check for and install signed updates for the CLI and desktop binaries with Minisign cryptographic signature verification:

```bash
sona-cli update check
sona-cli update apply
```

### `completion`

Generate shell auto-completion scripts for your preferred shell:

```bash
sona-cli completion bash > /etc/bash_completion.d/sona-cli
sona-cli completion zsh > ~/.zfunc/_sona-cli
sona-cli completion fish > ~/.config/fish/completions/sona-cli.fish
sona-cli completion powershell | Out-File -Append -Encoding utf8 $PROFILE
```

### `diagnostics`

Build a structured host diagnostics snapshot contract JSON object for support or issue reporting without accessing application databases:

```bash
sona-cli diagnostics
```

### `serve`

Run the shared local HTTP API server. Supports local REST transcription and WebSocket streaming (`/v1/streaming`):

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

For the complete REST and WebSocket endpoints specification, see [HTTP API Guide](guide:api-guide).

## Exit codes and errors

- `0`: Success
- `1`: General failure (e.g. `doctor --strict` health check failure, serialization error)
- `2`: Validation or CLI usage error (invalid argument, missing provider, nonexistent input file)
- `3`: Model error (missing preset, corrupted download, uninstalled companion)
- `4`: Network or online provider error (authentication failure, API timeout)
- `5`: Filesystem error (output file already exists without `--force`, directory write failure)
- `130`: Cancelled (interrupted by Ctrl+C signal)
