Sona は、外部のヘッドレス統合向けにプライバシー優先のローカル HTTP API サーバーを提供します。自動化スクリプト、バッチ処理ツール、Web フロントエンド、またはセカンダリアプリケーションから、REST エンドポイントおよび WebSocket リアルタイムストリーミングを通じて、ローカルで安全に音声文字起こしワークフローを制御できます。

## 設定とサーバーの起動

API サーバーは以下の 2 つの方法で起動できます：

### GUI クライアント設定

`設定 > API サーバー` に移動して設定します：

- `API サーバーを有効化`：有効/無効を切り替えます。
- `ホスト`：バインドする IP アドレス。ローカルマシンのみに制限する場合は `127.0.0.1`、LAN 内のデバイスからのアクセスを許可する場合は `0.0.0.0` を使用します。
- `ポート`：サーバーの待受 TCP ポート（デフォルトは `14200`）。
- `API Key`：エンドポイントを保護するための任意の Bearer トークン。`生成` をクリックして安全なキーを作成し、`コピー` でクリップボードにコピーできます。

### スタンドアロン CLI モード

スタンドアロンの `sona-cli` から同じサーバーアダプターを起動することも可能です：

```bash
sona-cli serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

CLI サーバー（`sona-cli serve`）は、インストール済みローカルオフラインモデルによる REST 文字起こしおよびネイティブの WebSocket リアルタイムストリーミング（`/v1/streaming`）に対応しています。`serve` ルートではクラウド Online ASR は提供されません。オンラインモデルを直接使用する場合は、`sona-cli transcribe` または `sona-cli transcribe-live` を使用してバッチまたはストリーミング文字起こしを実行してください。

`serve` の詳細なオプション仕様については、[CLI ガイド](guide:cli-guide) を参照してください。

## 認証

`API Key` が設定されている場合、すべての HTTP リクエストの `Authorization` ヘッダーに Bearer トークンを含める必要があります：

```http
Authorization: Bearer your_secure_key
```

API キーが設定されていない場合、サーバーは認証なしのリクエストを許可します。HTML5 メディア再生や WebSocket など、ヘッダーを渡すのが難しい環境では、`token` または `api_key` クエリパラメータとして渡すこともできます。

## エンドポイントリファレンス

### 1. サーバー情報と機能

サーバーのプラットフォーム情報、ハードウェアアクセラレーション状態、インストール済みモデル、利用可能なクラウド ASR プロバイダーを取得します。

- URL：`/info`
- メソッド：`GET`

#### レスポンス例 (`200 OK`)

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

### 2. サーバーヘルス状態と統計

稼働時間、実行中/待機中のジョブ数、一時ストレージの使用量を取得します。

- URL：`/health`
- メソッド：`GET`

#### レスポンス例 (`200 OK`)

```json
{
  "status": "ok",
  "uptime": 3600,
  "activeJobs": 1,
  "pendingJobs": 0,
  "cacheSpaceBytes": 10485760
}
```

### 3. 全ジョブの一覧取得

キューマネージャー内のすべての文字起こしジョブの状態を取得します。

- URL：`/v1/transcriptions`（または `/v1/transcriptions/jobs`）
- メソッド：`GET`

#### クエリパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
| --- | --- | --- | --- | --- |
| `limit` | 整数 | いいえ | `50` | 取得する最大件数 |
| `offset` | 整数 | いいえ | `0` | ページネーションのスキップ件数 |

#### レスポンス例 (`200 OK`)

```json
{
  "c86e0c65-2746-4e56-9141-866d51bbca43": "Pending",
  "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5": "Processing"
}
```

### 4. 文字起こしジョブの送信

音声ファイルをアップロードして新しい文字起こしタスクをキューに追加します。

- URL：`/v1/transcriptions`
- メソッド：`POST`
- Content-Type：`multipart/form-data`

#### リクエストフィールド

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `file` | バイナリ | はい | 文字起こし対象の音声ファイル（`wav`、`mp3`、`flac`、`ogg`、`m4a`、`aac`）。 |
| `model_id` | 文字列 | いいえ | 使用するモデル ID（省略時は最初のローカルモデルを使用）。 |
| `language` | 文字列 | いいえ | 対象言語コード（`zh`、`en`、`ja`、`auto` など）。 |
| `hotwords` | 文字列 | いいえ | 認識精度を向上させるカンマ区切りのカスタム用語/ホットワード。 |
| `online_provider` | 文字列 | いいえ | 設定済みクラウドプロバイダー ID（`volcengine-doubao` など）。 |
| `webhook_url` | 文字列 | いいえ | 完了または失敗時に HTTP POST を受信する URL。 |
| `webhook_secret` | 文字列 | いいえ | Webhook 署名用の HMAC-SHA256 シークレット。 |

#### レスポンス例 (`200 OK`)

```json
{
  "job_id": "c86e0c65-2746-4e56-9141-866d51bbca43"
}
```

#### Curl 例

```bash
curl -X POST http://127.0.0.1:14200/v1/transcriptions \
  -H "Authorization: Bearer your_secure_key" \
  -F "file=@/path/to/interview.wav" \
  -F "model_id=sensevoice" \
  -F "language=ja"
