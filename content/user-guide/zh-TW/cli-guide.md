`sona` 透過桌面主程式提供離線轉錄指令。安裝包不會將 `sona` 寫入 shell `PATH`，因此需要直接執行已安裝的應用程式二進位檔案並附帶 CLI 子指令。從原始碼建構時，也可以使用 Cargo 執行同一組指令。

CLI 範圍刻意保持精簡：單一檔案離線轉錄、預設模型清單/下載、無外介面 (headless) HTTP API 服務啟動。它不包含即時錄音、LLM 潤飾或 LLM 翻譯。

## 執行方式

- Windows：在安裝目錄執行 `Sona.exe transcribe ...`
- macOS：執行 `/Applications/Sona.app/Contents/MacOS/Sona transcribe ...`
- Linux 安裝包：從安裝位置執行 `Sona` 主程式並附帶 CLI 子指令
- AppImage：執行掛載後的 AppImage 執行檔並附帶 CLI 子指令
- 原始碼：`cargo run --manifest-path src-tauri/Cargo.toml -- transcribe ./sample.mp4 --config ./sona-cli.toml`

## 常用指令

### 轉錄檔案

```bash
sona transcribe ./sample.mp4 \
  --config ./sona-cli.toml \
  --output ./sample.srt
```

未指定 `--output` 時，轉錄結果會以 JSON 格式寫入 `stdout`。指定 `--output` 時，格式會從副檔名推斷，除非同時傳入 `--format`。

### 列出或下載模型

```bash
sona models list --mode offline --type whisper
sona models list --language zh --installed
sona models download sherpa-onnx-whisper-turbo
```

當選取的預設模型需要伴生模型時，`models download` 會自動下載所需模型，例如 `silero-vad` 或預設標點模型。

### 啟動 API 服務

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

HTTP API 端點和請求範例請參閱 [HTTP API 指南](guide:api-guide)。

## 設定檔

透過 `--config` 傳入 TOML 檔案。命令列參數會覆寫設定檔中的值。

最小 `transcribe` 範例：

```toml
models_dir = "C:/Users/you/AppData/Local/com.asoda.sona/models"
model_id = "sherpa-onnx-whisper-turbo"
vad_model_id = "silero-vad"
language = "auto"
threads = 4
enable_itn = false
vad_buffer_size = 5.0
gpu_acceleration = "auto"
format = "srt"
```

### `transcribe` 設定鍵

| 參數 / 設定鍵 | 必要性 | 取值範圍 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| `models_dir` | 可選 | 檔案系統路徑 | 可推斷時使用桌面應用程式模型目錄 | CLI 找不到桌面模型目錄時請顯式傳入。 |
| `model_id` | 必要，除非傳入 `--model-id` | 離線預設模型 ID | 無 | 使用 `sona models list --mode offline` 查看可用 ID。 |
| `vad_model_id` | 條件必要 | 預設模型 ID | 無 | 選取的模型需要 VAD 時必要。 |
| `punctuation_model_id` | 條件必要 | 預設模型 ID | 無 | 選取的模型需要標點時必要。 |
| `language` | 可選 | `auto` 或模型語言代碼，如 `zh`、`en`、`ja` | `auto` | 覆寫自動語言偵測。 |
| `threads` | 可選 | 大於 `0` 的整數 | `4` | 識別執行緒數。 |
| `enable_itn` | 可选 | `true` 或 `false` | `false` | 啟用逆文字正規化。 |
| `vad_buffer_size` | 可選 | 大於 `0` 的數字 | `5.0` | VAD 緩衝秒數。 |
| `gpu_acceleration` | 可選 | `auto`、`cpu`、`cuda`、`coreml`、`directml` | `auto` | 使用 `cpu` 可顯式關閉 GPU 加速。 |
| `format` | 可選 | `json`、`txt`、`srt`、`vtt`、`md` | 寫入 stdout 時為 `json`，否則從 `--output` 推斷 | 覆寫輸出副檔名推斷。 |

### `serve` 設定鍵

