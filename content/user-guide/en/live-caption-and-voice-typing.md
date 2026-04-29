`Live Caption` and `Voice Typing` both rely on the same offline live transcription setup, but they serve different surfaces: one shows floating captions, while the other sends text into another app.

## Best for

- Showing system audio as a floating subtitle window
- Dictating directly into chat apps, documents, or forms
- Users who already understand the main recording workflow and only need one side capability

## Before you start

- Finish [Getting Started](guide:getting-started), or configure a working `Live Record Model` in `Settings > Model Settings`.
- If you want to send text into another app, the feature still depends on the same offline live transcription stack.

## Where `Live Caption` starts

1. Open [Live Record](guide:live-record).
2. Find the `Live Caption` or `System Audio Captions` toggle on that page.
3. If you only want floating subtitles for system audio, you do not need to start recording first. Turning it on is enough.
4. If you later start `Live Record`, both can run in parallel.

## What `Settings > Subtitle Settings` controls

- It controls the floating caption window behavior: startup behavior, always-on-top, click-through, font size, width, color, and background transparency.
- It does not provide the start toggle. The real entry point stays on the [Live Record](guide:live-record) page.
- If `Live Caption` is already on but the window still does not appear, continue to [FAQ and Troubleshooting](guide:faq).

## How `Voice Typing` starts

1. Open `Settings > Voice Typing`.
2. Turn on `Voice Typing`.
3. Assign a global shortcut on that page.
4. Choose either `Push to Talk (Hold)` or `Toggle (Press once)`.
5. If it still is not ready, review the readiness and dependency status shown there.

## `Push to Talk` versus `Toggle`

- `Push to Talk (Hold)` works better for short bursts because capture only runs while you hold the shortcut.
- `Toggle (Press once)` works better for longer dictation because one press starts and the next press stops.
- In both modes, `Voice Typing` still depends on a working `Live Record Model`, any required `VAD` model, an available input device, and background warm-up.
- If `Voice Typing` is not ready yet, the same settings page tells you whether the blocker is the shortcut, model, VAD, input device, or runtime warm-up.

## When to choose which one

- If your goal is to see system audio as floating text instead of sending it somewhere else, start with `Live Caption`.
- If your goal is to put spoken text into another app's input field, start with `Voice Typing`.
- If one of the features is enabled but does not behave the way you expect, go straight to [FAQ and Troubleshooting](guide:faq).
