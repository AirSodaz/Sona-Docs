# CLIガイド

Sonaは、メインのデスクトップ実行ファイルを通じてオフライン文字起こしのコマンドをCLIから利用可能にしています。パッケージ版インストーラーでインストールした場合、`sona` はシェルの環境変数 `PATH` に自動追加されないため、インストールしたアプリのバイナリを直接指定してCLIサブコマンドを実行してください。ソースからビルドする場合は、Cargoを使用して同じコマンドを実行できます。

CLIの機能範囲は意図的に限定されており、「単一ファイルのオフライン文字起こし」、「プリセットモデルの一覧表示およびダウンロード」、および「バックグラウンド（ヘッドレス）でのHTTP APIサーバー起動」が含まれます。ライブ録音、LLM校正、LLM翻訳機能は含まれません。

## 実行方法

- Windows: インストールディレクトリから `Sona.exe transcribe ...` を実行します。
- macOS: `/Applications/Sona.app/Contents/MacOS/Sona transcribe ...` を実行します。
- Linuxパッケージ: インストール先のパスからパッケージ版の `Sona` バイナリを実行し、CLIサブコマンドを指定します。
- AppImage: マウントしたAppImageの実行ファイルを指定し、CLIサブコマンドを付与して実行します。
- ソースからビルド: `cargo run --manifest-path src-tauri/Cargo.toml -- transcribe ./sample.mp4 --config ./sona-cli.toml` を実行します。

## 主なコマンド

### ファイルの文字起こし

```bash
sona transcribe ./sample.mp4 \
  --config ./sona-cli.toml \
  --output ./sample.srt
```

`--output` を指定しない場合、文字起こし結果はJSON形式で標準出力（`stdout`）に書き出されます。`--output` を指定した場合、出力形式はファイルの拡張子から自動判定されます（ただし、`--format` が明示的に指定された場合を除きます）。

### モデルの一覧表示またはダウンロード

```bash
sona models list --mode offline --type whisper
sona models list --language zh --installed
sona models download sherpa-onnx-whisper-turbo
```

`models download` を実行すると、選択したプリセットで必要とされる場合、`silero-vad` やデフォルトの句読点モデルなどのコンパニオンモデルが自動的にダウンロードされます。

### APIサーバーの起動

```bash
sona serve --host 127.0.0.1 --port 14200 --api-key your_secure_key
```

HTTP APIのエンドポイントやリクエスト例については、[APIガイド](guide:api-guide)を参照してください。

## 設定ファイル

`--config` オプションを使用してTOMLファイルを渡します。コマンドライン引数のフラグは、設定ファイルに記載された値を上書きします。

最小構成の `transcribe` 設定ファイルの例:

```toml
models_dir = "C:/Users/you/AppData/Local/com.asoda.sona/models"
model_id = "sherpa-onnx-whisper-turbo"
vad_model_id = "silero-vad"
language = "auto"
threads = 4
enable_itn = false
vad_buffer_size = 5.0
gpu_acceleration = "auto"
format = "srt"
```

### `transcribe` の設定キー

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `models_dir` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | CLIがデスクトップアプリのモデルを検出できない場合に、明示的にパスを指定します。 |
| `model_id` | 引数 `--model-id` を指定しない限り必須 | オフラインのプリセットモデルID | なし | `sona models list --mode offline` を実行してIDを確認してください。 |
| `vad_model_id` | 条件付き | プリセットモデルID | なし | 選択したモデルがVADを必要とする場合に必須となります。 |
| `punctuation_model_id` | 条件付き | プリセットモデルID | なし | 選択したモデルが句読点モデルを必要とする場合に必須となります。 |
| `language` | 任意 | `auto` または `zh`、`en`、`ja` などのモデル言語コード | `auto` | 自動言語検出を上書きします。 |
| `threads` | 任意 | `0` より大きい整数 | `4` | 認識処理のスレッド数。 |
| `enable_itn` | 任意 | `true` または `false` | `false` | 逆テキスト正規化（ITN）を有効にします。 |
| `vad_buffer_size` | 任意 | `0` より大きい数値 | `5.0` | VADのバッファサイズ（秒単位）。 |
| `gpu_acceleration` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | GPUアクセラレーションを無効にするには `cpu` を指定します。 |
| `format` | 任意 | `json`, `txt`, `srt`, `vtt`, `md` | 標準出力の場合は `json`、それ以外は `--output` から自動判定 | 出力ファイルの拡張子からの自動判定を上書きします。 |

