`sona-cli`는 Sona의 독립 실행형 명령줄 인터페이스입니다. 데스크톱 Tauri 앱에는 더 이상 CLI 하위 명령이 포함되지 않으므로, 패키지된 데스크톱 빌드에서 명령줄 작업을 수행할 때는 `sona-cli`를 실행하세요.

현재 독립 실행형 CLI에는 다음 명령이 포함되어 있습니다.

- `path-status`
- `init-config`
- `models list`
- `models download`
- `models delete`
- `history list|query|transcript|snapshots|snapshot|<mutation>`
- `export transcript`
- `backup export|inspect|import`
- `serve`
- `transcribe`
- `transcribe-live`

헤드리스 HTTP API 서버는 공유 `sona-api-server` 어댑터를 사용하며, 데스크톱 앱이나 `sona-cli serve`에서 시작할 수 있습니다.

## 실행 방법

- 패키지 빌드: 같은 플랫폼용 설치 프로그램 출력에 포함된 `sona-cli` 바이너리 사용
- 소스 빌드: `cargo run -p sona-cli -- <command> ...`

예:

```bash
cargo run -p sona-cli -- path-status .
cargo run -p sona-cli -- init-config
cargo run -p sona-cli -- models list --json
cargo run -p sona-cli -- history list --app-data-dir ./sona-data --json
cargo run -p sona-cli -- export transcript --input ./segments.json --output ./transcript.vtt
cargo run -p sona-cli -- serve --host 127.0.0.1 --port 14200
cargo run -p sona-cli -- transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
cargo run -p sona-cli -- transcribe-live --model-id sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17
```

## 명령

### `path-status`

공유 런타임 상태 계약으로 파일 시스템 경로 하나를 확인하고 JSON을 `stdout`에 출력합니다.

```bash
sona-cli path-status ./models
```

출력 예:

```json
{
  "kind": "directory",
  "path": "C:/work/models",
  "error": null
}
```

### `init-config`

독립 실행형 CLI 작업에 사용할 주석 포함 초기 설정 파일을 만듭니다.

```bash
sona-cli init-config
sona-cli init-config ./sona-cli.toml --force
```

- 기본 출력 경로: `./sona-cli.toml`
- `--force`를 지정하지 않으면 기존 파일을 덮어쓰지 않습니다
- 상태 메시지는 `stderr`에 기록됩니다

### `models list`

프리셋 모델을 나열하고 모드, 유형, 언어 또는 설치 상태로 필터링합니다.

```bash
sona-cli models list
sona-cli models list --mode offline --type whisper
sona-cli models list --language zh --installed
sona-cli models list --json
```

`--json`은 `install_path`를 포함한 전체 기계 판독형 구조를 출력합니다.

### `models download`

프리셋 모델 하나를 확인된 모델 디렉터리에 다운로드합니다.

```bash
sona-cli models download sherpa-onnx-whisper-turbo
sona-cli models download silero-vad --models-dir ./models --yes
```

선택한 프리셋에 보조 리소스가 필요하면 `sona-cli`가 필요한 VAD 또는 구두점 모델도 함께 다운로드합니다.

### `models delete`

설치된 프리셋 모델 하나를 삭제합니다.

```bash
sona-cli models delete sherpa-onnx-whisper-turbo --yes
sona-cli models delete silero-vad --models-dir ./models --yes
```

보조 모델은 자동으로 삭제되지 않습니다.

### `history`

공유 기록 서비스를 통해 기존 Sona 앱 데이터 디렉터리를 조회하거나 변경합니다.

