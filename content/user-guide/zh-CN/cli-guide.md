`sona-cli` 是 Sona 基于 `sona-core` 构建的独立、无状态命令行语音识别 Host。它支持通过本地预设 ASR 模型或云端在线 Provider 转录音频文件、目录、麦克风实时音频输入与标准输入流。它不会打开或管理 Sona 的 SQLite 应用数据库、项目数据库、历史存储、同步状态或 Online LLM 任务。转录结果只输出到 `stdout` 或指定目标文件。

独立 CLI 提供以下核心命令：

- `live`（兼任别名 `transcribe-live`）：麦克风或标准输入的实时流式语音识别
- `transcribe`：基于本地或云端模型的音频/视频文件及目录批量转录
- `models`：列出、下载、查询、校验、搜索与删除预设 ASR 模型
- `export`：将转录分段 JSON 转换为 SRT、VTT、TXT、MD 等格式（支持兼容别名 `export transcript`）
- `config`：查看与管理 TOML 配置文件（`init`、`check`、`show`、`get`、`set`、`unset`、`edit`、`path`）
- `doctor`：运行宿主环境诊断，检测硬件加速（CUDA、Metal、AVX2、NEON）与路径健康
- `devices`：列出当前系统可用的音频输入和输出设备
- `providers`：查看已配置的云端在线 ASR Provider 及其能力状态
- `update`：检查并通过 Minisign 签名校验安全安装更新
- `completion`：生成 Shell 自动补全脚本（bash、zsh、fish、powershell、elvish）
- `serve`：启动本地 HTTP API 服务与 WebSocket 实时流式识别（`/v1/streaming`）
- `diagnostics`：构建宿主诊断快照契约

## 运行方式

- 打包版本：使用同平台安装包产物中附带的 `sona-cli` 可执行文件。
- 源码版本：`cargo run -p sona-cli -- <command> ...`

示例：

```bash
sona-cli doctor
sona-cli config init
sona-cli models list
sona-cli models download whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav --online-provider groq-whisper
sona-cli live -m sensevoice
sona-cli live --online-provider volcengine-doubao
sona-cli export ./segments.json ./transcript.vtt
sona-cli serve --host 127.0.0.1 --port 14200
```

## 无状态边界

CLI 有意排除 SQLite、History、Tag、应用备份/恢复、Sync 和 Online LLM。它不会创建或静默修改桌面应用数据目录。输出将打印到 `stdout` 或写入明确指定的文件。请使用 `export`（或 `export transcript`）以及 `stdout`/文件输出，把 CLI 与其他工具组合起来。

## 配置优先级

配置项按以下优先级从高到低解析：

1. 显式命令行参数：`-c / --config <PATH>`
2. 全局环境变量：`SONA_CONFIG`
3. 当前工作目录下的配置文件：`./sona-cli.toml`
4. 用户标准配置目录下的配置文件：`sona-cli.toml`（Linux：`~/.config/sona/sona-cli.toml`，macOS：`~/Library/Application Support/sona/sona-cli.toml`，Windows：`%APPDATA%\sona\sona-cli.toml` 或 `%USERPROFILE%\.config\sona\sona-cli.toml`）
5. 内置默认值：若未找到上述文件，以安全内置默认值运行

## 命令

### `config`

检查与管理 Sona CLI 配置文件：

- `sona-cli config init`：生成带注释的配置模板（使用 `-F/--force` 覆盖已有文件）
- `sona-cli config check`：校验配置文件的语法与分节
- `sona-cli config show`：显示当前合并后的生效配置
- `sona-cli config get <KEY>`：读取指定配置项值
- `sona-cli config set <KEY> <VALUE> [--global]`：在本地或全局持久化配置项
- `sona-cli config unset <KEY> [--global]`：移除指定配置项
- `sona-cli config edit`：在系统默认文本编辑器中打开配置文件
- `sona-cli config path`：打印解析到的配置文件绝对路径

```bash
sona-cli config init
sona-cli config check
sona-cli config set transcribe.model_id whisper-turbo
sona-cli config get transcribe.model_id
```

### `models`

管理所选模型目录下的本地预设 ASR 模型：

- `sona-cli models list`：列出可用预设模型（支持 `--mode live|batch`、`--installed`、`--json`）
- `sona-cli models download <MODEL>`（别名 `install`）：下载模型并校验哈希
- `sona-cli models delete <MODEL>`（别名 `rm`）：删除下载的模型文件（使用 `-F/--force` 免确认）
- `sona-cli models info <MODEL>`（别名 `show`）：查看模型技术规格与伴随组件
- `sona-cli models search <QUERY>`：按关键词或语言搜索模型
- `sona-cli models verify <MODEL>`：校验已安装模型文件的完整性与哈希
- `sona-cli models path`：打印当前生效的模型根目录路径

```bash
sona-cli models list --mode batch
sona-cli models search chinese
sona-cli models download whisper-turbo
sona-cli models verify whisper-turbo
sona-cli models delete whisper-turbo --force
```

### `transcribe`

使用本地预设 ASR 模型或云端在线 Provider 转录音频或视频文件。未指定 `--online-provider` 时使用本地 Sherpa 预设：

```bash
sona-cli transcribe ./sample.wav -m whisper-turbo
sona-cli transcribe ./sample.wav -m whisper-turbo -o ./transcript.srt
sona-cli transcribe ./sample.wav --model-id sherpa-onnx-whisper-turbo
```