### `serve` の設定キー

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `host` | 任意 | バインドIPアドレス | `0.0.0.0` | ローカルマシンからのアクセスに限定する場合は `127.0.0.1` を使用します。 |
| `port` | 任意 | TCPポート `0`〜`65535` | `14200` | APIサーバーのTCPポート番号。 |
| `api_key` | 任意 | 文字列 | 空文字 | 空の場合は、リクエストがBearer認証で保護されません。 |
| `models_dir` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | インストール済みのモデルを解決するために使用します。 |
| `ip_whitelist` | 任意 | カンマ区切りのルール | `localhost` | `localhost`、特定のIP、CIDR、`*`、および `192.168.*` などのIPv4ワイルドカードをサポートします。 |
| `max_streaming` | 任意 | 非負整数 | `2` | WebSocketの最大同時ストリーミング接続数。 |
| `max_concurrent` | 任意 | 非負整数 | `2` | 最大同時バッチジョブ処理数。 |
| `max_queue_size` | 任意 | 非負整数 | `100` | `0` はキューが無制限であることを意味します。 |
| `max_upload_size_mb` | 任意 | 非負整数 | `50` | `0` はアップロードファイル制限を無効にします。 |
| `job_ttl_minutes` | 任意 | 非負整数 | `60` | `0` は完了または失敗したジョブの履歴クリーンアップを無効にします。 |
| `gpu_acceleration` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | ローカルのバッチジョブおよびストリーミングジョブに対するサーバーレベルのデフォルト設定。 |
| `vad_model_id` | 任意 | プリセットモデルID | `silero-vad` | APIサーバジョブで使用されるデフォルトのVADコンパニオンモデル。 |
| `punctuation_model_id` | 任意 | プリセットモデルID | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | APIサーバジョブで使用されるデフォルトの句読点コンパニオンモデル。 |

## パラメータ

### グローバル

```text
sona
  -V, --version
  -v, --verbose
  -h, --help
  help
```

Sonaのバージョンを出力するには `-V` または `--version` を使用します。詳細な診断ログを出力するには、サブコマンドの前に `-v` または `--verbose` を追加します。コマンドのヘルプを表示するには、`-h`、`--help`、または `help` サブコマンドを使用します。

```bash
sona --version
sona -V
sona -v models list
sona --verbose transcribe ./sample.mp4 --config ./sona-cli.toml
sona transcribe --help
```

詳細な診断情報は標準エラー出力（`stderr`）に書き出されます。`models list` の結果や、`--output` を付与しない `transcribe` のJSON出力を含むコマンドのメインの処理結果は、標準出力（`stdout`）に出力されるため、他のツールへパイプで渡すことができます。

### `transcribe`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `<input>` | 必須 | ローカルの音声または動画ファイルのパス | なし | 文字起こし対象のファイル。 |
| `--config <path>` | 任意 | TOMLファイルパス | なし | 設定ファイルからデフォルト値を読み込みます。 |
| `--output <path>` | 任意 | ファイルシステムパス | `stdout` | 出力ファイルのパス。 |
| `--format <format>` | 任意 | `json`, `txt`, `srt`, `vtt`, `md` | 標準出力の場合は `json`、それ以外は `--output` から自動判定 | 設定ファイルおよび出力ファイル拡張子による自動判定を上書きします。 |
| `--language <code>` | 任意 | `auto` またはモデル言語コード | `auto` | 設定ファイルの指定を上書きします。 |
| `--model-id <id>` | 設定ファイルで `model_id` が設定されていない限り必須 | オフラインのプリセットモデルID | なし | メインの音声認識モデル。 |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | 設定ファイルの指定を上書きします。 |
| `--vad-model-id <id>` | 条件付き | プリセットモデルID | なし | 選択したモデルがVADを必要とする場合に必須となります。 |
| `--punctuation-model-id <id>` | 条件付き | プリセットモデルID | なし | 選択したモデルが句読点モデルを必要とする場合に必須となります。 |
| `--threads <n>` | 任意 | `0` より大きい整数 | `4` | 設定ファイルの指定を上書きします。 |
| `--enable-itn` | 任意 | フラグ | `false` | `--disable-itn` と競合します。 |
| `--disable-itn` | 任意 | フラグ | `false` | `enable_itn = true` を上書きします。`--enable-itn` と競合します。 |
| `--hotwords <words>` | 任意 | カンマ区切りの単語 | なし | CLI専用。現在、Transducer および Qwen3 モデルでサポートされています。 |
| `--gpu-acceleration <provider>` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | 設定ファイルの指定を上書きします。 |
| `--vad-buffer <seconds>` | 任意 | `0` より大きい数値 | `5.0` | `vad_buffer_size` のCLI引数名。 |
| `--save-wav <path>` | 任意 | ファイルシステムパス | なし | CLI専用。リサンプリングされた中間WAVファイルを保存します。 |
| `--quiet` | 任意 | フラグ | オフ | CLI専用。文字起こしの進捗表示を非表示にします。 |

