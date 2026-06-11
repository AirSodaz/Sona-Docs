import { describe, expect, it } from 'vitest';
import { buildUserGuideSystemInstruction } from '../user-guide-ai';

describe('user guide AI locale instructions', () => {
  const buildInstruction = (locale: 'en' | 'zh-CN' | 'zh-TW' | 'ja') =>
    buildUserGuideSystemInstruction({
      context: 'Guide locale context',
      currentPageTitle: 'Overview',
      locale,
    });

  it('asks zh-TW answers to use Traditional Chinese with Taiwan style', () => {
    const instruction = buildInstruction('zh-TW');

    expect(instruction).toContain(
      'Answer in Traditional Chinese using Taiwan terminology and style.',
    );
    expect(instruction).not.toContain('Answer in Simplified Chinese.');
  });

  it('keeps zh-CN and Japanese answer language instructions distinct', () => {
    expect(buildInstruction('zh-CN')).toContain('Answer in Simplified Chinese.');
    expect(buildInstruction('ja')).toContain('Answer in Japanese.');
  });
});
