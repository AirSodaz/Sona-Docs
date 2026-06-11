# APIガイド

Sonaは、外部のヘッドレスシステムやツールと連携するための、プライバシー最優先のローカルHTTP APIサーバーを提供しています。自動化ツール、バッチ処理スクリプト、またはサードパーティ製アプリから、RESTエンドポイントを介してローカルの音声書き起こしワークフローを制御できます。

## 設定とサーバーの起動

APIサーバーは、以下の2つの方法で起動できます。

### GUIクライアントからの起動設定

アプリ内の「Settings > API Server（設定 > APIサーバー）」に移動し、以下の項目を設定します。

- `Enable API Server`: サーバーを有効化（オン・オフ）します。
- `Host`: バインドするIPアドレスを指定します。アクセスをローカルマシンのみに制限する場合は `127.0.0.1` を、すべてのネットワークインターフェースから接続可能にする場合は `0.0.0.0` を設定します。
- `Port`: サーバーのTCPポートを指定します。デフォルト値は `14200` です。
- `API Key`: エンドポイントを保護するための任意のBearerトークンを設定します。「Generate」をクリックすると安全なキーが生成され、「Copy」でクリップボードへコピーできます。

### ヘッドレスCLIモードでの起動

以下のように、デスクトップUIを起動しないヘッドレスのCLIサーバーモードでSonaを起動することも可能です。

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key --ip-whitelist localhost --max-streaming 2 --gpu-acceleration auto
```

GPUアクセラレーションは、GUIモデル設定または `sona serve --gpu-acceleration` オプションを通じて、サーバーレベルのデフォルト設定として指定されます。バッチおよびストリーミングのAPIリクエストでは、リクエスト単位でGPUプロバイダーを指定（オーバーライド）することはできません。

利用可能なすべての `serve` オプションについては、[CLIガイド](guide:cli-guide)を参照してください。

## 認証

「API Key」が設定されている場合、すべてのHTTPリクエストの `Authorization` ヘッダーにBearerトークンとしてキーを含める必要があります。

```http
Authorization: Bearer your_secure_key
```

APIキーが設定されていない場合は、認証情報を含まないリクエストも許可されます。

## サーバー情報と利用可能なモデルの取得

サーバーの実行プラットフォーム情報、ハードウェアステータス、インストール済みのモデル、および利用可能なオンラインの音声認識（ASR）プロバイダーを取得します。

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

## サーバーのヘルスチェックと稼働状況の取得

サーバーの起動時間（uptime）、アクティブおよび保留中のジョブ数、および一時キャッシュストレージの使用状況を取得します。

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

## ジョブの一覧取得

ジョブマネージャーに登録されているすべての文字起こしジョブの現在のステータスを問い合わせます。

- URL: `/v1/transcriptions/jobs`
- Method: `GET`

### レスポンス (`200 OK`)

各 `job_id` に紐づく現在のジョブステータスが返されます。

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

## 文字起こしジョブの作成（送信）

ローカルの音声または動画ファイルを送信して文字起こし処理を依頼します。送信されたジョブはキューに追加され、バックグラウンドのワーカースレッドによって順次実行されます。

- URL: `/v1/transcriptions`
- Method: `POST`
- Content-Type: `multipart/form-data`

### リクエストペイロード

| フィールド名 | データ型 | 必須かどうか | 説明 |
| --- | --- | --- | --- |
| `file` | バイナリ | はい | 文字起こし対象の音声または動画ファイル。 |
| `model_id` | 文字列 | はい | ローカルASRモデルのID（`sensevoice` など）、または設定済みのクラウドASRプロバイダーのID（`volcengine-doubao` など）。 |
| `language` | 文字列 | いいえ | 対象言語コード（`zh`、`en`、`ja`、`ko`、`yue` など）。デフォルト値は `auto`。 |
| `hotwords` | 文字列 | いいえ | 音声認識精度を高めるためのカスタム語彙またはキーワード（改行区切り）。 |
| `webhook_url` | 文字列 | いいえ | 文字起こし完了時または失敗時に、POST通知を受け取るHTTP URL。 |
| `webhook_secret` | 文字列 | いいえ | HMAC-SHA256でWebhookのペイロードを署名するためのシークレットキー。 |

### レスポンス (`200 OK`)

文字起こしタスクに割り当てられた一意の `job_id` が返されます:

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

### Curl実行例

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=zh"
```

## ジョブステータスの問い合わせ

送信したジョブの進捗状態および文字起こし結果を問い合わせます。

- URL: `/v1/transcriptions/:job_id`
- Method: `GET`

### レスポンス構造

ジョブの進捗状況に応じて、以下のいずれかのJSONパターンが返されます。

#### Pending (保留中)

ジョブはキューに登録され、バックグラウンドワーカーの空きを待っている状態です。

```json
"Pending"
```

#### Processing (処理中)

ジョブがアクティブになり、現在文字起こし処理を実行している状態です。

```json
"Processing"
```

#### Completed (完了)

文字起こしが正常に完了しました。セグメントごとのテキストとミリ秒単位のタイムスタンプが返されます:

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

文字起こし処理が失敗しました。具体的なエラーメッセージが含まれます:

```json
{
  "Failed": "Failed to decode audio file: invalid format"
}
```

### Curl実行例

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

## Webhookと検証

ジョブ作成時に `webhook_url` を指定していた場合、Sonaはジョブ完了時または失敗時に、そのURL宛てに最終的なステータスを示すJSONデータをPOST送信します。

### Webhook署名ヘッダー (`X-Sona-Signature`)

Webhookの安全性を検証するため、ジョブの作成時に `webhook_secret` を指定します。Sonaは指定されたシークレットを使用して、送信するJSONペイロードのHMAC-SHA256署名を計算し、以下のヘッダーとして送信します。

- ヘッダー名: `X-Sona-Signature`
- フォーマット: `sha256=<16進数エンコードされた署名文字列>`

### 検証用アルゴリズムの例

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
