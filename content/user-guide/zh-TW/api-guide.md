Sona 提供了隱私優先的本機 HTTP API 服務，適用於外部 Headless 整合。自動化指令碼、批次處理工具、Web 前端或第三方應用程式均可透過 REST 端點與 WebSocket 即時串流辨識，在本機安全控制語音轉文字工作流程。

## 設定與服務啟動

API 服務可以透過以下兩種方式啟動：

### GUI 用戶端設定

進入 `設定 > API 服務` 並進行設定：

- `啟用 API 服務`：切換服務開關。
- `監聽位址`：繫結 IP 位址。使用 `127.0.0.1` 僅限本機存取，或使用 `0.0.0.0` 允許區域網路裝置存取。
- `連接埠`：伺服器監聽 TCP 連接埠，預設是 `14200`。
- `API Key`：用於保護介面的 Bearer Token。點擊 `產生` 建立高強度金鑰，點擊 `複製` 寫入剪貼簿。

### 獨立 CLI 模式

也可以直接在終端機中使用獨立 `sona-cli` 啟動相同的服務：

```bash
sona-cli serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

CLI 服務（`sona-cli serve`）支援使用已安裝本機離線模型的 REST 轉寫與原生 WebSocket 即時串流辨識（`/v1/streaming`）。`serve` 路由不暴露雲端 Online ASR；如需直接使用雲端模型，請使用 `sona-cli transcribe` 或 `sona-cli transcribe-live` 進行批次或串流轉錄。

完整的 `serve` 命令參數說明請參閱 [CLI 指南](guide:cli-guide)。

## 身分認證

設定 `API Key` 後，每個 HTTP 請求都必須在 `Authorization` 請求標頭中攜帶 Bearer Token：

```http
Authorization: Bearer your_secure_key
```

未設定 API Key 時，服務允許匿名免認證請求。對於 HTML5 媒體串流或 WebSocket 等難以自訂 Header 的情境，支援透過 `token` 或 `api_key` Query 參數傳遞。

## 介面參考

### 1. 服務資訊與能力

查詢服務平台資訊、硬體加速狀態、已安裝模型清單與已設定的雲端 ASR Provider。

- URL：`/info`
- 請求方法：`GET`

#### 回應範例 (`200 OK`)

```json
{
  "platform": "win32",
  "gpuAvailable": true,
  "models": [
    {
      "id": "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17",
      "name": "SenseVoice (Int8)",
      "languages": ["en", "ja", "ko", "yue", "zh"],
      "languageMode": "auto"
    }
  ],
  "vadInstalled": true,
  "punctuationInstalled": true,
  "onlineAsrProviders": [
    {
      "id": "volcengine-doubao",
      "configured": true,
      "supportsBatch": true,
      "supportsStreaming": true
    }
  ]
}
```

### 2. 服務健康狀態與指標

查詢服務執行時間、正在處理與排隊中的任務數、暫存儲存佔用。

- URL：`/health`
- 請求方法：`GET`

#### 回應範例 (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

### 3. 查詢所有任務

查詢目前任務管理器中所有轉錄任務的狀態清單。

- URL：`/v1/transcriptions`（或 `/v1/transcriptions/jobs`）
- 請求方法：`GET`

#### Query 參數

| 參數 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `limit` | 整數 | 否 | `50` | 返回任務最大數量 |
| `offset` | 整數 | 否 | `0` | 分頁偏移量 |

#### 回應範例 (`200 OK`)

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

### 4. 提交轉錄任務

上傳音訊檔案並建立轉錄排隊任務。

- URL：`/v1/transcriptions`
- 請求方法：`POST`
- Content-Type：`multipart/form-data`

#### 請求參數

| 欄位 | 類型 | 必填 | 說明 |
| --- | --- | --- | --- |
| `file` | 二進位 | 是 | 待轉錄音訊檔案（支援 `wav`、`mp3`、`flac`、`ogg`、`m4a`、`aac`）。 |
| `model_id` | 字串 | 否 | 呼叫的模型 ID，預設使用第一個可用本機離線模型。 |
| `language` | 字串 | 否 | 目標語種代碼（如 `zh`、`en`、`auto`）。 |
| `hotwords` | 字串 | 否 | 逗號分隔的熱詞/專有名詞清單，用於辨識增強。 |
| `online_provider` | 字串 | 否 | 已設定的雲端 Provider ID（如 `volcengine-doubao`）。 |
| `webhook_url` | 字串 | 否 | 任務完成或失敗時接收 HTTP POST 回呼的 URL。 |
| `webhook_secret` | 字串 | 否 | 用於 Webhook 簽名的 HMAC-SHA256 金鑰。 |

#### 回應範例 (`200 OK`)

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

#### Curl 範例

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

### 5. 查詢任務狀態與結果

根據任務 ID 查詢轉錄生命週期狀態及轉錄文字分段。

- URL：`/v1/transcriptions/:job_id`
- 請求方法：`GET`

#### 回應資料結構

根據任務目前進度，介面返回以下模式之一：

##### 排隊中 (Pending)
```json
"Pending"
```

##### 處理中 (Processing)
```json
"Processing"
```

##### 已完成 (Completed)
```json
{
  "Completed": [
    {
      "id": 0,
      "start": 120,
      "end": 2840,
      "text": "您好，歡迎使用 Sona。",
      "speaker": "Speaker 0"
    },
    {
      "id": 1,
      "start": 3100,
      "end": 5600,
      "text": "語音轉錄全程在您的本機裝置上離線完成。",
      "speaker": "Speaker 1"
    }
  ]
}
```

##### 失敗 (Failed)
```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

