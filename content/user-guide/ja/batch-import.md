既に音声や動画ファイルがあり、Sona にバックグラウンドで処理させたい場合は `Batch Import` を使用します。

## 推奨対象

- 録音済みの会議、講義、ポッドキャスト、インタビュー
- ローカルメディアファイルからの字幕作成
- 複数のファイルをキューに追加し、順次バックグラウンド処理したいワークフロー

## キューに追加する前に

- `Settings > Model Settings` で `Batch Import Model` が設定されていることを確認してください。
- ファイルが対応する音声または動画形式であることを確認してください。

## ファイルをキューに追加する

1. `Batch Import` タブを開きます。
2. ファイルをインポート領域にドラッグ＆ドロップするか、`Select File` をクリックします。
3. 1 つまたは複数のファイルをキューに追加します。
4. サイドバーのキュー一覧とアクティブな項目のステータス表示を確認します。
5. キューをさらに追加したい場合は `Add More Files` を使用します。

## インポート動作を調整する

1. 新しいタスクの `Subtitle Mode` や `Language` を変更したい場合は `Parameter Settings` をクリックします。
2. キューの各ステータスを確認します: `Pending`（待機中）、`Processing`（処理中）、`Complete`（完了）、`Failed`（失敗）。
3. **メッセージセンターとキャンセル**: ヘッダーの `メッセージセンター`（Message Center）では、キューと文字起こしの進捗をリアルタイムに表示し、実行中の一括インポートタスクの即時キャンセルに対応しています。

## 完了後にできること

- 完了したアイテムはメインの文字起こしエディタに読み込まれます。
- そこから [編集と再生](guide:edit-and-playback)、[AI Polish と翻訳](guide:ai-polish-and-translate)、[プロジェクトと Inbox](guide:workspace-projects-and-inbox)、または [エクスポートと設定](guide:export-and-settings) に進むことができます。

## お役立ちメモ

- オフラインの一括モデルが未設定の場合、Sona はインポートを開始する代わりに初回セットアップを再表示します。Qwen3-ASR（llama.cpp 経由）や Whisper プリセットなどのモデルにより、高精度かつ高速なオフライン一括文字起こしが可能です。
- `Settings > Model Settings` には、一括処理の動作に影響する `Batch VAD Segmentation`（Silero VAD v5 対応）、`VAD Buffer Size`、`Max Concurrent Transcriptions` が含まれています。Batch VAD をオフにすると、ローカルの一括文字起こしはファイル全体を一度に認識します。
- 特殊な音声形式やデコーダー不足のエラーが発生した場合は、`Settings > Storage Management` でカスタム FFmpeg パスを指定してください。
- 既存のメディアから字幕ファイルを作成したい場合、`Batch Import` とエクスポートの組み合わせが主なワークフローとなります。
