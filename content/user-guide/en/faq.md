Use this page when the main workflow is clear but one part is still blocking you.

## Sona keeps asking me to finish setup

- Open the onboarding banner and complete the model and microphone steps.
- If you skipped setup earlier, make sure both `Live Record Model` and `Batch Import Model` are configured in `Settings > Model Hub`.
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

## Export only shows `Original`

- `Translation` and `Bilingual` only appear when the transcript already contains translation text.

## `Live Caption` does not appear

- Go back to [Live Record](guide:live-record) and make sure `Live Caption` is turned on there. `Settings > Subtitle Settings` only controls the window behavior and appearance.
- If you only want floating system-audio subtitles, you do not need to start recording first. Turning on `Live Caption` is enough.
- `Live Caption` depends on the same offline live transcription setup, so make sure a `Live Record Model` is configured.

## Voice Typing does not work

- Turn on `Voice Typing` in `Settings > Shortcuts`.
- Confirm that the voice typing shortcut is set the way you expect.
- Make sure a live transcription model is configured, because Voice Typing depends on the same offline transcription setup.

## Playback controls are missing

- The audio player only appears when the current transcript has an audio source available, such as a saved recording or processed file.

## I want to build or develop Sona

- Use the [project README](readme) for source builds and development commands.
