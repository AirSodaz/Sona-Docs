このページでは、完成した文字起こしの書き出し、話者やバージョンの最終確認、よく使う設定画面の場所をまとめます。Dashboard、Diagnostics、Backup & Restore、Automation、通知センターなど、作業後半で参照しやすい画面もここで確認できます。

## 完成した文字起こしを書き出す

エクスポート前に話者ラベルが重要な場合は、文字起こし画面のヘッダーから `Speaker Review` を開いて確認してください。保存済みの文字起こしで、特定の行を戻したい、または一括変更を取り消したい場合は、先に `Version Snapshots` を確認します。

1. ヘッダーの `Export` ボタンをクリックします。
2. `Export Transcript` モーダルで `Filename` を入力します。
3. `Export Directory` を選択します。
4. 出力形式を選びます: `SubRip (.srt)`、`WebVTT (.vtt)`、`JSON (.json)`、`Plain Text (.txt)`、`Markdown (.md)`。
5. エクスポートモードを選びます: `Original`、`Translation`、`Bilingual`。
6. `Export` をクリックします。
7. ファイルを書き出さずに同じモードのプレーンテキストだけが必要な場合は、`Copy to Clipboard` を使います。

## エクスポート結果

- Sona は、選択した保存先と形式で文字起こしファイルを書き出します。
- `Markdown (.md)` では、話者ラベルが太字ラベルとして残り、Markdown エディタで読みやすい形式になります。
- 翻訳テキストがある場合は、翻訳のみ、または二言語併記で出力できます。
- `Copy to Clipboard` は、選択中のエクスポートモードに従って、確定済みセグメントのプレーンテキストをコピーします。
- `Translation` と `Bilingual` は、少なくとも 1 つのセグメントに翻訳テキストがある場合にだけ選択できます。

## プロジェクトセンターに戻るタイミング

- 保存済みの録音やインポートを開き直す、名前を変更する、移動する、並べ替える場合は、[プロジェクトと Inbox](guide:workspace-projects-and-inbox) に戻ってください。
- プロジェクトのコンテキスト設定や Inbox の整理も、現在はプロジェクトセンター（Projects）内で行います。

## カテゴリ別に整理された設定項目

Sona デスクトップの設定サイドバーは 5 つのカテゴリに分類されています：

### 1. 全般 (General)
- `Settings > General`: テーマ、アプリ言語、フォント、起動時自動起動、サイレント起動（トレイ最小化起動）、更新確認、`Diagnostics` および `Backup & Restore`
- `Settings > Dashboard`: 全体コンテンツの概要、話者カバー率、LLM 使用傾向
- `Settings > About`: バージョン情報、リリースノート、ライセンス、更新確認

### 2. 認識と音声 (Recognition & Speech)
- `Settings > Input Device`: マイク選択、システム音声選択、マイクブースト、`Keep Microphone Active`、録音中のミュート設定
- `Settings > Subtitle Settings`: フローティング字幕の動作、ウィンドウ外観、マウスクリック透過、フォントサイズ
- `Settings > Voice Typing`: `Voice Typing` 有効化、グローバルショートカット、`Push to Talk` / `Toggle`、シチュエーションプリセット、準備状態
- `Settings > Model Settings`: `Live Record Model`、`Batch Import Model`、CTC 強制アライメント、話者分離感度、`Batch VAD Segmentation`、`VAD Buffer Size`、モデル管理
- `Settings > Vocabulary`: `認識と補正`、`プロンプトとコンテキスト`、`話者プロファイル` の 3 つのサブタブに整理され、統合辞書（ビジュアルおよび YAML ソースのデュアルモード）に対応

### 3. AI と自動化 (AI & Automation)
- `Settings > LLM Service`: 機能モデル割り当て（llama.cpp によるローカル GGUF モデルおよび aimux 経由のマルチクラウドプロバイダー）、思考プロセスと本文の分離、プロバイダー認証情報
- `Settings > Automation`: Sona 起動中に指定フォルダーの音声を自動文字起こし、整文、翻訳し、指定プロジェクトへ書き出す自動化ルール

### 4. 連携と同期 (Integration & Sync)
- `Settings > Cloud Sync`: エンドツーエンド暗号化（E2EE）クロスデバイス同期 Vault、WebDAV および S3 互換オブジェクトストレージ（AWS S3、Cloudflare R2、MinIO 等）対応、マスターパスワード、緊急リカバリーキー、競合センター
- `Settings > API Server`: ローカル HTTP API ホスト、ポート、任意の API Key、IP 許可リスト、REST 文字起こし、WebSocket リアルタイムストリーミング
- `Settings > MCP Server`: Model Context Protocol サーバーブリッジ設定、エンドポイント監視、Agent 権限設定（テキスト編集、破壊的操作、モデル管理等）

### 5. システムと詳細 (System & Advanced)
- `Settings > Storage Management`: データおよびモデルディレクトリ概要、ホットリロードストレージ移行（アプリ再起動不要の進捗モーダル付きディレクトリ移動）、純 Rust 音声デコーダーと任意のカスタム FFmpeg パス、ディスク分析とクリーンアップポリシー
- `Settings > Shortcuts`: Live Record、再生、検索、プロジェクトナビゲーション、エディタ操作のショートカット（取り消し線 `Ctrl + Shift + S` 対応）
## 診断、バックアップ、クラウド同期、メッセージセンター

- `Settings > General` の `Diagnostics` では、ローカル文字起こしの準備状態、ランタイム、パッケージング環境を確認できます。
- 同じページの `Backup & Restore` では、設定、プロジェクトデータ、軽量な履歴文字起こしと要約、自動化状態、Dashboard の LLM 使用ログを含むアーカイブをエクスポートまたはインポートできます。
- 軽量バックアップにはテキスト履歴と要約が含まれますが、元の音声ファイルは含まれません。復元したアイテムは閲覧・編集できますが、音声再生には元のメディアファイルが必要です。
- `Settings > Cloud Sync` は独立したエンドツーエンド暗号化（E2EE）増分同期システムです。文字起こしや設定はデバイスから送信される前にマスターパスワードで暗号化され、緊急リカバリーキーによる復旧や、複数端末の同時編集を仲裁する競合センターを備えています。録音音声はローカルマシン上にのみ保持され、クラウドにアップロードされることはありません。
- 画面下部には旧 WebDAV バックアップアーカイブのワンタイム移行インポート機能が用意されています（Sona はリモートへの新規フルバックアップ作成を行いません）。
- ヘッダーのメッセージセンターでは、一括文字起こし、自動化、LLM ジョブを一元管理し、リアルタイムの進捗確認、一括文字起こしのリアルタイムキャンセル、完了タスクのクリアメニューをサポートします。中断されたタスクはリカバリーセンターで再開または破棄できます。

## 主に拡張機能を探している場合

- 文字起こしの要約を作りたい: [AI Summary](guide:ai-summary)
- フローティング字幕や他のアプリへの Voice Typing を使いたい: [Live Caption と Voice Typing](guide:live-caption-and-voice-typing)
- 監視フォルダーやエクスポートを自動化したい: `Settings > Automation` から始めてください。
- Hotwords、Text Replacement、Speaker Profiles、Auto-Polish、カスタムコンテキストを調整したい: [語彙と詳細設定](guide:vocabulary-and-advanced-settings)

## お役立ちメモ

- このページは、すべての設定項目を細かく説明するためではなく、目的に合う入口を見つけやすくするためのガイドです。
- エクスポートではなく問題の切り分けをしたい場合は、[FAQ とトラブルシューティング](guide:faq) に進んでください。
