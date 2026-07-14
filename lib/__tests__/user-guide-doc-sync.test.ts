import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'] as const;

function readGuide(locale: (typeof locales)[number], page: string) {
  return readFileSync(
    resolve(process.cwd(), 'content', 'user-guide', locale, `${page}.md`),
    'utf8',
  );
}

describe('synced Sona command and context-menu guides', () => {
  it.each(locales)('documents the current standalone CLI in %s', (locale) => {
    const cli = readGuide(locale, 'cli-guide');

    expect(cli).toContain('### `history`');
    expect(cli).toContain('### `backup`');
    expect(cli).toContain('### `transcribe-live`');
    expect(cli).toContain('sona-cli backup import');
    expect(cli).toContain('--confirm-replace');
    expect(cli).toContain('--input stdin');
    expect(cli).toContain('--output-format ndjson');
    expect(cli).toContain('[transcribe_live]');
    expect(cli).not.toMatch(/\bsona (?:serve|transcribe|models|init-config)\b/u);
    expect(cli).not.toContain('src-tauri/Cargo.toml');
    expect(cli).not.toContain('Sona.exe transcribe');
    expect(cli).not.toContain('Contents/MacOS/Sona transcribe');
  });

  it.each(locales)('uses sona-cli for the API server in %s', (locale) => {
    const api = readGuide(locale, 'api-guide');

    expect(api).toContain('sona-cli serve');
    expect(api).not.toMatch(/\bsona serve\b/u);
  });

  it.each(locales)('documents keyboard-accessible context menus in %s', (locale) => {
    expect(readGuide(locale, 'edit-and-playback')).toContain('Shift + F10');
    expect(readGuide(locale, 'workspace-projects-and-inbox')).toContain(
      'Shift + F10',
    );
  });
});
