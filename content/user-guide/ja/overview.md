# 概要

Sona は、音声の文字起こしをできるだけ自分のマシン上で完結させたい人のための、ローカルファーストな文字起こしエディタです。このガイドは実際の製品フローに沿って整理しているため、今やりたい作業に近いページから読み始められます。

## 目的に合うページを選ぶ

- 新しくインストールした、または初めて起動する: [はじめに](guide:getting-started)
- 今すぐ音声を録音したい: [Live Record](guide:live-record)
- 既存の音声または動画ファイルを使いたい: [Batch Import](guide:batch-import)
- 文字起こし、タイムスタンプ、話者ラベル、再生、バージョン履歴を確認したい: [編集と再生](guide:edit-and-playback)
- LLM を使って文章を整えたり、翻訳を追加したりしたい: [AI Polish と翻訳](guide:ai-polish-and-translate)
- 保存済みの録音、プロジェクト、Inbox の内容を整理したい: [ワークスペース、プロジェクト、Inbox](guide:workspace-projects-and-inbox)
- 完成した内容を書き出す、または設定画面の場所を確認したい: [エクスポートと設定](guide:export-and-settings)
- 本文を書き換えずに要約だけ作りたい: [AI Summary](guide:ai-summary)
- フローティング字幕や他のアプリへの音声入力を使いたい: [Live Caption と Voice Typing](guide:live-caption-and-voice-typing)
- Hotwords、Text Replacement、Speaker Profiles、Auto-Polish を調整したい: [語彙と詳細設定](guide:vocabulary-and-advanced-settings)
- ターミナルからオフラインのバッチ文字起こしを実行したい: [CLI ガイド](guide:cli-guide)
- 問題の切り分けやよくある詰まりを確認したい: [FAQ とトラブルシューティング](guide:faq)

## Sona の基本ワークフロー

1. [はじめに](guide:getting-started)を完了し、オフラインモデルを使える状態にします。
2. [Live Record](guide:live-record) または [Batch Import](guide:batch-import) で文字起こしを作成します。
3. 必要に応じて話者やバージョン履歴も確認しながら、[編集と再生](guide:edit-and-playback)でテキストを整えます。
4. LLM による整文や翻訳が必要な場合だけ、[AI Polish と翻訳](guide:ai-polish-and-translate)を使います。
5. 保存済みの作業を開き直したり、プロジェクトを切り替えたり、現在のエディタ外のアイテムを整理したりする場合は、[ワークスペース、プロジェクト、Inbox](guide:workspace-projects-and-inbox)を使います。
6. 仕上げとして[エクスポートと設定](guide:export-and-settings)を確認します。復元、更新、自動化などの通知が出た場合は、ヘッダーの通知センターも確認してください。

AI Summary、Live Caption、Voice Typing、Speaker Profiles、語彙調整は、基本ワークフローを補う機能です。まずは文字起こしの流れを一度通し、そのあと必要に応じて個別のページを開くのが一番わかりやすい進め方です。

## このガイドで扱うこと

- ローカル文字起こしを始めるための推奨手順
- Live Record と、キューに追加して処理する Batch Import の違い
- エディタ、ワークスペース整理、翻訳、エクスポートのつながり
- 編集や引き継ぎで役立つ Speaker Review、Speaker Profiles、Version Snapshots の使い方
- Dashboard、Diagnostics、Backup & Restore、Automation、通知センターなど、日常的に参照する設定画面の役割

## 関連ドキュメント

- コマンドラインからのバッチ文字起こし: [CLI ガイド](guide:cli-guide)
- ローカル HTTP API 連携: [HTTP API ガイド](guide:api-guide)
- ソースからのビルドと開発コマンド: [プロジェクトの README](readme)

> Sona の基本は、ローカル文字起こしを設定し、新しい音声または既存ファイルを開き、エディタで確認し、必要に応じてワークスペース整理、AI Polish、翻訳、要約、エクスポートへ進むことです。
