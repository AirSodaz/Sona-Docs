`sona-mcp` は、Sona デスクトップクライアント向けの Model Context Protocol (MCP) サーバーブリッジであり、標準の MCP 仕様（プロトコルバージョン `2026-07-28` / MCP 2.0）に完全準拠しています。ローカル IPC パイプまたは Unix ドメインソケット経由で、外部 AI Agent（Claude Desktop、Cursor、OpenCode、Codex など）を Sona のローカル音声文字起こしエンジン、履歴データベース、プロジェクト、録音ライフサイクルへ直接接続します。

## アーキテクチャと境界

`sona-mcp` は、外部 AI Agent とローカル Sona ホストとの間で責任を明確に分離しています：

1. **AI 推論境界**：`sona-mcp` 自体は LLM をホストせず、AI 推論を直接実行しません。外部 Agent は高い対話能力と推論能力を標準で備えています。`sona-mcp` は、Agent が録音を検査、パッチ修正、翻訳、要約できるように詳細なツール（Tools）とコンテキストリソース（Resources）を公開します。
2. **ステートレスプロトコルブリッジ**：`sona-mcp` は標準入出力（`stdio`）上の標準 JSON-RPC 2.0 経由で外部 Agent と通信します。プロトコル呼び出しを軽量なローカル IPC メッセージに変換し、起動中の Sona デスクトップアプリケーションに転送します。
3. **データ整合性とバージョニング**：MCP を通じて実行されたすべての変更（セグメント編集、一括パッチ、翻訳更新、要約編集）は、Sona デスクトップの SQLite リポジトリ内で不変スナップショットの作成をトリガーし、デスクトップ UI にリアルタイムの更新イベントを通知します。

```text
+-----------------------+              +-----------------------+              +-----------------------+
|   外部 AI Agent       |              |       sona-mcp        |              |  Sona デスクトップ    |
| (Claude/Cursor 等)    | <--(stdio)-> |  (プロトコルブリッジ) | <--(IPC)-->  | (ASR/DB/ストレージ)   |
+-----------------------+   JSON-RPC   +-----------------------+  Pipe/Socket +-----------------------+
```

## トランスポートとエンドポイント解決

MCP サーバーは、エンドポイント指定用の任意の引数を受け付けます：

```bash
sona-mcp [OPTIONS]

Options:
      --endpoint <ENDPOINT>  カスタム IPC パイプまたはソケットエンドポイント
  -h, --help                 ヘルプを表示
  -V, --version              バージョンを表示
```

### デフォルト IPC エンドポイント

`--endpoint` が明示的に指定されない場合、`sona-mcp` は自動的にプラットフォームのデフォルトを使用します：

- **Windows**：`\\.\pipe\sona-agent-ipc`
- **macOS / Linux**：`$XDG_RUNTIME_DIR/sona-agent.sock`（フォールバック：`~/.local/share/sona/agent.sock`）

### オフライン状態と遅延起動

Sona デスクトップクライアントが現在実行されていない場合：

- `sona_get_client_state` はエラーを出さずに `{ "online": false }` を返します。
- データの変更や取得を行うツールは、適切なエラー（`Sona desktop client is offline.`）を返します。
- 外部 Agent は `sona_launch_desktop`（バックグラウンド起動およびトレイ常駐をサポート）を呼び出してデスクトップを起動し、IPC 接続が確立されるまで待機できます。

## Agent 設定例

外部 AI Agent が Sona を操作できるようにするには、Agent の MCP 設定ファイルに `sona-mcp` を登録します。

### 1. Claude Desktop

`claude_desktop_config.json` の `mcpServers` に設定を追加します：

- macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows：`%APPDATA%\Claude\claude_desktop_config.json`
- Linux：`~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sona": {
      "command": "sona-mcp",
      "args": []
    }
  }
}
```

`sona-mcp` がシステムの `PATH` に通っていない場合は、Sona インストールディレクトリ内のバイナリへの絶対パスを指定してください。

### 2. Cursor

ワークスペースルートまたはグローバル設定の `.cursor/mcp.json` に設定を追加します：

```json
{
  "mcpServers": {
    "sona": {
      "command": "sona-mcp",
      "args": []
    }
  }
}
```

## 主要ツール一覧

`sona-mcp` は、主要な機能ドメインにわたって 40 個のツールを公開しています：

### 1. 状態とライフサイクル
- `sona_get_client_state`：デスクトップの状態、オンライン状態、アクティブな録音 ID、選択中のプロジェクトを確認
- `sona_launch_desktop`：Sona デスクトップをバックグラウンドで起動（トレイ最小化起動に対応）

### 2. 録音コントロール
- `sona_start_recording`：プロジェクトを指定してリアルタイム録音を開始
- `sona_stop_recording`：現在の録音を終了して確定
- `sona_pause_recording`：録音を一時停止
- `sona_resume_recording`：一時停止した録音を再開
- `sona_get_recording_state`：録音時間、音量レベル、セグメント数を取得

### 3. 文字起こし確認と編集
- `sona_get_transcript`：指定した履歴 ID の全セグメント、タイムスタンプ、話者情報を取得
- `sona_edit_transcript`：セグメント全体を置換し、不変スナップショットを保存
- `sona_patch_segments`：特定のセグメントを ID 指定で部分修正（テキスト、話者、タイムスタンプ）
- `sona_delete_transcript`：履歴レコードおよび関連音声ファイルを完全に削除

### 4. 翻訳と要約の管理
- `sona_update_translation`：翻訳セグメントを保存または更新
- `sona_edit_summary`：AI 要約ノートやタスク項目を編集
- `sona_delete_summary`：要約内容を消去

### 5. プロジェクトと整理
- `sona_list_projects`：すべてのプロジェクトワークスペースと含まれる項目数を一覧表示
- `sona_assign_project`：文字起こしレコードをプロジェクトまたは受信トレイ（Inbox）へ移動
- `sona_delete_project`：プロジェクトを削除し、項目を受信トレイまたはゴミ箱へ移動

### 6. 設定と診断
- `sona_get_settings`：環境設定、保存先パス、有効なモデル ID を確認
- `sona_update_settings`：クライアント設定を更新
- `sona_get_diagnostics`：ハードウェアアクセラレーション、ASR 状態、エラーログを確認

## コンテキストリソース (`sona://`)

外部 Agent は標準化された `sona://` URI スキームを通じてコンテキストを直接参照できます：

- `sona://client/state`：現在のクライアント状態とセッション情報
- `sona://recording/state`：リアルタイム録音状態、録音時間、音量
- `sona://projects`：プロジェクト一覧とメタデータ
- `sona://history/{history_id}/transcript`：整形された文字起こしセグメントテキスト
- `sona://history/{history_id}/translation`：翻訳テキスト
- `sona://history/{history_id}/summary`：作成された要約とアクション項目
