`sona-mcp` is a Model Context Protocol (MCP) server bridge for the Sona desktop client, compliant with standard MCP specifications (protocol version `2026-07-28`). It connects external AI Agents (Claude Desktop, Cursor, OpenCode, Codex, etc.) directly to Sona desktop's local transcription engine, history database, project workspaces, and audio recording lifecycle over an IPC pipe or Unix domain socket.

## Architecture and boundary

`sona-mcp` maintains a clean separation of concerns between external AI Agents and the local Sona transcription host:

1. **AI Reasoning Boundary**: `sona-mcp` does not host LLM models or run AI inferences directly. External Agents possess conversational and reasoning capabilities. Instead, `sona-mcp` exposes granular tools and contextual resources allowing the Agent to inspect, patch, translate, and summarize audio recordings.
2. **Stateless Protocol Bridge**: `sona-mcp` communicates with external Agents via standard JSON-RPC 2.0 over standard I/O (`stdio`). It translates protocol calls into lightweight local IPC messages sent to the running Sona desktop application.
3. **Data Integrity & Versioning**: All mutations (segment editing, batch patching, translation updates, and summary edits) committed through MCP trigger immutable snapshot creation within Sona desktop's SQLite repository and broadcast live update events to the desktop UI.

```text
+-----------------------+              +-----------------------+              +-----------------------+
|  External AI Agent    |              |       sona-mcp        |              |  Sona Desktop Client  |
|  (Claude/Cursor/etc.) | <--(stdio)-> |   (Protocol Bridge)   | <--(IPC)-->  | (Host ASR/DB/Storage) |
+-----------------------+  JSON-RPC    +-----------------------+  Pipe/Socket +-----------------------+
```

## Transport and endpoint resolution

The MCP server accepts one optional CLI argument for endpoint specification:

```bash
sona-mcp [OPTIONS]

Options:
      --endpoint <ENDPOINT>  Custom IPC pipe or socket endpoint
  -h, --help                 Print help
  -V, --version              Print version
```

### Default IPC endpoints

If `--endpoint` is not explicitly supplied, `sona-mcp` automatically detects the platform default:

- **Windows**: `\\.\pipe\sona-agent-ipc`
- **macOS / Linux**: `$XDG_RUNTIME_DIR/sona-agent.sock` (fallback: `~/.local/share/sona/agent.sock`)

### Offline state and lazy launch

When the Sona desktop client is not currently running:

- `sona_get_client_state` returns `{ "online": false }` without crashing or throwing an error.
- Mutating or data-fetching tools return a graceful error (`Sona desktop client is offline.`).
- External Agents can invoke `sona_launch_desktop` to spawn the desktop client in the background (with silent launch and tray keepalive) and poll until IPC communication is established.

## Agent configuration examples

To configure external AI Agents to control Sona, register `sona-mcp` in your agent's MCP configuration file.

### 1. Claude Desktop

Add `sona` to `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

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

If `sona-mcp` is not in your system `PATH`, provide the absolute path to the binary located in your Sona installation directory.

### 2. Cursor

Add the server to `.cursor/mcp.json` in your workspace or global Cursor settings:

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

## Granular tools overview

`sona-mcp` declares 40 granular tools across key functional domains:

### 1. State and lifecycle
- `sona_get_client_state`: inspect desktop client status, online state, active recording ID, and selected project
- `sona_launch_desktop`: launch Sona desktop in background (supports `silent: true` for silent startup in tray)

### 2. Audio recording controls
- `sona_start_recording`: start a live recording session with optional project assignment
- `sona_stop_recording`: finalize and stop the current active recording session
- `sona_pause_recording`: pause active recording capture
- `sona_resume_recording`: resume paused recording capture
- `sona_get_recording_state`: inspect real-time duration, audio level, and live segments count

### 3. Transcript inspection and editing
- `sona_get_transcript`: retrieve full transcript segments and metadata for a given history ID
- `sona_edit_transcript`: replace full segment list and persist an immutable history snapshot
- `sona_patch_segments`: selectively patch specific segments by ID (text, speaker, timestamps)
- `sona_delete_transcript`: permanently delete a transcript record and its audio files

### 4. Translation and summary
- `sona_update_translation`: save or update translated text segments
- `sona_edit_summary`: update AI summary notes and takeaways
- `sona_delete_summary`: clear summary content for a record

### 5. Projects and organization
- `sona_list_projects`: list all available project workspaces with item counts
- `sona_assign_project`: move a transcript record to a project or back to the Inbox
- `sona_delete_project`: delete a project workspace and move items to Inbox or Trash

### 6. Settings and diagnostics
- `sona_get_settings`: inspect client preferences, storage paths, and active model IDs
- `sona_update_settings`: modify allowed client settings
- `sona_get_diagnostics`: inspect system hardware acceleration, ASR status, and error logs

## Contextual resources (`sona://`)

External Agents can read live contextual data directly through standardized `sona://` URI schemes:

- `sona://client/state`: current desktop host state and active session
- `sona://recording/state`: live recording status, duration, and volume
- `sona://projects`: active project list and metadata
- `sona://history/{history_id}/transcript`: formatted transcript segments
- `sona://history/{history_id}/translation`: translated transcript text
- `sona://history/{history_id}/summary`: generated summary and action items
