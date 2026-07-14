import { describe, expect, it } from 'vitest';
import enMessages from '@/messages/en.json';
import jaMessages from '@/messages/ja.json';
import koMessages from '@/messages/ko.json';
import zhCnMessages from '@/messages/zh-CN.json';
import zhTwMessages from '@/messages/zh-TW.json';
import { buildDownloadContentFromMessages } from '../download-content';

const downloadMessages = {
  en: enMessages.DownloadsPage,
  ja: jaMessages.DownloadsPage,
  ko: koMessages.DownloadsPage,
  'zh-CN': zhCnMessages.DownloadsPage,
  'zh-TW': zhTwMessages.DownloadsPage,
};

function createReader(namespace: unknown) {
  return Object.assign(
    (key: string) =>
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

  it('provides Nightly and Android copy in every locale', () => {
    for (const namespace of Object.values(downloadMessages)) {
      const content = buildDownloadContentFromMessages(
        createReader(namespace),
      );

      expect(content.metadata.nightlyTitle).toBeTruthy();
      expect(content.channels.nightlyLabel).toBeTruthy();
      expect(content.channels.nightlyWarningDescription).toBeTruthy();
      expect(content.android.title).toBe('Android');
      expect(content.android.statusLabel).toBeTruthy();
      expect(content.page.nightlyReleaseLabel).toBeTruthy();
    }
  });
});
