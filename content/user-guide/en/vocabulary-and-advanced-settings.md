This page keeps a few tuning-oriented capabilities in one place: `Hotwords`, `Text Replacement`, `Speaker Profiles`, and the `Advanced Settings` under `LLM Polish`. They are not first-run requirements, but they become useful when you want more control over recognition, speaker matching, or cleanup behavior.

## Best for

- Terms, names, or product words that are repeatedly transcribed the wrong way
- Workflows where you want consistent wording after transcription
- Known speakers you want Sona to suggest or match in future transcripts
- Users who want to tune `Auto-Polish` or custom polish context beyond the default flow

## Open the right settings area first

- `Settings > Vocabulary`: manage `Hotwords`, `Text Replacement`, and `Speaker Profiles`
- `LLM Polish > Advanced Settings`: manage `Auto-Polish`, frequency, keywords, scenario presets, and custom context
- If you still need the basic polish and translation flow first, return to [AI Polish and Translate](guide:ai-polish-and-translate)

## What `Hotwords` are good for

- Add repeated terms to `Hotwords` when recognition keeps drifting on the same names or phrases.
- `Hotwords` are entered one per line, and weighted entries such as `Term :2.0` are supported.
- Right now this capability is especially relevant for Transducer and Qwen3 ASR models.

## What `Text Replacement` is good for

- Use `Text Replacement` when the same term keeps appearing in inconsistent forms after transcription.
- It works best for repeated cleanup patterns, not as a replacement for reviewing segments one by one.
- If your focus has shifted to editing transcript segments directly, continue to [Edit and Playback](guide:edit-and-playback).

## What `Speaker Profiles` are good for

- Create a profile for a known speaker, then import one or more local reference audio samples for that person.
- Sona normalizes imported samples into app-managed audio and uses the profile for candidate suggestions or automatic matching when speaker models are configured.
- A profile can show as ready for automatic matching, limited to suggestions, or not ready yet depending on usable sample count and duration.
- Projects can choose which speaker profiles are active, so a client, course, or meeting series can keep its own speaker set.
- Speaker profiles are not a promise of perfect automatic attribution. You can still confirm suggestions, assign another profile, or reset a group to anonymous from [Edit and Playback](guide:edit-and-playback).

## When to open `Advanced Settings`

- When you need more than a one-off `LLM Polish` action and want to manage `Auto-Polish`.
- When you want to tune `Auto-Polish Frequency`, keywords, scenario presets, or custom context.
- When provider and model setup is already done, but you want polish behavior to match a more specific use case.

## Useful notes

- `Advanced Settings` still belongs to the [AI Polish and Translate](guide:ai-polish-and-translate) workflow. It does not replace the base provider and model setup.
- Speaker profile readiness affects candidate quality and automatic matching confidence, not whether you can manually assign a profile.
- If you mainly want a transcript-side recap rather than polish behavior, switch to [AI Summary](guide:ai-summary).
- If a feature is already configured but still behaves incorrectly, continue to [FAQ and Troubleshooting](guide:faq).
