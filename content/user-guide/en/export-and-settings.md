This page covers the final stage of the workflow: exporting finished transcripts, doing final speaker/version checks, locating the settings areas that matter most, and knowing where support surfaces such as `Dashboard`, `Diagnostics`, `Backup & Restore`, `Automation`, and notifications live.

## Export a finished transcript

Before exporting, open `Speaker Review` from the transcript header if speaker labels matter for your delivery or review process. For saved non-draft transcripts, open `Version Snapshots` first if you need to recover selected rows or revert a bulk rewrite.

1. Click the `Export` button in the header.
2. In the `Export Transcript` modal, enter a `Filename`.
3. Choose an `Export Directory`.
4. Pick an output format: `SubRip (.srt)`, `WebVTT (.vtt)`, `JSON (.json)`, `Plain Text (.txt)`, or `Markdown (.md)`.
5. Choose an export mode: `Original`, `Translation`, or `Bilingual`.
6. Click `Export`.
7. Use `Copy to Clipboard` when you want the same selected mode as plain text without writing a file.

## What export gives you

- Sona writes the transcript to the selected path and format.
- `Markdown (.md)` preserves speaker labels as bold labels and keeps the transcript readable in Markdown editors.
- If translation text exists, you can export translated-only or bilingual output.
- `Copy to Clipboard` uses the selected export mode and copies plain text from final segments.
- `Translation` and `Bilingual` only appear when at least one segment already contains translation text.

## When to go back to `Projects`

- If you want to reopen, rename, move, or sort saved recordings and imports, go back to [Projects and Inbox](guide:workspace-projects-and-inbox).
- `Project Center` is also where project context and `Inbox` organization live now.

## Settings areas organized by category

The Sona desktop settings sidebar is grouped into 5 labeled categories:

### 1. General
- `Settings > General`: theme, app language, font, auto-start on boot, silent launch (start minimized to system tray), update checks, plus `Diagnostics` and `Backup & Restore`
- `Settings > Dashboard`: global content overview, speaker coverage, and LLM usage trends
- `Settings > About`: version info, release notes, license, and update actions

### 2. Recognition & Speech
- `Settings > Input Device`: microphone selection, system audio selection, microphone boost, `Keep Microphone Active`, and mute during recording
- `Settings > Subtitle Settings`: floating caption behavior, window styling, click-through, and font sizing
- `Settings > Voice Typing`: turn on `Voice Typing`, assign its global shortcut, choose `Push to Talk (Hold)` or `Toggle (Press once)`, situational presets, and check readiness
- `Settings > Model Settings`: `Live Record Model`, `Batch Import Model`, CTC forced alignment, diarization sensitivity (Permissive/Balanced/Strict), `Batch VAD Segmentation`, `VAD Buffer Size`, and model management
- `Settings > Vocabulary`: organized into sub-tabs (`Recognition & Correction`, `Prompts & Context`, `Speaker Profiles`) and unified dictionary (Visual Mode & YAML source)

### 3. AI & Automation
- `Settings > LLM Service`: feature model bindings (local offline GGUF via llama.cpp or cloud LLMs via aimux), reasoning options with thinking separation, and provider credentials
- `Settings > Automation`: watched-folder rules that automatically transcribe, polish, translate, and export incoming media into target projects

### 4. Integration & Sync
- `Settings > Cloud Sync`: End-to-End Encrypted (E2EE) cross-device sync vault supporting WebDAV and S3-compatible object storage (AWS S3, Cloudflare R2, MinIO, etc.), Master Password, Emergency Recovery Key, and Conflict Center
- `Settings > API Server`: local HTTP API host, port, optional API key, IP allowlist, REST transcription, and WebSocket streaming
- `Settings > MCP Server`: Model Context Protocol bridge configuration, endpoint monitoring, and agent permission toggles (transcript editing, destructive actions, model downloads)

### 5. System & Advanced
- `Settings > Storage Management`: data and models directory overview, hot-reload storage migration (live directory moving with progress modal), pure-Rust audio decoding with optional custom FFmpeg fallback path, disk usage breakdown, and cleanup policies
- `Settings > Shortcuts`: live recording, playback, search, project navigation, and editor shortcuts (supports strikethrough `Ctrl + Shift + S`)
## Diagnostics, backup, cloud sync, and message center

- In `Settings > General`, use `Diagnostics` to inspect the local transcription chain, runtime readiness, and packaging environment.
- In the same page, use `Backup & Restore` to export or import a light archive of config, project data, light history transcripts and summaries, automation state, and dashboard LLM usage.
- Light backup archives restore text history and summaries, but not original audio files. Restored entries may reopen for reading and editing without playback.
- `Settings > Cloud Sync` is a standalone End-to-End Encrypted (E2EE) incremental sync system. Transcripts and settings are encrypted with your Master Password before leaving your device, with an Emergency Recovery Key for access recovery, and a Conflict Center to arbitrate concurrent edits across devices. Audio recordings remain stored locally on your machine and are never uploaded to the cloud.
- An entry at the bottom of the Cloud Sync page allows a one-time import of legacy WebDAV backup archives; Sona no longer creates new full remote backup bundles.
- The Message Center in the header centrally manages batch transcription, automation, and LLM jobs with real-time progress, cancellation, and clear options for completed tasks; interrupted tasks can also be resumed or discarded in its Recovery Center.

## If you mainly came for an extension capability

- Need a transcript-side recap: [AI Summary](guide:ai-summary)
- Need floating captions or dictation in another app: [Live Caption and Voice Typing](guide:live-caption-and-voice-typing)
- Need watched-folder processing or export automation: start from `Settings > Automation` on this page
- Need `Hotwords`, `Text Replacement`, `Speaker Profiles`, `Auto-Polish`, or custom context tuning: [Vocabulary and Advanced Settings](guide:vocabulary-and-advanced-settings)

## Useful notes

- This page is intentionally not a full settings manual. It is here to point you at the right next page.
- If you are troubleshooting rather than exporting, go straight to [FAQ and Troubleshooting](guide:faq).
