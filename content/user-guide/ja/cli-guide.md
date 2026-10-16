`sona-cli` は、`sona-core` をベースにした Sona のスタンドアロン・ステートレスなコマンドライン音声認識ホストです。ローカルプリセット ASR モデルまたはクラウドプロバイダーを使って、音声ファイル、ディレクトリ、マイク入力、標準入力ストリームを文字起こしできます。Sona の SQLite アプリケーションデータベース、プロジェクトデータベース、履歴ストレージ、同期状態、Online LLM タスクを開いたり管理したりすることはありません。文字起こし結果は `stdout` または明示的に指定された出力ファイルに書き出されます。

スタンドアロン CLI は以下の主要コマンドを提供します：

- `live`（互換エイリアス `transcribe-live`）：マイクまたは標準入力からのリアルタイムストリーミング音声認識
- `transcribe`：ローカルまたはクラウドモデルによるファイル/ディレクトリの一括文字起こし
- `models`：プリセット ASR モデルの一覧表示、ダウンロード、検証、検索、削除
- `export`：文字起こしセグメント JSON を SRT、VTT、TXT、MD などに変換（互換エイリアス `export transcript` 対応）
- `config`：TOML 設定ファイルの確認と管理（`init`、`check`、`show`、`get`、`set`、`unset`、`edit`、`path`）
- `doctor`：ホスト環境診断、ハードウェアアクセラレーション（CUDA、Metal、AVX2、NEON）とパスの健全性確認
- `devices`：利用可能なオーディオ入力/出力デバイスの一覧表示
- `providers`：設定済みクラウド ASR プロバイダーとその機能状態の確認
- `update`：Minisign 署名検証付きの安全な更新確認と適用
- `completion`：シェル補完スクリプトの生成（bash、zsh、fish、powershell、elvish）
- `serve`：ローカル REST API サーバーと WebSocket リアルタイムストリーミング（`/v1/streaming`）
- `diagnostics`：ホスト診断スナップショット契約の構築

## 実行方法

- パッケージ版：インストーラーに同梱されている `sona-cli` バイナリを使用します。
- ソースビルド版：`cargo run -p sona-cli -- <command> ...`

例：

```bash
sona-cli doctor
sona-cli config init
sona-cli models list
sona-cli models download whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav --online-provider groq-whisper
sona-cli live -m sensevoice
sona-cli live --online-provider volcengine-doubao
sona-cli export ./segments.json ./transcript.vtt
sona-cli serve --host 127.0.0.1 --port 14200
```

## ステートレス境界

CLI では SQLite、History、Tag、アプリケーションのバックアップ/復元、Sync、Online LLM を意図的に対象外としています。デスクトップアプリのデータディレクトリを作成したり暗黙に変更したりすることはありません。出力は `stdout` に出力されるか、明示的に指定されたファイルに保存されます。`export`（または `export transcript`）と `stdout`/ファイル出力を使って、他のツールと柔軟に組み合わせてください。

## 設定の優先順位

設定オプションは以下の優先順位（高から低）で解決されます：

1. 明示的なコマンドライン引数：`-c / --config <PATH>`
2. グローバル環境変数：`SONA_CONFIG`
3. カレントディレクトリの設定ファイル：`./sona-cli.toml`
4. ユーザー標準設定ファイル：`sona-cli.toml`（Linux：`~/.config/sona/sona-cli.toml`、macOS：`~/Library/Application Support/sona/sona-cli.toml`、Windows：`%APPDATA%\sona\sona-cli.toml` または `%USERPROFILE%\.config\sona\sona-cli.toml`）
5. 組み込みデフォルト値：設定ファイルが見つからない場合は安全なデフォルト値で動作

## コマンド

### `config`

Sona CLI 設定ファイルの確認と管理：

- `sona-cli config init`：コメント付き TOML 設定テンプレートを生成（`-F/--force` で既存ファイルを上書き）
- `sona-cli config check`：設定ファイルの構文とセクションを検証
- `sona-cli config show`：マージされた有効な設定を表示
- `sona-cli config get <KEY>`：特定の設定プロパティを取得
- `sona-cli config set <KEY> <VALUE> [--global]`：プロパティ値をローカルまたはグローバルに保存
- `sona-cli config unset <KEY> [--global]`：プロパティを設定から削除
- `sona-cli config edit`：システムデフォルトのエディタで設定ファイルを開く
- `sona-cli config path`：解決された設定ファイルの絶対パスを表示

```bash
sona-cli config init
sona-cli config check
sona-cli config set transcribe.model_id whisper-turbo
sona-cli config get transcribe.model_id
```

### `models`

選択されたモデルディレクトリ内のローカル ASR プリセットモデルを管理：

- `sona-cli models list`：利用可能なプリセットモデルを一覧表示（`--mode live|batch`、`--installed`、`--json`）
- `sona-cli models download <MODEL>`（エイリアス `install`）：モデルファイルをダウンロードしてハッシュを検証
- `sona-cli models delete <MODEL>`（エイリアス `rm`）：ダウンロード済みモデルファイルを削除（`-F/--force` で確認をスキップ）
- `sona-cli models info <MODEL>`（エイリアス `show`）：モデルの仕様と付随ファイルの詳細を確認
- `sona-cli models search <QUERY>`：キーワードまたは言語でモデルを検索
- `sona-cli models verify <MODEL>`：インストール済みモデルファイルの整合性とハッシュを検証
- `sona-cli models path`：現在有効なモデルディレクトリの絶対パスを表示

