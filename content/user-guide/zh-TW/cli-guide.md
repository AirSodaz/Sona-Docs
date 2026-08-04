`sona-cli` 是 Sona 的無狀態命令列轉寫 Host。它不會開啟或管理 Sona 的 SQLite 應用程式資料庫、History/Tag 工作區、同步狀態或 Online LLM 工作。轉寫結果只會寫入 `stdout`，或寫入命令明確指定的輸出檔案。

目前獨立 CLI 提供以下命令：

- `path-status`
- `init-config`
- `models list|download|delete`
- `diagnostics`
- `export transcript`
- `serve`（使用本機 ASR 的本機 REST 轉寫）
- `transcribe`（本機或線上批次 ASR）
- `transcribe-live`（本機或線上串流 ASR）

## 執行方式

- 打包版本：使用同平台安裝程式產物中附帶的 `sona-cli` 執行檔。
- 原始碼版本：`cargo run -p sona-cli -- <command> ...`

範例：

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

## 無狀態邊界

CLI 有意排除 SQLite、History、Tag、應用程式備份/還原、Sync 和 Online LLM。它不會建立或修改桌面應用程式資料目錄。請使用 `export transcript` 以及 `stdout`/檔案輸出，把 CLI 與其他工具組合使用。

## 命令

### `path-status`

透過共享執行期狀態契約解析一個檔案系統路徑，並將 JSON 輸出至 `stdout`。

```bash
sona-cli path-status ./models
```

### `init-config`

產生帶有註解的本機轉寫與本機 API server TOML 設定範本。

```bash
sona-cli init-config
sona-cli init-config ./sona-cli.toml --force
```

現有檔案預設不會被覆寫，只有傳入 `--force` 才會取代；狀態文字會寫入 `stderr`。

### `models`

列出、下載或刪除本機 ASR 預設模型。這些命令只操作選取的模型目錄，不操作 SQLite 應用程式狀態。

```bash
sona-cli models list --mode offline --type whisper
sona-cli models list --language zh --installed --json
sona-cli models download sherpa-onnx-whisper-turbo
sona-cli models delete sherpa-onnx-whisper-turbo --yes
```

### `diagnostics`

根據 Host 提供的資訊建立 diagnostics 快照，不會讀取應用程式資料庫。

### `export transcript`

透過共享 Core export service 匯出 transcript segment JSON 陣列。

```bash
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.srt --mode bilingual
```

未提供 `--format` 時會從輸出副檔名推斷格式。支援 `json`、`txt`、`srt`、`vtt`、`md`；模式支援 `original`、`translation`、`bilingual`。

### `transcribe`

轉寫一個本機音訊檔；使用本機 ASR 時也可輸入視訊。不提供 `--online-provider` 時，命令會使用已安裝的本機 Sherpa 預設模型。

```bash
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
sona-cli transcribe ./sample.wav --config ./sona-cli.toml --output ./out.srt
```

提供 `--online-provider` 後，CLI 會將本機檔案上傳至指定供應商，並把結果輸出至 `stdout` 或目標檔案：

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

線上批次轉寫支援 `volcengine-doubao`、`groq-whisper` 和 `mistral-voxtral`。

| Provider | 預設環境變數 |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

使用 `--api-key-env NAME` 指定其他環境變數。`--online-config FILE` 接受用於覆寫 endpoint/model 等非敏感設定的 JSON 物件；其中不得包含 `apiKey` 或 `api_key`。

選擇線上 provider 後，`--model-id`、`--models-dir`、VAD/標點選項、執行緒數、GPU 模式和 `--save-wav` 等本機參數會被拒絕。取代現有輸出檔案必須使用 `--force`。

### `transcribe-live`

即時轉寫麥克風，或從 `stdin` 讀取無標頭的 16 kHz、單聲道、signed 16-bit little-endian PCM。

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

線上串流目前只支援 `volcengine-doubao`：

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli transcribe-live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

麥克風預設使用 CPAL 輸入裝置；`--device` 必須與 `--list-input-devices` 傳回的完整名稱相符。`--output-format` 支援 `text` 和 `ndjson`；`--output` 可寫入最終的 `json`、`txt`、`srt`、`vtt` 或 `md` 快照；`--format` 必須同時提供 `--output`。Ctrl+C、`stdin` EOF 和 `--duration` 都會先 flush/stop 工作階段再結束。

線上憑證與非敏感設定規則和 `transcribe` 相同。線上串流使用本機模型或執行期參數會被拒絕。

### `serve`

啟動共享的本機 HTTP API server。CLI server 僅提供本機 ASR：它不會公開 Online ASR 或 WebSocket 串流轉寫。Online ASR 請直接使用 `transcribe` 或 `transcribe-live`。

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

## 輸出與錯誤

`transcribe` 預設將 JSON 寫入 `stdout`。`transcribe-live` 輸出即時文字或 NDJSON 事件，並可選擇寫入最終檔案。參數驗證錯誤的結束碼為 2，模型錯誤為 3，網路/provider 錯誤為 4，檔案系統/輸入錯誤為 5。

可透過 `sona-cli <command> --help` 查看命令參數。
