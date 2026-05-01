Sona is a privacy-first transcript editor for people who want speech-to-text workflows to stay on their own machine by default. This guide is organized around the actual product flow, so you can jump straight to the part that matches what you need right now.

## Choose the page that matches your task

- New install or first launch: [Getting Started](guide:getting-started)
- Recording live speech right now: [Live Record](guide:live-record)
- Working from existing audio or video files: [Batch Import](guide:batch-import)
- Reviewing wording, timestamps, speaker labels, playback, or version snapshots: [Edit and Playback](guide:edit-and-playback)
- Adding optional LLM-powered cleanup or bilingual output: [AI Polish and Translate](guide:ai-polish-and-translate)
- Organizing saved recordings, projects, or `Inbox` items: [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox)
- Exporting finished work, checking `Dashboard`, or finding `Diagnostics`, `Backup & Restore`, and notification entry points: [Export and Settings](guide:export-and-settings)
- Need a transcript-side recap without rewriting the main transcript: [AI Summary](guide:ai-summary)
- Mainly want floating captions or dictation in another app: [Live Caption and Voice Typing](guide:live-caption-and-voice-typing)
- Mainly want hotwords, text replacement, speaker profiles, or `Auto-Polish` tuning: [Vocabulary and Advanced Settings](guide:vocabulary-and-advanced-settings)
- Mainly want offline batch transcription from the terminal: [CLI Guide](guide:cli-guide)
- Solving a blocker: [FAQ and Troubleshooting](guide:faq)

## The Sona workflow in one line

1. Finish [Getting Started](guide:getting-started) so the offline model setup is ready.
2. Create a transcript with [Live Record](guide:live-record) or [Batch Import](guide:batch-import).
3. Refine the transcript in [Edit and Playback](guide:edit-and-playback), including speaker review or version rollback when needed.
4. Use [AI Polish and Translate](guide:ai-polish-and-translate) only if you want LLM-assisted cleanup or translation.
5. Use [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox) when you want to reopen saved work, switch project context, or organize items beyond the current editor view.
6. Finish in [Export and Settings](guide:export-and-settings), and use the header notification center whenever Sona surfaces recovery, update, or automation results.

`AI Summary`, `Live Caption`, `Voice Typing`, speaker profiles, and vocabulary tuning are side capabilities around the main workflow. Most of the time, it is easiest to get the core transcript flow working first and then open the specific extension page you need.

## What this guide covers well

- The recommended first-run path for local transcription
- The difference between live recording and queued file transcription
- How the editor, workspace organization, translation, and export steps fit together
- Where speaker review, speaker profiles, and version snapshots fit into editing and handoff
- Which support surfaces matter most in everyday use, including `Dashboard`, `Diagnostics`, `Backup & Restore`, `Automation`, and the notification center

## Other docs you might need

- Command-line batch transcription: [CLI Guide](guide:cli-guide)
- Source builds and development commands: [project README](readme)

> The normal Sona path is simple: set up local transcription, create or reopen a transcript, review it in the editor, and then use workspace organization, polish, translation, summary, or export when needed.
