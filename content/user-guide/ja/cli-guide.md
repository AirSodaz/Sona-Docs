Sona は、デスクトップアプリの実行ファイルを通じて、オフライン文字起こし用の CLI コマンドを提供しています。パッケージ版インストーラーでインストールした場合、`sona` がシェルの `PATH` に自動追加されないことがあるため、インストール済みアプリのバイナリを直接指定して CLI サブコマンドを実行してください。ソースからビルドする場合は、Cargo から同じコマンドを実行できます。

CLI の範囲は意図的に絞られています。現在含まれるのは、単一ファイルとディレクトリのオフライン文字起こし、プリセットモデルの一覧表示 / ダウンロード / 削除、ヘッドレス HTTP API サーバー起動です。Live Record、LLM Polish、Translate は CLI には含まれません。

## 実行方法

- Windows: インストールディレクトリから `Sona.exe transcribe ...` を実行します。
- macOS: `/Applications/Sona.app/Contents/MacOS/Sona transcribe ...` を実行します。
- Linux パッケージ: インストール先の `Sona` バイナリに CLI サブコマンドを付けて実行します。
- AppImage: マウントした AppImage の実行ファイルを指定し、CLI サブコマンドを付けて実行します。
- ソースからビルド: `cargo run --manifest-path src-tauri/Cargo.toml -- transcribe ./sample.mp4 --config ./sona-cli.toml` を実行します。

## 主なコマンド

### ファイルを文字起こしする

```bash
sona transcribe ./sample.mp4 \
  --config ./sona-cli.toml \
  --output ./sample.srt
```

`--output` を指定しない場合、文字起こし結果は JSON として標準出力（`stdout`）に出力されます。`--output` を指定した場合、`--format` を明示しない限り、出力形式はファイル拡張子から自動判定されます。

### ディレクトリを文字起こしする

```bash
sona transcribe \
  --input-dir ./media \
  --output-dir ./transcripts \
  --format srt \
  --recursive \
  --jobs 1 \
  --config ./sona-cli.toml
```

ディレクトリモードでは、対応している各メディアファイルごとに `--output-dir` へ文字起こしファイルを書き出します。既定では直下のファイルだけを走査します。`--recursive` を追加するとサブディレクトリも対象になり、相対パスを保ったまま出力されます。文字起こし本文はファイルへ書き出され、`stdout` には JSON の成功 / 失敗サマリーが出力されます。

### モデルを一覧表示、ダウンロード、削除する

```bash
sona models list --mode offline --type whisper
sona models list --language zh --installed
sona models download sherpa-onnx-whisper-turbo
sona models delete sherpa-onnx-whisper-turbo
```

`models download` を実行すると、選択したプリセットで必要な場合に、`silero-vad` や既定の句読点モデルなどの関連モデルも自動でダウンロードされます。
`models delete` は指定したモデルだけを削除します。関連モデルは自動削除されません。

### API サーバーを起動する

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

HTTP API のエンドポイントやリクエスト例は、[HTTP API ガイド](guide:api-guide)を参照してください。

## 設定ファイル

`--config` オプションで TOML ファイルを渡します。コマンドライン引数で指定した値は、設定ファイルの値を上書きします。

最小構成の `transcribe` 設定ファイル例:

```toml
models_dir = "C:/Users/you/AppData/Local/com.asoda.sona/models"
model_id = "sherpa-onnx-whisper-turbo"
vad_model_id = "silero-vad"
language = "auto"
threads = 4
enable_itn = false
vad_buffer_size = 5.0
gpu_acceleration = "auto"
hotwords = "Sona,offline ASR"
format = "srt"
```

