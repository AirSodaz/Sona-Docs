After Sona creates transcript segments, the editor becomes the main place to review, correct, navigate, check speaker attribution, and recover from larger rewrites.

## Best for

- Checking wording segment by segment
- Jumping between transcript text and the original timing
- Correcting speaker labels before a transcript leaves Sona
- Comparing `Version Snapshots` after polish, translation, or re-transcription changes
- Searching, merging, deleting, or lightly formatting transcript content before export

## Before you edit

- Load transcript content from [Live Record](guide:live-record), [Batch Import](guide:batch-import), or [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox).

## Review and change transcript segments

1. Read through the segment list in the editor.
2. Click a timestamp to seek playback to that moment.
3. Double-click segment text, or use the edit action, to enter editing mode.
4. Press `Enter` to save the current segment.
5. Press `Shift + Enter` if you want a line break while editing.
6. Use the merge action to combine a segment with the next one.
7. Use the delete action to remove a segment after confirmation.

## Review speaker labels

1. If a segment has a speaker badge, click the badge to assign the whole speaker group to a `Speaker Profile`.
2. Use the same menu to reveal additional global profiles or restore that group to its anonymous label.
3. Open `Speaker Review` from the transcript header before export when you want a concentrated speaker pass.
4. Filter by `Needs review`, `Suggestions`, `Anonymous`, `Identified`, `Reviewed`, or `All`.
5. Preview the first segments in each group, jump to the first matching segment, confirm the current label, apply a suggested candidate, assign another profile, or reset the group to anonymous.

## Use version snapshots

1. Open `Version Snapshots` from the transcript header when the transcript is a saved non-draft workspace item.
2. Choose a snapshot saved before a bulk rewrite such as `LLM Polish`, `Translate`, or `Re-transcribe`.
3. Compare the snapshot with the current transcript.
4. Restore selected changed rows when only part of the rewrite needs to be rolled back.
5. Revert the whole transcript when the entire rewrite should be discarded.

## Search and playback

1. Press `Ctrl + F` to search inside the transcript.
2. Use the audio player to play, pause, seek, change speed, or control volume when an audio file is available.
3. Jump between matching segments without leaving the editor.

## What stays true in the editor

- The transcript remains editable at the segment level.
- Speaker corrections apply across the whole speaker group, not only one visible segment.
- Playback and transcript navigation stay aligned through timestamps.
- Restoring from `Version Snapshots` saves the current transcript first, so rollback remains reversible.
- The editor toolbar only appears while a segment is actively being edited.

## Useful tips

- The toolbar supports `Undo`, `Redo`, `Bold`, `Italic`, `Underline`, and line breaks.
- `Speaker Profiles` are created in [Vocabulary and Advanced Settings](guide:vocabulary-and-advanced-settings). Profiles help with suggestions and automatic matching, but manual confirmation is still available.
- `Version Snapshots` only appears for saved workspace items that are not drafts or the temporary `current` transcript.
- If you want to add optional LLM cleanup or translation after editing, continue to [AI Polish and Translate](guide:ai-polish-and-translate).
- If you want to reopen or reorganize saved items around the editor, continue to [Workspace, Projects, and Inbox](guide:workspace-projects-and-inbox).
- If you are done and mainly need files out of Sona, skip ahead to [Export and Settings](guide:export-and-settings).
