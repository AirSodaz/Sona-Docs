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
  decisionDescription: string;
  decisionTitle: string;
  description: string;
  desktopOnlyNote: string;
  emptyBuildsDescription: string;
  emptyBuildsTitle: string;
  firstRunHref: string;
  firstRunLabel: string;
  formatChoiceLabel: string;
  githubLabel: string;
  homeHref: string;
  homeLabel: string;
  installSafetyNote: string;
  loadingLabel: string;
  platformChoiceLabel: string;
  recommendedLabel: string;
  releaseLabel: string;
  title: string;
  unavailableDescription: string;
  unavailableTitle: string;
  updatedLabel: string;
}

export interface DownloadContent {
  button: DownloadButtonCopy;
  formats: Record<DownloadFormat, string>;
  formatDescriptions: Record<DownloadFormat, string>;
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
  platformDescriptions: Record<DownloadPlatformKey, string>;
  platforms: Record<DownloadPlatformKey, string>;
}

export const downloadContent = {
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
      alternateHref: '/downloads',
      alternateLanguageLabel: '简体中文',
      decisionDescription:
        'Start with your operating system and processor, then choose the installer format that fits how you manage apps.',
      decisionTitle: 'Choose the right build',
      description:
        'Pick the desktop build that matches your system, architecture, and preferred installer format.',
      desktopOnlyNote:
        'Sona runs as a desktop app. If you are on a phone or tablet, open this page again on the computer where you want to install it.',
      emptyBuildsDescription:
        'The release loaded, but it does not include Windows, macOS, or Linux desktop assets that this page can recognize. GitHub Releases may still list manual artifacts.',
      emptyBuildsTitle: 'No desktop builds found',
      firstRunHref: '/user-guide/getting-started',
      firstRunLabel: 'Continue with Getting Started',
      formatChoiceLabel: 'Format',
      githubLabel: 'View on GitHub Releases',
      homeHref: '/',
      homeLabel: 'Back to home',
      installSafetyNote:
        'If Windows SmartScreen, macOS Gatekeeper, or Linux executable-permission prompts appear, first confirm the file came from Sona Downloads or GitHub Releases, then follow the operating-system prompt. Do not turn off system protection globally.',
      loadingLabel: 'Checking the latest release...',
      platformChoiceLabel: 'Platform',
      recommendedLabel: 'Recommended',
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
    formatDescriptions: {
      exe: 'Guided Windows installer for most personal setups.',
      msi: 'Windows package suited to managed or scripted installs.',
      dmg: 'Standard macOS disk image for drag-to-install setup.',
      'app-tar-gz': 'Raw macOS app bundle for manual or automated installs.',
      appimage: 'Portable Linux build that runs outside a package manager.',
      deb: 'Debian and Ubuntu package for system installation.',
      rpm: 'Fedora, RHEL, and openSUSE package for system installation.',
    },
    platforms: {
      'windows-x64': 'Windows x64',
      'windows-arm64': 'Windows ARM64',
      'macos-arm64': 'macOS Apple Silicon',
      'macos-x64': 'macOS Intel',
      'macos-universal': 'macOS Universal',
      'linux-x64': 'Linux x64',
    },
    platformDescriptions: {
      'windows-x64': 'Most Windows PCs with Intel or AMD processors.',
      'windows-arm64': 'Windows on ARM devices.',
      'macos-arm64': 'Apple Silicon Macs.',
      'macos-x64': 'Older Intel Macs.',
      'macos-universal': 'One macOS build that covers both Apple Silicon and Intel.',
      'linux-x64': 'Most 64-bit Linux desktops.',
    },
  },
  'zh-CN': {
    metadata: {
      title: 'Sona | 桌面端下载',
      description:
        '在一个页面中查看并下载 Sona 最新的 Windows、macOS 与 Linux 桌面构建。',
    },
    button: {
      allBuildsHref: '/downloads',
      allBuildsLabel: '全部构建',
      currentPlatformLabel: '当前平台可选下载',
      menuAriaLabel: '显示更多下载选项',
      viewAllLabel: '查看全部桌面构建',
    },
    page: {
      alternateHref: '/downloads',
      alternateLanguageLabel: 'English',
      decisionDescription:
        '先按操作系统和处理器选择平台，再按你管理应用的方式选择安装格式。',
      decisionTitle: '选择合适的构建',
      description:
        '按系统、架构和安装格式选择最适合你的桌面端构建，不必在 Releases 列表里自己翻找。',
      desktopOnlyNote:
        'Sona 是桌面端应用。如果你正在手机或平板上浏览，请在准备安装的电脑上重新打开本页。',
      emptyBuildsDescription:
        'release 已成功载入，但其中没有本页可识别的 Windows、macOS 或 Linux 桌面端资源。GitHub Releases 中可能仍有可手动查看的构建。',
      emptyBuildsTitle: '没有找到桌面端构建',
      firstRunHref: '/user-guide/getting-started',
      firstRunLabel: '继续查看快速开始',
      formatChoiceLabel: '格式',
      githubLabel: '前往 GitHub Releases',
      homeHref: '/',
      homeLabel: '返回首页',
      installSafetyNote:
        '如果遇到 Windows SmartScreen、macOS Gatekeeper 或 Linux 可执行权限提示，请先确认文件来自 Sona 下载页或 GitHub Releases，再按系统提示处理；不要全局关闭系统安全防护。',
      loadingLabel: '正在检查最新 release...',
      platformChoiceLabel: '平台',
      recommendedLabel: '推荐',
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
    formatDescriptions: {
      exe: '适合大多数个人安装的 Windows 图形安装器。',
      msi: '适合集中管理或脚本化部署的 Windows 安装包。',
      dmg: 'macOS 常用磁盘镜像，适合拖拽安装。',
      'app-tar-gz': 'macOS 原始应用包，适合手动安装或自动化处理。',
      appimage: 'Linux 便携构建，不依赖系统包管理器。',
      deb: '适用于 Debian 与 Ubuntu 的系统安装包。',
      rpm: '适用于 Fedora、RHEL 与 openSUSE 的系统安装包。',
    },
    platforms: {
      'windows-x64': 'Windows x64',
      'windows-arm64': 'Windows ARM64',
      'macos-arm64': 'macOS Apple 芯片',
      'macos-x64': 'macOS Intel',
      'macos-universal': 'macOS 通用版',
      'linux-x64': 'Linux x64',
    },
    platformDescriptions: {
      'windows-x64': '大多数 Intel 或 AMD 处理器的 Windows 电脑。',
      'windows-arm64': 'Windows on ARM 设备。',
      'macos-arm64': 'Apple 芯片 Mac。',
      'macos-x64': '较早的 Intel Mac。',
      'macos-universal': '同时覆盖 Apple 芯片与 Intel 的 macOS 构建。',
      'linux-x64': '大多数 64 位 Linux 桌面系统。',
    },
  },
} as any as Record<HomeLocale, DownloadContent>;

