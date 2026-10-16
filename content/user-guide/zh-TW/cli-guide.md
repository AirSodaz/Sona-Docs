`sona-cli` 是 Sona 基於 `sona-core` 建構的獨立、無狀態命令列語音辨識 Host。它支援透過本機預設 ASR 模型或雲端線上 Provider 轉錄音訊檔案、目錄、麥克風即時音訊輸入與標準輸入流。它不會打開或管理 Sona 的 SQLite 應用程式資料庫、專案資料庫、歷史儲存、同步狀態或 Online LLM 任務。轉錄結果只輸出到 `stdout` 或指定目標檔案。

獨立 CLI 提供以下核心命令：

- `live`（兼任別名 `transcribe-live`）：麥克風或標準輸入的即時串流語音辨識
- `transcribe`：基於本機或雲端模型的音訊/影片檔案及目錄批次轉錄
- `models`：列出、下載、查詢、校驗、搜尋與刪除預設 ASR 模型
- `export`：將轉錄分段 JSON 轉換為 SRT、VTT、TXT、MD 等格式（支援相容別名 `export transcript`）
- `config`：檢視與管理 TOML 設定檔（`init`、`check`、`show`、`get`、`set`、`unset`、`edit`、`path`）
- `doctor`：執行主機環境診斷，檢測硬體加速（CUDA、Metal、AVX2、NEON）與路徑健康
- `devices`：列出目前系統可用的音訊輸入與輸出裝置
- `providers`：檢視已設定的雲端線上 ASR Provider 及其能力狀態
- `update`：檢查並透過 Minisign 簽名校驗安全安裝更新
- `completion`：產生 Shell 自動補齐指令碼（bash、zsh、fish、powershell、elvish）
- `serve`：啟動本機 HTTP API 服務與 WebSocket 即時串流辨識（`/v1/streaming`）
- `diagnostics`：建構主機診斷快照契約

## 執行方式

- 打包版本：使用同平台安裝套件產物中隨附的 `sona-cli` 執行檔。
- 原始碼版本：`cargo run -p sona-cli -- <command> ...`

範例：

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

## 無狀態邊界

CLI 有意排除 SQLite、History、Tag、應用程式備份/還原、Sync 和 Online LLM。它不會建立或靜默修改桌面應用程式資料目錄。輸出將列印到 `stdout` 或寫入明確指定的檔案。請使用 `export`（或 `export transcript`）以及 `stdout`/檔案輸出，把 CLI 與其他工具組合使用。

## 設定優先順序

設定項按以下優先順序由高至低解析：

1. 明確命令列參數：`-c / --config <PATH>`
2. 全域環境變數：`SONA_CONFIG`
3. 目前工作目錄下的設定檔：`./sona-cli.toml`
4. 使用者標準設定目錄下的設定檔：`sona-cli.toml`（Linux：`~/.config/sona/sona-cli.toml`，macOS：`~/Library/Application Support/sona/sona-cli.toml`，Windows：`%APPDATA%\sona\sona-cli.toml` 或 `%USERPROFILE%\.config\sona\sona-cli.toml`）
5. 內建預設值：若未找到上述檔案，以安全內建預設值執行

## 命令

### `config`

檢查與管理 Sona CLI 設定檔：

- `sona-cli config init`：產生帶註解的設定範本（使用 `-F/--force` 覆寫已有檔案）
- `sona-cli config check`：校驗設定檔的語法與區段
- `sona-cli config show`：顯示目前合併後的生效設定
- `sona-cli config get <KEY>`：讀取指定設定項值
- `sona-cli config set <KEY> <VALUE> [--global]`：在本機或全域持久化設定項
- `sona-cli config unset <KEY> [--global]`：移除指定設定項
- `sona-cli config edit`：在系統預設文字編輯器中打開設定檔
- `sona-cli config path`：列印解析到的設定檔絕對路徑

```bash
sona-cli config init
sona-cli config check
sona-cli config set transcribe.model_id whisper-turbo
sona-cli config get transcribe.model_id
```

### `models`

管理所選模型目錄下的本機預設 ASR 模型：

- `sona-cli models list`：列出可用預設模型（支援 `--mode live|batch`、`--installed`、`--json`）
- `sona-cli models download <MODEL>`（別名 `install`）：下載模型並校驗雜湊
- `sona-cli models delete <MODEL>`（別名 `rm`）：刪除下載的模型檔案（使用 `-F/--force` 略過確認）
- `sona-cli models info <MODEL>`（別名 `show`）：檢視模型技術規格與隨附組件
- `sona-cli models search <QUERY>`：按關鍵字或語言搜尋模型
- `sona-cli models verify <MODEL>`：校驗已安裝模型檔案的完整性與雜湊
- `sona-cli models path`：列印目前生效的模型根目錄路徑

