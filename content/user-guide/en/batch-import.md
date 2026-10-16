Use `Batch Import` when you already have audio or video files and want Sona to process them in the background.

## Best for

- Recorded meetings, lectures, podcasts, or interviews
- Subtitle preparation from local media files
- Workflows where multiple files need to queue and finish one after another

## Before you queue files

- Configure a `Batch Import Model` in `Settings > Model Settings`.
- Confirm your files use a supported audio or video format.

## Add files to the queue

1. Open the `Batch Import` tab.
2. Drop files into the import area, or click `Select File`.
3. Add one or more files to the queue.
4. Watch the queue sidebar and the active item status view.
5. Use `Add More Files` when you want to keep extending the queue.

## Adjust import behavior

1. Click `Parameter Settings` if you want to change `Subtitle Mode` or `Language` for new work.
2. Monitor batch progress through the **Summary Dashboard** (total tasks, total duration, processing, completed, and failed status) and grouped list views.
3. Use the **Clear Menu** to clear completed, failed, or all items from the queue.
4. **Real-time Cancellation**: In-flight transcription items can be cancelled in real time directly from the queue or the header `Message Center` with a safe confirmation dialog.

## What happens after a file finishes

- Completed items load into the main transcript editor.
- From there, you can continue with [Edit and Playback](guide:edit-and-playback), [AI Polish and Translate](guide:ai-polish-and-translate), [Projects and Inbox](guide:workspace-projects-and-inbox), or [Export and Settings](guide:export-and-settings).

## Useful tips

- If no offline batch model is configured, Sona reopens onboarding instead of starting import. Models like Qwen3-ASR (via llama.cpp) or Whisper presets provide high-performance offline batch transcription.
- `Settings > Model Settings` includes `Batch VAD Segmentation` (powered by Silero VAD v5), `VAD Buffer Size`, and `Max Concurrent Transcriptions`, which affect batch behavior. Turning off batch VAD makes local batch transcription recognize the whole file at once.
- Sona features a built-in pure-Rust audio decoding engine that natively handles WAV, MP3, FLAC, OGG, AAC, and M4A without requiring system FFmpeg installations. If you encounter unusual legacy containers or proprietary codecs, specify a custom FFmpeg fallback path in `Settings > Storage Management`.
- `Batch Import` plus export is the main path when you want subtitle files from existing media.