```bash
sona-cli history list --app-data-dir ./sona-data --limit 50 --offset 0
sona-cli history query --app-data-dir ./sona-data --input ./workspace-query.json --json
sona-cli history transcript --app-data-dir ./sona-data --history-id <ID> --json
sona-cli history snapshots --app-data-dir ./sona-data --history-id <ID>
sona-cli history snapshot --app-data-dir ./sona-data --history-id <ID> --snapshot-id <ID> --json
sona-cli history create-live-draft --app-data-dir ./sona-data --id <ID> --audio-extension wav --json
sona-cli history complete-live-draft --app-data-dir ./sona-data --history-id <ID> --segments ./segments.json --duration 12.5 --json
sona-cli history save-recording --app-data-dir ./sona-data --input ./recording.json --audio ./recording.wav --json
sona-cli history import-file --app-data-dir ./sona-data --input ./history-import.json --json
sona-cli history update-transcript --app-data-dir ./sona-data --history-id <ID> --segments ./segments.json --json
sona-cli history create-snapshot --app-data-dir ./sona-data --history-id <ID> --reason polish --segments ./segments.json --json
sona-cli history update-meta --app-data-dir ./sona-data --history-id <ID> --updates ./history-meta.json
sona-cli history assign-project --app-data-dir ./sona-data --history-id <ID> --project-id <PROJECT_ID>
sona-cli history reassign-project --app-data-dir ./sona-data --current-project-id <PROJECT_ID>
sona-cli history delete --app-data-dir ./sona-data --history-id <ID>
```

- `query`는 Tauri 및 UniFFI와 같은 camelCase `HistoryWorkspaceQueryRequest` JSON 계약을 받습니다.
- `list`, `query`, `snapshots`는 기본적으로 표를 사용하며, `--json`은 완전한 기계 판독형 응답을 유지합니다.
- `transcript`와 `snapshot`은 기본적으로 세그먼트 표를 표시합니다.
- `recording.json`에는 `segments`, `duration`, 선택적 `projectId`와 `audioExtension`이 들어갑니다. 오디오 바이트는 `--audio`에서만 읽습니다.
- `history-import.json`은 camelCase `HistorySaveImportedFileRequest` 계약을 사용합니다. `--segments` 파일은 JSON 배열이고 `--updates`는 JSON 객체입니다.
- `assign-project` 또는 `reassign-project`에서 대상 프로젝트 옵션을 생략하면 기록을 Inbox로 이동합니다.
- 앱 데이터 디렉터리는 미리 존재해야 합니다. 잘못된 변경 입력은 지연 초기화되는 SQLite 어댑터가 데이터베이스를 열기 전에 거부됩니다.

### `export transcript`

기존 전사 세그먼트 JSON 배열을 공유 코어 내보내기 서비스로 내보냅니다.

```bash
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.srt --mode bilingual
sona-cli export transcript --input ./segments.json --output ./transcript.txt --format txt --json
```

- `--format`을 지정하지 않으면 출력 파일 확장자에서 형식을 추론합니다.
- 지원 형식: `json`, `txt`, `srt`, `vtt`, `md`
- 지원 모드: `original`(기본값), `translation`, `bilingual`
- `--json`은 출력 경로와 기록된 바이트 수를 기계 판독형 JSON으로 출력합니다.

### `backup`

지원되는 앱 상태 범위 다섯 개를 모두 내보내고, 앱 데이터를 열지 않은 채 보관 파일을 검증하거나, 보관 파일에서 백업된 상태를 원자적으로 교체합니다.

```bash
sona-cli backup export --app-data-dir ./sona-data --output ./sona-backup.sona-backup --app-version 0.8.0
sona-cli backup inspect --archive ./sona-backup.sona-backup
sona-cli backup import --app-data-dir ./sona-data --archive ./sona-backup.sona-backup --default-rule-set-name "Default Rules" --confirm-replace
```

가져오기는 `config`, `workspace`, `history`, `automation`, `analytics` 범위를 원자적으로 교체합니다. `--confirm-replace`가 반드시 필요하며 대화형 프롬프트를 열지 않습니다. 작업 원장과 원본 오디오는 백업 보관 파일에 포함되지 않습니다.

### `serve`

독립 실행형 CLI에서 공유 로컬 HTTP API 서버를 실행합니다.

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

