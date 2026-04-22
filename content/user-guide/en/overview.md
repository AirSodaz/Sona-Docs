Sona is a privacy-first transcript editor for people who want speech-to-text workflows to stay on their own machine by default. This guide is organized around the actual product flow, so you can jump straight to the part that matches what you need right now.

## Choose the page that matches your task

- New install or first launch: [Getting Started](guide:getting-started)
- Recording live speech right now: [Live Record](guide:live-record)
- Working from existing audio or video files: [Batch Import](guide:batch-import)
- Reviewing wording, timestamps, and playback: [Edit and Playback](guide:edit-and-playback)
- Adding optional LLM-powered cleanup or bilingual output: [AI Polish and Translate](guide:ai-polish-and-translate)
- Exporting finished work, reopening earlier sessions, or checking key settings: [Export, History, and Settings](guide:export-history-and-settings)
- Mainly want a floating subtitle window: start with `Live Caption` in [Live Record](guide:live-record)
- Mainly want to dictate into another app: check `Voice Typing` in [Export, History, and Settings](guide:export-history-and-settings)
- Solving a blocker: [FAQ and Troubleshooting](guide:faq)

## The Sona workflow in one line

1. Finish [Getting Started](guide:getting-started) so the offline model setup is ready.
2. Create a transcript with [Live Record](guide:live-record) or [Batch Import](guide:batch-import).
3. Refine the transcript in [Edit and Playback](guide:edit-and-playback).
4. Use [AI Polish and Translate](guide:ai-polish-and-translate) only if you want LLM-assisted cleanup or translation.
5. Finish in [Export, History, and Settings](guide:export-history-and-settings).

`Live Caption` is a side capability inside `Live Record`, while `Voice Typing` lives under `Settings > Shortcuts`. Both depend on the same offline live transcription setup.

## What this guide covers well

- The recommended first-run path for local transcription
- The difference between live recording and queued file transcription
- How the editor, playback, translation, and export steps fit together
- Which settings matter most without turning the docs into a full settings reference

## What lives outside this guide

- Command-line batch transcription: [CLI guide](cli)
- Source builds and development commands: [project README](readme)

> The normal Sona path is simple: set up local transcription, create a transcript, review it in the editor, and only then add polish, translation, or export when needed.
