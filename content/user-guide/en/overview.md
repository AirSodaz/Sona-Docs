Sona is a privacy-first transcript editor for people who want speech-to-text workflows to stay on their own machine by default. This guide is organized around the actual product flow, so you can jump straight to the part that matches what you need right now.

## Choose the page that matches your task

- New install or first launch: [Getting Started](guide:getting-started)
- Recording live speech right now: [Live Record](guide:live-record)
- Working from existing audio or video files: [Batch Import](guide:batch-import)
- Reviewing wording, timestamps, and playback: [Edit and Playback](guide:edit-and-playback)
- Adding optional LLM-powered cleanup or bilingual output: [AI Polish and Translate](guide:ai-polish-and-translate)
- Exporting finished work, reopening earlier sessions, or checking key settings: [Export, History, and Settings](guide:export-history-and-settings)
- Need a read-only recap instead of rewriting the transcript: [AI Summary](guide:ai-summary)
- Mainly want floating captions or dictation in another app: [Live Caption and Voice Typing](guide:live-caption-and-voice-typing)
- Mainly want hotwords, text replacement, or `Auto-Polish` tuning: [Vocabulary and Advanced Settings](guide:vocabulary-and-advanced-settings)
- Mainly want offline batch transcription from the terminal: [CLI Guide](guide:cli-guide)
- Solving a blocker: [FAQ and Troubleshooting](guide:faq)

## The Sona workflow in one line

1. Finish [Getting Started](guide:getting-started) so the offline model setup is ready.
2. Create a transcript with [Live Record](guide:live-record) or [Batch Import](guide:batch-import).
3. Refine the transcript in [Edit and Playback](guide:edit-and-playback).
4. Use [AI Polish and Translate](guide:ai-polish-and-translate) only if you want LLM-assisted cleanup or translation.
5. Finish in [Export, History, and Settings](guide:export-history-and-settings).

`AI Summary`, `Live Caption`, `Voice Typing`, and vocabulary tuning are side capabilities around the main workflow. Most of the time, it is easiest to get the core transcript flow working first and then open the specific extension page you need.

## What this guide covers well

- The recommended first-run path for local transcription
- The difference between live recording and queued file transcription
- How the editor, playback, translation, and export steps fit together
- Which settings and extension entry points matter most without turning the docs into a full settings reference

## Other docs you might need

- Command-line batch transcription: [CLI Guide](guide:cli-guide)
- Source builds and development commands: [project README](readme)

> The normal Sona path is simple: set up local transcription, create a transcript, review it in the editor, and only then add polish, translation, or export when needed.
