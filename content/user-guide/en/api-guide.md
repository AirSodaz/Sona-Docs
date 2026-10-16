Sona exposes a privacy-first local HTTP API server for external headless integration. Automated tools, batch-processing scripts, web applications, or secondary apps can control speech-to-text workflows locally through REST endpoints and real-time WebSocket streaming.

## Configuration and server activation

The API server can be started in two ways:

### GUI client settings

Navigate to `Settings > API Server` and configure:

- `Enable API Server`: toggle activation.
- `Host`: bind IP address. Use `127.0.0.1` to restrict access to the local machine, or `0.0.0.0` to bind all network interfaces for LAN access.
- `Port`: TCP port for the server. The default is `14200`.
- `API Key`: optional Bearer token to protect endpoints. Click `Generate` to create a secure key and `Copy` to write it to your clipboard.

### Standalone CLI mode

You can also launch the same server adapter from the standalone `sona-cli`:

```bash
sona-cli serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

The CLI server (`sona-cli serve`) supports local REST transcription with installed offline models as well as native WebSocket streaming (`/v1/streaming`). The `serve` routes do not expose cloud Online ASR; use `sona-cli transcribe` or `sona-cli transcribe-live` for direct Online ASR batch and streaming transcription.

For the full `serve` command reference, see [CLI Guide](guide:cli-guide).

## Authentication

When an `API Key` is configured, every HTTP request must include it in the `Authorization` header as a Bearer token:

```http
Authorization: Bearer your_secure_key
```

If no API key is set, the server permits unauthenticated requests. For media streaming or WebSocket requests where headers cannot be easily passed, the API key may be passed as a `token` or `api_key` query parameter.

## Endpoints reference

### 1. Server info and capabilities

Retrieve server platform information, hardware status, installed models, and available online ASR providers.

- URL: `/info`
- Method: `GET`

#### Response (`200 OK`)

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

### 2. Server health and stats

Retrieve server uptime, active/pending job counts, and temporary storage usage.

- URL: `/health`
- Method: `GET`

#### Response (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

### 3. List all jobs

Query the current status of transcription jobs in the manager.

- URL: `/v1/transcriptions` (or `/v1/transcriptions/jobs`)
- Method: `GET`

#### Query parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `limit` | Integer | No | `50` | Maximum number of jobs to return |
| `offset` | Integer | No | `0` | Number of jobs to skip for pagination |

#### Response (`200 OK`)

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

### 4. Submit a transcription job

Upload an audio file to enqueue a new transcription job.

- URL: `/v1/transcriptions`
- Method: `POST`
- Content-Type: `multipart/form-data`

#### Request payload

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | Binary | Yes | The audio file to transcribe (`wav`, `mp3`, `flac`, `ogg`, `m4a`, `aac`). |
| `model_id` | String | No | Model ID to use. Defaults to the first available local offline model. |
| `language` | String | No | Target spoken language code (e.g. `zh`, `en`, `auto`). |
| `hotwords` | String | No | Comma-separated list of hotwords / custom terminology for bias boosting. |
| `online_provider` | String | No | ID of configured cloud provider (e.g. `volcengine-doubao`). |
| `webhook_url` | String | No | URL to receive HTTP POST callback when job completes or fails. |
| `webhook_secret` | String | No | HMAC-SHA256 secret for webhook payload signing. |

#### Response (`200 OK`)

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

#### Curl example

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

### 5. Query job status

Query the current lifecycle state and transcription results of a submitted job.

- URL: `/v1/transcriptions/:job_id`
- Method: `GET`

#### Response structures

Depending on the job's progress, the endpoint returns one of the following JSON patterns:

##### Pending
```json
"Pending"
```

##### Processing
```json
"Processing"
```

##### Completed
```json
{
  "Completed": [
    {
      "id": 0,
      "start": 120,
      "end": 2840,
      "text": "Hello, welcome to Sona.",
      "speaker": "Speaker 0"
    },
    {
      "id": 1,
      "start": 3100,
      "end": 5600,
      "text": "We are processing speech locally on your machine.",
      "speaker": "Speaker 1"
    }
  ]
}
```

##### Failed
```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

