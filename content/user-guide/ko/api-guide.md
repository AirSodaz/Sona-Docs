Sona는 외부 헤드리스 통합을 위해 개인정보 보호 우선의 로컬 HTTP API 서버를 제공합니다. 자동화 스크립트, 배치 처리 도구, 웹 애플리케이션 또는 서드파티 앱에서 REST 엔드포인트와 WebSocket 실시간 스트리밍을 통해 로컬에서 안전하게 음성-텍스트 워크플로를 제어할 수 있습니다.

## 설정 및 서버 실행

API 서버는 다음 두 가지 방법으로 시작할 수 있습니다:

### GUI 클라이언트 설정

`설정 > API 서버`로 이동하여 구성합니다:

- `API 서버 활성화`: 서버 활성화 토글.
- `호스트`: 바인딩할 IP 주소. 로컬 시스템으로만 제한하려면 `127.0.0.1`을, LAN 내 기기 접근을 허용하려면 `0.0.0.0`을 지정합니다.
- `포트`: 서버 TCP 포트 (기본값: `14200`).
- `API Key`: 엔드포인트를 보호하기 위한 선택적 Bearer 토큰. `생성`을 클릭하여 안전한 키를 생성하고 `복사`로 클립보드에 복사할 수 있습니다.

### 독립형 CLI 모드

독립형 `sona-cli`에서도 동일한 서버 어댑터를 실행할 수 있습니다:

```bash
sona-cli serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

CLI 서버(`sona-cli serve`)는 설치된 로컬 오프라인 모델을 사용한 REST 전사 및 네이티브 WebSocket 실시간 스트리밍(`/v1/streaming`)을 지원합니다. `serve` 경로는 클라우드 Online ASR를 노출하지 않습니다. 온라인 모델을 직접 사용하려면 `sona-cli transcribe` 또는 `sona-cli transcribe-live`를 사용하여 배치 또는 스트리밍 전사를 실행하세요.

자세한 `serve` 명령 사양은 [CLI 가이드](guide:cli-guide)를 참조하세요.

## 인증

`API Key`가 설정되어 있으면 모든 HTTP 요청의 `Authorization` 헤더에 Bearer 토큰을 포함해야 합니다:

```http
Authorization: Bearer your_secure_key
```

API 키가 설정되어 있지 않으면 서버는 인증되지 않은 익명 요청을 허용합니다. HTML5 미디어 재생이나 WebSocket 등 헤더 전달이 까다로운 환경에서는 `token` 또는 `api_key` 쿼리 파라미터로 키를 전달할 수 있습니다.

## 엔드포인트 참조

### 1. 서버 정보 및 기능

서버 플랫폼 정보, 하드웨어 가속 상태, 설치된 모델, 사용 가능한 클라우드 ASR 제공자 목록을 조회합니다.

- URL: `/info`
- 메서드: `GET`

#### 응답 예시 (`200 OK`)

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

### 2. 서버 상태 및 통계

서버 가동 시간, 실행 중/대기 중인 작업 수, 임시 저장소 사용량을 조회합니다.

- URL: `/health`
- 메서드: `GET`

#### 응답 예시 (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

### 3. 전체 작업 목록 조회

작업 관리자 내 모든 전사 작업의 상태를 조회합니다.

- URL: `/v1/transcriptions` (또는 `/v1/transcriptions/jobs`)
- 메서드: `GET`

#### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `limit` | 정수 | 아니오 | `50` | 반환할 최대 작업 수 |
| `offset` | 정수 | 아니오 | `0` | 페이지네이션 오프셋 |

#### 응답 예시 (`200 OK`)

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

### 4. 전사 작업 제출

오디오 파일을 업로드하여 새로운 전사 작업을 큐에 추가합니다.

- URL: `/v1/transcriptions`
- 메서드: `POST`
- Content-Type: `multipart/form-data`

#### 요청 파라미터

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `file` | 바이너리 | 예 | 전사할 오디오 파일 (`wav`, `mp3`, `flac`, `ogg`, `m4a`, `aac`). |
| `model_id` | 문자열 | 아니오 | 사용할 모델 ID (생략 시 첫 번째 사용 가능한 로컬 모델 사용). |
| `language` | 문자열 | 아니오 | 대상 언어 코드 (`ko`, `en`, `zh`, `auto` 등). |
| `hotwords` | 문자열 | 아니오 | 인식 향상을 위한 쉼표 구분 핫워드/전문 용어 목록. |
| `online_provider` | 문자열 | 아니오 | 구성된 클라우드 제공자 ID (`volcengine-doubao` 등). |
| `webhook_url` | 문자열 | 아니오 | 작업 완료 또는 실패 시 HTTP POST 콜백을 받을 URL. |
| `webhook_secret` | 문자열 | 아니오 | Webhook 서명용 HMAC-SHA256 비밀키. |

#### 응답 예시 (`200 OK`)

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

#### Curl 예시

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=ko"
```

### 5. 작업 상태 및 결과 조회

작업 ID를 지정하여 진행 상태 및 전사 텍스트 세그먼트를 조회합니다.

- URL: `/v1/transcriptions/:job_id`
- 메서드: `GET`

#### 응답 구조

작업 진행 상태에 따라 다음 중 하나의 JSON 형태가 반환됩니다:

##### 대기 중 (Pending)
```json
"Pending"
```

##### 처리 중 (Processing)
```json
"Processing"
```