- Ctrl+C를 누를 때까지 실행됩니다
- 데스크톱 앱과 같은 로컬 일괄 전사 API 서버 어댑터를 재사용합니다
- `--config`는 `init-config`가 생성한 `[serve]` 섹션을 읽습니다
- CLI에서 로컬 REST 전사를 사용할 수 있습니다. `serve`의 WebSocket 스트리밍 라우터와 온라인 ASR 연동에는 여전히 데스크톱 런타임이 필요합니다. 독립 실행형 로컬 스트리밍에는 `transcribe-live`를 사용하세요.

### `transcribe`

오프라인 ASR 어댑터를 사용해 로컬 오디오 또는 비디오 파일 하나를 전사합니다.

```bash
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
sona-cli transcribe ./sample.wav --config ./sona-cli.toml --output ./out.srt
sona-cli transcribe ./sample.wav --format txt --quiet
```

- `--output`을 생략하면 기본적으로 `stdout`에 출력합니다
- 지원 내보내기 형식: `json`, `txt`, `srt`, `vtt`, `md`
- `--config`는 `init-config`가 생성한 주석 포함 `sona-cli.toml` 템플릿을 읽습니다
- `--force`를 지정하면 기존 출력 파일을 덮어쓸 수 있습니다

### `transcribe-live`

설치된 로컬 스트리밍 모델로 마이크 또는 stdin 원시 오디오를 실시간 전사합니다.

```bash
sona-cli transcribe-live --list-input-devices
sona-cli transcribe-live \
  --model-id sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17 \
  --device "Studio Mic" \
  --duration 60 \
  --output ./live.srt
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli transcribe-live \
    --input stdin \
    --model-id sherpa-onnx-streaming-paraformer-trilingual-zh-cantonese-en \
    --output-format ndjson
```

- 이 명령은 로컬 오프라인 ASR만 지원합니다. 선택한 프리셋은 `streaming` 모드를 선언해야 하며 확인된 모델 디렉터리에 설치되어 있어야 합니다.
- `--device`에 `--list-input-devices`가 반환한 정확한 이름을 지정하지 않으면 마이크 입력은 기본 CPAL 입력 장치를 사용합니다.
- `--input stdin`은 헤더 없는 16 kHz, 모노, 부호 있는 16-bit little-endian PCM을 받습니다. 끝에 불완전한 샘플이 있으면 입력 오류가 됩니다.
- TTY 텍스트 출력은 현재 전사를 제자리에서 새로 고칩니다. 리디렉션된 텍스트 출력은 flush 후 최종 스냅샷을 한 번만 기록합니다.
- `--output-format ndjson`은 한 줄에 JSON 객체 하나를 출력하고 각 이벤트마다 flush합니다. 이벤트 유형은 `started`, `update`, `stopped`, 런타임 오류 전용 `error`이며 전사 필드는 camelCase를 사용합니다.
- Ctrl+C, stdin EOF, `--duration`은 같은 정상 종료 절차를 수행합니다. 캡처 오디오를 비우고 ASR을 flush한 뒤 중지하며, 필요하면 최종 파일을 쓰고 `stopped`를 출력한 다음 종료 코드 0으로 끝납니다.
- `--output`은 최종 스냅샷을 `json`, `txt`, `srt`, `vtt`, `md`로 기록합니다. `--format`이 없으면 확장자가 형식을 선택하며, 기존 파일을 교체하려면 `--force`가 필요합니다.
- `--config`는 `sona-cli.toml`의 `[transcribe_live]`를 읽습니다. 명령줄 값이 이 섹션을 덮어쓰며, 이 섹션은 공유 최상위 ASR 기본값을 상속합니다. 최종 출력 경로, 내보내기 형식, 덮어쓰기 동작은 명령줄에서만 지정할 수 있습니다.
- 검증 오류는 종료 코드 2, 모델 오류는 3, 입력 또는 장치 오류는 5를 사용합니다. 런타임 NDJSON 오류도 0이 아닌 코드로 종료하기 전에 `error` 이벤트로 출력됩니다.

## 전역 플래그

```text
sona-cli
  -V, --version
  -h, --help
```

명령별 사용법은 `sona-cli <command> --help`에서 확인하세요.
