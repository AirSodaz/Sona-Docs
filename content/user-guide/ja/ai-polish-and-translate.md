# AI Polish と翻訳

Sona の AI Polish と Translate は任意機能です。使わなくてもローカル文字起こしは動作しますが、文章を整えたり翻訳を追加したりするには、`Settings > LLM Service` でプロバイダーを設定する必要があります。このページでは、`LLM Polish` と `Translate` の使い方を説明します。本文を書き換えずに要約だけ作りたい場合は、[AI Summary](guide:ai-summary) を参照してください。

## 推奨対象

- ローカル文字起こし後に、誤字、句読点、言い回しを整えたい場合
- 原文の文字起こしを残したまま、翻訳セグメントを追加したい場合
- 整文と翻訳を同じエディタ内で完結させたい場合

## 開始する前に

- [Live Record](guide:live-record)、[Batch Import](guide:batch-import)、または[ワークスペース、プロジェクト、Inbox](guide:workspace-projects-and-inbox)から作成した文字起こしセグメントが必要です。
- `Settings > LLM Service` で、使いたい機能のモデルとプロバイダーを設定できる状態にしておいてください。

## 先にプロバイダーを接続する

1. `Settings > LLM Service` を開きます。
2. `Feature Models` で、`Polish Model` と `Translation Model` に使うモデルを選択します。
3. `Provider Credentials` で使うプロバイダーを開き、`Base URL`、`API Key`、`Endpoint`、`Deployment Name` など必要な接続情報を入力します。
4. 選択したモデルが推論モードに対応している場合は、`Reasoning Mode` を有効にし、`Reasoning Level` を選択します。
5. `Test Connection` をクリックします。
6. 必要な機能モデルを割り当てたら、メインワークスペースへ戻ります。

## 文字を整えたい場合は LLM Polish を実行する

1. `Settings > LLM Service` で `Polish Model` が割り当てられていることを確認します。
2. アプリ内で `LLM Polish` アクションを開きます。
3. 必要に応じて `LLM Polish`、`Re-transcribe`、`Undo`、`Redo`、`Advanced Settings` を選択します。
4. `Auto-Polish`、`Auto-Polish Frequency`、`Keywords`、`Scenario Presets`、`Custom Context` を調整したい場合は、`Advanced Settings` を開きます。細かな調整は[語彙と詳細設定](guide:vocabulary-and-advanced-settings)にまとめています。

## 二言語表示が必要な場合は Translate を実行する

1. `Settings > LLM Service` で `Translation Model` が割り当てられていることを確認します。
2. `Translate` ボタンをクリックします。
3. 翻訳先の言語を選択します。
4. `Start Translation` または `Retranslate` をクリックします。
5. エディタ内で二言語表示を切り替えるには、`Show Translations` または `Hide Translations` を使います。

## AI 処理で変わること

- `LLM Polish` は、文字起こし本文そのものを更新します。
- `Translate` は、セグメントごとに翻訳テキストを保存し、原文の下に表示できます。

## お役立ちメモ

- `Polish Model` と `Translation Model` は別々に設定できます。同じプロバイダーを使っても、機能ごとに別のプロバイダーを使ってもかまいません。
- 翻訳には `Google Translate (Free)` や `Google Translate (API)` などの専用翻訳プロバイダーも使えますが、AI Polish には LLM 対応のプロバイダーとモデルが必要です。
- 翻訳先の言語は、現在「中国語（簡体字）」「英語」「日本語」「韓国語」「フランス語」「ドイツ語」「スペイン語」に対応しています。
- `Re-transcribe` は、現在の文字起こしが保存済みのワークスペースアイテムから開かれている場合に利用できます。
- 要約を作りたい場合は、[AI Summary](guide:ai-summary) に進んでください。
- Auto-Polish、キーワード、カスタムコンテキストを調整したい場合は、[語彙と詳細設定](guide:vocabulary-and-advanced-settings) に進んでください。
- テキストを整え終えたら、[エクスポートと設定](guide:export-and-settings) に進みます。
