# Live Caption と Voice Typing

`Live Caption` と `Voice Typing` は、どちらも同じオフラインのリアルタイム文字起こしエンジンを使います。ただし用途は異なります。Live Caption はフローティング字幕ウィンドウを表示し、Voice Typing は他のアプリへテキストを入力します。

## 推奨対象

- システム音声やマイク音声を字幕として画面上に表示したい場合
- 会議ツール、エディタ、ブラウザーなど別のアプリで Voice Typing を使いたい場合
- Live Record を開始せずに、リアルタイム文字起こしだけ使いたい場合

## Live Caption を使う

1. `Live Record` 画面で `Live Caption` をオンにします。
2. フローティング字幕ウィンドウが表示されます。
3. `Settings > Subtitle Settings` で、最前面表示、クリック透過、フォントサイズ、幅、色、背景の透明度、起動時の動作を調整します。
4. 表示されない場合は、[FAQ とトラブルシューティング](guide:faq) を確認してください。

## Voice Typing を使う

1. `Settings > Voice Typing` を開きます。
2. `Voice Typing` を有効にします。
3. ショートカット、入力方式、モデル、VAD、入力デバイスを確認します。
4. 他のアプリにフォーカスを移し、設定したショートカットで Voice Typing を開始します。

## Live Record との違い

- `Live Record` は、録音セッションを作り、文字起こしを Sona のワークスペースに保存するための機能です。
- `Live Caption` は、フローティング字幕を表示するための機能です。録音を開始しなくても使えます。
- `Voice Typing` は、Sona 以外のアプリへテキストを入力するための機能です。
- いずれもリアルタイム文字起こしエンジンに依存するため、`Live Record Model` が正しく設定されている必要があります。

## お役立ちメモ

- 字幕の見た目を変えたい場合は `Settings > Subtitle Settings` を確認してください。
- Voice Typing のショートカットや押し方を変えたい場合は `Settings > Voice Typing` を確認してください。
- 文字起こしを保存して後から編集したい場合は、[Live Record](guide:live-record) を使う方が適しています。
