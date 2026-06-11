# HTTP API ガイド

Sona には、外部ツールやヘッドレス環境と連携するためのローカル HTTP API サーバーがあります。自動化ツール、バッチ処理スクリプト、サードパーティ製アプリから、REST エンドポイントを通じてローカルの文字起こしワークフローを操作できます。

## 設定とサーバー起動

API サーバーは、次の 2 つの方法で起動できます。

### GUI クライアントから設定する

アプリ内の `Settings > API Server` を開き、次の項目を設定します。

- `Enable API Server`: サーバーを有効または無効にします。
- `Host`: バインドする IP アドレスです。ローカルマシンからのアクセスに限定する場合は `127.0.0.1`、すべてのネットワークインターフェースで受け付ける場合は `0.0.0.0` を指定します。
- `Port`: サーバーの TCP ポートです。既定値は `14200` です。
- `API Key`: エンドポイントを保護する任意の Bearer トークンです。`Generate` で安全なキーを生成し、`Copy` でクリップボードへコピーできます。

### ヘッドレス CLI モードで起動する

デスクトップ UI を起動せず、CLI から API サーバーだけを起動することもできます。

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key --ip-whitelist localhost --max-streaming 2 --gpu-acceleration auto
```

GPU アクセラレーションは、GUI のモデル設定または `sona serve --gpu-acceleration` オプションで、サーバーレベルの既定値として指定します。バッチ API やストリーミング API の各リクエストで、GPU プロバイダーを個別に上書きすることはできません。

利用できる `serve` オプションの一覧は、[CLI ガイド](guide:cli-guide)を参照してください。

## 認証

`API Key` が設定されている場合は、すべての HTTP リクエストの `Authorization` ヘッダーに Bearer トークンとしてキーを含めます。

```http
Authorization: Bearer your_secure_key
```

API キーが空の場合は、認証情報なしのリクエストも許可されます。

## サーバー情報と利用可能なモデルを取得する

サーバーの実行プラットフォーム、ハードウェア状態、インストール済みモデル、利用可能なオンライン ASR プロバイダーを取得します。

- URL: `/v1/info`
- Method: `GET`

### レスポンス (`200 OK`)

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

## ヘルスチェックと稼働状況を取得する

サーバーの稼働時間、アクティブジョブ数、待機中ジョブ数、一時キャッシュストレージの使用状況を取得します。

- URL: `/health`
- Method: `GET`

### レスポンス (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

## ジョブ一覧を取得する

ジョブマネージャーに登録されている文字起こしジョブの現在の状態を取得します。

- URL: `/v1/transcriptions/jobs`
- Method: `GET`

### レスポンス (`200 OK`)

各 `job_id` に対応する現在のジョブ状態が返されます。

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

## 文字起こしジョブを作成する

ローカルの音声または動画ファイルを送信し、文字起こし処理を依頼します。送信されたジョブはキューに追加され、バックグラウンドワーカーによって順番に処理されます。

- URL: `/v1/transcriptions`
- Method: `POST`
- Content-Type: `multipart/form-data`

### リクエストペイロード

| フィールド名 | データ型 | 必須かどうか | 説明 |
| --- | --- | --- | --- |
| `file` | バイナリ | はい | 文字起こし対象の音声または動画ファイル。 |
| `model_id` | 文字列 | はい | ローカル ASR モデルの ID（`sensevoice` など）、または設定済みクラウド ASR プロバイダーの ID（`volcengine-doubao` など）。 |
| `language` | 文字列 | いいえ | 対象言語コード（`zh`、`en`、`ja`、`ko`、`yue` など）。既定値は `auto`。 |
| `hotwords` | 文字列 | いいえ | 認識精度を高めるためのカスタム語彙またはキーワード（改行区切り）。 |
| `webhook_url` | 文字列 | いいえ | 文字起こし完了時または失敗時に POST 通知を受け取る HTTP URL。 |
| `webhook_secret` | 文字列 | いいえ | Webhook ペイロードを HMAC-SHA256 で署名するためのシークレット。 |

### レスポンス (`200 OK`)

文字起こしタスクに割り当てられた一意の `job_id` が返されます。

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

### Curl 実行例

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

## ジョブ状態を問い合わせる

送信したジョブの進捗と文字起こし結果を取得します。

- URL: `/v1/transcriptions/:job_id`
- Method: `GET`

### レスポンス構造

ジョブの状態に応じて、次のいずれかの JSON パターンが返されます。

#### Pending (待機中)

ジョブはキューに登録され、バックグラウンドワーカーの空きを待っています。

```json
"Pending"
```

#### Processing (処理中)

ジョブがアクティブになり、現在文字起こし処理を実行しています。

```json
"Processing"
```

#### Completed (完了)

文字起こしが正常に完了しました。セグメントごとのテキストとミリ秒単位のタイムスタンプが返されます。

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

#### Failed (失敗)

文字起こし処理が失敗しました。具体的なエラーメッセージが含まれます。

```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

### Curl 実行例

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

## Webhook と検証

ジョブ作成時に `webhook_url` を指定していた場合、Sona はジョブ完了時または失敗時に、その URL へ最終状態を示す JSON を POST します。

### Webhook 署名ヘッダー (`X-Sona-Signature`)

Webhook の安全性を検証するため、ジョブ作成時に `webhook_secret` を指定できます。Sona は指定されたシークレットを使って JSON ペイロードの HMAC-SHA256 署名を計算し、次のヘッダーで送信します。

- ヘッダー名: `X-Sona-Signature`
- フォーマット: `sha256=<16進数エンコードされた署名文字列>`

### 検証アルゴリズムの例

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