```bash
sona-cli models list --mode batch
sona-cli models search japanese
sona-cli models download whisper-turbo
sona-cli models verify whisper-turbo
sona-cli models delete whisper-turbo --force
```

### `transcribe`

ローカル ASR モデルまたはクラウドプロバイダーを使って音声・動画ファイルを文字起こしします。`--online-provider` を指定しない場合、ローカルの Sherpa プリセットを使用します：

```bash
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo -o ./transcript.srt
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
```

`--online-provider` を指定すると、音声をクラウドプロバイダーにアップロードして結果を出力します：

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

利用可能なバッチプロバイダーは `volcengine-doubao`、`groq-whisper`、`mistral-voxtral` です：

| プロバイダー | デフォルト環境変数 |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

カスタム環境変数を指定するには `--api-key-env NAME` を使用します。`--online-config FILE` は非秘密設定の上書き用 JSON を受け取ります（`apiKey` や `api_key` を含めてはいけません）。

オンラインプロバイダー選択時、ローカル専用フラグ（`--model-id`、`--models-dir`、VAD/句読点オプション、スレッド数、GPU モード、`--save-wav` など）は拒否されます。既存ファイルを上書きするには `--force` が必要です。

### `transcribe-live`

`sona-cli live`（互換エイリアス `sona-cli transcribe-live`）は、マイク入力または標準入力（`--input stdin`）からリアルタイムのストリーミング音声認識を実行します。

```bash
sona-cli live -m sensevoice
sona-cli live --device "Studio Mic" --duration 60 --output ./live.srt

ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin -m sensevoice --output-format ndjson
```

オンラインストリーミング認識は現在 `volcengine-doubao` に対応しています：

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

マイク入力は CPAL のデフォルト録音デバイスを使用します（`--device` でデバイス名を指定可能、`sona-cli devices` で一覧表示）。`--output-format` は `text` または `ndjson` を指定可能で、`--output` を指定すると終了時に `json`、`txt`、`srt`、`vtt`、`md` ファイルとして書き出されます。Ctrl+C、`stdin` EOF、`--duration` 到達時に安全にフラッシュして終了します。

`transcribe` と同様の認証情報および設定規則が適用されます。

### `export transcript`

文字起こしセグメントを整形済み字幕やテキストファイルに変換して書き出します。推奨される直接引数構文は `sona-cli export <INPUT> [OUTPUT]` で、互換エイリアス `sona-cli export transcript` および `sona-cli convert` も完全にサポートされています：

```bash
sona-cli export ./segments.json ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export ./segments.json ./transcript.srt --mode bilingual
```

出力形式は拡張子から自動判別されるか、`--format <srt|vtt|txt|json|tsv|csv|md>` で指定します。モードは `original`、`translation`、`bilingual` をサポートしています。

### `doctor`

ローカル実行環境の自動ヘルスチェックを行い、ホストプラットフォーム、CPU アーキテクチャ、SIMD 拡張（AVX2、NEON）、GPU/CUDA アクセラレーション、オーディオデバイス、インストール済みモデルの整合性、書き込み権限を診断します：

```bash
sona-cli doctor
sona-cli doctor --strict
sona-cli doctor --json
```

### `devices`

ホストシステムで検出されたオーディオ入力および出力デバイスを一覧表示します：

```bash
sona-cli devices
sona-cli devices --json
```

### `providers`

設定済みクラウド ASR プロバイダーとその接続・機能状態を確認します：

```bash
sona-cli providers
sona-cli providers --json
```

### `update`

Minisign 署名検証付きで、CLI およびデスクトップバイナリの更新を確認して安全にインストールします：

```bash
sona-cli update check
sona-cli update apply
```

### `completion`

各種シェル向けの自動補完スクリプトを生成します：

```bash
sona-cli completion bash > /etc/bash_completion.d/sona-cli
sona-cli completion zsh > ~/.zfunc/_sona-cli
sona-cli completion fish > ~/.config/fish/completions/sona-cli.fish
sona-cli completion powershell | Out-File -Append -Encoding utf8 $PROFILE
```

### `diagnostics`

サポートや問題報告のために、アプリケーションデータベースにアクセスしない構造化された診断スナップショット JSON を作成します：

```bash
sona-cli diagnostics
```

### `serve`

共有ローカル HTTP API サーバーを起動します。ローカル REST 文字起こしと WebSocket リアルタイムストリーミング（`/v1/streaming`）に対応しています：

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

REST および WebSocket エンドポイントの完全な仕様については、[HTTP API ガイド](guide:api-guide) を参照してください。

## 終了コードとエラー

- `0`：成功
- `1`：一般的なエラー（`doctor --strict` チェック不合格、シリアライズ失敗など）
- `2`：検証または引数エラー（無効な引数、指定プロバイダー不在、ファイル非存在）
- `3`：モデルエラー（プリセット不在、ダウンロードファイル破損、付随ファイル不足）
- `4`：ネットワークまたはオンラインプロバイダーエラー（認証失敗、API タイムアウト）
- `5`：ファイルシステムエラー（`--force` なしの既存ファイル上書き、書き込み失敗）
- `130`：キャンセル（Ctrl+C シグナルによる中断）