| 參數 / 設定鍵 | 必要性 | 取值範圍 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| `host` | 可選 | 監聽地址 | `0.0.0.0` | 本機存取可用 `127.0.0.1`。 |
| `port` | 可選 | TCP 連接埠 `0` 到 `65535` | `14200` | API 服務連接埠。 |
| `api_key` | 可選 | 字串 | 空 | 為空時請求不需要 Bearer 認證。 |
| `models_dir` | 可選 | 檔案系統路徑 | 可推斷時使用桌面應用程式模型目錄 | 用於解析已安裝模型。 |
| `ip_whitelist` | 可選 | 逗號分隔規則 | `localhost` | 支援 `localhost`、精確 IP、CIDR、`*`，以及 `192.168.*` 這類 IPv4 萬用字元。 |
| `max_streaming` | 可選 | 非負整數 | `2` | 最大並行串流 WebSocket 連線數。 |
| `max_concurrent` | 可選 | 非負整數 | `2` | 最大並行批次任務數。 |
| `max_queue_size` | 可選 | 非負整數 | `100` | `0` 表示佇列基本不限。 |
| `max_upload_size_mb` | 可選 | 非負整數 | `50` | `0` 表示關閉上傳大小限制。 |
| `job_ttl_minutes` | 可選 | 非負整數 | `60` | `0` 表示關閉完成/失敗任務清理。 |
| `gpu_acceleration` | 可選 | `auto`、`cpu`、`cuda`、`coreml`、`directml` | `auto` | 本地批次和串流任務的服務級預設值。 |
| `vad_model_id` | 可選 | 預設模型 ID | `silero-vad` | API 服務任務的預設 VAD 伴生模型。 |
| `punctuation_model_id` | 可选 | 預設模型 ID | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | API 服務任務的預設標點伴生模型。 |

## 參數

### 全局

```text
sona
  -V, --version
  -v, --verbose
  -h, --help
  help
```

使用 `-V` 或 `--version` 印出 Sona 版本號。將 `-v` 或 `--verbose` 放在子指令前可啟用詳細診斷日誌。使用 `-h`、`--help` 或 `help` 印出指令說明：

```bash
sona --version
sona -V
sona -v models list
sona --verbose transcribe ./sample.mp4 --config ./sona-cli.toml
sona transcribe --help
```

詳細診斷日誌會寫入 `stderr`。指令結果仍會寫入 `stdout`，包括 `models list` 的 JSON 輸出，以及 `transcribe` 未指定 `--output` 時的輸出，因此仍可安全地透過管線 (pipe) 傳送給其他工具。

### `transcribe`

| 參數 / 設定鍵 | 必要性 | 取值範圍 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| `<input>` | 必要 | 本地音訊或影片檔案路徑 | 無 | 要轉錄的檔案。 |
| `--config <path>` | 可選 | TOML 檔案路徑 | 無 | 從設定檔載入預設值。 |
| `--output <path>` | 可選 | 檔案系統路徑 | `stdout` | 輸出檔案路徑。 |
| `--format <format>` | 可選 | `json`、`txt`、`srt`、`vtt`、`md` | 寫入 stdout 時為 `json`，否則從 `--output` 推斷 | 覆寫設定與輸出副檔名推斷。 |
| `--language <code>` | 可選 | `auto` 或模型語言代碼 | `auto` | 覆寫設定。 |
| `--model-id <id>` | 必要，除非設定了 `model_id` | 離線預設模型 ID | 無 | 主轉錄模型。 |
| `--models-dir <path>` | 可選 | 檔案系統路徑 | 可推斷時使用桌面應用程式模型目錄 | 覆寫設定。 |
| `--vad-model-id <id>` | 條件必要 | 預設模型 ID | 無 | 選取的模型需要 VAD 時必要。 |
| `--punctuation-model-id <id>` | 條件必要 | 預設模型 ID | 無 | 選取的模型需要標點時必要。 |
| `--threads <n>` | 可選 | 大於 `0` 的整數 | `4` | 覆寫設定。 |
| `--enable-itn` | 可選 | 旗標 | `false` | 與 `--disable-itn` 互斥。 |
| `--disable-itn` | 可選 | 旗標 | `false` | 覆寫 `enable_itn = true`；與 `--enable-itn` 互斥。 |
| `--hotwords <words>` | 可選 | 逗號分隔詞組 | 無 | 僅限 CLI 參數；目前支援 Transducer 和 Qwen3 模型。 |
| `--gpu-acceleration <provider>` | 可選 | `auto`、`cpu`、`cuda`、`coreml`、`directml` | `auto` | 覆寫設定。 |
| `--vad-buffer <seconds>` | 可選 | 大於 `0` 的數字 | `5.0` | `vad_buffer_size` 的 CLI 參數名稱。 |
| `--save-wav <path>` | 可選 | 檔案系統路徑 | 無 | 僅限 CLI 參數；儲存中間重取樣 WAV。 |
| `--quiet` | 可選 | 旗標 | 關閉 | 僅限 CLI 參數；隱藏轉錄進度。 |

