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

## まず把握しておきたい設定画面

- `Settings > Dashboard`: 全体のコンテンツ概要、話者カバー率、LLM の使用傾向を表示します。
- `Settings > General`: テーマ、アプリの言語、フォント、システムトレイ、更新確認に加え、`Diagnostics` と `Backup & Restore` への入口があります。
- `Settings > Input Device`: マイク、システム音声、マイクブースト、`Keep Microphone Active`、録音中のミュート設定を管理します。
- `Settings > Subtitle Settings`: フローティング字幕の挙動を設定します。Live Caption や Voice Typing が目的の場合は、[Live Caption と Voice Typing](guide:live-caption-and-voice-typing) も参照してください。
- `Settings > Voice Typing`: Voice Typing を有効にし、グローバルショートカット、Push to Talk / Toggle、準備状態を確認します。
- `Settings > Model Settings`: `Live Record Model`、`Batch Import Model`、文字起こし設定、ITN、`Batch VAD Segmentation`、VAD バッファ、最大同時文字起こし数、既定値への復元、音声認識・句読点・話者・VAD などのダウンロード可能モデルを管理します。
- `Settings > Vocabulary`: `Text Replacement`、`Hotwords`、整文用キーワードセット、整文コンテキストプリセット、要約テンプレート、`Speaker Profiles` を管理します。具体的な調整例は[語彙と詳細設定](guide:vocabulary-and-advanced-settings)を参照してください。
- `Settings > Automation`: Sona の起動中に新しいメディアを監視し、文字起こし、AI Polish、翻訳、エクスポートを自動実行するフォルダールールを設定します。
- `Settings > Storage Management`: データおよびモデル保存先ディレクトリの概要、カスタム FFmpeg パス、ディスク使用状況の内訳、音声保持クリーンアップポリシー、WebView キャッシュの消去を管理します。
- `Settings > Cloud Sync`: エンドツーエンド暗号化（E2EE）クロスデバイス同期 Vault、Vault ID とペアリング、マスターパスワードと緊急リカバリーキー、同期スコーププリセット、競合センターを管理します。
- `Settings > API Server`: ローカル HTTP API のホスト、ポート、任意の API Key、IP allowlist、サーバー制限、サーバーレベルの文字起こし既定値を設定します。
- `Settings > LLM Service`: 機能モデルの割り当て、推論オプション、プロバイダー認証情報を設定します。整文と翻訳は[AI Polish と翻訳](guide:ai-polish-and-translate)、要約は[AI Summary](guide:ai-summary)を参照してください。
- `Settings > Shortcuts`: Live Record、再生、検索、プロジェクトナビゲーション、エディタ操作のショートカット（取り消し線 `Ctrl + Shift + S` 対応）を設定します。
- `Settings > About`: ソースコード、ログ、更新関連の操作を確認できます。

## 診断、バックアップ、クラウド同期、タスクセンター

- `Settings > General` の `Diagnostics` では、ローカル文字起こしの準備状態、ランタイム、パッケージング環境を確認できます。
- 同じページの `Backup & Restore` では、設定、プロジェクトデータ、軽量な履歴文字起こしと要約、自動化状態、Dashboard の LLM 使用ログを含むアーカイブをエクスポートまたはインポートできます。
- 軽量バックアップにはテキスト履歴と要約が含まれますが、元の音声ファイルは含まれません。復元したアイテムは閲覧・編集できますが、音声再生には元のメディアファイルが必要です。
- `Settings > Cloud Sync` は独立したエンドツーエンド暗号化（E2EE）増分同期システムです。文字起こしや設定はデバイスから送信される前にマスターパスワードで暗号化され、緊急リカバリーキーによる復旧や、複数端末の同時編集を仲裁する競合センターを備えています。録音音声はローカルマシン上にのみ保持され、クラウドにアップロードされることはありません。
- 画面下部には旧 WebDAV バックアップアーカイブのワンタイム移行インポート機能が用意されています（Sona はリモートへの新規フルバックアップ作成を行いません）。
- ヘッダーのタスクセンターでは、一括文字起こし、自動化、LLM ジョブを一元管理し、リアルタイムの進捗確認や一括文字起こしのリアルタイムキャンセルをサポートします。中断されたタスクはリカバリーセンターで再開または破棄できます。

## 主に拡張機能を探している場合

- 文字起こしの要約を作りたい: [AI Summary](guide:ai-summary)
- フローティング字幕や他のアプリへの Voice Typing を使いたい: [Live Caption と Voice Typing](guide:live-caption-and-voice-typing)
- 監視フォルダーやエクスポートを自動化したい: `Settings > Automation` から始めてください。
- Hotwords、Text Replacement、Speaker Profiles、Auto-Polish、カスタムコンテキストを調整したい: [語彙と詳細設定](guide:vocabulary-and-advanced-settings)

## お役立ちメモ

- このページは、すべての設定項目を細かく説明するためではなく、目的に合う入口を見つけやすくするためのガイドです。
- エクスポートではなく問題の切り分けをしたい場合は、[FAQ とトラブルシューティング](guide:faq) に進んでください。