指定 `--online-provider` 时，CLI 将音频上传到指定的云端服务并输出识别结果：

```bash
export GROQ_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider groq-whisper --format txt

export SONA_VOLCENGINE_ASR_API_KEY="..."
sona-cli transcribe ./sample.wav --online-provider volcengine-doubao --output ./out.srt
```

支持的批量 Provider 包括 `volcengine-doubao`、`groq-whisper` 和 `mistral-voxtral`：

| Provider | 默认环境变量 |
| --- | --- |
| `volcengine-doubao` | `SONA_VOLCENGINE_ASR_API_KEY` |
| `groq-whisper` | `GROQ_API_KEY` |
| `mistral-voxtral` | `MISTRAL_API_KEY` |

使用 `--api-key-env NAME` 可指定自定义环境变量。`--online-config FILE` 接受非敏感参数覆写的 JSON 文件，且不可包含 `apiKey` 或 `api_key`。

选择在线 Provider 时，本地专用选项（如 `--model-id`、`--models-dir`、VAD/标点参数、线程数、GPU 模式与 `--save-wav`）会被明确拒绝。覆盖已有文件需传 `--force`。

### `transcribe-live`

`sona-cli live`（兼容别名 `sona-cli transcribe-live`）执行麦克风或标准输入（`--input stdin`）的实时流式语音识别。

```bash
sona-cli live -m sensevoice
sona-cli live --device "Studio Mic" --duration 60 --output ./live.srt

ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin -m sensevoice --output-format ndjson
```

在线流式识别目前支持 `volcengine-doubao`：

```bash
export SONA_VOLCENGINE_ASR_API_KEY="..."
ffmpeg -i sample.wav -f s16le -ac 1 -ar 16000 - | \
  sona-cli live --input stdin \
    --online-provider volcengine-doubao --output-format ndjson
```

麦克风输入默认使用 CPAL 默认录音设备，除非通过 `--device` 传入精确设备名（可运行 `sona-cli devices` 查询）。`--output-format` 支持 `text` 与 `ndjson`；`--output` 可在结束时写入 `json`、`txt`、`srt`、`vtt` 或 `md` 文件。Ctrl+C、`stdin` EOF 或 `--duration` 倒计时均会刷新并安全终止会话后退出。

与 `transcribe` 相同的凭据和配置规则同样适用于在线流式识别。

### `export transcript`

将转录分段导出为格式化字幕或纯文本。推荐命令为展平语法的 `sona-cli export <INPUT> [OUTPUT]`，同时完全支持兼容别名 `sona-cli export transcript` 与 `sona-cli convert`：

```bash
sona-cli export ./segments.json ./transcript.vtt
sona-cli export transcript --input ./segments.json --output ./transcript.vtt
sona-cli export ./segments.json ./transcript.srt --mode bilingual
```

输出格式根据扩展名自动推断，也可通过 `--format <srt|vtt|txt|json|tsv|csv|md>` 指定。支持模式为 `original`、`translation` 与 `bilingual`。

### `doctor`

对本地运行环境进行自动健康检查，检测宿主平台、CPU 架构、SIMD 指令集（AVX2、NEON）、GPU/CUDA 加速、音频设备、已安装模型完整性与目录写入权限：

```bash
sona-cli doctor
sona-cli doctor --strict
sona-cli doctor --json
```

### `devices`

枚举宿主系统当前检测到的音频输入与输出设备：

```bash
sona-cli devices
sona-cli devices --json
```

### `providers`

查看已配置的云端在线 ASR Provider 及其连接与能力状态：

```bash
sona-cli providers
sona-cli providers --json
```

### `update`

检查并安全安装 CLI 与桌面端二进制更新，内置 Minisign 密码学签名校验：

```bash
sona-cli update check
sona-cli update apply
```

### `completion`

为常用 Shell 生成自动补全脚本：

```bash
sona-cli completion bash > /etc/bash_completion.d/sona-cli
sona-cli completion zsh > ~/.zfunc/_sona-cli
sona-cli completion fish > ~/.config/fish/completions/sona-cli.fish
sona-cli completion powershell | Out-File -Append -Encoding utf8 $PROFILE
```

### `diagnostics`

构建不访问应用数据库的结构化宿主诊断快照 JSON 对象，便于技术支持与排障：

```bash
sona-cli diagnostics
```

### `serve`

启动共享的本地 HTTP API 服务。支持本地 REST 转写与 WebSocket 实时流式识别（`/v1/streaming`）：

```bash
sona-cli serve
sona-cli serve --config ./sona-cli.toml
sona-cli serve --host 127.0.0.1 --port 14200 --api-key local-secret
```

完整的 REST 和 WebSocket 端点规范请参阅 [HTTP API 指南](guide:api-guide)。

## 退出状态码与错误

- `0`：成功
- `1`：常规故障（如 `doctor --strict` 检查未通过、序列化错误）
- `2`：参数校验或用法错误（无效参数、缺少 Provider、输入文件不存在）
- `3`：模型错误（预设缺失、下载损坏、缺少伴随文件）
- `4`：网络或在线 Provider 错误（认证失败、API 超时）
- `5`：文件系统错误（未加 `--force` 时目标文件已存在、目录写入失败）
- `130`：已取消（收到 Ctrl+C 信号）
