Sona's polish and translation features are optional. Local transcription works without them, but the AI steps need a configured provider in `Settings > LLM Service`.

## Best for

- Cleaning up transcript wording after the local transcription pass
- Producing translated segments while keeping the source transcript visible
- Teams that want polishing and translation to happen inside the same editor flow

## Before you start

- You already have transcript segments from [Live Record](guide:live-record), [Batch Import](guide:batch-import), or `History`.
- You are ready to configure the feature you need in `Settings > LLM Service`.

## Connect the provider first

1. Open `Settings > LLM Service`.
2. In `Feature Models`, choose the model for `Polish Model` and the model for `Translation Model`.
3. In `Provider Credentials`, open the provider you want to use and fill in the required connection details such as `Base URL`, `API Key`, `Endpoint`, `Deployment Name`, or provider-specific fields.
4. Click `Test Connection`.
5. Return to the main workspace after the required feature model is assigned.

## Run polish when you want a cleaner draft

1. Make sure `Polish Model` is assigned in `Settings > LLM Service`.
2. In the app, open the `LLM Polish` action.
3. Choose what you need: `LLM Polish`, `Re-transcribe`, `Undo`, `Redo`, or `Advanced Settings`.
4. Open `Advanced Settings` if you want to manage `Auto-Polish`, `Auto-Polish Frequency`, `Keywords`, `Scenario Presets`, or `Custom Context`.

## Run translation when you need bilingual output

1. Make sure `Translation Model` is assigned in `Settings > LLM Service`.
2. Click the `Translate` button.
3. Choose the target language.
4. Click `Start Translation` or `Retranslate`.
5. Use `Show Translations` or `Hide Translations` to control bilingual display in the editor.

## What the AI steps change

- `LLM Polish` updates transcript text in place.
- `Translate` stores translation text per segment and can display it under the original text.

## Useful notes

- `Polish Model` and `Translation Model` are configured separately. One provider can serve both, or you can split them.
- Translation can use dedicated translation providers such as `Google Translate (Free)` or `Google Translate (API)`, but polish needs an LLM-capable provider and model.
- Translation target languages currently include `Chinese (Simplified)`, `English`, `Japanese`, `Korean`, `French`, `German`, and `Spanish`.
- `Re-transcribe` is only available when the current transcript came from a saved history item.
- Once the text looks right, move to [Export, History, and Settings](guide:export-history-and-settings).