### `models list`

| 參數 / 設定鍵 | 必要性 | 取值範圍 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| `--models-dir <path>` | 可選 | 檔案系統路徑 | 可推斷時使用桌面應用程式模型目錄 | 用於偵測已安裝預設模型。 |
| `--mode <mode>` | 可選 | `streaming`、`offline` | 所有模式 | 依支援模式過濾。 |
| `--type <type>` | 可選 | 預設模型類型，如 `whisper`、`vad`、`punctuation` | 所有類型 | 依模型類型過濾。 |
| `--language <code>` | 可選 | 語言代碼，如 `zh`、`en`、`ja`、`yue` | 所有語言 | 依支援的語言代碼過濾。 |
| `--installed` | 可選 | 旗標 | 關閉 | 只顯示 `models_dir` 中已存在的模型。 |
| 輸出 | 總是 | JSON | JSON | 寫入 `stdout`。 |

### `models download`

| 參數 / 設定鍵 | 必要性 | 取值範圍 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| `<model_id>` | 必要 | 已知預設模型 ID | 無 | 要下載的主模型。 |
| `--models-dir <path>` | 可選 | 檔案系統路徑 | 可推斷時使用桌面應用程式模型目錄 | 目標模型目錄。 |
| `--quiet` | 可選 | 旗標 | 關閉 | 隱藏個別下載進度。 |
| 伴生模型下載 | 自動 | 所需 VAD 和標點預設模型 | 自動 | 下載主模型時會同時下載必要伴生模型。 |

### `serve`

| 參數 / 設定鍵 | 必要性 | 取值範圍 | 預設值 | 說明 |
| --- | --- | --- | --- | --- |
| `--config <path>` | 可選 | TOML 檔案路徑 | 無 | 從設定檔載入預設值。 |
| `--host <ip>` | 可選 | 監聽地址 | `0.0.0.0` | 覆寫設定。 |
| `--port <port>` | 可選 | TCP 連接埠 `0` 到 `65535` | `14200` | 覆寫設定。 |
| `--api-key <key>` | 可選 | 字串 | 空 | 為空時不啟用 Bearer 認證。 |
| `--models-dir <path>` | 可選 | 檔案系統路徑 | 可推斷時使用桌面應用程式模型目錄 | 覆寫設定。 |
| `--ip-whitelist <rules>` | 可選 | 逗號分隔規則 | `localhost` | 支援 `localhost`、精確 IP、CIDR、`*`，以及 `192.168.*` 這類 IPv4 萬用字元。 |
| `--max-streaming <n>` | 可選 | 非負整數 | `2` | 最大並行串流連線數。 |
| `--max-concurrent <n>` | 可選 | 非負整數 | `2` | 最大並行批次任務數。 |
| `--max-queue-size <n>` | 可选 | 非負整數 | `100` | `0` 表示佇列基本不限。 |
| `--max-upload-size-mb <n>` | 可選 | 非負整數 | `50` | `0` 表示關閉上傳大小限制。 |
| `--job-ttl-minutes <n>` | 可選 | 非負整數 | `60` | `0` 表示關閉完成/失敗任務清理。 |
| `--gpu-acceleration <provider>` | 可選 | `auto`、`cpu`、`cuda`、`coreml`、`directml` | `auto` | HTTP API 請求不支援依個別請求覆寫 GPU 設定。 |
| `--vad-model-id <id>` | 可選 | 預設模型 ID | `silero-vad` | API 服務任務的預設 VAD 伴生模型。 |
| `--punctuation-model-id <id>` | 可選 | 預設模型 ID | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | API 服務任務的預設標點伴生模型。 |

執行 `sona <command> --help` 可查看 clap 產生的完整說明文字。

如果您要回到一般桌面端流程，可以繼續參閱 [快速開始](guide:getting-started) 或 [批次轉錄](guide:batch-import)。