```

### 5. ジョブ状態と結果の照会

ジョブ ID を指定して進行状況および文字起こし結果のセグメントを取得します。

- URL：`/v1/transcriptions/:job_id`
- メソッド：`GET`

#### レスポンス構造

ジョブの進捗に応じて、以下のいずれかの形式が返されます：

##### 待機中 (Pending)
```json
"Pending"
```

##### 処理中 (Processing)
```json
"Processing"
```

##### 完了 (Completed)
```json
{
  "Completed": [
    {
      "id": 0,
      "start": 120,
      "end": 2840,
      "text": "こんにちは、Sona へようこそ。",
      "speaker": "Speaker 0"
    },
    {
      "id": 1,
      "start": 3100,
      "end": 5600,
      "text": "音声はすべてお使いのマシン上でローカルに処理されます。",
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

#### Curl 例

```bash
curl http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 6. ジョブの削除 / キャンセル

実行中の文字起こしをキャンセルするか、完了/失敗したジョブおよび一時音声ファイルを削除します。

- URL：`/v1/transcriptions/:job_id`
- メソッド：`DELETE`

#### レスポンス (`204 No Content`)

ジョブと一時ファイルが直ちに削除され、実行中のタスクは安全に中止されます。

```bash
curl -X DELETE http://127.0.0.1:14200/v1/transcriptions/c86e0c65-2746-4e56-9141-866d51bbca43 \
  -H "Authorization: Bearer your_secure_key"
```

### 7. ジョブ音声ファイルの取得

ジョブに紐づく元の音声ファイルをストリーミング再生またはダウンロードします。HTTP Range ヘッダーに対応しているため、プレイヤーでのシーク再生が可能です。

- URL：`/v1/transcriptions/:job_id/audio`
- メソッド：`GET`

#### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `token` | 文字列 | いいえ | HTML5 `<audio>` / `<video>` タグ用の Bearer トークン代替。 |

#### レスポンス (`200 OK` または `206 Partial Content`)

適切な `Content-Type`（`audio/wav`、`audio/mpeg` など）を持つバイナリ音声ストリームを返します。

### 8. ジョブ字幕ファイルのエクスポート

完了した文字起こし結果を指定の字幕またはテキスト形式で直接書き出します。

- URL：`/v1/transcriptions/:job_id/export`
- メソッド：`GET`

#### クエリパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
| --- | --- | --- | --- | --- |
| `format` | 文字列 | いいえ | `srt` | 形式：`srt`、`vtt`、`json`、`txt`、`md`。 |
| `mode` | 文字列 | いいえ | `original` | モード：`original`（原文）、`translation`（訳文）、`bilingual`（対訳）。 |

#### レスポンス (`200 OK`)

`Content-Disposition: attachment; filename="{job_id}.{format}"` ヘッダーと該当する MIME タイプが返されます。

### 9. LLM セグメント整形 (Polish)

デスクトップで設定された LLM プロバイダーを使って、文字起こしセグメントのフィラー除去や表記統一を行います。

- URL：`/v1/llm/polish`
- メソッド：`POST`
- Content-Type：`application/json`

#### リクエストボディ例

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "ええと、こんにちは世界",
      "isFinal": true
    }
  ]
}
```

#### レスポンス例 (`200 OK`)

```json
{
  "segments": [
    {
      "id": "seg-0",
      "start": 0.0,
      "end": 2.5,
      "text": "こんにちは、世界。",
      "isFinal": true
    }
  ]
}
```

### 10. LLM セグメント翻訳

デスクトップで設定された LLM プロバイダーを使って、文字起こしセグメントを指定の言語に翻訳します。

- URL：`/v1/llm/translate`
- メソッド：`POST`
- Content-Type：`application/json`

#### リクエストボディ例

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
  "target_language": "ja"
}
```

#### レスポンス例 (`200 OK`)

各セグメントに `translation` フィールドが付与された配列が返されます。

### 11. WebSocket リアルタイム音声ストリーミング

WebSocket 経由で生の PCM 音声チャンクをストリーミング送信し、極めて低い遅延でリアルタイム文字起こし結果を受信します。

- URL：`/v1/streaming`（または `ws://127.0.0.1:14200/v1/streaming?token=your_secure_key`）
- プロトコル：`WebSocket`

#### ハンドシェイク認証

接続開始時にクエリ文字列（`?token=...` または `?api_key=...`）または標準の `Authorization: Bearer <key>` ヘッダーで認証キーを渡します。

#### プロトコルシーケンス

1. **クライアント -> サーバー (テキスト JSON)**：セッション開始
   ```json
   {
     "type": "start",
     "model_id": "sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17",
     "language": "auto",
     "hotwords": null,
     "vad_model_id": "silero-vad"
   }
   ```
2. **サーバー -> クライアント (テキスト JSON)**：セッション確認
   ```json
   {
     "type": "started",
     "session_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
   }
   ```
3. **クライアント -> サーバー (バイナリ Binary)**：生 PCM 音声データを送信
   - フォーマット：16 kHz、16-bit リトルエンディアン、モノラル（`pcm_s16le`）。
4. **サーバー -> クライアント (テキスト JSON)**：認識セグメントを受信
   ```json
   {
     "type": "segment",
     "segment": {
       "id": "seg-1",
       "text": "こんにちは世界",
       "start": 0.0,
       "end": 1.8,
       "isFinal": false
     }
   }
   ```
5. **クライアント -> サーバー (テキスト JSON)**：セッション終了
   ```json
   {
     "type": "stop"
   }
   ```

## Webhook と署名検証

ジョブ送信時に `webhook_url` を指定した場合、Sona はジョブの完了または失敗時にその URL へ HTTP POST リクエストを送信します。

### Webhook 署名 (`X-Sona-Signature`)

Webhook の改ざんを防止するために、送信時に `webhook_secret` を設定します。Sona は未加工の JSON ペイロードから HMAC-SHA256 署名を計算し、ヘッダーに付与します：

- ヘッダー名：`X-Sona-Signature`
- 形式：`sha256=<hex_encoded_signature>`

### 検証アルゴリズム（Node.js の例）

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