##### 완료됨 (Completed)
```json
{
  "Completed": [
    {
      "id": 0,
      "start": 120,
      "end": 2840,
      "text": "안녕하세요, Sona에 오신 것을 환영합니다.",
      "speaker": "Speaker 0"
    },
    {
      "id": 1,
      "start": 3100,
      "end": 5600,
      "text": "음성은 여러분의 로컬 기기에서 완전히 오프라인으로 처리됩니다.",
      "speaker": "Speaker 1"
    }
  ]
}
```

##### 실패 (Failed)
```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

#### Curl 예시

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 6. 작업 삭제 / 취소

진행 중인 작업을 취소하거나 완료/실패한 작업 기록 및 임시 오디오 파일을 제거합니다.

- URL: `/v1/transcriptions/:job_id`
- 메서드: `DELETE`

#### 응답 (`204 No Content`)

작업 기록과 임시 오디오 파일이 즉시 삭제되며 진행 중인 작업 스레드는 안전하게 중단됩니다.

```bash
curl -X DELETE http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 7. 작업 오디오 파일 가져오기

작업과 연관된 원본 오디오 파일을 스트리밍 재생하거나 다운로드합니다. HTTP Range 헤더를 지원하여 플레이어에서 탐색 재생이 가능합니다.

- URL: `/v1/transcriptions/:job_id/audio`
- 메서드: `GET`

#### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `token` | 문자열 | 아니오 | HTML5 `<audio>` / `<video>` 태그용 토큰 파라미터. |

#### 응답 (`200 OK` 또는 `206 Partial Content`)

적절한 `Content-Type`(`audio/wav`, `audio/mpeg` 등)을 가진 바이너리 오디오 스트림을 반환합니다.

### 8. 작업 자막 파일 내보내기

완료된 전사 결과를 자막 또는 구조화된 텍스트 파일로 직접 내보냅니다.

- URL: `/v1/transcriptions/:job_id/export`
- 메서드: `GET`

#### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `format` | 문자열 | 아니오 | `srt` | 형식: `srt`, `vtt`, `json`, `txt`, `md`. |
| `mode` | 문자열 | 아니오 | `original` | 텍스트 모드: `original` (원본), `translation` (번역문), `bilingual` (이중 언어). |

#### 응답 (`200 OK`)

`Content-Disposition: attachment; filename="{job_id}.{format}"` 헤더 및 해당 MIME 타입이 반환됩니다.

### 9. LLM 세그먼트 윤문 (Polish)

데스크톱에 설정된 LLM 제공자를 사용하여 음성 인식 세그먼트의 군더더기를 다듬고 표기를 교정합니다.

- URL: `/v1/llm/polish`
- 메서드: `POST`
- Content-Type: `application/json`

#### 요청 본문 예시

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "어 그 안녕 세상",
      "isFinal": true
    }
  ]
}
```

#### 응답 예시 (`200 OK`)

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "안녕하세요, 세상.",
      "isFinal": true
    }
  ]
}
```

### 10. LLM 세그먼트 번역

데스크톱에 설정된 LLM 제공자를 사용하여 전사 세그먼트를 목표 언어로 번역합니다.

- URL: `/v1/llm/translate`
- 메서드: `POST`
- Content-Type: `application/json`

#### 요청 본문 예시

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
  "target_language": "ko"
}
```

#### 응답 예시 (`200 OK`)

각 세그먼트에 `translation` 필드가 채워진 배열을 반환합니다.

### 11. WebSocket 실시간 오디오 스트리밍

WebSocket을 통해 원시 오디오 바이너리 청크를 스트리밍하여 매우 낮은 지연 시간으로 실시간 전사 결과를 수신합니다.

- URL: `/v1/streaming` (또는 `ws://127.0.0.1:14200/v1/streaming?token=your_secure_key`)
- 프로토콜: `WebSocket`

#### 핸드셰이크 인증

연결 시 쿼리 문자열(`?token=...` 또는 `?api_key=...`)이나 표준 `Authorization: Bearer <key>` 헤더로 키를 전달합니다.

#### 프로토콜 시퀀스

1. **클라이언트 -> 서버 (텍스트 JSON)**: 세션 시작
   ```json
   {
     "type": "start",
     "model_id": "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17",
     "language": "auto",
     "hotwords": null,
     "vad_model_id": "silero-vad"
   }
   ```
2. **서버 -> 클라이언트 (텍스트 JSON)**: 세션 준비 완료
   ```json
   {
     "type": "started",
     "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
   }
   ```
3. **클라이언트 -> 서버 (바이너리 Binary)**: 원시 PCM 오디오 데이터 전송
   - 오디오 형식: 16 kHz 샘플레이트, 16-bit 리틀엔디언, 모노 (`pcm_s16le`).
4. **서버 -> 클라이언트 (텍스트 JSON)**: 점진적 인식 세그먼트 수신
   ```json
   {
     "type": "segment",
     "segment": {
       "id": "seg-1",
       "text": "안녕하세요 세상",
       "start": 0.0,
       "end": 1.8,
       "isFinal": false
     }
   }
   ```
5. **클라이언트 -> 서버 (텍스트 JSON)**: 세션 종료
   ```json
   {
     "type": "stop"
   }
   ```

## Webhook 및 서명 검증

작업 제출 시 `webhook_url`을 지정하면 Sona는 작업 완료 또는 실패 시 해당 주소로 HTTP POST 요청을 전송합니다.

### Webhook 서명 (`X-Sona-Signature`)

Webhook 위조를 방지하려면 제출 시 `webhook_secret`을 설정합니다. Sona는 원본 JSON 페이로드로부터 HMAC-SHA256 서명을 계산하여 헤더에 포함합니다:

- 헤더 이름: `X-Sona-Signature`
- 형식: `sha256=<hex_encoded_signature>`

### 검증 알고리즘 (Node.js 예시)

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
