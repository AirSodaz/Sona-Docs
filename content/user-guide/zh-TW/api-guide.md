Sona 提供隱私優先的本機 HTTP API 服務，面向外部無外介面 (headless) 整合。自動化工具、批次處理腳本或輔助客戶端可以透過 REST 端點在本機控制語音轉文字流程。

## 設定與服務啟用

API 服務可以透過兩種方式啟動。

### GUI 應用程式設定

在主介面打開 `設定 > API 服務` 並設定：

- `啟用 API 服務`：切換服務開啟或關閉。
- `監聽地址`：繫結 IP。使用 `127.0.0.1` 可限制為僅本機存取，使用 `0.0.0.0` 會繫結所有網路介面。
- `連接埠`：API 服務執行的 TCP 連接埠，預設是 `14200`。
- `安全金鑰`：用於保護介面的可選 Bearer token。點擊 `產生` 可以建立安全金鑰，點擊 `複製` 寫入剪貼簿。

### 命令列無外介面模式

也可以透過命令列無外介面啟動 Sona：

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key --ip-whitelist localhost --max-streaming 2 --gpu-acceleration auto
```

GPU 硬體加速透過 GUI 模型設定或 `sona serve --gpu-acceleration` 作為服務級預設值設定。批次和串流 API 請求不支援依個別請求覆寫 GPU 設定。

完整 `serve` 參數表請參閱 [CLI 指南](guide:cli-guide)。

## 介面認證

當設定了 `安全金鑰` 時，每個發送到 API 服務的 HTTP 請求都必須在 `Authorization` 請求標頭中包含 Bearer token：

```http
Authorization: Bearer your_secure_key
```

如果未設定 API key，服務會允許未認證的請求。

## 取得伺服器資訊與可用能力

取得伺服器平台資訊、硬體狀態、已安裝模型以及可用的線上 ASR 提供者 (provider)。

- URL：`/v1/info`
- Method：`GET`

### 回應 (`200 OK`)

```json
{
  "platform": "win32",
  "gpuAvailable": true,
  "models": ["sensevoice", "sherpa-onnx-whisper-turbo"],
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

## 服務健康與統計

取得伺服器運作時間、活躍/佇列任務數以及暫存空間占用情況。

- URL：`/health`
- Method：`GET`

### 回應 (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

## 列出所有任務

查詢任務管理器中所有轉錄任務的目前狀態。

- URL：`/v1/transcriptions/jobs`
- Method：`GET`

### 回應 (`200 OK`)

傳回 `job_id` 到目前任務狀態的對映。

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

## 提交轉錄任務

提交本機音訊或影片檔案進行語音轉文字處理。任務會進入佇列，並由背景轉錄 worker 執行。

- URL：`/v1/transcriptions`
- Method：`POST`
- Content-Type：`multipart/form-data`

### 請求參數

| 參數名稱 | 類型 | 是否必填 | 參數說明 |
| --- | --- | --- | --- |
| `file` | 二進位 | 是 | 要轉錄的音訊或影片檔案。 |
| `model_id` | 字串 | 是 | 本機 ASR 模型 ID，例如 `sensevoice`；或已設定的雲端 ASR 提供者，例如 `volcengine-doubao`。 |
| `language` | 字串 | 否 | 目標辨識語言，例如 `zh`、`en`、`ja`、`ko`、`yue`。預設是 `auto`。 |
| `hotwords` | 字串 | 否 | 用於增強辨識的自訂詞彙或關鍵詞，依換行分隔。 |
| `webhook_url` | 字串 | 否 | 轉錄任務完成或失敗後接收 POST 通知的 HTTP URL。 |
| `webhook_secret` | 字串 | 否 | 用於透過 HMAC-SHA256 簽名 webhook payload 的金鑰。 |

### 傳回資料 (`200 OK`)

傳回為該轉錄任務分配的唯一 `job_id`：

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

### Curl 請求範例

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

## 查詢任務狀態

查詢已提交任務的生命週期狀態和轉錄結果。

- URL：`/v1/transcriptions/:job_id`
- Method：`GET`

### 狀態傳回結構

介面會根據任務處理進度傳回以下 JSON 結構之一。

#### 佇列中

任務正在佇列中等待轉錄 worker 執行。

```json
"Pending"
```

#### 處理中

任務正在由辨識引擎執行轉錄。

```json
"Processing"
```

#### 成功完成

語音辨識成功。回應會傳回包含毫秒級時間戳記的分段轉錄文字：

```json
{
  "Completed": [
    {
      "id": 0,
      "start": 120,
      "end": 2840,
      "text": "你好，歡迎使用 Sona。",
      "speaker": "Speaker 0"
    },
    {
      "id": 1,
      "start": 3100,
      "end": 5600,
      "text": "我們正在您的本機上處理語音辨識。",
      "speaker": "Speaker 1"
    }
  ]
}
```

#### 辨識失敗

轉錄任務失敗，並包含具體失敗原因：

```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

### Curl 請求範例

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

## Webhooks 結果推送與安全驗證

如果提交任務時指定了 `webhook_url`，Sona 會在任務完成或失敗時，將最終 JSON 狀態 POST 到該 URL。

### Webhook 簽名 (`X-Sona-Signature`)

為了保護 webhook，可以在提交任務時提供 `webhook_secret`。Sona 會使用該金鑰對 JSON payload 字串計算 HMAC-SHA256 簽名，並透過請求標頭傳送：

- 請求標頭名稱：`X-Sona-Signature`
- 格式：`sha256=<hex_encoded_signature>`

### 驗證演算法

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
