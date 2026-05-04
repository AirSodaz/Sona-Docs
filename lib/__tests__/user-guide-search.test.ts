import { describe, expect, it } from 'vitest';
import { searchUserGuideEntries } from '../user-guide-search-core';
import {
  getUserGuideSearchEntries,
  stripUserGuideMarkdownForSearch,
} from '../user-guide-search';

describe('user guide search index', () => {
  it('builds locale-specific guide paths', async () => {
    const englishEntries = await getUserGuideSearchEntries('en');
    const chineseEntries = await getUserGuideSearchEntries('zh-CN');

    expect(englishEntries).not.toHaveLength(0);
    expect(chineseEntries).not.toHaveLength(0);
    expect(englishEntries.every((entry) => entry.path.startsWith('/user-guide'))).toBe(true);
    expect(chineseEntries.every((entry) => entry.path.startsWith('/zh/user-guide'))).toBe(true);
  });

  it('finds expected English and Chinese guide pages', async () => {
    const englishEntries = await getUserGuideSearchEntries('en');
    const chineseEntries = await getUserGuideSearchEntries('zh-CN');

    expect(searchUserGuideEntries(englishEntries, 'AI Summary')[0]?.id).toBe(
      'ai-summary',
    );
    expect(searchUserGuideEntries(chineseEntries, '实时字幕')[0]?.id).toBe(
      'live-caption-and-voice-typing',
    );
  });

  it('strips markdown links, inline code, and heading markers from indexed text', () => {
    const text = stripUserGuideMarkdownForSearch(
      '## Search and playback\nPress `Ctrl + F`, then open [Live Record](guide:live-record).',
    );

    expect(text).toContain('Search and playback');
    expect(text).toContain('Ctrl + F');
    expect(text).toContain('Live Record');
    expect(text).not.toContain('##');
    expect(text).not.toContain('`');
    expect(text).not.toContain('guide:live-record');
  });
});
