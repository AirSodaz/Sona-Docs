If you are opening Sona for the first time, this is the shortest route to a usable local transcription setup.

## Best for

- First-time desktop installs
- Users who want the recommended offline setup instead of manual model selection
- Anyone who wants to reach `Live Record` as quickly as possible

## Before you begin

- Sona can open normally on your machine.
- If you want the app to download the recommended model pack during onboarding, keep an internet connection available.

## Install the desktop app

1. Open [Sona Downloads](/downloads) and choose the build for your desktop system. If the site cannot load release details, use [GitHub Releases](https://github.com/AirSodaz/sona/releases/latest) as the fallback.
2. Launch the app.
3. If you are building from source instead, use the [project README](readme).

If Windows SmartScreen, macOS Gatekeeper, or Linux executable-permission prompts appear, first confirm that the installer came from Sona Downloads or GitHub Releases, then follow the operating-system prompt. Do not turn off system protection globally.

## Complete `First Run Setup`

1. Wait for `First Run Setup` to appear when Sona launches.
2. Review the welcome step. Sona's recommended first success path is `Microphone -> Live Record`.
3. Click `Continue`.
4. On the models step, click `Download Recommended Models`. If the required models are already present, Sona can show `Continue` instead.
5. Wait for the recommended offline models to finish downloading and extracting.
6. Continue to the microphone step and allow microphone access.
7. If microphone permission was denied, use `Try Permission Again` after fixing the OS permission prompt.
8. Choose the microphone you want Sona to use for `Live Record`.
9. Click `Start with Live Record`.

## What happens next

- Sona applies the recommended offline setup for local transcription.
- The app opens on `Live Record`.
- If setup is still incomplete, the reminder banner can reopen onboarding later.

## Good follow-ups after setup

- Go straight to [Live Record](guide:live-record) if you want to capture speech immediately.
- Go to [Batch Import](guide:batch-import) if you already have files waiting to be transcribed.
- Use [FAQ and Troubleshooting](guide:faq) if setup keeps reopening or a model still appears missing.

## Helpful notes

- You can click `Later` during onboarding and return from the reminder banner.
- If you hide the reminder banner, it stops appearing on the home screen until setup is complete.
- You can change models later in `Settings > Model Settings`.
- You can change the default microphone later in `Settings > Input Device`.
- If model download stalls, check that your internet connection is available and the model host can be reached, then retry onboarding. If it still fails, use `Settings > Model Settings` to download or select models, then open `Settings > General > Diagnostics` for details.
- If you want command-line batch transcription later, continue to the in-site [CLI Guide](guide:cli-guide).
