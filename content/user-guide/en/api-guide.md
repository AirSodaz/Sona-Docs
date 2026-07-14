Sona exposes a privacy-first local HTTP API server for external headless integration. Automated tools, batch-processing scripts, or secondary apps can control speech-to-text workflows locally through REST endpoints.

## Configuration and server activation

The API server can be started in two ways.

### GUI client settings

Navigate to `Settings > API Server` and configure:

- `Enable API Server`: toggle activation.
- `Host`: bind IP address. Use `127.0.0.1` to restrict access to the local machine, or `0.0.0.0` to bind all network interfaces.
- `Port`: TCP port for the server. The default is `14200`.
- `API Key`: optional Bearer token to protect endpoints. Use `Generate` to create a secure key and `Copy` to write it to your clipboard.

### Headless CLI mode

You can also launch the same server adapter from the standalone `sona-cli`:

```bash
sona-cli serve --host 127.0.0.1 --port 14200 --api-key your_secure_key --ip-whitelist localhost --max-streaming 2 --gpu-acceleration auto
```

GPU acceleration is configured as a server-level default through GUI model settings or `sona-cli serve --gpu-acceleration`. On Windows, `auto` tries CUDA first, then DirectML when the bundled runtime supports it, then CPU. Batch and streaming API requests do not accept a per-request GPU override.

For the full `serve` option table, see [CLI Guide](guide:cli-guide).

## Authentication

When an `API Key` is configured, every HTTP request must include it in the `Authorization` header as a Bearer token:

```http
Authorization: Bearer your_secure_key
```

If no API key is set, the server permits unauthenticated requests.

## Server info and capabilities

Retrieve server platform information, hardware status, installed models, and available online ASR providers.

- URL: `/v1/info`
- Method: `GET`

### Response (`200 OK`)

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

## Server health and stats

Retrieve server uptime, active/pending job counts, and temporary storage usage.

- URL: `/health`
- Method: `GET`

### Response (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

## List all jobs

Query the current status of all transcription jobs in the manager.

- URL: `/v1/transcriptions/jobs`
- Method: `GET`

### Response (`200 OK`)

Returns a map of `job_id` to the current job status.

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

## Submit a transcription job

Submit a local audio or video file for speech-to-text processing. Jobs are queued and executed by the background transcription worker.

- URL: `/v1/transcriptions`
- Method: `POST`
- Content-Type: `multipart/form-data`

### Request payload

| Field name | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | Binary | Yes | The audio or video file to transcribe. |
| `model_id` | String | Yes | The identifier of a local ASR model, such as `sensevoice`, or a configured Cloud ASR provider, such as `volcengine-doubao`. |
| `language` | String | No | Target language code, such as `zh`, `en`, `ja`, `ko`, or `yue`. Defaults to `auto`. |
| `hotwords` | String | No | Custom vocabulary or keywords to enhance recognition, separated by newlines. |
| `webhook_url` | String | No | HTTP URL to receive a POST notification once transcription finishes or fails. |
| `webhook_secret` | String | No | Secret used to sign the webhook payload with HMAC-SHA256. |

### Response (`200 OK`)

Returns the unique `job_id` allocated for the transcription task:

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

### Curl example

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

## Query job status

Query the lifecycle state and transcription result for a submitted job.

- URL: `/v1/transcriptions/:job_id`
- Method: `GET`

### Response structures

Depending on progress, the endpoint returns one of these JSON patterns.

#### Pending

The job is queued and waiting for the transcription worker.

```json
"Pending"
```

#### Processing

The job is active and transcription is currently underway.

```json
"Processing"
```

#### Completed

The transcription succeeded. The response returns segment-level text with millisecond timestamps:

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

#### Failed

The transcription failed and includes the specific error message:

```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

### Curl example

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

## Webhooks and verification

If `webhook_url` was specified when submitting the job, Sona posts the final JSON state to that URL on job completion or failure.

### Webhook signature (`X-Sona-Signature`)

To secure webhooks, specify a `webhook_secret` when submitting the job. Sona computes an HMAC-SHA256 signature of the JSON payload string using this secret and sends it in the headers:

- Header name: `X-Sona-Signature`
- Format: `sha256=<hex_encoded_signature>`

### Verification algorithm

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