#### Curl example

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 6. Delete / cancel job

Cancel an ongoing transcription or remove a completed/failed job and its associated audio file.

- URL: `/v1/transcriptions/:job_id`
- Method: `DELETE`

#### Response (`204 No Content`)

The job and temporary audio file are removed immediately, and any ongoing worker processing is aborted.

```bash
curl -X DELETE http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 7. Retrieve job audio

Stream or download the original audio file submitted with the job. Supports HTTP Range headers for seekable HTML5 media player playback.

- URL: `/v1/transcriptions/:job_id/audio`
- Method: `GET`

#### Query parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `token` | String | No | Alternative to Bearer token header for HTML5 `<audio>` / `<video>` tags. |

#### Response (`200 OK` or `206 Partial Content`)

Returns the binary audio stream with appropriate `Content-Type` (e.g. `audio/wav`, `audio/mpeg`).

### 8. Export job subtitles

Export completed transcription segments formatted as subtitles or structured text.

- URL: `/v1/transcriptions/:job_id/export`
- Method: `GET`

#### Query parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `format` | String | No | `srt` | Subtitle/export format: `srt`, `vtt`, `json`, `txt`, `md`. |
| `mode` | String | No | `original` | Text mode: `original` (source transcription), `translation`, or `bilingual`. |

#### Response (`200 OK`)

Includes `Content-Disposition: attachment; filename="{job_id}.{format}"` and the corresponding MIME content type.

### 9. LLM segment polish

Polish raw speech segments using the configured desktop LLM provider.

- URL: `/v1/llm/polish`
- Method: `POST`
- Content-Type: `application/json`

#### Request body

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "uh hello world",
      "isFinal": true
    }
  ]
}
```

#### Response (`200 OK`)

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
  ]
}
```

### 10. LLM segment translation

Translate transcription segments to a target language using the configured desktop LLM provider.

- URL: `/v1/llm/translate`
- Method: `POST`
- Content-Type: `application/json`

#### Request body

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

#### Response (`200 OK`)

Returns segments with the `translation` property populated.

### 11. WebSocket real-time audio streaming

Stream raw microphone or audio chunks to the server for low-latency live speech recognition over WebSocket.

- URL: `/v1/streaming` (or `ws://127.0.0.1:14200/v1/streaming?token=your_secure_key`)
- Protocol: `WebSocket`

#### Handshake authentication

Pass the API key in the connection query string (`?token=...` or `?api_key=...`) or in the standard `Authorization: Bearer <key>` header during the WebSocket handshake.

#### Protocol flow

1. **Client -> Server (Text JSON)**: initialize the session
   ```json
   {
     "type": "start",
     "model_id": "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17",
     "language": "auto",
     "hotwords": null,
     "vad_model_id": "silero-vad"
   }
   ```
2. **Server -> Client (Text JSON)**: session confirmed
   ```json
   {
     "type": "started",
     "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
   }
   ```
3. **Client -> Server (Binary)**: send raw PCM audio chunks
   - Audio format: 16 kHz, 16-bit little-endian, mono (`pcm_s16le`).
4. **Server -> Client (Text JSON)**: incremental recognized segments
   ```json
   {
     "type": "segment",
     "segment": {
       "id": "seg-1",
       "text": "Hello world",
       "start": 0.0,
       "end": 1.8,
       "isFinal": false
     }
   }
   ```
5. **Client -> Server (Text JSON)**: finalize session
   ```json
   {
     "type": "stop"
   }
   ```

## Webhooks and verification

If `webhook_url` was specified when submitting a transcription job, Sona posts the final JSON state to that URL on job completion or failure.

### Webhook signature (`X-Sona-Signature`)

To verify webhook authenticity, specify a `webhook_secret` during job submission. Sona computes an HMAC-SHA256 signature of the raw JSON body using this secret and transmits it in the request headers:

- Header name: `X-Sona-Signature`
- Format: `sha256=<hex_encoded_signature>`

### Verification algorithm (Node.js example)

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