### `models list`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | インストール済みのプリセット検出用。 |
| `--mode <mode>` | 任意 | `streaming`, `offline` | すべてのモード | サポートされているモードでフィルタリングします。 |
| `--type <type>` | 任意 | プリセットモデルの種類（`whisper`、`vad`、`punctuation` など） | すべての種類 | モデルタイプでフィルタリングします。 |
| `--language <code>` | 任意 | 言語トークン（`zh`、`en`、`ja`、`yue` など） | すべての言語 | サポートされている言語トークンでフィルタリングします。 |
| `--installed` | 任意 | フラグ | オフ | `models_dir` 内に存在するモデルのみを表示します。 |
| 出力 | 常に | JSON | JSON | 標準出力に出力されます。 |

### `models download`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `<model_id>` | 必須 | 既知のプリセットモデルID | なし | ダウンロード対象のメインモデル。 |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | 保存先モデルディレクトリ。 |
| `--quiet` | 任意 | フラグ | オフ | ダウンロードごとの進捗表示を非表示にします。 |
| 関連ダウンロード | 自動 | 必須のVADおよび句読点プリセット | 自動 | メインモデルをダウンロードすると、必要なコンパニオンモデルも自動的にダウンロードされます。 |

### `serve`

| パラメータ / 設定キー | 必須かどうか | 指定可能な値の範囲 | デフォルト値 | 備考 |
| --- | --- | --- | --- | --- |
| `--config <path>` | 任意 | TOMLファイルパス | なし | 設定ファイルからデフォルト値を読み込みます。 |
| `--host <ip>` | 任意 | バインドIPアドレス | `0.0.0.0` | 設定ファイルの指定を上書きします。 |
| `--port <port>` | 任意 | TCPポート `0`〜`65535` | `14200` | 設定ファイルの指定を上書きします。 |
| `--api-key <key>` | 任意 | 文字列 | 空文字 | 設定ファイルの指定を上書きします。 |
| `--models-dir <path>` | 任意 | ファイルシステムパス | 推測可能な場合はデスクトップアプリのモデルディレクトリ | 設定ファイルの指定を上書きします。 |
| `--ip-whitelist <rules>` | 任意 | カンマ区切りのルール | `localhost` | `localhost`、特定のIP、CIDR、`*`、および `192.168.*` などのIPv4ワイルドカードをサポートします。 |
| `--max-streaming <n>` | 任意 | 非負整数 | `2` | 設定ファイルの指定を上書きします。 |
| `--max-concurrent <n>` | 任意 | 非負整数 | `2` | 設定ファイルの指定を上書きします。 |
| `--max-queue-size <n>` | 任意 | 非負整数 | `100` | 設定ファイルの指定を上書きします。 |
| `--max-upload-size-mb <n>` | 任意 | 非負整数 | `50` | 設定ファイルの指定を上書きします。 |
| `--job-ttl-minutes <n>` | 任意 | 非負整数 | `60` | 設定ファイルの指定を上書きします。 |
| `--gpu-acceleration <provider>` | 任意 | `auto`, `cpu`, `cuda`, `coreml`, `directml` | `auto` | HTTP APIリクエストはリクエスト単位でのGPUオーバーライドを受け付けません。 |
| `--vad-model-id <id>` | 任意 | プリセットモデルID | `silero-vad` | 設定ファイルの指定を上書きします。 |
| `--punctuation-model-id <id>` | 任意 | プリセットモデルID | `sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12-int8` | 設定ファイルの指定を上書きします。 |

Clap（コマンドラインパーサー）が自動生成した詳細なヘルプを表示するには、`sona <command> --help` を実行してください。

デスクトップアプリの通常のワークフローを利用したい場合は、代わりに[スタートガイド](guide:getting-started)または[バッチインポート](guide:batch-import)に戻ってください。
