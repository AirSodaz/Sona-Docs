import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getUserGuidePageById } from '../user-guide-content';

const locales = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'] as const;
const cliSummaryMarkers = {
  en: ['stateless', 'diagnostics'],
  'zh-CN': ['无状态', '诊断'],
  'zh-TW': ['無狀態', '診斷'],
  ja: ['ステートレス', '診断'],
  ko: ['Stateless', '진단'],
} as const;

function readGuide(locale: (typeof locales)[number], page: string) {
  return readFileSync(
    resolve(process.cwd(), 'content', 'user-guide', locale, `${page}.md`),
    'utf8',
  );
}

describe('synced Sona command and context-menu guides', () => {
  it.each(locales)('documents the current standalone CLI in %s', (locale) => {
    const cli = readGuide(locale, 'cli-guide');

    expect(cli).toContain('### `diagnostics`');
    expect(cli).toContain('### `export transcript`');
    expect(cli).toContain('### `transcribe`');
    expect(cli).toContain('### `transcribe-live`');
    expect(cli).toContain('### `serve`');
    expect(cli).toContain('--input stdin');
    expect(cli).toContain('--output-format ndjson');
    expect(cli).toContain('--online-provider');
    expect(cli).toContain('--api-key-env');
    expect(cli).toContain('--online-config');
    expect(cli).toContain('volcengine-doubao');
    expect(cli).toContain('groq-whisper');
    expect(cli).toContain('mistral-voxtral');
    expect(cli).toContain('SQLite');
    expect(cli).toContain('History');
    expect(cli).toContain('Tag');
    expect(cli).toContain('Sync');
    expect(cli).toContain('Online LLM');
    expect(cli).not.toContain('### `history`');
    expect(cli).not.toContain('### `backup`');
    expect(cli).not.toMatch(/sona-cli (?:history|backup)\b/u);
    expect(cli).not.toContain('--app-data-dir');
    expect(cli).not.toContain('--confirm-replace');
    expect(cli).not.toMatch(/\bsona (?:serve|transcribe|models|init-config)\b/u);
    expect(cli).not.toContain('src-tauri/Cargo.toml');
    expect(cli).not.toContain('Sona.exe transcribe');
    expect(cli).not.toContain('Contents/MacOS/Sona transcribe');
  });

  it.each(locales)('uses the stateless CLI summary in %s', (locale) => {
    const page = getUserGuidePageById(locale, 'cli-guide');

    for (const marker of cliSummaryMarkers[locale]) {
      expect(page.description).toContain(marker);
    }
  });

  it.each(locales)('uses sona-cli for the API server in %s', (locale) => {
    const api = readGuide(locale, 'api-guide');

    expect(api).toContain('sona-cli serve');
    expect(api).toContain('sona-cli transcribe');
    expect(api).toContain('sona-cli transcribe-live');
    expect(api).toContain('Online ASR');
    expect(api).toContain('WebSocket');
    expect(api).not.toMatch(/\bsona serve\b/u);
  });

  it.each(locales)('documents the Qwen3-ASR hotword boundary in %s', (locale) => {
    const vocabulary = readGuide(locale, 'vocabulary-and-advanced-settings');

    expect(vocabulary).toContain('sherpa-onnx Transducer');
    expect(vocabulary).toContain('llama.cpp Qwen3-ASR');
  });

  it.each(locales)('documents keyboard-accessible context menus in %s', (locale) => {
    expect(readGuide(locale, 'edit-and-playback')).toContain('Shift + F10');
    expect(readGuide(locale, 'workspace-projects-and-inbox')).toContain(
      'Shift + F10',
    );
  });

  it.each(locales)('documents standalone Cloud Sync and not legacy embedded backup in %s', (locale) => {
    const exportSettings = readGuide(locale, 'export-and-settings');
    expect(exportSettings).not.toContain('lives inside Backup & Restore');
    expect(exportSettings).not.toContain('位于 备份与恢复 内部');
    expect(exportSettings).not.toContain('位於 備份與復原 內部');
    expect(exportSettings).not.toContain('Backup & Restore の中にあります');
    expect(exportSettings).not.toContain('Backup & Restore 안에 있습니다');
  });

  it.each(locales)('uses Inbox instead of obsolete Untagged in %s', (locale) => {
    const workspace = readGuide(locale, 'workspace-projects-and-inbox');
    const overview = readGuide(locale, 'overview');

    expect(workspace).not.toContain('Untagged');
    expect(workspace).not.toContain('未分类');
    expect(workspace).not.toContain('未分類');
    expect(overview).not.toContain('Untagged');
    expect(overview).not.toContain('未分类');
    expect(overview).not.toContain('未分類');
  });

  it.each(locales)('uses Projects instead of obsolete Workspace in %s', (locale) => {
    const guide = readGuide(locale, 'workspace-projects-and-inbox');
    expect(guide).not.toContain('`Workspace` tab');
    expect(guide).not.toContain('`工作区` 页签');
    expect(guide).not.toContain('`工作區` 標籤頁');
    expect(guide).not.toContain('`Workspace` タブ');
    expect(guide).not.toContain('`Workspace` 탭');
  });
});
