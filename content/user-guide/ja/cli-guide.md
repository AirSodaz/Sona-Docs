`sona-cli` は Sona のスタンドアロン CLI です。デスクトップ版 Tauri アプリには CLI サブコマンドが組み込まれなくなったため、パッケージ版でコマンドライン操作を行う場合は `sona-cli` を起動してください。

現在のスタンドアロン CLI には、次のコマンドが含まれます。

- `path-status`
- `init-config`
- `models list`
- `models download`
- `models delete`
- `history list|query|transcript|snapshots|snapshot|<mutation>`
- `export transcript`
- `backup export|inspect|import`
- `serve`
- `transcribe`
- `transcribe-live`

ヘッドレス HTTP API サーバーは共通の `sona-api-server` アダプターを使用しており、デスクトップアプリまたは `sona-cli serve` から起動できます。

## 実行方法

- パッケージ版：同じプラットフォーム向けインストーラー出力に同梱されている `sona-cli` バイナリを使用
- ソース版：`cargo run -p sona-cli -- <command> ...`

例：

```bash
cargo run -p sona-cli -- path-status .
cargo run -p sona-cli -- init-config
cargo run -p sona-cli -- models list --json
cargo run -p sona-cli -- history list --app-data-dir ./sona-data --json
cargo run -p sona-cli -- export transcript --input ./segments.json --output ./transcript.vtt
cargo run -p sona-cli -- serve --host 127.0.0.1 --port 14200
cargo run -p sona-cli -- transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
cargo run -p sona-cli -- transcribe-live --model-id sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17
```

## コマンド

### `path-status`

共通のランタイム状態コントラクトでファイルシステム上のパスを解決し、JSON を `stdout` に出力します。

```bash
sona-cli path-status ./models
```

出力例：

```json
{
  "kind": "directory",
  "path": "C:/work/models",
  "error": null
}
```

### `init-config`

スタンドアロン CLI のワークフローで使用する、コメント付きの初期設定ファイルを作成します。

```bash
sona-cli init-config
sona-cli init-config ./sona-cli.toml --force
```

- 既定の出力先：`./sona-cli.toml`
- `--force` を指定しない限り、既存ファイルは上書きされません
- 状態メッセージは `stderr` に出力されます

### `models list`

プリセットモデルを一覧表示し、モード、種類、言語、インストール状態で絞り込みます。

```bash
sona-cli models list
sona-cli models list --mode offline --type whisper
sona-cli models list --language zh --installed
sona-cli models list --json
```

`--json` を指定すると、`install_path` を含む完全な機械可読形式で出力します。

### `models download`

プリセットモデルを、解決されたモデルディレクトリへダウンロードします。

```bash
sona-cli models download sherpa-onnx-whisper-turbo
sona-cli models download silero-vad --models-dir ./models --yes
```

選択したプリセットが付随リソースを必要とする場合は、必要な VAD または句読点モデルも `sona-cli` がダウンロードします。

### `models delete`

インストール済みのプリセットモデルを 1 つ削除します。

```bash
sona-cli models delete sherpa-onnx-whisper-turbo --yes
sona-cli models delete silero-vad --models-dir ./models --yes
```

付随モデルは自動では削除されません。

### `history`

共通の履歴サービスを通じて、既存の Sona アプリデータディレクトリを照会または変更します。

```bash
sona-cli history list --app-data-dir ./sona-data --limit 50 --offset 0
sona-cli history query --app-data-dir ./sona-data --input ./workspace-query.json --json
sona-cli history transcript --app-data-dir ./sona-data --history-id <ID> --json
sona-cli history snapshots --app-data-dir ./sona-data --history-id <ID>
sona-cli history snapshot --app-data-dir ./sona-data --history-id <ID> --snapshot-id <ID> --json
sona-cli history create-live-draft --app-data-dir ./sona-data --id <ID> --audio-extension wav --json
sona-cli history complete-live-draft --app-data-dir ./sona-data --history-id <ID> --segments ./segments.json --duration 12.5 --json
sona-cli history save-recording --app-data-dir ./sona-data --input ./recording.json --audio ./recording.wav --json
sona-cli history import-file --app-data-dir ./sona-data --input ./history-import.json --json
sona-cli history update-transcript --app-data-dir ./sona-data --history-id <ID> --segments ./segments.json --json
sona-cli history create-snapshot --app-data-dir ./sona-data --history-id <ID> --reason polish --segments ./segments.json --json
sona-cli history update-meta --app-data-dir ./sona-data --history-id <ID> --updates ./history-meta.json
sona-cli history assign-project --app-data-dir ./sona-data --history-id <ID> --project-id <PROJECT_ID>
sona-cli history reassign-project --app-data-dir ./sona-data --current-project-id <PROJECT_ID>
sona-cli history delete --app-data-dir ./sona-data --history-id <ID>
```

- `query` は Tauri および UniFFI と同じ camelCase の `HistoryWorkspaceQueryRequest` JSON コントラクトを受け取ります。
- `list`、`query`、`snapshots` は既定で表形式を使用し、`--json` では完全な機械可読レスポンスを保持します。
- `transcript` と `snapshot` は既定でセグメント表を表示します。
- `recording.json` には `segments`、`duration`、任意の `projectId` と `audioExtension` を含めます。音声バイトは `--audio` からのみ読み込みます。
- `history-import.json` は camelCase の `HistorySaveImportedFileRequest` コントラクトを使用します。`--segments` ファイルは JSON 配列、`--updates` は JSON オブジェクトです。
- `assign-project` または `reassign-project` で移動先プロジェクトを省略すると、記録は Inbox に戻ります。
- アプリデータディレクトリは事前に存在している必要があります。不正な変更入力は、遅延初期化される SQLite アダプターがデータベースを開く前に拒否されます。

