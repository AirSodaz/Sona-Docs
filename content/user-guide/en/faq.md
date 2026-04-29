Use this page when the main workflow is clear but one part is still blocking you.

## Sona keeps asking me to finish setup

- Open the onboarding banner and complete the model and microphone steps.
- If you skipped setup earlier, make sure both `Live Record Model` and `Batch Import Model` are configured in `Settings > Model Settings`.
- If you hid the reminder banner, reopen setup manually from the banner flow or settings-related entry points when Sona prompts again.

## `Live Record` does not start

- Check microphone permission in your operating system.
- Confirm that a `Live Record Model` is configured.
- Make sure the input source is correct: `Microphone` or `Desktop Audio`.

## `Batch Import` does not start

- Make sure a `Batch Import Model` is configured.
- Confirm that the file extension is supported.
- If Sona reports an unsupported format, convert the file first and try again.

## `LLM Polish` or `Translate` is disabled or fails

- Confirm that `Settings > LLM Service` has the correct provider credentials.
- Make sure the feature itself has a model assigned: `Polish Model` for polishing, `Translation Model` for translation.
- Use `Test Connection` before retrying.
- If you use a custom endpoint or local service such as `Ollama`, verify that service first.

## I cannot find `Auto-Polish`

- Open `LLM Polish > Advanced Settings` for `Auto-Polish`, frequency, keywords, scenario presets, and custom context.
- If you want the map of where those controls fit, continue to [Vocabulary and Advanced Settings](guide:vocabulary-and-advanced-settings).

## Export only shows `Original`

- `Translation` and `Bilingual` only appear when the transcript already contains translation text.

## Why do new items appear in `Inbox` first

- `Inbox` is the default holding area for recordings and imports that are not assigned to a project yet.
- Open a specific project before starting `Live Record` or `Batch Import` if you want new items to stay in that project automatically.
- You can also move saved items later from `Inbox` into a project from [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox).

## What happens when I delete a project

- Deleting a project removes the project itself, but it does not delete the recordings or imports that were inside it.
- Sona moves those items back to `Inbox`, so you can reassign or continue using them later.

## Why do I see a `Draft` item while I am still recording

- During an active live recording, Sona can create a visible `Draft` item so the session already has a saved place in `Workspace`.
- When you stop recording, Sona completes that same item instead of creating a second saved copy.
- Treat the draft as the live session while capture is still running; the finished transcript stays on the same entry.

## `Live Caption` does not appear

- Go back to [Live Record](guide:live-record) and make sure `Live Caption` is turned on there. `Settings > Subtitle Settings` only controls the window behavior and appearance.
- If you only want floating system-audio subtitles, you do not need to start recording first. Turning on `Live Caption` is enough.
- `Live Caption` depends on the same offline live transcription setup, so make sure a `Live Record Model` is configured.
- If you want the split between the page toggle and the settings layer explained first, continue to [Live Caption and Voice Typing](guide:live-caption-and-voice-typing).

## Voice Typing does not work

- Turn on `Voice Typing` in `Settings > Voice Typing`.
- Confirm that the page shows the shortcut, model, VAD, input device, and readiness state you expect.
- Make sure a live transcription model is configured, because Voice Typing depends on the same offline transcription setup.
- If you still need the setup path or the mode choice explained, continue to [Live Caption and Voice Typing](guide:live-caption-and-voice-typing).

## Where do I recover interrupted batch or automation work

- Open the header notification center if Sona reports pending recovery items.
- Use `Recovery Center` to resume or discard interrupted batch and automation work.
- If you were looking for diagnostics or backup instead, go to `Settings > General`.

## Playback controls are missing

- The audio player only appears when the current transcript has an audio source available, such as a saved recording or processed file.

## I want to build or develop Sona

- Use the [project README](readme) for source builds and development commands.
