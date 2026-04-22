import type { HomeLocale } from '@/lib/homepage-content';
import type {
  DownloadFormat,
  DownloadPlatformKey,
} from '@/lib/release-downloads';

interface DownloadButtonCopy {
  allBuildsHref: string;
  allBuildsLabel: string;
  currentPlatformLabel: string;
  menuAriaLabel: string;
  viewAllLabel: string;
}

interface DownloadPageCopy {
  alternateHref: string;
  alternateLanguageLabel: string;
  description: string;
  githubLabel: string;
  homeHref: string;
  homeLabel: string;
  loadingLabel: string;
  releaseLabel: string;
  title: string;
  unavailableDescription: string;
  unavailableTitle: string;
  updatedLabel: string;
}

export interface DownloadContent {
  button: DownloadButtonCopy;
  formats: Record<DownloadFormat, string>;
  metadata: {
    description: string;
    title: string;
  };
  page: DownloadPageCopy;
  platformGroups: {
    linux: string;
    macos: string;
    windows: string;
  };
  platforms: Record<DownloadPlatformKey, string>;
}

export const downloadContent: Record<HomeLocale, DownloadContent> = {
  en: {
    metadata: {
      title: 'Sona | Desktop Downloads',
      description:
        'Download the latest Sona desktop builds for Windows, macOS, and Linux from one place.',
    },
    button: {
      allBuildsHref: '/downloads',
      allBuildsLabel: 'All builds',
      currentPlatformLabel: 'Downloads for your platform',
      menuAriaLabel: 'Show more download options',
      viewAllLabel: 'View all desktop builds',
    },
    page: {
      alternateHref: '/zh/downloads',
      alternateLanguageLabel: '中文',
      description:
        'Pick the desktop build that matches your system, architecture, and preferred installer format.',
      githubLabel: 'View on GitHub Releases',
      homeHref: '/',
      homeLabel: 'Back to home',
      loadingLabel: 'Checking the latest release...',
      releaseLabel: 'Latest release',
      title: 'Desktop downloads',
      unavailableDescription:
        'The latest release details could not be loaded right now. GitHub Releases still has the complete list of builds.',
      unavailableTitle: 'Release details are temporarily unavailable',
      updatedLabel: 'Updated from the latest GitHub release',
    },
    platformGroups: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    },
    formats: {
      exe: 'Installer (.exe)',
      msi: 'MSI package (.msi)',
      dmg: 'Disk image (.dmg)',
      'app-tar-gz': 'App bundle (.app.tar.gz)',
      appimage: 'AppImage',
      deb: 'Deb package (.deb)',
      rpm: 'RPM package (.rpm)',
    },
    platforms: {
      'windows-x64': 'Windows x64',
      'windows-arm64': 'Windows ARM64',
      'macos-arm64': 'macOS Apple Silicon',
      'macos-x64': 'macOS Intel',
      'macos-universal': 'macOS Universal',
      'linux-x64': 'Linux x64',
    },
  },
  'zh-CN': {
    metadata: {
      title: 'Sona | 桌面端下载',
      description:
        '在一个页面中查看并下载 Sona 最新的 Windows、macOS 与 Linux 桌面构建。',
    },
    button: {
      allBuildsHref: '/zh/downloads',
      allBuildsLabel: '全部构建',
      currentPlatformLabel: '当前平台可选下载',
      menuAriaLabel: '显示更多下载选项',
      viewAllLabel: '查看全部桌面构建',
    },
    page: {
      alternateHref: '/downloads',
      alternateLanguageLabel: 'English',
      description:
        '按系统、架构和安装格式选择最适合你的桌面端构建，不必在 Releases 列表里自己翻找。',
      githubLabel: '前往 GitHub Releases',
      homeHref: '/zh',
      homeLabel: '返回首页',
      loadingLabel: '正在检查最新 release...',
      releaseLabel: '最新版本',
      title: '桌面端下载',
      unavailableDescription:
        '当前无法读取最新 release 详情，但 GitHub Releases 里仍然保留了完整构建列表。',
      unavailableTitle: '暂时无法获取 release 详情',
      updatedLabel: '内容来自最新 GitHub release',
    },
    platformGroups: {
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
    },
    formats: {
      exe: '安装器 (.exe)',
      msi: 'MSI 安装包 (.msi)',
      dmg: '磁盘镜像 (.dmg)',
      'app-tar-gz': '应用包 (.app.tar.gz)',
      appimage: 'AppImage',
      deb: 'Deb 安装包 (.deb)',
      rpm: 'RPM 安装包 (.rpm)',
    },
    platforms: {
      'windows-x64': 'Windows x64',
      'windows-arm64': 'Windows ARM64',
      'macos-arm64': 'macOS Apple 芯片',
      'macos-x64': 'macOS Intel',
      'macos-universal': 'macOS 通用版',
      'linux-x64': 'Linux x64',
    },
  },
};
