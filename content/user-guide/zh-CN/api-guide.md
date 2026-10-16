Sona 提供了隐私优先的本地 HTTP API 服务，适用于外部 Headless 集成。自动化脚本、批处理工具、Web 前端或第三方应用均可通过 REST 端点与 WebSocket 实时流式识别，在本地安全控制语音转文字工作流。

## 配置与服务启动

API 服务可以通过以下两种方式启动：

### GUI 客户端设置

进入 `设置 > API 服务` 并进行配置：

- `启用 API 服务`：切换服务开关。
- `监听地址`：绑定 IP 地址。使用 `127.0.0.1` 仅限本机访问，或使用 `0.0.0.0` 允许局域网设备访问。
- `端口`：服务器监听 TCP 端口，默认是 `14200`。
- `API Key`：用于保护接口的 Bearer Token。点击 `生成` 创建高强度密钥，点击 `复制` 写入剪贴板。

### 独立 CLI 模式

也可以直接在终端中使用独立 `sona-cli` 启动相同的服务：

```bash
sona-cli serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

CLI 服务（`sona-cli serve`）支持使用已安装本地离线模型的 REST 转写与原生 WebSocket 实时流式识别（`/v1/streaming`）。`serve` 路由不暴露云端 Online ASR；如需直接使用云端模型，请使用 `sona-cli transcribe` 或 `sona-cli transcribe-live` 进行批量或流式转录。

完整的 `serve` 命令参数说明请参阅 [CLI 指南](guide:cli-guide)。

## 身份认证

配置 `API Key` 后，每个 HTTP 请求都必须在 `Authorization` 请求头中携带 Bearer Token：

```http
Authorization: Bearer your_secure_key
```

未设置 API Key 时，服务允许匿名免认证请求。对于 HTML5 媒体流或 WebSocket 等难以自定义 Header 的场景，支持通过 `token` 或 `api_key` Query 参数传递。

## 接口参考

### 1. 服务信息与能力

查询服务平台信息、硬件加速状态、已安装模型列表与已配置的云端 ASR Provider。

- URL：`/info`
- 请求方法：`GET`

#### 响应示例 (`200 OK`)

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

### 2. 服务健康状态与指标

查询服务运行时间、正在处理与排队中的任务数、临时存储占用。

- URL：`/health`
- 请求方法：`GET`

#### 响应示例 (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

### 3. 查询所有任务

查询当前任务管理器中所有转录任务的状态列表。

- URL：`/v1/transcriptions`（或 `/v1/transcriptions/jobs`）
- 请求方法：`GET`

#### Query 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| `limit` | 整数 | 否 | `50` | 返回任务最大数量 |
| `offset` | 整数 | 否 | `0` | 分页偏移量 |

#### 响应示例 (`200 OK`)

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

### 4. 提交转录任务

上传音频文件并创建转录排队任务。

- URL：`/v1/transcriptions`
- 请求方法：`POST`
- Content-Type：`multipart/form-data`

#### 请求参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `file` | 二进制 | 是 | 待转录音频文件（支持 `wav`、`mp3`、`flac`、`ogg`、`m4a`、`aac`）。 |
| `model_id` | 字符串 | 否 | 调用的模型 ID，默认使用第一个可用本地离线模型。 |
| `language` | 字符串 | 否 | 目标语种代码（如 `zh`、`en`、`auto`）。 |
| `hotwords` | 字符串 | 否 | 逗号分隔的热词/专有名词列表，用于识别增强。 |
| `online_provider` | 字符串 | 否 | 已配置的云端 Provider ID（如 `volcengine-doubao`）。 |
| `webhook_url` | 字符串 | 否 | 任务完成或失败时接收 HTTP POST 回调的 URL。 |
| `webhook_secret` | 字符串 | 否 | 用于 Webhook 签名的 HMAC-SHA256 密钥。 |

#### 响应示例 (`200 OK`)

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

#### Curl 示例

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

### 5. 查询任务状态与结果

根据任务 ID 查询转录生命周期状态及转录文本分段。

- URL：`/v1/transcriptions/:job_id`
- 请求方法：`GET`

#### 响应数据结构

根据任务当前进度，接口返回以下模式之一：

##### 排队中 (Pending)
```json
"Pending"
```

##### 处理中 (Processing)
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
      "text": "你好，欢迎使用 Sona。",
      "speaker": "Speaker 0"
    },
    {
      "id": 1,
      "start": 3100,
      "end": 5600,
      "text": "语音转录全程在您的本地设备上离线完成。",
      "speaker": "Speaker 1"
    }
  ]
}
```

