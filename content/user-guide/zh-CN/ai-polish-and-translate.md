Sona 的润色与翻译是可选能力。离线转录本身不依赖它们，但如果你要继续做 AI 处理，就需要先在 `设置 > LLM 服务` 中完成配置。这一页只聚焦 `LLM 润色` 和 `翻译`；如果你主要想要一份贴着转录存在的归纳，请直接看 [AI 摘要](guide:ai-summary)。

## 适合这些场景

- 想把本地转录后的文字整理得更顺滑
- 希望生成译文，同时保留原文分段做对照
- 希望润色、翻译仍然留在同一个编辑器流程里，而不是切到别的工具

## 开始前

- 你已经有来自 [实时录音](guide:live-record)、[批量转录](guide:batch-import) 或 [工作区、项目与 Inbox](guide:workspace-projects-and-inbox) 的转录分段。
- 你准备先在 `设置 > LLM 服务` 中配置需要的功能。

## 先完成 provider 配置

1. 打开 `设置 > LLM 服务`。
2. 在 `功能模型绑定` 中分别为 `润色模型` 和 `翻译模型` 指定模型。
3. 在 `Provider 凭据` 中展开要使用的 provider，填写连接信息，例如 `Base URL`、`API Key`、`Endpoint`、`Deployment Name` 或 provider 特有字段。
4. 点击 `测试连接`。
5. 确认所需功能已经绑定模型后，再返回主界面使用。

## 需要更顺滑的文本时，运行润色

1. 确认 `设置 > LLM 服务` 中已经指定 `润色模型`。
2. 在应用里打开 `LLM 润色` 动作。
3. 按需选择： `LLM 润色`、`重新转录`、`撤销`、`重做`、`高级设置`。
4. 如果需要管理 `Auto-Polish`、`Auto-Polish Frequency`、`关键词`、`场景预设`、`自定义上下文`，请进入 `高级设置`，更完整的集中说明见 [词汇与高级设置](guide:vocabulary-and-advanced-settings)。

## 需要双语内容时，运行翻译

1. 确认 `设置 > LLM 服务` 中已经指定 `翻译模型`。
2. 点击 `翻译` 按钮。
3. 选择目标语言。
4. 点击 `开始翻译` 或 `重新翻译`。
5. 使用 `显示双语` 或 `隐藏双语` 控制编辑器中的双语显示。

## 这些 AI 步骤会改变什么

- `LLM 润色` 会直接更新转录文本。
- `翻译` 会把译文保存到每个分段，并可显示在原文下方。

## 补充说明

- `润色模型` 与 `翻译模型` 是分开配置的。可以共用同一个 provider，也可以拆开。
- 翻译可以使用 `Google Translate (Free)`、`Google Translate (API)` 这类专用翻译 provider；润色则需要真正的 LLM provider 与模型。
- 当前支持的翻译目标语言包括 `简体中文`、`English`、`Japanese`、`Korean`、`French`、`German`、`Spanish`。
- 只有当当前转录来自已保存的工作区条目时，菜单里才会出现 `重新转录`。
- 如果你下一步要做的是贴着转录存在的摘要，而不是改写转录正文，请继续看 [AI 摘要](guide:ai-summary)。
- 如果你现在关心的是 `Auto-Polish`、关键词或自定义上下文，请继续看 [词汇与高级设置](guide:vocabulary-and-advanced-settings)。
- 当文本已经整理完成，下一步通常就是 [导出与设置](guide:export-and-settings)。
