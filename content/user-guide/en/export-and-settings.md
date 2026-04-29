This page covers the final stage of the workflow: exporting finished transcripts, locating the settings areas that matter most, and knowing where support surfaces such as `Dashboard`, `Diagnostics`, `Backup & Restore`, `Automation`, and notifications live.

## Export a finished transcript

1. Click the `Export` button in the header.
2. In the `Export Transcript` modal, enter a `Filename`.
3. Choose an `Export Directory`.
4. Pick an output format: `SubRip (.srt)`, `WebVTT (.vtt)`, `JSON (.json)`, or `Plain Text (.txt)`.
5. Choose an export mode: `Original`, `Translation`, or `Bilingual`.
6. Click `Export`.

## What export gives you

- Sona writes the transcript to the selected path and format.
- If translation text exists, you can export translated-only or bilingual output.
- `Translation` and `Bilingual` only appear when at least one segment already contains translation text.

## When to go back to `Workspace`

- If you want to reopen, rename, move, or sort saved recordings and imports, go back to [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox).
- `Workspace` is also where project context and `Inbox` organization live now.

## Settings areas worth learning first

- `Settings > Dashboard`: global content overview, speaker coverage, and LLM usage trends
- `Settings > General`: theme, app language, font, tray behavior, update checks, plus `Diagnostics` and `Backup & Restore`
- `Settings > Input Device`: microphone selection, system audio selection, microphone boost, mute during recording
- `Settings > Subtitle Settings`: floating caption behavior; if you mainly came for `Live Caption` or `Voice Typing`, continue to [Live Caption and Voice Typing](guide:live-caption-and-voice-typing)
- `Settings > Voice Typing`: turn on `Voice Typing`, assign its global shortcut, choose `Push to Talk (Hold)` or `Toggle (Press once)`, and check readiness
- `Settings > Model Settings`: `Live Record Model`, `Batch Import Model`, `Transcription Settings`, `ITN`, `VAD Buffer Size`, `Max Concurrent Transcriptions`, `Restore Default Settings`, and downloadable recognition, punctuation, speaker, and VAD models
- `Settings > Vocabulary`: `Text Replacement`, `Hotwords`, polish keyword sets, polish context presets, and summary templates; the concrete tuning use cases live in [Vocabulary and Advanced Settings](guide:vocabulary-and-advanced-settings)
- `Settings > Automation`: watched-folder rules that can transcribe, polish, translate, and export new media while Sona is running
- `Settings > LLM Service`: feature model bindings and provider credentials; use [AI Polish and Translate](guide:ai-polish-and-translate) for polish/translation and [AI Summary](guide:ai-summary) for summaries
- `Settings > Shortcuts`: live recording shortcuts
- `Settings > About`: source code, logs, and update-related actions

## Diagnostics, backup, and notifications

- In `Settings > General`, use `Diagnostics` to inspect the local transcription chain, runtime readiness, and packaging environment.
- In the same page, use `Backup & Restore` to export or import a light archive of config, workspace, light history transcripts and summaries, automation state, and dashboard LLM usage.
- `WebDAV Cloud Sync` lives inside `Backup & Restore`. It stores credentials locally on this device and helps you upload or restore backup archives manually.
- Use the header notification center when Sona surfaces update actions, `Recovery Center`, or automation results.

## If you mainly came for an extension capability

- Need a transcript-side recap: [AI Summary](guide:ai-summary)
- Need floating captions or dictation in another app: [Live Caption and Voice Typing](guide:live-caption-and-voice-typing)
- Need watched-folder processing or export automation: start from `Settings > Automation` on this page
- Need `Hotwords`, `Text Replacement`, `Auto-Polish`, or custom context tuning: [Vocabulary and Advanced Settings](guide:vocabulary-and-advanced-settings)

## Useful notes

- This page is intentionally not a full settings manual. It is here to point you at the right next page.
- If you are troubleshooting rather than exporting, go straight to [FAQ and Troubleshooting](guide:faq).
