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
    const taiwaneseEntries = await getUserGuideSearchEntries('zh-TW');
    const japaneseEntries = await getUserGuideSearchEntries('ja');
    const koreanEntries = await getUserGuideSearchEntries('ko');

    expect(englishEntries).not.toHaveLength(0);
    expect(chineseEntries).not.toHaveLength(0);
    expect(taiwaneseEntries).not.toHaveLength(0);
    expect(japaneseEntries).not.toHaveLength(0);
    expect(koreanEntries).not.toHaveLength(0);
    expect(englishEntries.every((entry) => entry.path.startsWith('/user-guide'))).toBe(true);
    expect(chineseEntries.every((entry) => entry.path.startsWith('/user-guide'))).toBe(true);
    expect(taiwaneseEntries.every((entry) => entry.path.startsWith('/user-guide'))).toBe(true);
    expect(japaneseEntries.every((entry) => entry.path.startsWith('/user-guide'))).toBe(true);
    expect(koreanEntries.every((entry) => entry.path.startsWith('/user-guide'))).toBe(true);
  });

  it('finds expected English, Chinese, and Korean guide pages', async () => {
    const englishEntries = await getUserGuideSearchEntries('en');
    const chineseEntries = await getUserGuideSearchEntries('zh-CN');
    const taiwaneseEntries = await getUserGuideSearchEntries('zh-TW');
    const koreanEntries = await getUserGuideSearchEntries('ko');

    expect(searchUserGuideEntries(englishEntries, 'AI Summary')[0]?.id).toBe(
      'ai-summary',
    );
    expect(searchUserGuideEntries(englishEntries, 'HTTP API')[0]?.id).toBe(
      'api-guide',
    );
    expect(searchUserGuideEntries(chineseEntries, '实时字幕')[0]?.id).toBe(
      'live-caption-and-voice-typing',
    );
    expect(searchUserGuideEntries(chineseEntries, 'API 服务')[0]?.id).toBe(
      'api-guide',
    );
    expect(searchUserGuideEntries(taiwaneseEntries, '即時字幕')[0]?.id).toBe(
      'live-caption-and-voice-typing',
    );
    expect(searchUserGuideEntries(taiwaneseEntries, 'API 服務')[0]?.id).toBe(
      'api-guide',
    );
    expect(searchUserGuideEntries(koreanEntries, '실시간 자막')[0]?.id).toBe(
      'live-caption-and-voice-typing',
    );
    expect(searchUserGuideEntries(koreanEntries, 'API 서버')[0]?.id).toBe(
      'api-guide',
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
