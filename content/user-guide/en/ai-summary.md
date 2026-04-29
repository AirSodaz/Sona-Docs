`AI Summary` is for the point where a transcript already exists and you want a shorter recap beside it. It does not rewrite the transcript, and it does not automatically become part of export output.

## Best for

- Quickly reviewing the main points of a meeting, lecture, or interview
- Keeping the original transcript unchanged while adding a separate summary
- Staying inside the same editor instead of moving to another summarization tool

## Before you start

- You already have transcript segments from [Live Record](guide:live-record), [Batch Import](guide:batch-import), or [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox).
- You are ready to configure `Summary Model` in `Settings > LLM Service`.

## Assign the summary model first

1. Open `Settings > LLM Service`.
2. In `Feature Models`, assign a model to `Summary Model`.
3. In `Provider Credentials`, open the provider you want to use and fill in the required connection details.
4. Click `Test Connection`.
5. Return to the main workspace after `Summary Model` is available.

## Generate or update the current summary

1. Open any transcript that already has segments.
2. Open the summary editor from the transcript surface.
3. Switch between the `General`, `Meeting`, or `Lecture` templates if you want the next generation to use a different summary prompt.
4. Click `Generate` to create the current summary. Use `Regenerate` later if you want to replace that same summary.
5. Edit the summary directly whenever you want to adjust wording. Sona auto-saves when focus leaves the editor.
6. Click `Copy` if you want to reuse the summary elsewhere.

## What state the summary keeps

- `AI Summary` keeps one current summary record beside the transcript without changing the original text.
- The current summary stays separate from the transcript, but you can still edit it directly when you want to adjust wording before reuse.
- If the transcript is edited, polished, or re-transcribed later, the old summary stays visible but shows an outdated warning until you regenerate it manually.

## Useful notes

- `Summary Model` is configured separately from `Polish Model` and `Translation Model`. One provider can serve all of them, or you can split them.
- `AI Summary` needs an LLM-capable provider and model. The Google Translate providers are not supported for summaries.
- If `AI Summary` is not fully configured yet, you can still write or revise the summary manually.
- Changing templates changes the next generation target or project default. It does not create a separate saved summary for every template.
- If you mainly want to rewrite transcript text rather than create a summary beside it, continue to [AI Polish and Translate](guide:ai-polish-and-translate).
- If your next step is export, go back to [Export and Settings](guide:export-and-settings).
- Summary output does not become part of exported files. Copy it from the panel if you want to reuse it elsewhere.