downloadContent['zh-TW'] = {
  metadata: {
    title: 'Sona | 桌面端下載',
    description:
      '在一個頁面中查看並下載 Sona 最新的 Windows、macOS 與 Linux 桌面建構。',
  },
  button: {
    allBuildsHref: '/downloads',
    allBuildsLabel: '全部建構',
    currentPlatformLabel: '目前平台可選下載',
    menuAriaLabel: '顯示更多下載選項',
    viewAllLabel: '查看全部桌面建構',
  },
  page: {
    alternateHref: '/downloads',
    alternateLanguageLabel: 'English',
    decisionDescription:
      '先按作業系統和處理器選擇平台，再按您管理應用程式的方式選擇安裝格式。',
    decisionTitle: '選擇合適的建構',
    description:
      '按系統、架構和安裝格式選擇最適合您的桌面端建構，不必在 Releases 列表裡自己翻找。',
    desktopOnlyNote:
      'Sona 是桌面端應用程式。如果您正在手機或平板上瀏覽，請在準備安裝的電腦上重新打開本頁。',
    emptyBuildsDescription:
      'release 已成功載入，但其中沒有本頁可辨識的 Windows、macOS 或 Linux 桌面端資源。GitHub Releases 中可能仍有可手動查看的建構。',
    emptyBuildsTitle: '沒有找到桌面端建構',
    firstRunHref: '/user-guide/getting-started',
    firstRunLabel: '繼續查看快速入門',
    formatChoiceLabel: '格式',
    githubLabel: '前往 GitHub Releases',
    homeHref: '/',
    homeLabel: '返回首頁',
    installSafetyNote:
      '如果遇到 Windows SmartScreen、macOS Gatekeeper 或 Linux 可執行權限提示，請先確認檔案來自 Sona 下載頁或 GitHub Releases，再按系統提示處理；不要全域關閉系統安全防護。',
    loadingLabel: '正在檢查最新 release...',
    platformChoiceLabel: '平台',
    recommendedLabel: '推薦',
    releaseLabel: '最新版本',
    title: '桌面端下載',
    unavailableDescription:
      '目前無法讀取最新 release 詳情，但 GitHub Releases 裡仍然保留了完整建構列表。',
    unavailableTitle: '暫時無法獲取 release 詳情',
    updatedLabel: '內容來自最新 GitHub release',
  },
  platformGroups: {
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
  },
  formats: {
    exe: '安裝器 (.exe)',
    msi: 'MSI 安裝包 (.msi)',
    dmg: '磁碟映像 (.dmg)',
    'app-tar-gz': '應用程式包 (.app.tar.gz)',
    appimage: 'AppImage',
    deb: 'Deb 安裝包 (.deb)',
    rpm: 'RPM 安裝包 (.rpm)',
  },
  formatDescriptions: {
    exe: '適合大多數個人安裝的 Windows 圖形安裝器。',
    msi: '適合集中管理或指令碼化部署的 Windows 安裝包。',
    dmg: 'macOS 常用磁碟映像，適合拖曳安裝。',
    'app-tar-gz': 'macOS 原始應用程式包，適合手動安裝或自動化處理。',
    appimage: 'Linux 可攜式建構，不依賴系統包管理員。',
    deb: '適用於 Debian 與 Ubuntu 的系統安裝包。',
    rpm: '適用於 Fedora、RHEL 與 openSUSE 的系統安裝包。',
  },
  platforms: {
    'windows-x64': 'Windows x64',
    'windows-arm64': 'Windows ARM64',
    'macos-arm64': 'macOS Apple 晶片',
    'macos-x64': 'macOS Intel',
    'macos-universal': 'macOS 通用版',
    'linux-x64': 'Linux x64',
  },
  platformDescriptions: {
    'windows-x64': '大多數 Intel 或 AMD 處理器的 Windows 電腦。',
    'windows-arm64': 'Windows on ARM 裝置。',
    'macos-arm64': 'Apple 晶片 Mac。',
    'macos-x64': '較早的 Intel Mac。',
    'macos-universal': '同時覆蓋 Apple 晶片與 Intel 的 macOS 建構。',
    'linux-x64': '大多數 64 位 Linux 桌面系統。',
  },
} as any;

downloadContent.ja = {
  metadata: {
    title: 'Sona | デスクトップダウンロード',
    description: 'Windows、macOS、Linux用の最新Sonaデスクトップビルドを1箇所からダウンロード。',
  },
} as any;