```bash
sona-cli models list --mode batch
sona-cli models search chinese
sona-cli models download whisper-turbo
sona-cli models verify whisper-turbo
sona-cli models delete whisper-turbo --force
```

### `transcribe`

使用本機預設 ASR 模型或雲端線上 Provider 轉錄音訊或影片檔案。未指定 `--online-provider` 時使用本機 Sherpa 預設：

```bash
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo -o ./transcript.srt
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
```

指定 `--online-provider` 時，CLI 將音訊上傳到指定的雲端服務並輸出辨識結果：

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

支援的批次 Provider 包括 `volcengine-doubao`、`groq-whisper` 和 `mistral-voxtral`：

| Provider | 預設環境變數 |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

使用 `--api-key-env NAME` 可指定自訂環境變數。`--online-config FILE` 接受非敏感參數覆寫的 JSON 檔案，且不可包含 `apiKey` 或 `api_key`。

選擇線上 Provider 時，本機專用選項（如 `--model-id`、`--models-dir`、VAD/標點參數、執行緒數、GPU 模式與 `--save-wav`）會被明確拒絕。覆寫已有檔案需傳 `--force`。

### `transcribe-live`

`sona-cli live`（相容別名 `sona-cli transcribe-live`）執行麥克風或標準輸入（`--input stdin`）的即時串流語音辨識。

```bash
sona-cli live -m sensevoice
sona-cli live --device "Studio Mic" --duration 60 --output ./live.srt

ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin -m sensevoice --output-format ndjson
```

線上串流辨識目前支援 `volcengine-doubao`：

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

麥克風輸入預設使用 CPAL 預設錄音裝置，除非透過 `--device` 傳入精確裝置名（可執行 `sona-cli devices` 查詢）。`--output-format` 支援 `text` 與 `ndjson`；`--output` 可在結束時寫入 `json`、`txt`、`srt`、`vtt` 或 `md` 檔案。Ctrl+C、`stdin` EOF 或 `--duration` 倒數均會重新整理並安全終止工作階段後退出。

與 `transcribe` 相同的憑證與設定規則同樣適用於線上串流辨識。

### `export transcript`

將轉錄分段匯出為格式化字幕或純文字。推薦命令為扁平化語法的 `sona-cli export <INPUT> [OUTPUT]`，同時完全支援相容別名 `sona-cli export transcript` 與 `sona-cli convert`：

```bash
sona-cli export ./segments.json ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export ./segments.json ./transcript.srt --mode bilingual
```

輸出格式根據副檔名自動推斷，也可透過 `--format <srt|vtt|txt|json|tsv|csv|md>` 指定。支援模式為 `original`、`translation` 與 `bilingual`。

### `doctor`

對本機執行環境進行自動健康檢查，檢測主機平台、CPU 架構、SIMD 指令集（AVX2、NEON）、GPU/CUDA 加速、音訊裝置、已安裝模型完整性與目錄寫入權限：

```bash
sona-cli doctor
sona-cli doctor --strict
sona-cli doctor --json
```

### `devices`

列舉主機系統目前偵測到的音訊輸入與輸出裝置：

```bash
sona-cli devices
sona-cli devices --json
```

### `providers`

檢視已設定的雲端線上 ASR Provider 及其連線與能力狀態：

```bash
sona-cli providers
sona-cli providers --json
```

### `update`

檢查並安全安裝 CLI 與桌面端二進位更新，內建 Minisign 密碼學簽名校驗：

```bash
sona-cli update check
sona-cli update apply
```

### `completion`

為常用 Shell 產生自動補全指令碼：

```bash
sona-cli completion bash > /etc/bash_completion.d/sona-cli
sona-cli completion zsh > ~/.zfunc/_sona-cli
sona-cli completion fish > ~/.config/fish/completions/sona-cli.fish
sona-cli completion powershell | Out-File -Append -Encoding utf8 $PROFILE
```

### `diagnostics`

建構不存取應用程式資料庫的結構化主機診斷快照 JSON 物件，便於技術支援與疑難排解：

```bash
sona-cli diagnostics
```

### `serve`

啟動共用的本機 HTTP API 服務。支援本機 REST 轉寫與 WebSocket 即時串流辨識（`/v1/streaming`）：

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

完整的 REST 和 WebSocket 端點規格請參閱 [HTTP API 指南](guide:api-guide)。

## 結束狀態碼與錯誤

- `0`：成功
- `1`：常規故障（如 `doctor --strict` 檢查未通過、序列化錯誤）
- `2`：參數校驗或用法錯誤（無效參數、缺少 Provider、輸入檔案不存在）
- `3`：模型錯誤（預設缺失、下載損壞、缺少隨附檔案）
- `4`：網路或線上 Provider 錯誤（認證失敗、API 逾時）
- `5`：檔案系統錯誤（未加 `--force` 時目標檔案已存在、目錄寫入失敗）
- `130`：已取消（收到 Ctrl+C 訊號）
