# CLI ガイド

`sona-cli` は、Sona のステートレスなコマンドライン文字起こし Host です。Sona の SQLite アプリケーションデータベース、History/Tag ワークスペース、同期状態、Online LLM タスクを開いたり管理したりしません。文字起こし結果は `stdout`、または明示的に指定した出力ファイルへ書き込まれます。

スタンドアロン CLI には次のコマンドがあります。

- `path-status`
- `init-config`
- `models list|download|delete`
- `diagnostics`
- `export transcript`
- `serve`（ローカル ASR を使うローカル REST 文字起こし）
- `transcribe`（ローカルまたはオンラインのバッチ ASR）
- `transcribe-live`（ローカルまたはオンラインのストリーミング ASR）

## 実行方法

- パッケージ版: 同じプラットフォーム向けインストーラーに含まれる `sona-cli` バイナリを使います。
- ソース版: `cargo run -p sona-cli -- <command> ...`

例:

```bash
cargo run -p sona-cli -- path-status ./models
cargo run -p sona-cli -- init-config
cargo run -p sona-cli -- models list --json
cargo run -p sona-cli -- diagnostics
cargo run -p sona-cli -- transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
cargo run -p sona-cli -- transcribe ./sample.wav --online-provider groq-whisper
cargo run -p sona-cli -- transcribe-live --online-provider volcengine-doubao
cargo run -p sona-cli -- export transcript --input ./segments.json --output ./transcript.vtt
cargo run -p sona-cli -- serve --host 127.0.0.1 --port 14200
```

## ステートレス境界

CLI では SQLite、History、Tag、アプリケーションのバックアップ/復元、Sync、Online LLM を意図的に対象外としています。デスクトップアプリのデータディレクトリを作成、変更することはありません。`export transcript` と `stdout`/ファイル出力を使って、ほかのツールと組み合わせてください。

## コマンド

### `path-status`

共有ランタイムステータス契約で 1 つのファイルシステムパスを解決し、JSON を `stdout` に出力します。

```bash
sona-cli path-status ./models
```

### `init-config`

ローカル文字起こしとローカル API server 用の、コメント付き TOML 設定テンプレートを作成します。

```bash
sona-cli init-config
sona-cli init-config ./sona-cli.toml --force
```

既存ファイルは `--force` を指定しない限り上書きされません。ステータスは `stderr` に出力されます。

### `models`

ローカル ASR プリセットモデルを一覧表示、ダウンロード、削除します。選択したモデルディレクトリだけを操作し、SQLite アプリケーション状態は扱いません。

```bash
sona-cli models list --mode offline --type whisper
sona-cli models list --language zh --installed --json
sona-cli models download sherpa-onnx-whisper-turbo
sona-cli models delete sherpa-onnx-whisper-turbo --yes
```

### `diagnostics`

Host が提供する情報から diagnostics スナップショットを作成します。アプリケーションデータベースは読み取りません。

### `export transcript`

文字起こしセグメントの JSON 配列を、共有 Core export service でエクスポートします。

```bash
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.srt --mode bilingual
```

`--format` がなければ出力ファイルの拡張子から形式を判断します。対応形式は `json`、`txt`、`srt`、`vtt`、`md`、対応モードは `original`、`translation`、`bilingual` です。

### `transcribe`

ローカル音声ファイルを 1 つ文字起こしします。ローカル ASR では動画ファイルも入力できます。`--online-provider` がなければ、インストール済みのローカル Sherpa プリセットを使います。

```bash
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
sona-cli transcribe ./sample.wav --config ./sona-cli.toml --output ./out.srt
```

`--online-provider` を指定すると、ローカルファイルを選択した provider にアップロードし、結果を `stdout` または指定した出力ファイルへ書き込みます。

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

オンラインバッチは `volcengine-doubao`、`groq-whisper`、`mistral-voxtral` に対応しています。

| Provider | 既定の環境変数 |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

別の環境変数を使うには `--api-key-env NAME` を指定します。`--online-config FILE` は endpoint/model など機密情報ではない上書きを含む JSON オブジェクトを受け付けますが、`apiKey` または `api_key` を含めることはできません。

オンライン provider を選んだ場合、`--model-id`、`--models-dir`、VAD/句読点オプション、スレッド数、GPU モード、`--save-wav` などローカル専用オプションは拒否されます。既存の出力ファイルを置き換えるには `--force` が必要です。

### `transcribe-live`

マイク入力、または `stdin` からのヘッダーなし 16 kHz モノラル signed 16-bit little-endian PCM をリアルタイムで文字起こしします。

```bash
sona-cli transcribe-live --list-input-devices
sona-cli transcribe-live \
  --model-id sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17 \
  --device "Studio Mic" --duration 60 --output ./live.srt

ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli transcribe-live --input stdin \
    --model-id sherpa-onnx-streaming-paraformer-trilingual-zh-cantonese-en \
    --output-format ndjson
```

オンラインストリーミングは現在 `volcengine-doubao` のみに対応しています。

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli transcribe-live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

マイク入力は既定の CPAL 入力デバイスを使います。`--device` を指定する場合は、`--list-input-devices` が返す正確な名前を使ってください。`--output-format` は `text` または `ndjson`、`--output` の最終スナップショットは `json`、`txt`、`srt`、`vtt`、`md` に対応します。`--format` には `--output` も必要です。Ctrl+C、`stdin` EOF、`--duration` は、セッションを flush/stop してから終了します。

オンライン認証情報と機密情報ではない設定の規則は `transcribe` と同じです。オンラインストリーミングでローカルモデルまたはランタイムオプションを指定すると拒否されます。

### `serve`

共有ローカル HTTP API server を起動します。CLI server はローカル ASR 専用であり、Online ASR や WebSocket ストリーミングを公開しません。Online ASR には `transcribe` または `transcribe-live` を直接使ってください。

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

## 出力とエラー

`transcribe` は既定で JSON を `stdout` に書き込みます。`transcribe-live` はライブテキストまたは NDJSON イベントを出力し、任意で最終ファイルも書き込めます。検証エラーは終了コード 2、モデルエラーは 3、ネットワーク/provider エラーは 4、ファイルシステム/入力エラーは 5 です。

コマンドごとの使い方は `sona-cli <command> --help` で確認できます。