### `transcribe` の設定キー

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `models_dir` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | CLI がデスクトップアプリのモデルを検出できない場合に、明示的にパスを指定します。 |
| `model_id` | 引数 `--model-id` を指定しない限り必須 | オフラインのプリセットモデル ID | なし | `sona models list --mode offline` で ID を確認してください。 |
| `vad_model_id` | 任意 | プリセットモデル ID | 必要な場合は `silero-vad` | 選択したモデルが VAD を必要とする場合に使います。既定の関連モデルを上書きできます。 |
| `punctuation_model_id` | 任意 | プリセットモデル ID | 必要な場合は `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | 選択したモデルが句読点モデルを必要とする場合に使います。既定の関連モデルを上書きできます。 |
| `language` | 任意 | `auto` または `zh`、`en`、`ja` などのモデル言語コード | `auto` | 自動言語検出を上書きします。 |
| `threads` | 任意 | `0` より大きい整数 | `4` | 認識処理のスレッド数。 |
| `enable_itn` | 任意 | `true` または `false` | `false` | 逆テキスト正規化（ITN）を有効にします。 |
| `hotwords` | 任意 | カンマ区切りの単語 | なし | カスタム ASR ホットワード。現在、Transducer および Qwen3 モデルでサポートされています。 |
| `vad_buffer_size` | 任意 | `0` より大きい数値 | `5.0` | VAD のバッファサイズ（秒単位）。 |
| `gpu_acceleration` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | GPU アクセラレーションを無効にする場合は `cpu` を指定します。 |
| `format` | 任意 | `json`, `txt`, `srt`, `vtt`, `md` | 標準出力またはディレクトリモードでは `json`、それ以外は `--output` から自動判定 | 出力ファイル拡張子からの自動判定を上書きします。 |

### `serve` の設定キー

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `host` | 任意 | バインド IP アドレス | `0.0.0.0` | ローカルマシンからのアクセスに限定する場合は `127.0.0.1` を使います。 |
| `port` | 任意 | TCP ポート `0`〜`65535` | `14200` | API サーバーの TCP ポート番号。 |
| `api_key` | 任意 | 文字列 | 空文字 | 空の場合、リクエストは Bearer 認証で保護されません。 |
| `models_dir` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | インストール済みモデルの解決に使います。 |
| `ip_whitelist` | 任意 | カンマ区切りのルール | `localhost` | `localhost`、特定の IP、CIDR、`*`、`192.168.*` などの IPv4 ワイルドカードをサポートします。 |
| `max_streaming` | 任意 | 非負整数 | `2` | WebSocket の最大同時ストリーミング接続数。 |
| `max_concurrent` | 任意 | 非負整数 | `2` | 最大同時バッチジョブ処理数。 |
| `max_queue_size` | 任意 | 非負整数 | `100` | `0` はキューを無制限にすることを意味します。 |
| `max_upload_size_mb` | 任意 | 非負整数 | `50` | `0` はアップロードファイル制限を無効にします。 |
| `job_ttl_minutes` | 任意 | 非負整数 | `60` | `0` は完了または失敗したジョブ履歴のクリーンアップを無効にします。 |
| `gpu_acceleration` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | ローカルのバッチジョブとストリーミングジョブに使う、サーバーレベルの既定値です。 |
| `vad_model_id` | 任意 | プリセットモデル ID | `silero-vad` | API サーバージョブで使う既定の VAD 関連モデル。 |
| `punctuation_model_id` | 任意 | プリセットモデル ID | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | API サーバージョブで使う既定の句読点関連モデル。 |

## パラメータ

### グローバル

```text
sona
  -V, --version
  -v, --verbose
  -h, --help
  help
```

Sona のバージョンを表示するには `-V` または `--version` を使います。詳しい診断ログを出すには、サブコマンドの前に `-v` または `--verbose` を追加します。コマンドのヘルプは、`-h`、`--help`、または `help` サブコマンドで表示できます。

```bash
sona --version
sona -V
sona -v models list
sona --verbose transcribe ./sample.mp4 --config ./sona-cli.toml
sona transcribe --help
```

詳細な診断情報は標準エラー出力（`stderr`）に出力されます。`models list` の結果や、`--output` を付けない `transcribe` の JSON 出力など、コマンド本体の結果は標準出力（`stdout`）に出るため、他のツールへパイプできます。

高度なラッパーやテストでは、`SONA_FORCE_CLI=1` を設定すると、認識済みの CLI サブコマンドなしで実行ファイルが起動された場合でも CLI モードを強制できます。

### `transcribe`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `<input>` | `--input-dir` を指定しない限り必須 | ローカルの音声または動画ファイルのパス | なし | 文字起こし対象の単一ファイル。 |
| `--input-dir <dir>` | ディレクトリモードでは必須 | ディレクトリパス | なし | ディレクトリ内の対応メディアファイルを文字起こしします。 |
| `--config <path>` | 任意 | TOML ファイルパス | なし | 設定ファイルから既定値を読み込みます。 |
| `--output <path>` | 任意 | ファイルシステムパス | `stdout` | 出力ファイルのパス。 |
| `--output-dir <dir>` | `--input-dir` と併用する場合は必須 | ディレクトリパス | なし | 入力ファイルごとに文字起こしファイルを書き出します。 |
| `--recursive` | 任意 | フラグ | オフ | サブディレクトリを走査し、相対出力パスを保ちます。 |
| `--jobs <n>` | 任意 | `0` より大きい整数 | `1` | ディレクトリモードの最大同時ファイルジョブ数。 |
| `--format <format>` | 任意 | `json`, `txt`, `srt`, `vtt`, `md` | 標準出力またはディレクトリモードでは `json`、それ以外は `--output` から自動判定 | 設定ファイルと出力ファイル拡張子による自動判定を上書きします。 |
| `--language <code>` | 任意 | `auto` またはモデル言語コード | `auto` | 設定ファイルの指定を上書きします。 |
| `--model-id <id>` | 設定ファイルで `model_id` が設定されていない限り必須 | オフラインのプリセットモデル ID | なし | メインの音声認識モデル。 |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | 設定ファイルの指定を上書きします。 |
| `--vad-model-id <id>` | 任意 | プリセットモデル ID | 必要な場合は `silero-vad` | 既定の VAD 関連モデルを上書きします。 |
| `--punctuation-model-id <id>` | 任意 | プリセットモデル ID | 必要な場合は `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | 既定の句読点関連モデルを上書きします。 |
| `--threads <n>` | 任意 | `0` より大きい整数 | `4` | 設定ファイルの指定を上書きします。 |
| `--enable-itn` | 任意 | フラグ | `false` | `--disable-itn` と同時には使えません。 |
| `--disable-itn` | 任意 | フラグ | `false` | `enable_itn = true` を上書きします。`--enable-itn` と同時には使えません。 |
| `--hotwords <words>` | 任意 | カンマ区切りの単語 | なし | `hotwords` を上書きします。現在、Transducer および Qwen3 モデルでサポートされています。 |
| `--gpu-acceleration <provider>` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | 設定ファイルの指定を上書きします。 |
| `--vad-buffer <seconds>` | 任意 | `0` より大きい数値 | `5.0` | `vad_buffer_size` の CLI 引数名。 |
| `--save-wav <path>` | 任意 | ファイルシステムパス | なし | CLI 専用。リサンプリングされた中間 WAV ファイルを保存します。`--input-dir` とは併用できません。 |
| `--quiet` | 任意 | フラグ | オフ | CLI 専用。文字起こしの進捗表示を隠します。 |

