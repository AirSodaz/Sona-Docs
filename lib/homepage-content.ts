export type HomeLocale = 'en' | 'zh-CN';

interface FeatureContent {
  title: string;
  desc: string;
}

export interface HomePageContent {
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    github: string;
    languageToggleHref: string;
    languageToggleLabel: string;
    languageToggleShortLabel: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    desc: string;
    btnDownload: string;
    btnDocs: string;
    docsHref: string;
  };
  features: FeatureContent[];
  footer: {
    license: string;
    repo: string;
    issue: string;
  };
}

export const homePageContent: Record<HomeLocale, HomePageContent> = {
  en: {
    metadata: {
      title: 'Sona | Offline Transcript Editor',
      description:
        'Powerful, offline transcript editor built with Tauri and Sherpa-onnx. Fast, accurate, and private speech-to-text.',
    },
    nav: {
      github: 'GitHub',
      languageToggleHref: '/zh',
      languageToggleLabel: '中文',
      languageToggleShortLabel: '中',
    },
    hero: {
      badge: 'Fast, accurate, private.',
      title1: 'Transcription tools',
      title2: 'for the quiet spaces.',
      desc: 'Sona is an offline transcript editor built with Tauri and Sherpa-onnx. It brings powerful speech-to-text directly to your local machine. No cloud, no subscriptions, just your words.',
      btnDownload: 'Download Latest Release',
      btnDocs: 'Read User Guide',
      docsHref: 'https://github.com/AirSodaz/sona/blob/master/docs/user-guide.md',
    },
    features: [
      {
        title: 'Locally Processed',
        desc: 'Complete privacy. Everything runs entirely on your local hardware using Sherpa-onnx, avoiding internet bounds and data leaks.',
      },
      {
        title: 'LLM Assistant',
        desc: 'Built-in capabilities with local Large Language Models to automatically polish, summarize, and translate your transcripts.',
      },
      {
        title: 'High Accuracy',
        desc: 'Achieves commercial-grade speech recognition tailored for long audio files with intelligent phrasing.',
      },
      {
        title: 'Transcript Editor',
        desc: 'Rich, interactive editor built with React to easily tweak generated text, align timestamps, and refine your audio.',
      },
    ],
    footer: {
      license: 'Open sourced under MIT License.',
      repo: 'GitHub Repository',
      issue: 'Report Issue',
    },
  },
  'zh-CN': {
    metadata: {
      title: 'Sona | 离线转录编辑器',
      description:
        '基于 Tauri 和 Sherpa-onnx 构建的离线转录编辑器，提供快速、准确、注重隐私的本地语音转文字体验。',
    },
    nav: {
      github: 'GitHub',
      languageToggleHref: '/',
      languageToggleLabel: 'English',
      languageToggleShortLabel: 'EN',
    },
    hero: {
      badge: '快速 · 准确 · 隐私',
      title1: '静谧空间的',
      title2: '转写工具。',
      desc: 'Sona 是一款基于 Tauri 和 Sherpa-onnx 构建的离线富文本转录编辑器。让强大的语音识别能力回归本地机器。没有云端，没有订阅，只有你的文字。',
      btnDownload: '下载最新版本',
      btnDocs: '阅读用户指南',
      docsHref: 'https://github.com/AirSodaz/sona/blob/master/docs/user-guide.zh-CN.md',
    },
    features: [
      {
        title: '完全本土运行',
        desc: '绝对的隐私安全。所有处理均在你的本地硬件上使用 Sherpa-onnx 完成，无需联网，远离数据泄露的担忧。',
      },
      {
        title: '内置大模型智能助手',
        desc: '内置本地大语言模型支持。无需离开应用，即可自动优化语句、生成摘要，或是翻译转录内容。',
      },
      {
        title: '极高准确率',
        desc: '提供商业级别的语音识别体验，通过智能断句技术，专为超长音频的精确转写而调优。',
      },
      {
        title: '精巧的富文本编辑器',
        desc: '基于 React 的沉浸式富文本编辑器，允许你轻松调整生成的文字、校准时间戳，让校对变得顺滑。',
      },
    ],
    footer: {
      license: '基于 MIT 协议开源。',
      repo: 'GitHub 仓库',
      issue: '报告问题',
    },
  },
};
