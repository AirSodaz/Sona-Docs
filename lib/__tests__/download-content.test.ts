import { describe, expect, it } from 'vitest';
import koMessages from '@/messages/ko.json';
import { buildDownloadContentFromMessages } from '../download-content';

function createReader(namespace: unknown) {
  return Object.assign(
    (key: 'metadata.description' | 'metadata.title') =>
      key.split('.').reduce<unknown>((value, part) => {
        if (!value || typeof value !== 'object') {
          return undefined;
        }

        return (value as Record<string, unknown>)[part];
      }, namespace) as string,
    {
      raw(key: string) {
        return (namespace as Record<string, unknown>)[key];
      },
    },
  );
}

describe('download content', () => {
  it('builds homepage download button copy from Korean messages', () => {
    const content = buildDownloadContentFromMessages(
      createReader(koMessages.DownloadsPage),
    );

    expect(content.button.allBuildsLabel).toBe('전체 빌드');
    expect(content.button.currentPlatformLabel).toBe('현재 플랫폼용 다운로드');
    expect(content.formats.exe).toBe('설치 프로그램 (.exe)');
    expect(content.platformDescriptions['windows-x64']).toContain(
      '대부분의 Windows PC',
    );
  });
});
