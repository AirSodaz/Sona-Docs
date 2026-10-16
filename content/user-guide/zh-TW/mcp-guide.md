`sona-mcp` 是專為 Sona 桌面用戶端打造的 Model Context Protocol (MCP) 服務橋接程式，完全相容官方 MCP 協定標準（協定版本 `2026-07-28` / MCP 2.0）。它透過本機 IPC 具名管道或 Unix Domain Socket，將外部 AI Agent（Claude Desktop、Cursor、OpenCode、Codex 等）直接連接到 Sona 桌面端的本機語音轉錄引擎、歷史資料庫、專案工作區及錄音生命週期。

## 架構與設計邊界

`sona-mcp` 在外部 AI Agent 與 Sona 本機轉錄 Host 之間保持了清晰的職責劃分：

1. **AI 推理邊界**：`sona-mcp` 本身不承載 LLM 模型，也不直接執行推理。外部 Agent 天生具備語言理解、對話與推理能力。`sona-mcp` 提供細粒度的工具（Tools）與上下文資源（Resources），使 Agent 能夠檢查、修正、翻譯和總結音訊記錄。
2. **無狀態協定橋接**：`sona-mcp` 透過標準 I/O（`stdio`）上的 JSON-RPC 2.0 與外部 Agent 通訊。它將協定請求轉換為輕量級的本機 IPC 訊息，直接分發給正在執行的 Sona 桌面端處理程序。
3. **資料一致性與版本化**：透過 MCP 提交的任何修改（分段編輯、批次修補、譯文更新與摘要修改）均會在 Sona 桌面端的 SQLite 儲存庫中觸發不可變快照記錄，並即時向桌面 UI 廣播更新事件。

```text
+-----------------------+              +-----------------------+              +-----------------------+
|   外部 AI Agent       |              |       sona-mcp        |              |   Sona 桌面用戶端     |
| (Claude/Cursor 等)    | <--(stdio)-> |    (協定橋接處理程序) | <--(IPC)-->  | (ASR/SQLite/本機儲存) |
+-----------------------+   JSON-RPC   +-----------------------+  Pipe/Socket +-----------------------+
```

## 通訊傳輸與端點解析

MCP 服務接受一個選用命令列參數來指定自訂通訊端點：

```bash
sona-mcp [OPTIONS]

選項：
      --endpoint <ENDPOINT>  自訂 IPC 具名管道或 Socket 端點
  -h, --help                 列印說明資訊
  -V, --version              列印版本號
```

### 預設 IPC 端點

若未明確傳入 `--endpoint` 參數，`sona-mcp` 會自動使用系統預設端點：

- **Windows**：`\\.\pipe\sona-agent-ipc`
- **macOS / Linux**：`$XDG_RUNTIME_DIR/sona-agent.sock`（備用路徑：`~/.local/share/sona/agent.sock`）

### 離線狀態與延遲啟動

當 Sona 桌面用戶端尚未執行時：

- `sona_get_client_state` 將正常返回 `{ "online": false }`，不會崩潰或報錯。
- 所有資料修改或讀取工具將返回明確錯誤（`Sona desktop client is offline.`）。
- 外部 Agent 可以呼叫 `sona_launch_desktop` 工具（支援 `silent: true` 靜默啟動並常駐系統匣）在背景啟動桌面端，並輪詢等待 IPC 連線建立。

## 外部 Agent 設定範例

只需在 Agent 的 MCP 設定檔中註冊 `sona-mcp`，即可讓 Agent 獲得對 Sona 的控制能力。

### 1. Claude Desktop

在 `claude_desktop_config.json` 的 `mcpServers` 下新增設定：

- macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows：`%APPDATA%\Claude\claude_desktop_config.json`
- Linux：`~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sona": {
      "command": "sona-mcp",
      "args": []
    }
  }
}
```

若 `sona-mcp` 未加入系統環境變數 `PATH`，請填寫 Sona 安裝目錄下的執行檔絕對路徑。

### 2. Cursor

在專案工作區根目錄或全域 Cursor 設定中的 `.cursor/mcp.json` 新增設定：

```json
{
  "mcpServers": {
    "sona": {
      "command": "sona-mcp",
      "args": []
    }
  }
}
```

## 核心工具集一覽

`sona-mcp` 宣告了 40 個細粒度工具，涵蓋轉錄生命週期的關鍵領域：

### 1. 狀態與生命週期
- `sona_get_client_state`：檢查桌面端連線狀態、目前錄音任務 ID 與選中專案
- `sona_launch_desktop`：背景拉起 Sona 桌面用戶端（支援 `silent: true` 靜默系統匣常駐）

### 2. 音訊錄製控制
- `sona_start_recording`：啟動即時錄音並可直接指定所屬專案
- `sona_stop_recording`：停止並完成目前錄音任務
- `sona_pause_recording`：暫停目前錄音串流
- `sona_resume_recording`：恢復已暫停的錄音
- `sona_get_recording_state`：取得即時錄音時長、音訊電平與分段數量

### 3. 轉錄文稿檢查與編輯
- `sona_get_transcript`：根據歷史 ID 取得轉錄全文分段、時間戳記與說話者資訊
- `sona_edit_transcript`：全量替換分段清單並自動留存不可變歷史快照
- `sona_patch_segments`：按 ID 精確修補特定分段（文字、說話者、時間戳記）
- `sona_delete_transcript`：永久刪除某條歷史記錄及關聯音訊檔案

### 4. 譯文與摘要管理
- `sona_update_translation`：寫入或更新多語種翻譯文字分段
- `sona_edit_summary`：編輯或重新產生 AI 會議記錄與行動要點
- `sona_delete_summary`：清空某條記錄的摘要內容

### 5. 專案與收件匣整理
- `sona_list_projects`：列出所有專案工作區及其包含的項目數量
- `sona_assign_project`：將轉錄記錄移動到指定專案或移回收件匣（Inbox）
- `sona_delete_project`：刪除專案並選擇將記錄移回收件匣或垃圾桶

### 6. 設定與系統診斷
- `sona_get_settings`：檢視應用程式設定、儲存目錄與生效的模型 ID
- `sona_update_settings`：修改允許的用戶端喜好設定
- `sona_get_diagnostics`：檢查硬體加速狀態、ASR 引擎及錯誤日誌

## 上下文資源 (`sona://`)

外部 Agent 可直接透過標準化的 `sona://` URI 協定讀取即時上下文：

- `sona://client/state`：目前用戶端連線狀態與工作階段資訊
- `sona://recording/state`：即時錄音狀態、時長與音量
- `sona://projects`：專案清單與元資料
- `sona://history/{history_id}/transcript`：格式化轉錄分段文字
- `sona://history/{history_id}/translation`：翻譯結果文字
- `sona://history/{history_id}/summary`：AI 會議記錄與行動要點