##### 失败 (Failed)
```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

#### Curl 示例

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 6. 删除 / 取消任务

取消正在进行的转录任务，或删除已完成/失败的任务记录及其缓存的音频文件。

- URL：`/v1/transcriptions/:job_id`
- 请求方法：`DELETE`

#### 响应 (`204 No Content`)

任务记录与临时音频文件将被立即清除，正在运行的处理线程将安全中止。

```bash
curl -X DELETE http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 7. 获取任务音频文件

流式播放或下载与任务关联的原始音频文件。支持 HTTP Range 标头以实现媒体播放器的跳转回放。

- URL：`/v1/transcriptions/:job_id/audio`
- 请求方法：`GET`

#### Query 参数

| 参数 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `token` | 字符串 | 否 | 适用于 HTML5 `<audio>` / `<video>` 标签的免 Header 鉴权凭证。 |

#### 响应 (`200 OK` 或 `206 Partial Content`)

返回二进制音频流并携带对应的 `Content-Type`（如 `audio/wav`、`audio/mpeg`）。

### 8. 导出任务字幕文件

将已完成的转录结果直接格式化导出为字幕或文本文件。

- URL：`/v1/transcriptions/:job_id/export`
- 请求方法：`GET`

#### Query 参数

| 参数 | 类型 | 必填 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| `format` | 字符串 | 否 | `srt` | 导出格式：`srt`、`vtt`、`json`、`txt`、`md`。 |
| `mode` | 字符串 | 否 | `original` | 文本模式：`original`（原始文本）、`translation`（译文）或 `bilingual`（双语对照）。 |

#### 响应 (`200 OK`)

响应头包含 `Content-Disposition: attachment; filename="{job_id}.{format}"` 及对应的 MIME 类型。

### 9. LLM 分段文本润色

使用桌面端配置的 LLM 服务对语音识别分段进行文本去冗、校对与结构规整。

- URL：`/v1/llm/polish`
- 请求方法：`POST`
- Content-Type：`application/json`

#### 请求体示例

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "呃那个你好世界",
      "isFinal": true
    }
  ]
}
```

#### 响应示例 (`200 OK`)

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "你好，世界。",
      "isFinal": true
    }
  ]
}
```

### 10. LLM 分段文本翻译

使用桌面端配置的 LLM 服务将转录分段翻译为目标语言。

- URL：`/v1/llm/translate`
- 请求方法：`POST`
- Content-Type：`application/json`

#### 请求体示例

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

#### 响应示例 (`200 OK`)

返回包含填充后 `translation` 字段的分段列表。

### 11. WebSocket 实时音频流式识别

通过 WebSocket 协议实时传输音频二进制分片，实现极低延迟的语音出字。

- URL：`/v1/streaming`（或 `ws://127.0.0.1:14200/v1/streaming?token=your_secure_key`）
- 通信协议：`WebSocket`

#### 握手认证

在连接握手阶段，通过 Query 参数（`?token=...` 或 `?api_key=...`）或标准 `Authorization: Bearer <key>` Header 传递密钥。

#### 协议交互流程

1. **客户端 -> 服务端 (文本 JSON)**：初始化会话
   ```json
   {
     "type": "start",
     "model_id": "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17",
     "language": "auto",
     "hotwords": null,
     "vad_model_id": "silero-vad"
   }
   ```
2. **服务端 -> 客户端 (文本 JSON)**：会话已就绪
   ```json
   {
     "type": "started",
     "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
   }
   ```
3. **客户端 -> 服务端 (二进制 Binary)**：推送原始 PCM 音频分片
   - 音频格式：16 kHz 采样率、单声道、16-bit 有符号小端整数（`pcm_s16le`）。
4. **服务端 -> 客户端 (文本 JSON)**：增量输出识别片段
   ```json
   {
     "type": "segment",
     "segment": {
       "id": "seg-1",
       "text": "你好世界",
       "start": 0.0,
       "end": 1.8,
       "isFinal": false
     }
   }
   ```
5. **客户端 -> 服务端 (文本 JSON)**：结束会话
   ```json
   {
     "type": "stop"
   }
   ```

## Webhooks 与签名校验

如果在提交任务时设置了 `webhook_url`，Sona 会在任务成功完成或失败时向该地址发起 HTTP POST 回调。

### Webhook 签名 (`X-Sona-Signature`)

为防止伪造回调，可在提交任务时指定 `webhook_secret`。Sona 会使用该密钥计算原始 JSON 载荷的 HMAC-SHA256 签名，并通过请求头下发：

- 请求头名称：`X-Sona-Signature`
- 格式：`sha256=<hex_encoded_signature>`

### 校验算法（Node.js 示例）

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
