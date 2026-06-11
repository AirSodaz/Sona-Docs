# エクスポートと設定

このページでは、完成した文字起こしの書き出し、話者やバージョンの最終確認、よく使う設定画面の場所をまとめます。Dashboard、Diagnostics、Backup & Restore、Automation、通知センターなど、作業後半で参照しやすい画面もここで確認できます。

## 完成した文字起こしを書き出す

エクスポート前に話者ラベルが重要な場合は、文字起こし画面のヘッダーから `Speaker Review` を開いて確認してください。保存済みの文字起こしで、特定の行を戻したい、または一括変更を取り消したい場合は、先に `Version Snapshots` を確認します。

1. ヘッダーの `Export` ボタンをクリックします。
2. `Export Transcript` モーダルで `Filename` を入力します。
3. `Export Directory` を選択します。
4. 出力形式を選びます: `SubRip (.srt)`、`WebVTT (.vtt)`、`JSON (.json)`、`Plain Text (.txt)`。
5. エクスポートモードを選びます: `Original`、`Translation`、`Bilingual`。
6. `Export` をクリックします。

## エクスポート結果

- Sona は、選択した保存先と形式で文字起こしファイルを書き出します。
- 翻訳テキストがある場合は、翻訳のみ、または二言語併記で出力できます。
- `Translation` と `Bilingual` は、少なくとも 1 つのセグメントに翻訳テキストがある場合にだけ選択できます。

## Workspace に戻るタイミング

- 保存済みの録音やインポートを開き直す、名前を変更する、移動する、並べ替える場合は、[ワークスペース、プロジェクト、Inbox](guide:workspace-projects-and-inbox) に戻ってください。
- プロジェクトのコンテキスト設定や Inbox の整理も、現在は Workspace 内で行います。

## まず把握しておきたい設定画面

- `Settings > Dashboard`: 全体のコンテンツ概要、話者カバー率、LLM の使用傾向を表示します。
- `Settings > General`: テーマ、アプリの言語、フォント、システムトレイ、更新確認に加え、`Diagnostics` と `Backup & Restore` への入口があります。
- `Settings > Input Device`: マイク、システム音声、マイクブースト、録音中のミュート設定を管理します。
- `Settings > Subtitle Settings`: フローティング字幕の挙動を設定します。Live Caption や Voice Typing が目的の場合は、[Live Caption と Voice Typing](guide:live-caption-and-voice-typing) も参照してください。
- `Settings > Voice Typing`: Voice Typing を有効にし、グローバルショートカット、Push to Talk / Toggle、準備状態を確認します。
- `Settings > Model Settings`: `Live Record Model`、`Batch Import Model`、文字起こし設定、ITN、VAD バッファ、最大同時文字起こし数、既定値への復元、音声認識・句読点・話者・VAD などのダウンロード可能モデルを管理します。
- `Settings > Vocabulary`: `Text Replacement`、`Hotwords`、整文用キーワードセット、整文コンテキストプリセット、要約テンプレート、`Speaker Profiles` を管理します。具体的な調整例は[語彙と詳細設定](guide:vocabulary-and-advanced-settings)を参照してください。
- `Settings > Automation`: Sona の起動中に新しいメディアを監視し、文字起こし、AI Polish、翻訳、エクスポートを自動実行するフォルダールールを設定します。
- `Settings > LLM Service`: 機能モデルの割り当て、推論オプション、プロバイダー認証情報を設定します。整文と翻訳は[AI Polish と翻訳](guide:ai-polish-and-translate)、要約は[AI Summary](guide:ai-summary)を参照してください。
- `Settings > Shortcuts`: Live Record、再生、検索、ワークスペースナビゲーション、エディタ操作のショートカットを設定します。
- `Settings > About`: ソースコード、ログ、更新関連の操作を確認できます。

## 診断、バックアップ、通知

- `Settings > General` の `Diagnostics` では、ローカル文字起こしの準備状態、ランタイム、パッケージング環境を確認できます。
- 同じページの `Backup & Restore` では、設定、ワークスペース、軽量な履歴文字起こしと要約、自動化状態、Dashboard の LLM 使用ログを含むアーカイブをエクスポートまたはインポートできます。
- 軽量バックアップにはテキスト履歴と要約が含まれますが、元の音声ファイルは含まれません。復元したアイテムは閲覧・編集できますが、音声再生には元のメディアファイルが必要です。
- `WebDAV Cloud Sync` は `Backup & Restore` の中にあります。このデバイスに認証情報を保存し、バックアップアーカイブの手動アップロードや復元を支援します。
- Sona が更新、`Recovery Center`、自動化の結果を知らせる場合は、ヘッダーの通知センターを確認してください。

## 主に拡張機能を探している場合

- 文字起こしの要約を作りたい: [AI Summary](guide:ai-summary)
- フローティング字幕や他のアプリへの Voice Typing を使いたい: [Live Caption と Voice Typing](guide:live-caption-and-voice-typing)
- 監視フォルダーやエクスポートを自動化したい: `Settings > Automation` から始めてください。
- Hotwords、Text Replacement、Speaker Profiles、Auto-Polish、カスタムコンテキストを調整したい: [語彙と詳細設定](guide:vocabulary-and-advanced-settings)

## お役立ちメモ

- このページは、すべての設定項目を細かく説明するためではなく、目的に合う入口を見つけやすくするためのガイドです。
- エクスポートではなく問題の切り分けをしたい場合は、[FAQ とトラブルシューティング](guide:faq) に進んでください。
