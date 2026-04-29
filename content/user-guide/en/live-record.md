Use `Live Record` when you want transcript segments to appear while you are still capturing audio.

## Best for

- Meetings, interviews, lectures, or voice notes
- Workflows where timestamps need to stay attached during capture
- Users who want to keep everything in the main Sona workspace, including visible live drafts, after recording stops

## Before you start

- Finish [Getting Started](guide:getting-started), or manually configure a `Live Record Model` in `Settings > Model Settings`.
- Make sure your operating system has granted microphone permission if you want to record from a microphone.

## Record a live session

1. Open the `Live Record` tab.
2. Before recording starts, choose the input source from the dropdown: `Microphone` or `Desktop Audio`.
3. Click `Start Recording`.
4. Watch the waveform and timer while Sona captures audio.
5. Use `Pause` if you want to temporarily stop without ending the session.
6. Use `Stop` when you want to finalize the recording.

## Adjust what happens during recording

1. Click `Parameter Settings` if you want to change `Subtitle Mode` or `Language`.
2. Turn on `Live Caption` if you want the floating caption window during live use.
3. Open `Settings > Subtitle Settings` if you want to change caption behavior such as always-on-top, click-through, size, width, color, or startup behavior.
4. If you mainly came here for the full `Live Caption` behavior instead of the recording flow, continue to [Live Caption and Voice Typing](guide:live-caption-and-voice-typing).

## What `Live Caption` is for

- `Live Caption` is the `System Audio Captions` toggle on the `Live Record` page, and it is useful when you mainly want a floating subtitle window for system audio.
- You can turn it on without starting a recording first. If you later start `Live Record`, both can run in parallel.
- `Settings > Subtitle Settings` controls startup behavior, always-on-top, click-through, font size, width, color, and background transparency.
- If you mainly want the split between the page entry point and the settings layer, or you also need `Voice Typing`, go straight to [Live Caption and Voice Typing](guide:live-caption-and-voice-typing).
- If `Live Caption` is turned on but the window still does not appear, check [FAQ and Troubleshooting](guide:faq).

## What you get during and after recording

- Transcript segments appear in the editor on the right.
- The active segment follows the live recording state while capture is running.
- While capture is still running, Sona can already surface the session as a `Draft` item in [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox).
- Once recording stops, the transcript remains available for editing, polishing, translation, export, and later reopening from [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox), and Sona completes that same draft item instead of creating a second saved copy.
- If you were not already inside a project, the saved item usually lands in `Inbox`.

## Useful tips

- `Ctrl + Space` starts or stops live recording by default.
- `Space` pauses or resumes while recording is active.
- `Parameter Settings` only covers transcription behavior like `Subtitle Mode` and `Language`; it is not the full LLM polish workflow.
- If Sona says a model is missing, reopen onboarding or configure the model in `Settings > Model Settings`.
- After capture, the next practical page is usually [Edit and Playback](guide:edit-and-playback).