### `export transcript`

既存の文字起こしセグメント JSON 配列を、共通のコア書き出しサービスでエクスポートします。

```bash
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.srt --mode bilingual
sona-cli export transcript --input ./segments.json --output ./transcript.txt --format txt --json
```

- `--format` を省略すると、出力ファイルの拡張子から形式を判定します。
- 対応形式：`json`、`txt`、`srt`、`vtt`、`md`
- 対応モード：`original`（既定）、`translation`、`bilingual`
- `--json` は出力先と書き込んだバイト数を機械可読 JSON で表示します。

### `backup`

5 つのアプリ状態スコープをすべて書き出す、アプリデータを開かずにアーカイブを検証する、またはアーカイブからバックアップ対象状態をアトミックに置換します。

```bash
sona-cli backup export --app-data-dir ./sona-data --output ./sona-backup.sona-backup --app-version 0.8.0
sona-cli backup inspect --archive ./sona-backup.sona-backup
sona-cli backup import --app-data-dir ./sona-data --archive ./sona-backup.sona-backup --default-rule-set-name "Default Rules" --confirm-replace
```

インポートは `config`、`workspace`、`history`、`automation`、`analytics` の各スコープをアトミックに置換します。`--confirm-replace` が必須で、対話式プロンプトは表示しません。タスク台帳と元の音声はバックアップアーカイブに含まれません。

### `serve`

スタンドアロン CLI から共通のローカル HTTP API サーバーを実行します。

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

- Ctrl+C を押すまで実行を続けます
- デスクトップアプリと同じローカル一括文字起こし API サーバーアダプターを再利用します
- `--config` は `init-config` が生成する `[serve]` セクションを読み込みます
- CLI ではローカル REST 文字起こしを利用できます。`serve` の WebSocket ストリーミングルーターとオンライン ASR 連携には引き続きデスクトップランタイムが必要です。スタンドアロンのローカルストリーミングには `transcribe-live` を使用してください。

### `transcribe`

オフライン ASR アダプターを使用して、ローカルの音声または動画ファイルを 1 つ文字起こしします。

```bash
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
sona-cli transcribe ./sample.wav --config ./sona-cli.toml --output ./out.srt
sona-cli transcribe ./sample.wav --format txt --quiet
```

- `--output` を省略すると `stdout` に出力します
- 対応する書き出し形式：`json`、`txt`、`srt`、`vtt`、`md`
- `--config` は `init-config` が生成するコメント付き `sona-cli.toml` テンプレートを読み込みます
- `--force` を指定すると既存の出力ファイルを上書きできます

### `transcribe-live`

インストール済みのローカルストリーミングモデルを使い、マイクまたは stdin の生音声をリアルタイムで文字起こしします。

```bash
sona-cli transcribe-live --list-input-devices
sona-cli transcribe-live \
  --model-id sherpa-onnx-sense-voice-zh-en-ja-ko-yue-int8-2024-07-17 \
  --device "Studio Mic" \
  --duration 60 \
  --output ./live.srt
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli transcribe-live \
    --input stdin \
    --model-id sherpa-onnx-streaming-paraformer-trilingual-zh-cantonese-en \
    --output-format ndjson
```

- このコマンドはローカルのオフライン ASR のみ対応します。選択するプリセットは `streaming` モードを宣言し、解決されたモデルディレクトリにインストール済みである必要があります。
- マイク入力では、`--device` に `--list-input-devices` が返す完全な名前を指定しない限り、CPAL の既定入力デバイスを使用します。
- `--input stdin` は、ヘッダーなしの 16 kHz、モノラル、符号付き 16-bit little-endian PCM を受け取ります。末尾に不完全なサンプルがあると入力エラーになります。
- TTY のテキスト出力は現在の文字起こしを同じ位置で更新します。リダイレクトされたテキスト出力は flush 後に最終スナップショットを 1 回だけ書き込みます。
- `--output-format ndjson` は 1 行に 1 個の JSON オブジェクトを出力し、イベントごとに flush します。イベント種別は `started`、`update`、`stopped`、実行時エラー専用の `error` で、文字起こしフィールドは camelCase です。
- Ctrl+C、stdin EOF、`--duration` は同じ正常終了処理を行います。取得済み音声を処理し、ASR を flush して停止し、必要なら最終ファイルを書き込み、`stopped` を出力して終了コード 0 で終了します。
- `--output` は最終スナップショットを `json`、`txt`、`srt`、`vtt`、`md` で保存します。`--format` がなければ拡張子で形式を選び、既存ファイルの置換には `--force` が必要です。
- `--config` は `sona-cli.toml` の `[transcribe_live]` を読み込みます。コマンドライン値がこのセクションを上書きし、このセクションは共通のトップレベル ASR 既定値を継承します。最終出力先、書き出し形式、上書き動作はコマンドラインでのみ指定できます。
- 検証エラーは終了コード 2、モデルエラーは 3、入力またはデバイスエラーは 5 です。実行時の NDJSON エラーも、非ゼロで終了する前に `error` イベントとして出力されます。

## グローバルフラグ

```text
sona-cli
  -V, --version
  -h, --help
```

コマンドごとの使い方は `sona-cli <command> --help` で確認できます。
