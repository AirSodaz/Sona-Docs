`sona-mcp` 是专为 Sona 桌面客户端打造的 Model Context Protocol (MCP) 服务桥接程序，完全兼容官方 MCP 协议标准（协议版本 `2026-07-28` / MCP 2.0）。它通过本地 IPC 命名管道或 Unix Domain Socket，将外部 AI Agent（Claude Desktop、Cursor、OpenCode、Codex 等）直接连接到 Sona 桌面端的本地语音转录引擎、历史数据库、项目工作区及录音生命周期。

## 架构与设计边界

`sona-mcp` 在外部 AI Agent 与 Sona 本地转录 Host 之间保持了清晰的职责划分：

1. **AI 推理边界**：`sona-mcp` 本身不承载 LLM 模型，也不直接运行推理。外部 Agent 天生具备语言理解、对话与推理能力。`sona-mcp` 提供细粒度的工具（Tools）与上下文资源（Resources），使 Agent 能够检查、修正、翻译和总结音频记录。
2. **无状态协议桥接**：`sona-mcp` 通过标准 I/O（`stdio`）上的 JSON-RPC 2.0 与外部 Agent 通信。它将协议请求转换为轻量级的本地 IPC 消息，直接分发给正在运行的 Sona 桌面端进程。
3. **数据一致性与版本化**：通过 MCP 提交的任何修改（分段编辑、批量修补、译文更新与摘要修改）均会在 Sona 桌面端的 SQLite 存储库中触发不可变快照记录，并实时向桌面 UI 广播更新事件。

```text
+-----------------------+              +-----------------------+              +-----------------------+
|   外部 AI Agent       |              |       sona-mcp        |              |   Sona 桌面客户端     |
| (Claude/Cursor 等)    | <--(stdio)-> |    (协议桥接进程)     | <--(IPC)-->  | (ASR/SQLite/本地存储) |
+-----------------------+   JSON-RPC   +-----------------------+  Pipe/Socket +-----------------------+
```

## 通信传输与端点解析

MCP 服务接受一个可选命令行参数来指定自定义通信端点：

```bash
sona-mcp [OPTIONS]

选项：
      --endpoint <ENDPOINT>  自定义 IPC 命名管道或 Socket 端点
  -h, --help                 打印帮助信息
  -V, --version              打印版本号
```

### 默认 IPC 端点

若未显式传入 `--endpoint` 参数，`sona-mcp` 会自动使用系统默认端点：

- **Windows**：`\\.\pipe\sona-agent-ipc`
- **macOS / Linux**：`$XDG_RUNTIME_DIR/sona-agent.sock`（后备路径：`~/.local/share/sona/agent.sock`）

### 离线状态与懒启动

当 Sona 桌面客户端尚未运行时：

- `sona_get_client_state` 将优雅返回 `{ "online": false }`，不会崩溃或报错。
- 所有数据修改或读取工具将返回明确错误（`Sona desktop client is offline.`）。
- 外部 Agent 可以调用 `sona_launch_desktop` 工具（支持 `silent: true` 静默启动并常驻系统托盘）在后台启动桌面端，并轮询等待 IPC 连接建立。

## 外部 Agent 配置示例

只需在 Agent 的 MCP 配置文件中注册 `sona-mcp`，即可让 Agent 获得对 Sona 的控制能力。

### 1. Claude Desktop

在 `claude_desktop_config.json` 的 `mcpServers` 下添加配置：

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

若 `sona-mcp` 未加入系统环境变量 `PATH`，请填写 Sona 安装目录下的可执行文件绝对路径。

### 2. Cursor

在项目工作区根目录或全局 Cursor 设置中的 `.cursor/mcp.json` 添加配置：

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

## 核心工具集一览

`sona-mcp` 声明了 40 个细粒度工具，涵盖转录生命周期的关键领域：

### 1. 状态与生命周期
- `sona_get_client_state`：检查桌面端在线状态、当前录音任务 ID 与选中项目
- `sona_launch_desktop`：后台拉起 Sona 桌面客户端（支持 `silent: true` 静默托盘常驻）

### 2. 音频录制控制
- `sona_start_recording`：启动实时录音并可直接指定所属项目
- `sona_stop_recording`：停止并完成当前录音任务
- `sona_pause_recording`：暂停当前录音流
- `sona_resume_recording`：恢复已暂停的录音
- `sona_get_recording_state`：获取实时录音时长、音频电平与分段数量

### 3. 转录文稿检查与编辑
- `sona_get_transcript`：根据历史 ID 获取转录全文分段、时间戳与说话人信息
- `sona_edit_transcript`：全量替换分段列表并自动留存不可变历史快照
- `sona_patch_segments`：按 ID 精确修补特定分段（文本、说话人、时间戳）
- `sona_delete_transcript`：永久删除某条历史记录及关联音频文件

### 4. 译文与摘要管理
- `sona_update_translation`：写入或更新多语种翻译文本分段
- `sona_edit_summary`：编辑或重新生成 AI 会议纪要与行动项
- `sona_delete_summary`：清空某条记录的摘要内容

### 5. 项目与收件箱整理
- `sona_list_projects`：列出所有项目工作区及其包含的条目数量
- `sona_assign_project`：将转录记录移动到指定项目或移回收件箱（Inbox）
- `sona_delete_project`：删除项目并选择将记录移回收件箱或回收站

### 6. 设置与系统诊断
- `sona_get_settings`：查看应用配置、存储目录与生效的模型 ID
- `sona_update_settings`：修改允许的客户端偏好设置
- `sona_get_diagnostics`：检查硬件加速状态、ASR 引擎及错误日志

## 上下文资源 (`sona://`)

外部 Agent 可直接通过标准化的 `sona://` URI 协议读取实时上下文：

- `sona://client/state`：当前客户端在线状态与会话信息
- `sona://recording/state`：实时录音状态、时长与音量
- `sona://projects`：项目列表与元数据
- `sona://history/{history_id}/transcript`：格式化转录分段文本
- `sona://history/{history_id}/translation`：翻译结果文本
- `sona://history/{history_id}/summary`：AI 会议纪要与行动要点
