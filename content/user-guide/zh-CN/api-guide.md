Sona 提供隐私优先的本地 HTTP API 服务，面向外部无头集成。自动化工具、批处理脚本或辅助客户端可以通过 REST 端点在本机控制语音转文字流程。

## 配置与服务启用

API 服务可以通过两种方式启动。

### GUI 客户端设置

在主界面打开 `设置 > API 服务` 并配置：

- `启用 API 服务`：切换服务开启或关闭。
- `监听地址`：绑定 IP。使用 `127.0.0.1` 可限制为仅本机访问，使用 `0.0.0.0` 会绑定所有网络接口。
- `端口`：API 服务运行的 TCP 端口，默认是 `14200`。
- `安全密钥`：用于保护接口的可选 Bearer token。点击 `生成` 可以创建安全密钥，点击 `复制` 写入剪贴板。

### 命令行无头模式

也可以通过命令行无头启动 Sona：

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key --ip-whitelist localhost --max-streaming 2 --gpu-acceleration auto
```

GPU 硬件加速通过 GUI 模型设置或 `sona serve --gpu-acceleration` 作为服务级默认值配置。批量和流式 API 请求不支持按请求覆盖 GPU 配置。

完整 `serve` 参数表见 [CLI 指南](guide:cli-guide)。

## 接口认证

当配置了 `安全密钥` 时，每个发往 API 服务的 HTTP 请求都必须在 `Authorization` 请求头中包含 Bearer token：

```http
Authorization: Bearer your_secure_key
```

如果未设置 API key，服务会允许未认证请求。

## 获取服务器信息与可用能力

获取服务器平台信息、硬件状态、已安装模型以及可用的在线 ASR provider。

- URL：`/v1/info`
- Method：`GET`

### 响应 (`200 OK`)

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

## 服务健康与统计

获取服务器运行时间、活跃/排队任务数以及临时存储占用情况。

- URL：`/health`
- Method：`GET`

### 响应 (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

## 列出所有任务

查询任务管理器中所有转录任务的当前状态。

- URL：`/v1/transcriptions/jobs`
- Method：`GET`

### 响应 (`200 OK`)

返回 `job_id` 到当前任务状态的映射。

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

## 提交转录任务

提交本地音频或视频文件进行语音转文字处理。任务会进入队列，并由后台转录 worker 执行。

- URL：`/v1/transcriptions`
- Method：`POST`
- Content-Type：`multipart/form-data`

### 请求参数

| 参数名称 | 类型 | 是否必填 | 参数说明 |
| --- | --- | --- | --- |
| `file` | 二进制 | 是 | 要转录的音频或视频文件。 |
| `model_id` | 字符串 | 是 | 本地 ASR 模型 ID，例如 `sensevoice`；或已配置的云端 ASR provider，例如 `volcengine-doubao`。 |
| `language` | 字符串 | 否 | 目标识别语言，例如 `zh`、`en`、`ja`、`ko`、`yue`。默认是 `auto`。 |
| `hotwords` | 字符串 | 否 | 用于增强识别的自定义词汇或关键词，按换行分隔。 |
| `webhook_url` | 字符串 | 否 | 转录任务完成或失败后接收 POST 通知的 HTTP URL。 |
| `webhook_secret` | 字符串 | 否 | 用于通过 HMAC-SHA256 签名 webhook payload 的密钥。 |

### 返回数据 (`200 OK`)

返回为该转录任务分配的唯一 `job_id`：

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

### Curl 请求示例

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

## 查询任务状态

查询已提交任务的生命周期状态和转录结果。

- URL：`/v1/transcriptions/:job_id`
- Method：`GET`

### 状态返回结构

接口会根据任务处理进度返回以下 JSON 结构之一。

#### 排队中

任务正在队列中等待转录 worker 执行。

```json
"Pending"
```

#### 处理中

任务正在由识别引擎运行转录。

```json
"Processing"
```

#### 成功完成

语音识别成功。响应会返回包含毫秒级时间戳的分段转录文本：

```json
{
  "Completed": [
    {
      "id": 0,
      "start": 120,
      "end": 2840,
      "text": "你好，欢迎使用 Sona。",
      "speaker": "Speaker 0"
    },
    {
      "id": 1,
      "start": 3100,
      "end": 5600,
      "text": "我们正在您的本地机器上处理语音识别。",
      "speaker": "Speaker 1"
    }
  ]
}
```

#### 识别失败

转录任务失败，并包含具体失败原因：

```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

### Curl 请求示例

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

## Webhooks 结果推送与安全校验

如果提交任务时指定了 `webhook_url`，Sona 会在任务完成或失败时，把最终 JSON 状态 POST 到该 URL。

### Webhook 签名 (`X-Sona-Signature`)

为了保护 webhook，可以在提交任务时提供 `webhook_secret`。Sona 会使用该密钥对 JSON payload 字符串计算 HMAC-SHA256 签名，并通过请求头发送：

- 请求头名称：`X-Sona-Signature`
- 格式：`sha256=<hex_encoded_signature>`

### 校验算法

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
