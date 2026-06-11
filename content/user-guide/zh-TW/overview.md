Sona 是一款以隱私優先為目標的轉錄編輯器，適合希望預設在本機完成語音轉文字流程的使用者。這份指南按真實產品流程組織，您可以直接跳到目前最需要的那一頁。

## 先選最符合目前任務的頁面

- 第一次安裝或第一次打開： [快速入門](guide:getting-started)
- 現在就要邊錄邊轉： [即時錄音](guide:live-record)
- 手頭已經有音訊或影片檔案： [批次轉錄](guide:batch-import)
- 主要在整理措辭、時間戳記、說話者標籤、回放或版本快照： [編輯與播放](guide:edit-and-playback)
- 需要可選的 AI 潤飾或雙語輸出： [AI 潤飾與翻譯](guide:ai-polish-and-translate)
- 需要整理已儲存的錄音、專案或 `Inbox` 內容： [工作區、專案與 Inbox](guide:workspace-projects-and-inbox)
- 要匯出成品、查看 `儀表板`，或找到 `診斷`、`備份與復原`、通知入口： [匯出與設定](guide:export-and-settings)
- 需要一份貼著轉錄存在的歸納，而不是改寫正文： [AI 摘要](guide:ai-summary)
- 主要想看懸浮字幕或在其他應用程式裡直接聽寫文字： [即時字幕與語音輸入法](guide:live-caption-and-voice-typing)
- 主要想調 `熱詞`、`文字替換`、`說話者檔案` 或 `Auto-Polish`： [詞彙與高級設定](guide:vocabulary-and-advanced-settings)
- 主要想從終端機做離線批次轉錄： [CLI 指南](guide:cli-guide)
- 遇到具體阻塞： [常見問題與疑難排解](guide:faq)

## 一句話看懂 Sona 的完整流程

1. 先完成 [快速入門](guide:getting-started)，讓離線模型和輸入裝置進入可用狀態。
2. 透過 [即時錄音](guide:live-record) 或 [批次轉錄](guide:batch-import) 生成轉錄內容。
3. 在 [編輯與播放](guide:edit-and-playback) 中整理文字和時間戳記；需要時也在這裡完成說話者校對或版本復原。
4. 只有在需要時，再進入 [AI 潤飾與翻譯](guide:ai-polish-and-translate)。
5. 如果您要重新打開已儲存內容、切換專案上下文，或系統整理已有條目，就進入 [工作區、專案與 Inbox](guide:workspace-projects-and-inbox)。
6. 最後在 [匯出與設定](guide:export-and-settings) 完成匯出或查看關鍵設定；如果 Sona 主動彈出復原、更新或自動化結果，也從頂部通知中心繼續處理。

`AI 摘要`、`即時字幕`、`語音輸入法`、說話者檔案和 `詞彙/高級設定` 都屬於圍繞主流程展開的擴充能力。通常先把核心轉錄流程跑通，再按需要打開對應頁面即可。

## 這份指南重點覆蓋什麼

- 推薦的首次離線上手路徑
- `即時錄音` 與 `批次轉錄` 的適用區別
- 編輯、工作區整理、翻譯、匯出這些步驟如何接成同一條工作流程
- 說話者校對、說話者檔案和版本快照分別應該放在編輯與交付流程的哪個位置
- 日常最值得先了解的支援面：`儀表板`、`診斷`、`備份與復原`、`自動化` 和通知中心，而不是把每個設定都展開成完整手冊

## 其他您可能會用到的文件

- 命令行批次轉錄： [CLI 指南](guide:cli-guide)
- 本地 HTTP API 整合： [HTTP API 指南](guide:api-guide)
- 原始碼建構與開發命令： [專案 README](readme)

> Sona 的正常路徑其實很直接：先把本機轉錄設定好，再生成或重新打開轉錄、整理文字，然後按需使用工作區整理、潤飾、翻譯、摘要和匯出。