#### Curl 範例

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 6. 刪除 / 取消任務

取消正在進行的轉錄任務，或刪除已完成/失敗的任務記錄及其快取的音訊檔案。

- URL：`/v1/transcriptions/:job_id`
- 請求方法：`DELETE`

#### 回應 (`204 No Content`)

任務記錄與暫存音訊檔案將被立即清除，正在執行的處理執行緒將安全中止。

```bash
curl -X DELETE http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 7. 取得任務音訊檔案

串流播放或下載與任務關聯的原始音訊檔案。支援 HTTP Range 標頭以實現媒體播放器的跳轉回放。

- URL：`/v1/transcriptions/:job_id/audio`
- 請求方法：`GET`

#### Query 參數

| 參數 | 類型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `token` | 字串 | 否 | 適用於 HTML5 `<audio>` / `<video>` 標籤的免 Header 鑑權憑證。 |

#### 回應 (`200 OK` 或 `206 Partial Content`)

返回二進位音訊串流並攜帶對應的 `Content-Type`（如 `audio/wav`、`audio/mpeg`）。

### 8. 匯出任務字幕檔案

將已完成的轉錄結果直接格式化匯出為字幕或文字檔案。

- URL：`/v1/transcriptions/:job_id/export`
- 請求方法：`GET`

#### Query 參數

| 參數 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `format` | 字串 | 否 | `srt` | 匯出格式：`srt`、`vtt`、`json`、`txt`、`md`。 |
| `mode` | 字串 | 否 | `original` | 文字模式：`original`（原始文字）、`translation`（譯文）或 `bilingual`（雙語對照）。 |

#### 回應 (`200 OK`)

回應標頭包含 `Content-Disposition: attachment; filename="{job_id}.{format}"` 及對應的 MIME 類型。

### 9. LLM 分段文字潤飾

使用桌面端設定的 LLM 服務對語音辨識分段進行文字去冗、校對與結構規整。

- URL：`/v1/llm/polish`
- 請求方法：`POST`
- Content-Type：`application/json`

#### 請求本文範例

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "呃那個您好世界",
      "isFinal": true
    }
  ]
}
```

#### 回應範例 (`200 OK`)

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "您好，世界。",
      "isFinal": true
    }
  ]
}
```

### 10. LLM 分段文字翻譯

使用桌面端設定的 LLM 服務將轉錄分段翻譯為目標語言。

- URL：`/v1/llm/translate`
- 請求方法：`POST`
- Content-Type：`application/json`

#### 請求本文範例

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "Hello, world.",
      "isFinal": true
    }
  ],
  "target_language": "zh"
}
```

#### 回應範例 (`200 OK`)

返回包含填充後 `translation` 欄位的分段清單。

### 11. WebSocket 即時音訊串流辨識

透過 WebSocket 協定即時傳輸音訊二進位分片，實現極低延遲的語音出字。

- URL：`/v1/streaming`（或 `ws://127.0.0.1:14200/v1/streaming?token=your_secure_key`）
- 通訊協定：`WebSocket`

#### 握手認證

在連線握手階段，透過 Query 參數（`?token=...` 或 `?api_key=...`）或標準 `Authorization: Bearer <key>` Header 傳遞金鑰。

#### 協定互動流程

1. **用戶端 -> 伺服端 (文字 JSON)**：初始化工作階段
   ```json
   {
     "type": "start",
     "model_id": "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17",
     "language": "auto",
     "hotwords": null,
     "vad_model_id": "silero-vad"
   }
   ```
2. **伺服端 -> 用戶端 (文字 JSON)**：工作階段已就緒
   ```json
   {
     "type": "started",
     "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
   }
   ```
3. **用戶端 -> 伺服端 (二進位 Binary)**：推送原始 PCM 音訊分片
   - 音訊格式：16 kHz 取樣率、單聲道、16-bit 有符號小端整數（`pcm_s16le`）。
4. **伺服端 -> 用戶端 (文字 JSON)**：增量輸出辨識片段
   ```json
   {
     "type": "segment",
     "segment": {
       "id": "seg-1",
       "text": "您好世界",
       "start": 0.0,
       "end": 1.8,
       "isFinal": false
     }
   }
   ```
5. **用戶端 -> 伺服端 (文字 JSON)**：結束工作階段
   ```json
   {
     "type": "stop"
   }
   ```

## Webhooks 與簽名校驗

如果在提交任務時設定了 `webhook_url`，Sona 會在任務成功完成或失敗時向該位址發起 HTTP POST 回呼。

### Webhook 簽名 (`X-Sona-Signature`)

為防止偽造回呼，可在提交任務時指定 `webhook_secret`。Sona 會使用該金鑰計算原始 JSON 負載的 HMAC-SHA256 簽名，並透過請求標頭下發：

- 請求標頭名稱：`X-Sona-Signature`
- 格式：`sha256=<hex_encoded_signature>`

### 校驗演算法（Node.js 範例）

```javascript
const crypto = require('crypto');

function verifySignature(payloadString, secret, receivedSignatureHeader) {
  const [algorithm, signature] = receivedSignatureHeader.split('=');
  if (algorithm !== 'sha256') return false;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}
```