### `models list`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | インストール済みプリセットの検出に使います。 |
| `--mode <mode>` | 任意 | `streaming`, `offline` | すべてのモード | 対応モードで絞り込みます。 |
| `--type <type>` | 任意 | プリセットモデルの種類（`whisper`、`vad`、`punctuation` など） | すべての種類 | モデルタイプで絞り込みます。 |
| `--language <code>` | 任意 | 言語トークン（`zh`、`en`、`ja`、`yue` など） | すべての言語 | 対応言語トークンで絞り込みます。 |
| `--installed` | 任意 | フラグ | オフ | `models_dir` 内に存在するモデルだけを表示します。 |
| 出力 | 常に | JSON | JSON | 標準出力に出力されます。 |

### `models download`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `<model_id>` | 必須 | 既知のプリセットモデル ID | なし | ダウンロードするメインモデル。 |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | 保存先のモデルディレクトリ。 |
| `--quiet` | 任意 | フラグ | オフ | ダウンロードごとの進捗表示を隠します。 |
| 関連ダウンロード | 自動 | 必須の VAD および句読点プリセット | 自動 | メインモデルをダウンロードすると、必要な関連モデルも自動的にダウンロードされます。 |

### `models delete`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `<model_id>` | 必須 | 既知のプリセットモデル ID | なし | 削除するモデル。 |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | 対象モデルディレクトリ。 |
| `--yes` | 任意 | フラグ | オフ | 対話確認を省略します。 |
| インストール先がない場合 | いいえ | 既知だが未インストールのプリセット | 成功 no-op | `stderr` に通知して終了コード 0 で終了します。 |
| 関連モデルの削除 | いいえ | 必須の VAD と句読点プリセット | 削除しない | 不要な関連モデルは明示的に削除してください。 |

### `serve`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `--config <path>` | 任意 | TOML ファイルパス | なし | 設定ファイルから既定値を読み込みます。 |
| `--host <ip>` | 任意 | バインド IP アドレス | `0.0.0.0` | 設定ファイルの指定を上書きします。 |
| `--port <port>` | 任意 | TCP ポート `0`〜`65535` | `14200` | 設定ファイルの指定を上書きします。 |
| `--api-key <key>` | 任意 | 文字列 | 空文字 | 設定ファイルの指定を上書きします。 |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | 設定ファイルの指定を上書きします。 |
| `--ip-whitelist <rules>` | 任意 | カンマ区切りのルール | `localhost` | `localhost`、特定の IP、CIDR、`*`、`192.168.*` などの IPv4 ワイルドカードをサポートします。 |
| `--max-streaming <n>` | 任意 | 非負整数 | `2` | 設定ファイルの指定を上書きします。 |
| `--max-concurrent <n>` | 任意 | 非負整数 | `2` | 設定ファイルの指定を上書きします。 |
| `--max-queue-size <n>` | 任意 | 非負整数 | `100` | 設定ファイルの指定を上書きします。 |
| `--max-upload-size-mb <n>` | 任意 | 非負整数 | `50` | 設定ファイルの指定を上書きします。 |
| `--job-ttl-minutes <n>` | 任意 | 非負整数 | `60` | 設定ファイルの指定を上書きします。 |
| `--gpu-acceleration <provider>` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | HTTP API リクエストでは、リクエスト単位の GPU 上書きは受け付けません。 |
| `--vad-model-id <id>` | 任意 | プリセットモデル ID | `silero-vad` | 設定ファイルの指定を上書きします。 |
| `--punctuation-model-id <id>` | 任意 | プリセットモデル ID | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | 設定ファイルの指定を上書きします。 |

Clap が自動生成する詳細なヘルプを見るには、`sona <command> --help` を実行してください。

デスクトップアプリの通常のワークフローを使いたい場合は、[はじめに](guide:getting-started) または [Batch Import](guide:batch-import) に戻ってください。
