# 語彙と詳細設定

このページでは、文字起こしの精度や仕上がりを調整するための `Hotwords`、`Text Replacement`、`Speaker Profiles`、そして `LLM Polish` の `Advanced Settings` をまとめています。初回起動時に必須の設定ではありませんが、専門用語、話者、整文の挙動を細かく調整したいときに役立ちます。

## 推奨対象

- 専門用語、人名、製品名などが繰り返し誤認識される場合
- 文字起こし後の表記や言い回しを揃えたい場合
- 今後の文字起こしで、登録済みの話者を候補として出したい場合
- 既定の設定を超えて、Auto-Polish やカスタムコンテキストを調整したい場合

## まず開く設定画面を確認する

- `Settings > Vocabulary`: `Hotwords`、`Text Replacement`、`Speaker Profiles` を管理します。
- `LLM Polish > Advanced Settings`: `Auto-Polish` のオン / オフ、頻度、キーワード、シナリオプリセット、カスタムコンテキストを管理します。
- まず基本的な AI Polish や翻訳の流れを知りたい場合は、[AI Polish と翻訳](guide:ai-polish-and-translate) に戻ってください。

## Hotwords が役立つ場面

- 特定の名前やフレーズの認識が何度もぶれる場合、その用語を `Hotwords` に追加します。
- `Hotwords` は 1 行に 1 項目ずつ入力します。`用語 :2.0` のような重み付けにも対応しています。
- 現在、この機能は特に Transducer および Qwen3 ASR モデルで効果を発揮します。

## Text Replacement が役立つ場面

- 文字起こし後に同じ用語の表記ゆれが目立つ場合は、`Text Replacement` を使います。
- 繰り返し発生するパターンの自動修正に向いていますが、セグメントごとの確認を完全に置き換えるものではありません。
- セグメント単位の編集に集中したい場合は、[編集と再生](guide:edit-and-playback) に進んでください。

## Speaker Profiles が役立つ場面

- 登録したい話者のプロファイルを作成し、その人のローカル音声を参照サンプルとして 1 つ以上インポートします。
- Sona はインポートした音声サンプルをアプリ内で扱える形式に整え、話者モデルが設定されている場合に、候補提案や自動マッチングの判断材料として使います。
- プロファイルは、利用できる音声サンプルの数や長さに応じて、`Ready for automatic matching`、`Limited to suggestions`、`Not ready yet` のいずれかの状態を示します。
- プロジェクトごとに有効にする話者プロファイルを選べるため、クライアント、講座、定例会議ごとに別の話者セットを維持できます。
- Speaker Profiles は完璧な自動割り当てを保証するものではありません。候補の確定、別プロファイルの適用、匿名へのリセットは、引き続き[編集と再生](guide:edit-and-playback)から行えます。

## Advanced Settings を開くタイミング

- 単発の `LLM Polish` だけでなく、`Auto-Polish` を管理したい場合
- `Auto-Polish Frequency`、キーワード、シナリオプリセット、カスタムコンテキストを調整したい場合
- プロバイダーとモデルの設定は済んでいて、より具体的な用途に合わせて整文の挙動を変えたい場合

## お役立ちメモ

- `Advanced Settings` は [AI Polish と翻訳](guide:ai-polish-and-translate) の一部です。前提となるプロバイダーやモデル設定の代わりにはなりません。
- Speaker Profiles の準備状態は、候補の品質や自動マッチングの信頼性に影響しますが、手動でプロファイルを適用できるかどうかには影響しません。
- 文字起こし本文を整えるのではなく、横に要約を作りたい場合は、[AI Summary](guide:ai-summary) に進んでください。
- 設定済みなのに期待通りに動作しない場合は、[FAQ とトラブルシューティング](guide:faq) を確認してください。
