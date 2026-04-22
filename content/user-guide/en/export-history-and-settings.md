This page covers the final stage of the workflow: exporting finished transcripts, reopening earlier work, and knowing which settings areas matter most in everyday use.

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

## Reopen earlier sessions from `History`

1. Open the `History` tab.
2. Search by title or transcript content.
3. Filter by type with `All Types`, `Recordings`, or `Batch Imports`.
4. Filter by time with `Any Time`, `Today`, `Last 7 Days`, or `Last 30 Days`.
5. Click an item to load it.
6. Use selection mode if you want to delete multiple items.

## Settings areas worth learning first

- `Settings > General`: theme, app language, font, tray behavior, update checks
- `Settings > Input Device`: microphone selection, system audio selection, microphone boost, mute during recording
- `Settings > Subtitle Settings`: live caption startup, click-through lock, always-on-top, font size, width, color, background transparency
- `Settings > Model Hub`: `Live Record Model`, `Batch Import Model`, and downloadable recognition, punctuation, and VAD models
- `Settings > Local Setup`: `Transcription Settings`, `ITN`, `VAD Buffer Size`, `Max Concurrent Transcriptions`, and `Restore Default Settings`
- `Settings > Vocabulary`: `Text Replacement` rule sets and `Hotwords` rule sets
- `Settings > LLM Service`: feature model bindings and provider credentials
- `Settings > Shortcuts`: live recording shortcuts plus `Voice Typing`
- `Settings > About`: source code, logs, and update-related actions

## `Voice Typing`

- `Voice Typing` is useful when you want to dictate directly into chat apps, documents, forms, or other applications.
- Open `Settings > Shortcuts`, turn on `Voice Typing`, choose a global shortcut, and pick either `Push to Talk (Hold)` or `Toggle (Press once)`.
- `Push to Talk (Hold)` works better for short bursts. `Toggle (Press once)` works better for longer dictation sessions.
- `Voice Typing` depends on the same offline live transcription setup, so you also need a working `Live Record Model`.
- If it still does not work after setup, go straight to [FAQ and Troubleshooting](guide:faq).

## Useful notes

- In `Settings > Vocabulary`, `Hotwords` are entered one per line. Weighted entries such as `Term :2.0` are supported, and hotwords are currently most relevant for Transducer and Qwen3 ASR models.
- In `Settings > Vocabulary`, `Text Replacement` can fix repeated terminology or spelling after transcription.
- If you are troubleshooting rather than exporting, go straight to [FAQ and Troubleshooting](guide:faq).
