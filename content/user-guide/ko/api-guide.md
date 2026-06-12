Sona는 외부 headless 연동을 위해 개인정보 보호 중심의 로컬 HTTP API 서버를 제공합니다. 자동화 도구, batch-processing script, 보조 앱은 REST endpoint를 통해 로컬에서 speech-to-text 워크플로를 제어할 수 있습니다.

## 설정과 서버 활성화

API 서버는 두 가지 방식으로 시작할 수 있습니다.

### GUI 클라이언트 설정

`Settings > API Server`로 이동해 다음 항목을 설정합니다.

- `Enable API Server`: 서버 활성화 토글
- `Host`: bind IP address. 로컬 컴퓨터로 제한하려면 `127.0.0.1`, 모든 network interface에 bind하려면 `0.0.0.0`을 사용합니다.
- `Port`: 서버 TCP port. 기본값은 `14200`입니다.
- `API Key`: endpoint를 보호하는 선택형 Bearer token. 안전한 key를 만들려면 `Generate`, clipboard에 쓰려면 `Copy`를 사용합니다.

### Headless CLI mode

Sona를 headless CLI server mode로 실행할 수도 있습니다.

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key --ip-whitelist localhost --max-streaming 2 --gpu-acceleration auto
```

GPU acceleration은 GUI model settings 또는 `sona serve --gpu-acceleration`을 통해 server-level default로 설정합니다. Batch와 streaming API request는 request별 GPU override를 받지 않습니다.

전체 `serve` option table은 [CLI 가이드](guide:cli-guide)를 참고하세요.

## 인증

`API Key`가 설정되어 있으면 모든 HTTP request가 `Authorization` header에 Bearer token을 포함해야 합니다.

```http
Authorization: Bearer your_secure_key
```

API key가 없으면 서버는 unauthenticated request를 허용합니다.

## 서버 정보와 기능

서버 platform 정보, hardware status, 설치된 model, 사용 가능한 online ASR provider를 가져옵니다.

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

## 서버 health와 stats

서버 uptime, active/pending job count, temporary storage usage를 가져옵니다.

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

## 모든 job 목록

Manager 안의 모든 transcription job 현재 상태를 조회합니다.

- URL: `/v1/transcriptions/jobs`
- Method: `GET`

### Response (`200 OK`)

`job_id`에서 현재 job status로 이어지는 map을 반환합니다.

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

## 전사 job 제출

로컬 오디오 또는 비디오 파일을 speech-to-text 처리 대상으로 제출합니다. Job은 대기열에 들어가 background transcription worker가 실행합니다.

- URL: `/v1/transcriptions`
- Method: `POST`
- Content-Type: `multipart/form-data`

### Request payload

| Field name | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | Binary | Yes | 전사할 오디오 또는 비디오 파일입니다. |
| `model_id` | String | Yes | `sensevoice` 같은 local ASR model id 또는 `volcengine-doubao` 같은 configured Cloud ASR provider id입니다. |
| `language` | String | No | `zh`, `en`, `ja`, `ko`, `yue` 같은 target language code입니다. 기본값은 `auto`입니다. |
| `hotwords` | String | No | 인식 품질을 높이기 위한 custom vocabulary 또는 keywords입니다. 줄바꿈으로 구분합니다. |
| `webhook_url` | String | No | 전사가 끝나거나 실패했을 때 POST notification을 받을 HTTP URL입니다. |
| `webhook_secret` | String | No | HMAC-SHA256으로 webhook payload에 서명할 때 쓰는 secret입니다. |

### Response (`200 OK`)

Transcription task에 할당된 고유 `job_id`를 반환합니다.

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

## Job status 조회

제출한 job의 lifecycle state와 transcription result를 조회합니다.

- URL: `/v1/transcriptions/:job_id`
- Method: `GET`

### Response structures

진행 상태에 따라 endpoint는 다음 JSON pattern 중 하나를 반환합니다.

#### Pending

Job이 queue에 들어가 transcription worker를 기다리는 중입니다.

```json
"Pending"
```

#### Processing

Job이 활성 상태이며 transcription이 진행 중입니다.

```json
"Processing"
```

#### Completed

전사가 성공했습니다. Response는 millisecond timestamp가 있는 segment-level text를 반환합니다.

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

전사가 실패했으며 구체적인 error message를 포함합니다.

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

## Webhooks와 검증

Job 제출 시 `webhook_url`을 지정했다면, Sona는 job completion 또는 failure 시 final JSON state를 해당 URL로 POST합니다.

### Webhook signature (`X-Sona-Signature`)

Webhook을 보호하려면 job 제출 시 `webhook_secret`을 지정하세요. Sona는 이 secret으로 JSON payload string의 HMAC-SHA256 signature를 계산하고 header에 보냅니다.

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
