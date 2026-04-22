`AI Summary` is for the point where a transcript already exists and you want a shorter read-only recap beside it. It does not rewrite the transcript, and it does not automatically become part of export output.

## Best for

- Quickly reviewing the main points of a meeting, lecture, or interview
- Keeping the original transcript unchanged while adding a separate summary
- Staying inside the same editor instead of moving to another summarization tool

## Before you start

- You already have transcript segments from [Live Record](guide:live-record), [Batch Import](guide:batch-import), or `History`.
- You are ready to configure `Summary Model` in `Settings > LLM Service`.

## Assign the summary model first

1. Open `Settings > LLM Service`.
2. In `Feature Models`, assign a model to `Summary Model`.
3. In `Provider Credentials`, open the provider you want to use and fill in the required connection details.
4. Click `Test Connection`.
5. Return to the main workspace after `Summary Model` is available.

## Generate or refresh a summary

1. Open any transcript that already has segments.
2. Find the summary panel at the top of the editor.
3. Switch between the `General`, `Meeting`, or `Lecture` templates.
4. Click `Generate` to create a summary for the current template. Use `Regenerate` later if you want to refresh that same template.
5. Click `Copy` if you want to reuse the summary elsewhere.

## What state the summary keeps

- `AI Summary` stores the summary beside the transcript without changing the original text.
- The current summary stays read-only, which makes it suitable for review and copy, not direct editing.
- If the transcript is edited, polished, or re-transcribed later, the old summary stays visible but shows an outdated warning until you regenerate it manually.

## Useful notes

- `Summary Model` is configured separately from `Polish Model` and `Translation Model`. One provider can serve all of them, or you can split them.
- `AI Summary` needs an LLM-capable provider and model. The Google Translate providers are not supported for summaries.
- If you mainly want to rewrite transcript text rather than create a read-only recap, continue to [AI Polish and Translate](guide:ai-polish-and-translate).
- If your next step is export, go back to [Export, History, and Settings](guide:export-history-and-settings).
- Summary output does not become part of exported files. Copy it from the panel if you want to reuse it elsewhere.
