import { describe, expect, it } from 'vitest';
import {
  buildUserGuideSystemInstruction,
  getUserGuideAiContext,
} from '../user-guide-ai';

describe('user guide AI locale instructions', () => {
  const buildInstruction = (locale: 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko') =>
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

  it('asks Korean answers to use natural Korean', () => {
    expect(buildInstruction('ko')).toContain('Answer in Korean.');
  });

  it('builds a focused context with the current page and limited references', async () => {
    const context = await getUserGuideAiContext(
      'en',
      'overview',
      'How do I use the HTTP API server?',
    );

    expect(context).toContain('Current page - Sona User Guide');
    expect(context).toContain('Page ID: overview');
    expect(context).toContain('Relevant reference snippets');
    expect(context).toContain('Page ID: api-guide');
    const pageIdMatches = context.match(/^Page ID:/gm) ?? [];

    expect(pageIdMatches.length).toBeGreaterThan(1);
    expect(pageIdMatches.length).toBeLessThanOrEqual(4);
    expect(context.match(/^Page ID: overview$/gm)).toHaveLength(1);
  });

  it('uses only the current page when the question is empty', async () => {
    const context = await getUserGuideAiContext('en', 'overview', '');

    expect(context).toContain('Current page - Sona User Guide');
    expect(context.match(/^Page ID:/gm)).toHaveLength(1);
  });
});
