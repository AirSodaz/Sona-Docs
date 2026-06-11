# AI校正と翻訳

Sonaの校正機能と翻訳機能はオプションです。これらを使用しなくてもローカルでの文字起こしは機能しますが、AI処理を行う場合は「Settings > LLM Service（設定 > LLMサービス）」でプロバイダーの設定を行う必要があります。このページでは、「LLM Polish（LLM校正）」と「Translate（翻訳）」に焦点を当てています。本文の書き換えではなく、文字起こしの要約を作成したい場合は、直接[AI要約](guide:ai-summary)にジャンプしてください。

## 推奨対象

- ローカル文字起こし完了後、テキストの誤字や表現をクリーンアップしたい場合
- 原文の文字起こしを表示したまま、翻訳セグメントを生成したい場合
- 校正と翻訳を同じエディタフロー内で完結させたい場合

## 開始する前に

- [ライブ録音](guide:live-record)、[バッチインポート](guide:batch-import)、または[ワークスペース、プロジェクト、インボックス](guide:workspace-projects-and-inbox)から取得した文字起こしセグメントがすでに存在すること。
- 「Settings > LLM Service（設定 > LLMサービス）」で必要な機能の設定を行う準備ができていること。

## 最初にプロバイダーを接続する

1. 「Settings > LLM Service」を開きます。
2. 「Feature Models（機能モデル）」で、「Polish Model（校正モデル）」と「Translation Model（翻訳モデル）」に使用するモデルを選択します。
3. 「Provider Credentials（プロバイダー認証情報）」で、使用するプロバイダーを開き、「Base URL」、「API Key」、「Endpoint」、「Deployment Name」、またはプロバイダー固有の項目など、必要な接続情報を入力します。
4. 選択したモデルが推論モードをサポートしている場合は、「Reasoning Mode」を有効にし、「Reasoning Level（推論レベル）」を選択します。
5. 「Test Connection（接続テスト）」をクリックします。
6. 必要な機能モデルが割り当てられたら、メインワークスペースに戻ります。

## テキストをきれいに整えたい場合に校正（Polish）を実行する

1. 「Settings > LLM Service」で「Polish Model」が割り当てられていることを確認します。
2. アプリ内で、「LLM Polish」アクションを開きます。
3. 必要に応じて「LLM Polish（校正）」、「Re-transcribe（再文字起こし）」、「Undo（元に戻す）」、「Redo（やり直し）」、または「Advanced Settings（詳細設定）」を選択します。
4. 「Auto-Polish（自動校正）」、「Auto-Polish Frequency（自動校正頻度）」、「Keywords（キーワード）」、「Scenario Presets（シナリオプリセット）」、または「Custom Context（カスタムコンテキスト）」を管理したい場合は、「Advanced Settings」を開きます。より詳細な調整オプションは[語彙と詳細設定](guide:vocabulary-and-advanced-settings)にまとめられています。

## 二言語表記が必要な場合に翻訳（Translation）を実行する

1. 「Settings > LLM Service」で「Translation Model」が割り当てられていることを確認します。
2. 「Translate（翻訳）」ボタンをクリックします。
3. 翻訳先の言語を選択します。
4. 「Start Translation（翻訳開始）」または「Retranslate（再翻訳）」をクリックします。
5. エディタ内での二言語表示を切り替えるには、「Show Translations（翻訳を表示）」または「Hide Translations（翻訳を非表示）」を使用します。

## AI処理がもたらす変更

- 「LLM Polish」は、文字起こしテキスト自体をインプレースで更新（上書き）します。
- 「Translate」は、セグメントごとに翻訳テキストを保存し、原文の下に表示させることができます。

## お役立ちメモ

- 「Polish Model」と「Translation Model」は個別に設定できます。1つのプロバイダーで両方を兼ねることも、それぞれ異なるプロバイダーに分けることも可能です。
- 翻訳には `Google Translate (Free)` や `Google Translate (API)` などの専用翻訳プロバイダーを使用できますが、校正（Polish）にはLLM対応のプロバイダーとモデルが必要です。
- 翻訳のターゲット言語は、現在「中国語（簡体字）」、「英語」、「日本語」、「韓国語」、「フランス語」、「ドイツ語」、「スペイン語」をサポートしています。
- 「Re-transcribe（再文字起こし）」は、現在の文字起こしが保存済みのワークスペースアイテムから読み込まれたものである場合にのみ利用できます。
- 本文を書き換えるのではなく、文字起こしテキストの横に要約を作成したい場合は、[AI要約](guide:ai-summary)に進んでください。
- 「Auto-Polish」、キーワード、またはカスタムコンテキストの調整を行いたい場合は、[語彙と詳細設定](guide:vocabulary-and-advanced-settings)に進んでください。
- テキストの内容が整ったら、[エクスポートと設定](guide:export-and-settings)に進みます。
