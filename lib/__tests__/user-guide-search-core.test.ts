import { describe, expect, it } from 'vitest';
import {
  normalizeGuideSearchText,
  searchUserGuideEntries,
  type UserGuideSearchEntry,
} from '../user-guide-search-core';

const baseEntry = {
  groupLabel: 'Workflow',
  navLabel: 'Guide Page',
  path: '/user-guide/page',
};

function createEntry(
  id: string,
  overrides: Partial<UserGuideSearchEntry>,
): UserGuideSearchEntry {
  return {
    ...baseEntry,
    content: '',
    description: '',
    id,
    title: id,
    ...overrides,
  };
}

describe('user guide search core', () => {
  it('prioritizes title matches over body matches', () => {
    const entries: UserGuideSearchEntry[] = [
      createEntry('edit-and-playback', {
        content: 'This page mentions AI Summary as a related next step.',
        title: 'Edit and Playback',
      }),
      createEntry('ai-summary', {
        content: 'Generate a transcript-side recap.',
        title: 'AI Summary',
      }),
    ];

    const results = searchUserGuideEntries(entries, 'AI Summary');

    expect(results.map((result) => result.id)).toEqual([
      'ai-summary',
      'edit-and-playback',
    ]);
    expect(results[0].matchedField).toBe('title');
  });

  it('matches English and Chinese text after conservative normalization', () => {
    const entries: UserGuideSearchEntry[] = [
      createEntry('live-caption-and-voice-typing', {
        content: '实时字幕和语音输入法共用离线实时转录依赖。',
        title: '实时字幕与语音输入法',
      }),
      createEntry('live-record', {
        content: 'Live Caption can be started from the Live Record page.',
        title: 'Live Record',
      }),
    ];

    expect(searchUserGuideEntries(entries, '实时字幕')[0]?.id).toBe(
      'live-caption-and-voice-typing',
    );
    expect(searchUserGuideEntries(entries, 'live caption')[0]?.id).toBe(
      'live-record',
    );
    expect(normalizeGuideSearchText('ＡＩ　Summary')).toBe('ai summary');
  });

  it('returns no results for empty queries and respects the result limit', () => {
    const entries = Array.from({ length: 10 }, (_, index) =>
      createEntry(`entry-${index}`, {
        content: `matching content ${index}`,
        title: `Entry ${index}`,
      }),
    );

    expect(searchUserGuideEntries(entries, '   ')).toEqual([]);
    expect(searchUserGuideEntries(entries, 'matching', { limit: 3 })).toHaveLength(3);
  });

  it('returns clean snippets with highlight ranges', () => {
    const entries: UserGuideSearchEntry[] = [
      createEntry('clean-content', {
        content:
          'Open Live Record first, then continue to edit and export the transcript.',
        title: 'Clean Content',
      }),
    ];

    const [result] = searchUserGuideEntries(entries, 'edit');

    expect(result.excerpt).toContain('continue to edit and export');
    expect(result.excerpt).not.toContain('`');
    expect(result.highlights).toEqual([
      {
        end: result.excerpt.indexOf('edit') + 'edit'.length,
        start: result.excerpt.indexOf('edit'),
      },
    ]);
  });
});
