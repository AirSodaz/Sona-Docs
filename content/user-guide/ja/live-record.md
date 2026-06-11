# Live Record

録音しながら文字起こしのセグメントをリアルタイムで確認したい場合は、`Live Record` を使います。会話の流れを残しつつ、録音後もそのまま編集、翻訳、エクスポートへ進めます。

## 推奨対象

- 会議、インタビュー、講義、ボイスメモ
- 録音中からタイムスタンプ付きの文字起こしを確認したい場合
- 録音中の下書きも含め、作業内容を Sona のワークスペースに残したい場合

## 開始する前に

- [はじめに](guide:getting-started)を完了するか、`Settings > Model Settings` で `Live Record Model` を手動で設定してください。
- マイクから録音する場合は、OS 側で Sona へのマイクアクセスを許可してください。

## ライブセッションを録音する

1. `Live Record` タブを開きます。
2. 録音を開始する前に、入力ソースとして `Microphone` または `Desktop Audio` を選択します。
3. `Start Recording` をクリックします。
4. Sona が音声を取得している間、波形とタイマーを確認します。
5. セッションを終了せずに止めたい場合は `Pause` を使います。
6. 録音を終えて保存する場合は `Stop` を使います。

## 録音中の動作を調整する

1. `Subtitle Mode` や `Language` など、文字起こし時の挙動を変えたい場合は `Parameter Settings` を開きます。
2. リアルタイムのフローティング字幕が必要な場合は、`Live Caption` をオンにします。
3. 字幕の最前面表示、クリック透過、サイズ、幅、色、起動時の動作などを調整したい場合は、`Settings > Subtitle Settings` を開きます。
4. 録音ではなく Live Caption や Voice Typing を主に使いたい場合は、[Live Caption と Voice Typing](guide:live-caption-and-voice-typing) に進んでください。

## Live Caption との関係

- `Live Caption` は、Live Record 画面にある `System Audio Captions` の切り替えで、主にシステム音声のフローティング字幕を表示したいときに使います。
- 録音を始めなくても単独でオンにできます。その後 Live Record を開始した場合は、両方を並行して使えます。
- `Settings > Subtitle Settings` では、起動時の動作、最前面表示、クリック透過、フォントサイズ、幅、色、背景の透明度を調整できます。
- 画面上の切り替えと設定画面の違いを知りたい場合や、Voice Typing も使いたい場合は、[Live Caption と Voice Typing](guide:live-caption-and-voice-typing) を参照してください。
- `Live Caption` をオンにしてもウィンドウが表示されない場合は、[FAQ とトラブルシューティング](guide:faq) を確認してください。

## 録音中と録音後にできること

- 文字起こしセグメントが右側のエディタに表示されます。
- 録音中は、現在のセグメントがライブ録音の状態に合わせて更新されます。
- 録音中でも、Sona はそのセッションを Draft アイテムとして[ワークスペース、プロジェクト、Inbox](guide:workspace-projects-and-inbox)に表示できます。
- 録音を停止すると、その Draft が完成した文字起こしとして保存されます。別の新規ファイルを重複して作るのではなく、同じアイテムが更新されます。
- 事前にプロジェクトを開いていない場合、保存されたアイテムは通常 Inbox に入ります。

## お役立ちメモ

- 既定では `Ctrl + Space` でライブ録音を開始または停止できます。
- 録音中は `Space` キーで一時停止と再開を切り替えられます。
- `Parameter Settings` は、Subtitle Mode や Language など文字起こし時の設定を扱います。LLM Polish 全体の設定ではありません。
- モデルが見つからないというエラーが出る場合は、初回セットアップをやり直すか、`Settings > Model Settings` でモデルを設定してください。
- 録音後の次のステップは、通常 [編集と再生](guide:edit-and-playback) です。
