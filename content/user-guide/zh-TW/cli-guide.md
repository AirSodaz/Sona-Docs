`sona-cli` 是 Sona 的獨立命令列介面。桌面版 Tauri 應用程式已不再內嵌 CLI 子指令，因此打包後的桌面版本應使用 `sona-cli` 執行命令列工作流程。

目前獨立 CLI 提供以下指令：

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

無介面的 HTTP API 服務由共用的 `sona-api-server` 轉接器提供，可從桌面應用程式或 `sona-cli serve` 啟動。

## 執行方式

- 安裝套件：使用同平台安裝輸出中隨附的 `sona-cli` 執行檔
- 原始碼建構：`cargo run -p sona-cli -- <command> ...`

範例：

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

## 指令

### `path-status`

透過共用的執行階段狀態契約解析一個檔案系統路徑，並將 JSON 輸出至 `stdout`。

```bash
sona-cli path-status ./models
```

輸出範例：

```json
{
  "kind": "directory",
  "path": "C:/work/models",
  "error": null
}
```

### `init-config`

建立帶有註解的起始設定檔，供後續獨立 CLI 工作流程使用。

```bash
sona-cli init-config
sona-cli init-config ./sona-cli.toml --force
```

- 預設輸出路徑：`./sona-cli.toml`
- 除非傳入 `--force`，否則不會覆寫既有檔案
- 狀態文字會寫入 `stderr`

### `models list`

列出預設模型，並可依模式、類型、語言或安裝狀態篩選。

```bash
sona-cli models list
sona-cli models list --mode offline --type whisper
sona-cli models list --language zh --installed
sona-cli models list --json
```

`--json` 會輸出完整的機器可讀格式，其中包含 `install_path`。

### `models download`

將一個預設模型下載至解析後的模型目錄。

```bash
sona-cli models download sherpa-onnx-whisper-turbo
sona-cli models download silero-vad --models-dir ./models --yes
```

如果選定的預設模型需要配套資源，`sona-cli` 也會下載必要的 VAD 或標點模型。

### `models delete`

刪除一個已安裝的預設模型。

```bash
sona-cli models delete sherpa-onnx-whisper-turbo --yes
sona-cli models delete silero-vad --models-dir ./models --yes
```

配套模型不會自動刪除。

### `history`

透過共用的歷史記錄服務，查詢或修改既有的 Sona 應用程式資料目錄。

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

- `query` 接受與 Tauri、UniFFI 相同的 camelCase `HistoryWorkspaceQueryRequest` JSON 契約。
- `list`、`query` 和 `snapshots` 預設使用表格；`--json` 會保留完整的機器可讀回應。
- `transcript` 和 `snapshot` 預設顯示分段表格。
- `recording.json` 包含 `segments`、`duration`，以及可選的 `projectId`、`audioExtension`；音訊位元組只會從 `--audio` 讀取。
- `history-import.json` 使用 camelCase `HistorySaveImportedFileRequest` 契約。`--segments` 檔案是 JSON 陣列，`--updates` 則是 JSON 物件。
- 在 `assign-project` 或 `reassign-project` 省略目標專案選項，會將記錄移回 Inbox。
- 應用程式資料目錄必須已存在。無效的修改輸入會在延遲載入的 SQLite 轉接器開啟資料庫之前被拒絕。

### `export transcript`

透過共用的核心匯出服務，匯出既有的轉錄分段 JSON 陣列。

```bash
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.srt --mode bilingual
sona-cli export transcript --input ./segments.json --output ./transcript.txt --format txt --json
```

- 未提供 `--format` 時，會從輸出副檔名推斷格式。
- 支援格式：`json`、`txt`、`srt`、`vtt`、`md`。
- 支援模式：`original`（預設）、`translation`、`bilingual`。
- `--json` 會以機器可讀 JSON 輸出路徑和寫入的位元組數。

### `backup`

匯出全部五個應用程式狀態範圍、在不開啟應用程式資料的情況下驗證封存，或從封存原子取代已備份的狀態。

```bash
sona-cli backup export --app-data-dir ./sona-data --output ./sona-backup.sona-backup --app-version 0.8.0
sona-cli backup inspect --archive ./sona-backup.sona-backup
sona-cli backup import --app-data-dir ./sona-data --archive ./sona-backup.sona-backup --default-rule-set-name "Default Rules" --confirm-replace
```

匯入會以原子方式取代 `config`、`workspace`、`history`、`automation` 和 `analytics` 範圍。必須提供 `--confirm-replace`，而且不會開啟互動式提示。備份封存不包含任務帳本與原始音訊。

### `serve`

從獨立 CLI 執行共用的本機 HTTP API 服務。

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

- 持續執行直到按下 Ctrl+C
- 重用與桌面應用程式相同的本機批次轉錄 API server 轉接器
- `--config` 讀取 `init-config` 產生的 `[serve]` 區段
- CLI 支援本機 REST 轉錄。`serve` 的 WebSocket 串流路由與線上 ASR 整合仍需要桌面執行階段；獨立本機串流請使用 `transcribe-live`。

### `transcribe`

使用離線 ASR 轉接器轉錄一個本機音訊或視訊檔案。

```bash
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
sona-cli transcribe ./sample.wav --config ./sona-cli.toml --output ./out.srt
sona-cli transcribe ./sample.wav --format txt --quiet
```

- 省略 `--output` 時，預設輸出至 `stdout`
- 支援匯出格式：`json`、`txt`、`srt`、`vtt`、`md`
- `--config` 讀取 `init-config` 產生且帶有註解的 `sona-cli.toml` 範本
- `--force` 允許覆寫既有輸出檔案

### `transcribe-live`

使用已安裝的本機串流模型，即時轉錄麥克風或 stdin 原始音訊。

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

- 此指令只支援本機離線 ASR。選定的預設模型必須宣告 `streaming` 模式，並安裝於解析後的模型目錄。
- 麥克風輸入預設使用 CPAL 的預設輸入裝置；`--device` 必須提供 `--list-input-devices` 回傳的完整名稱。
- `--input stdin` 接受無標頭的 16 kHz、單聲道、signed 16-bit little-endian PCM。最後一個不完整的 sample 會視為輸入錯誤。
- TTY 文字輸出會原地更新目前的轉錄；重新導向的文字輸出會在 flush 後只寫入一次最終快照。
- `--output-format ndjson` 每行輸出一個 JSON 物件，並在每個事件後 flush。事件類型為 `started`、`update`、`stopped`，以及只在執行階段錯誤時使用的 `error`；轉錄欄位使用 camelCase。
- Ctrl+C、stdin EOF 和 `--duration` 使用相同的正常結束流程：排空擷取音訊、flush 並停止 ASR、視需要寫入最終檔案、輸出 `stopped`，然後以 0 結束。
- `--output` 可將最終快照寫成 `json`、`txt`、`srt`、`vtt` 或 `md`。除非提供 `--format`，否則由副檔名選擇格式；覆寫既有檔案需要 `--force`。
- `--config` 讀取 `sona-cli.toml` 的 `[transcribe_live]`。命令列值會覆寫該區段，而該區段會繼承共用的頂層 ASR 預設值。最終輸出路徑、匯出格式與覆寫行為仍只能透過命令列設定。
- 驗證錯誤以狀態碼 2 結束，模型錯誤為 3，輸入/裝置錯誤為 5。執行階段 NDJSON 錯誤也會先寫入一個 `error` 事件，再以非零狀態碼結束。

## 全域旗標

```text
sona-cli
  -V, --version
  -h, --help
```

執行 `sona-cli <command> --help` 查看各指令的用法。
