import type { HomeLocale } from '@/lib/homepage-content';

export type TrustPrivacyPageId = 'privacy' | 'trust';

interface FactItem {
  label: string;
  title: string;
  description: string;
}

interface DetailSection {
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
}

export interface TrustPrivacyPageCopy {
  id: TrustPrivacyPageId;
  locale: HomeLocale;
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    alternateHref: string;
    alternateLanguageLabel: string;
    alternateLanguageShortLabel: string;
    githubLabel: string;
    homeHref: string;
    homeLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    updatedLabel: string;
  };
  facts: FactItem[];
  sections: DetailSection[];
  closing: {
    title: string;
    description: string;
    primaryHref: string;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };
  footer: {
    license: string;
    privacyHref: string;
    privacyLabel: string;
    trustHref: string;
    trustLabel: string;
  };
  path: string;
  alternatePath: string;
}

type LocalePages = Record<TrustPrivacyPageId, TrustPrivacyPageCopy>;

export const trustPrivacyContent: Record<HomeLocale, LocalePages> = {
  en: {
    trust: {
      id: 'trust',
      locale: 'en',
      metadata: {
        title: 'Sona | Trust',
        description:
          'How Sona keeps transcription local by default, makes optional network features explicit, and protects the public docs site.',
      },
      nav: {
        alternateHref: '/zh/trust',
        alternateLanguageLabel: '中文',
        alternateLanguageShortLabel: '中',
        githubLabel: 'GitHub',
        homeHref: '/',
        homeLabel: 'Home',
      },
      hero: {
        eyebrow: 'Trust',
        title: 'Local first, explicit when networked.',
        description:
          'Sona is built around a simple boundary: transcription starts on your own machine, and networked features should be visible, optional, and tied to the action you asked for.',
        updatedLabel: 'Product trust principles',
      },
      facts: [
        {
          label: 'Default',
          title: 'Transcription runs on-device',
          description:
            'Speech recognition is designed around local Sherpa-onnx models instead of sending audio to a hosted transcription service by default.',
        },
        {
          label: 'Choice',
          title: 'AI assistance is optional',
          description:
            'Polish, translation, and summary features depend on the provider you configure. If you do not configure them, the local transcript workflow still works.',
        },
        {
          label: 'Site',
          title: 'No ad tracking in this repo',
          description:
            'The current docs site code does not include analytics or advertising trackers; public API surfaces are limited and guarded.',
        },
      ],
      sections: [
        {
          eyebrow: 'Desktop app',
          title: 'The core workflow stays close to the device',
          body:
            'Sona is a desktop transcript editor. The primary path is recording or importing audio, transcribing it with local models, reviewing timestamps, editing text, and exporting files from the app.',
          items: [
            'Local transcription does not require a Sona-hosted speech service.',
            'Model downloads and app updates may contact external release or model hosts when you ask for them.',
            'Backups, restores, and WebDAV sync are controlled from the app and should be treated as user-selected data movement.',
          ],
        },
        {
          eyebrow: 'Optional AI',
          title: 'Provider-backed features follow your configuration',
          body:
            'Sona can call configured LLM or translation providers for polish, translation, and summaries. Those features are separate from local transcription and depend on the provider settings you enter.',
          items: [
            'Transcript text can be sent to the provider you choose when you run an AI action.',
            'Provider credentials and behavior are managed in the desktop app settings, not by the public docs site.',
            'If you use a local provider such as a local model server, the data boundary depends on that provider endpoint.',
          ],
        },
        {
          eyebrow: 'Transparency',
          title: 'Open source keeps the claims inspectable',
          body:
            'Sona and this docs site are built in public. That makes the product flow, website routes, release handling, and current anti-abuse controls reviewable from the repository.',
          items: [
            'Downloads are pulled from GitHub Releases, and the site exposes the release source instead of hiding it behind a custom installer flow.',
            'The docs assistant is only enabled when the required Gemini and abuse-protection environment variables are configured.',
            'Security headers and same-site checks are part of the current site implementation, with stronger traffic controls recommended at the edge.',
          ],
        },
      ],
      closing: {
        title: 'Want the data-flow version?',
        description:
          'The privacy page explains what the desktop app and this website do with data in more direct operational terms.',
        primaryHref: '/privacy',
        primaryLabel: 'Read Privacy',
        secondaryHref: '/user-guide',
        secondaryLabel: 'Open User Guide',
      },
      footer: {
        license: 'Open sourced under MIT License.',
        privacyHref: '/privacy',
        privacyLabel: 'Privacy',
        trustHref: '/trust',
        trustLabel: 'Trust',
      },
      path: '/trust',
      alternatePath: '/zh/trust',
    },
    privacy: {
      id: 'privacy',
      locale: 'en',
      metadata: {
        title: 'Sona | Privacy',
        description:
          'A practical explanation of what Sona keeps local, when optional features may send data, and how the docs site handles requests.',
      },
      nav: {
        alternateHref: '/zh/privacy',
        alternateLanguageLabel: '中文',
        alternateLanguageShortLabel: '中',
        githubLabel: 'GitHub',
        homeHref: '/',
        homeLabel: 'Home',
      },
      hero: {
        eyebrow: 'Privacy',
        title: 'A practical privacy map, not legal fine print.',
        description:
          'This page describes the current product and website behavior in plain language: what stays local, what may leave the device when you choose networked features, and what the public docs site handles.',
        updatedLabel: 'Privacy principles',
      },
      facts: [
        {
          label: 'Local',
          title: 'Audio and transcripts start on your device',
          description:
            'The normal Sona workflow is built around local transcription, local editing, and user-controlled export.',
        },
        {
          label: 'Optional',
          title: 'Network features are action-based',
          description:
            'AI provider calls, model downloads, updates, backups, and WebDAV sync are tied to features you configure or trigger.',
        },
        {
          label: 'Website',
          title: 'The docs site has limited dynamic surfaces',
          description:
            'The site checks GitHub release data for downloads and can offer a protected guide assistant when configured.',
        },
      ],
      sections: [
        {
          eyebrow: 'Desktop app data',
          title: 'What stays local by design',
          body:
            'Sona is intended for people who want transcript work to happen on their own machine by default. Recording, importing, local recognition, timestamp review, editing, and export are desktop workflows.',
          items: [
            'Local transcription uses installed models and does not need a Sona cloud transcription account.',
            'Workspace records, light history transcripts, summaries, settings, and backups are managed by the desktop app.',
            'Exported files go where you choose to save or share them.',
          ],
        },
        {
          eyebrow: 'User-selected sharing',
          title: 'When data may leave your device',
          body:
            'Some features are useful because they connect to another service. In those cases, the destination is determined by the feature and provider you chose.',
          items: [
            'LLM polish, translation, and summary actions may send transcript text to your configured provider.',
            'Model downloads, update checks, and release downloads contact their relevant hosting services.',
            'WebDAV cloud sync uploads or restores backup archives through the server you configure.',
          ],
        },
        {
          eyebrow: 'Website behavior',
          title: 'What this public site handles',
          body:
            'The Sona docs site is separate from the desktop transcript workflow. It serves pages, checks GitHub release metadata for download options, and may enable an AI guide assistant for documentation questions.',
          items: [
            'The download UI calls `/api/github-release`, which fetches public release metadata from GitHub and returns structured build links.',
            'The guide assistant sends your question, short conversation history, locale, and current guide page context to Gemini when the feature is configured.',
            'The assistant route uses signed anonymous anti-abuse cookies and may show Cloudflare Turnstile after usage thresholds.',
          ],
        },
        {
          eyebrow: 'Limits',
          title: 'What this page is not claiming',
          body:
            'This is a practical product explanation, not a lawyer-reviewed privacy policy or compliance statement. It reflects the current repository shape and should be updated when product behavior changes.',
          items: [
            'It does not claim that every third-party provider follows the same privacy practices.',
            'It does not replace reading the policies of GitHub, Gemini, Cloudflare, your LLM provider, or your WebDAV host.',
            'It does not add new analytics, persistence, tracking, or API behavior.',
          ],
        },
      ],
      closing: {
        title: 'Prefer the trust summary?',
        description:
          'The trust page gives the higher-level view of Sona’s local-first product boundary and site safeguards.',
        primaryHref: '/trust',
        primaryLabel: 'Read Trust',
        secondaryHref: '/user-guide',
        secondaryLabel: 'Open User Guide',
      },
      footer: {
        license: 'Open sourced under MIT License.',
        privacyHref: '/privacy',
        privacyLabel: 'Privacy',
        trustHref: '/trust',
        trustLabel: 'Trust',
      },
      path: '/privacy',
      alternatePath: '/zh/privacy',
    },
  },
  'zh-CN': {
    trust: {
      id: 'trust',
      locale: 'zh-CN',
      metadata: {
        title: 'Sona | 信任',
        description:
          '了解 Sona 如何默认在本机完成转录、明确区分可选联网能力，并保护公开文档站点。',
      },
      nav: {
        alternateHref: '/trust',
        alternateLanguageLabel: 'English',
        alternateLanguageShortLabel: 'EN',
        githubLabel: 'GitHub',
        homeHref: '/zh',
        homeLabel: '首页',
      },
      hero: {
        eyebrow: '信任',
        title: '本地优先，\n联网时说清楚。',
        description:
          'Sona 的边界很明确：转录先在你自己的设备上完成；需要联网的能力应当可见、可选，并且对应到你主动触发的动作。',
        updatedLabel: '产品信任原则',
      },
      facts: [
        {
          label: '默认',
          title: '转录在本机运行',
          description:
            '语音识别围绕本地 Sherpa-onnx 模型设计，默认不把音频发往托管式转录服务。',
        },
        {
          label: '选择',
          title: 'AI 辅助是可选能力',
          description:
            '润色、翻译和摘要取决于你配置的 provider；即使不配置这些能力，本地转录流程仍可使用。',
        },
        {
          label: '站点',
          title: '当前仓库没有广告追踪',
          description:
            '当前文档站点代码没有接入 analytics 或广告追踪器；公开 API 面较少，并带有防滥用保护。',
        },
      ],
      sections: [
        {
          eyebrow: '桌面应用',
          title: '核心工作流尽量留在设备附近',
          body:
            'Sona 是一款桌面端转录编辑器。主流程是录音或导入音频，用本地模型转录，检查时间戳，编辑文本，再从应用里导出文件。',
          items: [
            '本地转录不需要依赖 Sona 托管的语音服务。',
            '当你主动下载模型或检查更新时，应用可能访问对应的 release 或模型托管地址。',
            '备份、恢复和 WebDAV 同步由应用内操作触发，应视为用户主动选择的数据移动。',
          ],
        },
        {
          eyebrow: '可选 AI',
          title: '依赖 provider 的能力跟随你的配置',
          body:
            'Sona 可以调用你配置的 LLM 或翻译 provider 来做润色、翻译和摘要。这些能力与本地转录分开，取决于你在设置中填写的 provider 信息。',
          items: [
            '当你运行 AI 动作时，转录文本可能会发送给你选择的 provider。',
            'Provider 凭据和调用行为由桌面应用设置管理，不由公开文档站点代管。',
            '如果你使用本地 provider，例如本地模型服务，数据边界取决于你配置的 endpoint。',
          ],
        },
        {
          eyebrow: '透明度',
          title: '开源让这些说法可以被检查',
          body:
            'Sona 和这个文档站点都在公开仓库中构建。产品流程、网站路由、release 处理和当前防滥用控制都可以从代码中查看。',
          items: [
            '下载信息来自 GitHub Releases，站点不会把来源藏在自定义安装流程后面。',
            '文档助手只有在 Gemini 和防滥用相关环境变量都配置好时才会启用。',
            '当前站点包含安全响应头和 same-site 检查；更强的流量限制建议放在 CDN/边缘层。',
          ],
        },
      ],
      closing: {
        title: '想看数据流版本？',
        description:
          '隐私页用更直接的方式说明桌面应用和这个网站分别会如何处理数据。',
        primaryHref: '/zh/privacy',
        primaryLabel: '阅读隐私说明',
        secondaryHref: '/zh/user-guide',
        secondaryLabel: '打开用户指南',
      },
      footer: {
        license: '基于 MIT 协议开源。',
        privacyHref: '/zh/privacy',
        privacyLabel: '隐私',
        trustHref: '/zh/trust',
        trustLabel: '信任',
      },
      path: '/zh/trust',
      alternatePath: '/trust',
    },
    privacy: {
      id: 'privacy',
      locale: 'zh-CN',
      metadata: {
        title: 'Sona | 隐私',
        description:
          '用实际产品和站点行为说明 Sona 哪些内容留在本地、哪些可选功能可能发送数据，以及文档站点如何处理请求。',
      },
      nav: {
        alternateHref: '/privacy',
        alternateLanguageLabel: 'English',
        alternateLanguageShortLabel: 'EN',
        githubLabel: 'GitHub',
        homeHref: '/zh',
        homeLabel: '首页',
      },
      hero: {
        eyebrow: '隐私',
        title: '实用隐私地图，\n不是法律细则。',
        description:
          '这一页用普通语言说明当前产品和网站的行为：哪些内容默认留在本地，哪些联网能力会在你选择后发生，以及公开文档站点会处理什么。',
        updatedLabel: '隐私原则',
      },
      facts: [
        {
          label: '本地',
          title: '音频和转录先在设备上处理',
          description:
            'Sona 的常规流程围绕本地转录、本地编辑和用户主动导出来设计。',
        },
        {
          label: '可选',
          title: '联网能力跟随具体动作',
          description:
            'AI provider 调用、模型下载、更新、备份和 WebDAV 同步都与用户配置或触发的功能相关。',
        },
        {
          label: '网站',
          title: '文档站点的动态面较少',
          description:
            '站点会为下载页读取 GitHub release 数据，并可在配置后提供受保护的文档助手。',
        },
      ],
      sections: [
        {
          eyebrow: '桌面应用数据',
          title: '默认留在本地的内容',
          body:
            'Sona 面向希望把转录工作默认留在自己机器上的用户。录音、导入、本地识别、时间戳检查、编辑和导出都是桌面端工作流。',
          items: [
            '本地转录使用已安装模型，不需要 Sona 云端转录账号。',
            '工作区记录、轻量历史转录、摘要、设置和备份由桌面应用管理。',
            '导出的文件会保存到你选择的位置，之后如何分享也由你决定。',
          ],
        },
        {
          eyebrow: '用户选择的数据发送',
          title: '什么时候数据可能离开设备',
          body:
            '有些能力之所以有用，是因为它们会连接到另一个服务。此时数据去向取决于你选择的功能和 provider。',
          items: [
            'LLM 润色、翻译和摘要动作可能会把转录文本发送给你配置的 provider。',
            '模型下载、更新检查和 release 下载会访问相应的托管服务。',
            'WebDAV 云同步会通过你配置的服务器上传或恢复备份归档。',
          ],
        },
        {
          eyebrow: '网站行为',
          title: '这个公开站点会处理什么',
          body:
            'Sona 文档站点与桌面端转录工作流是分开的。它负责提供页面、为下载选项检查 GitHub release 元数据，并可为文档问题启用 AI 助手。',
          items: [
            '下载 UI 会调用 `/api/github-release`，由它从 GitHub 读取公开 release 元数据并返回结构化构建链接。',
            '文档助手启用后，会把你的问题、较短的对话历史、语言和当前指南页上下文发送给 Gemini。',
            '助手路由使用签名匿名防滥用 cookie，并可能在达到使用阈值后显示 Cloudflare Turnstile。',
          ],
        },
        {
          eyebrow: '边界',
          title: '这一页没有声称什么',
          body:
            '这是一份实际产品说明，不是经过律师审阅的隐私政策或合规声明。它反映当前仓库形态，产品行为变化时也应同步更新。',
          items: [
            '它不声称所有第三方 provider 都采用同样的隐私实践。',
            '它不能替代 GitHub、Gemini、Cloudflare、你的 LLM provider 或 WebDAV 服务商各自的政策。',
            '它不会新增 analytics、持久化、追踪或 API 行为。',
          ],
        },
      ],
      closing: {
        title: '想看信任摘要？',
        description:
          '信任页用更高层的方式说明 Sona 的本地优先边界和站点防护。',
        primaryHref: '/zh/trust',
        primaryLabel: '阅读信任说明',
        secondaryHref: '/zh/user-guide',
        secondaryLabel: '打开用户指南',
      },
      footer: {
        license: '基于 MIT 协议开源。',
        privacyHref: '/zh/privacy',
        privacyLabel: '隐私',
        trustHref: '/zh/trust',
        trustLabel: '信任',
      },
      path: '/zh/privacy',
      alternatePath: '/privacy',
    },
  },
};

export function getTrustPrivacyPageContent(
  locale: HomeLocale,
  pageId: TrustPrivacyPageId,
) {
  return trustPrivacyContent[locale][pageId];
}

export function getAllTrustPrivacyPaths() {
  return Object.values(trustPrivacyContent).flatMap((pages) =>
    Object.values(pages).map((page) => page.path),
  );
}
