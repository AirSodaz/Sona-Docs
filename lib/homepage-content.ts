export type HomeLocale = 'en' | 'zh-CN';
export type DemoAction = 'recorded' | 'polished' | 'translated';

interface FeatureContent {
  title: string;
  desc: string;
}

export interface DemoSegment {
  time: string;
  text: string;
}

export interface DemoPanelContent {
  badge: string;
  title: string;
  paragraphs: string[];
  note: string;
  highlights: string[];
}

export interface DemoContent {
  eyebrow: string;
  title: string;
  desc: string;
  appLabel: string;
  fileName: string;
  status: string;
  duration: string;
  localBadge: string;
  transcriptLabel: string;
  transcriptHint: string;
  controls: Record<DemoAction, string>;
  panels: Record<DemoAction, DemoPanelContent>;
  segments: DemoSegment[];
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
  demo: DemoContent;
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
    demo: {
      eyebrow: 'From recording to a usable draft',
      title: 'Preview the workflow after the mic goes quiet.',
      desc: 'This faux editor keeps the timestamped transcript in view, then lets you switch to AI polish or translation with a single tap.',
      appLabel: 'Sona Demo Editor',
      fileName: 'Product-sync-interview.sona',
      status: 'Recording finished',
      duration: '24:18',
      localBadge: '100% local',
      transcriptLabel: 'Timestamped transcript',
      transcriptHint:
        'Review the raw capture against the original timing before you clean up wording or prepare a translated draft.',
      controls: {
        recorded: 'Recorded',
        polished: 'AI Polish',
        translated: 'Translate',
      },
      panels: {
        recorded: {
          badge: 'Ready to refine',
          title: 'The first pass stays grounded in the original recording.',
          paragraphs: [
            'Keep the local recording path for the next release, then tighten the onboarding copy once the build is stable. The transcript should keep its timestamps so reviewers can jump back to the exact audio moment while proofreading.',
            'After the first pass, prepare a cleaner draft for the team and a translated version for external collaborators. The original wording should remain visible for side-by-side comparison.',
          ],
          note: 'Sona keeps the source transcript readable first, so every later pass still has a clear anchor.',
          highlights: ['6 timestamped segments', 'Punctuation restored', 'Offline workflow'],
        },
        polished: {
          badge: 'AI Polish',
          title: 'A cleaner version for sharing internally.',
          paragraphs: [
            'For the next release, keep the local recording workflow in place and revise the onboarding copy once the build is stable. Preserve timestamps in the transcript so reviewers can return to the exact moment in the audio during proofreading.',
            'After the initial pass, generate a polished draft for internal sharing and a Chinese translation for external collaborators. The original English transcript should remain visible so teams can compare wording without splitting the conversation into separate documents.',
          ],
          note: 'The polish pass smooths filler words and sentence flow without changing the order of ideas.',
          highlights: ['Fewer filler words', 'Calmer sentence flow', 'Shareable draft'],
        },
        translated: {
          badge: 'Translate',
          title: 'A translated draft that still tracks the source.',
          paragraphs: [
            '下一个版本继续保留本地录音流程，并在构建稳定后再统一整理引导文案。同时，转录内容需要保留时间戳，方便审阅者在校对时快速回到音频中的具体位置。',
            '初稿完成后，可以先生成一份更顺滑的润色版本，供内部沟通使用；面向外部协作者时，再补充中文译文。原始英文转录应继续保留在旁侧，便于团队直接对照措辞，而不必拆成另一份文档。',
          ],
          note: 'Translation becomes an adjacent step, not a second workflow outside the editor.',
          highlights: ['English -> Chinese', 'Original stays visible', 'Readable phrasing'],
        },
      },
      segments: [
        {
          time: '00:02',
          text: 'Alright, let us keep the local recording path for the next release and clean up the onboarding copy after the build stabilizes.',
        },
        {
          time: '00:18',
          text: 'I also want the timestamps to stay attached to the transcript so reviewers can jump back to the exact moment in the audio.',
        },
        {
          time: '00:34',
          text: 'Once the first pass is done, run AI polish for a cleaner draft before we share it with the rest of the team.',
        },
        {
          time: '00:47',
          text: 'For external collaborators, generate a Chinese version too, but keep the original English visible on the side.',
        },
        {
          time: '01:02',
          text: 'That way we can compare wording quickly without turning the transcript into a separate document.',
        },
        {
          time: '01:18',
          text: 'If this all stays offline, it will fit the workflow we promised from day one.',
        },
      ],
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
    demo: {
      eyebrow: '录音结束后的整理界面',
      title: '看一眼转录落地后的完整演示。',
      desc: '这个轻量伪编辑器展示录音结束后的处理方式：时间戳原文始终保留，润色与翻译只需一次点击。',
      appLabel: 'Sona 演示编辑器',
      fileName: '产品同步访谈.sona',
      status: '录音已完成',
      duration: '24:18',
      localBadge: '全程离线',
      transcriptLabel: '带时间戳的转录原文',
      transcriptHint: '先对照原始时间轴检查内容，再继续润色或生成译文，整个过程都留在同一块编辑区域里。',
      controls: {
        recorded: '录音结果',
        polished: '润色',
        translated: '翻译',
      },
      panels: {
        recorded: {
          badge: '可继续整理',
          title: '第一轮转录先忠实贴住原始录音。',
          paragraphs: [
            '下一版先保留本地录音流程，等构建稳定之后再统一调整引导文案。转录里的时间戳也不要去掉，审阅的人需要能直接回到音频中的对应位置。',
            '初稿出来后，可以继续生成更顺滑的润色版本，或者补充英文翻译给海外同事查看；但原始中文内容要一直留在旁边，方便大家随时对照措辞。',
          ],
          note: 'Sona 会先把原始转录整理成可读状态，再把后续处理叠加到同一份内容之上。',
          highlights: ['6 段时间戳', '标点已恢复', '离线处理'],
        },
        polished: {
          badge: '润色',
          title: '适合继续分享和流转的整洁版本。',
          paragraphs: [
            '下一版本继续保留本地录音流程，待构建稳定后再统一优化引导文案。转录文本应保留时间戳，方便审阅者在校对时快速定位回原始音频。',
            '初稿生成后，可先执行一次润色，统一语气、断句与标点，再发给团队审阅。若需要面向海外同事共享，则补充英文译文，同时保留原始中文内容，便于各方直接对照措辞。',
          ],
          note: '润色主要负责收紧语气、断句和标点，让草稿更接近可直接发送的版本。',
          highlights: ['去掉口头填充', '句子更顺', '适合分享'],
        },
        translated: {
          badge: '翻译',
          title: '保留上下文感的英文译文。',
          paragraphs: [
            'For the next release, keep the local recording workflow as it is and revisit the onboarding copy after the build stabilizes. Timestamps should remain in the transcript so reviewers can jump back to the matching point in the audio while proofreading.',
            'Once the first draft is ready, run a polish pass to smooth the tone, sentence breaks, and punctuation before sharing it with the team. If overseas colleagues need it, generate an English translation as well, while keeping the original Chinese visible for side-by-side comparison.',
          ],
          note: '翻译结果紧贴原文语义，方便双语协作时快速比对，而不用跳出当前编辑界面。',
          highlights: ['中文 -> English', '原文始终可见', '术语更稳定'],
        },
      },
      segments: [
        {
          time: '00:03',
          text: '下一版先保留本地录音流程，等构建稳定之后再统一调整引导文案。',
        },
        {
          time: '00:16',
          text: '转录里的时间戳也别去掉，审阅的人需要能直接回到音频里的对应位置。',
        },
        {
          time: '00:31',
          text: '初稿出来后先做一遍润色，把语气和标点整理顺一点，再发给团队看。',
        },
        {
          time: '00:46',
          text: '如果要发给海外同事，再补一份英文翻译，但原始中文要一直留在旁边。',
        },
        {
          time: '00:59',
          text: '这样大家可以直接对照措辞，不用把同一段内容拆成两份文件来回切换。',
        },
        {
          time: '01:14',
          text: '只要整个流程继续离线运行，就符合我们一开始承诺的使用体验。',
        },
      ],
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
