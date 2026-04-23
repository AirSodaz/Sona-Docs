export type HomeLocale = 'en' | 'zh-CN';
export type DemoAction = 'recorded' | 'polished' | 'translated';
export type UseCaseId =
  | 'meetings'
  | 'lectures'
  | 'subtitle-export'
  | 'subtitle-translation';

interface FeatureContent {
  title: string;
  desc: string;
}

export interface UseCaseItem {
  id: UseCaseId;
  href: string;
  title: string;
  context: string;
  workflow: string;
  result: string;
  tags: string[];
}

export interface UseCasesContent {
  eyebrow: string;
  title: string;
  desc: string;
  labels: {
    context: string;
    workflow: string;
    result: string;
  };
  note: string;
  items: UseCaseItem[];
}

export interface DemoSegment {
  time: string;
  raw: string;
  polished: string;
  translated: string;
}

export interface DemoContent {
  eyebrow: string;
  title: string;
  desc: string;
  appLabel: string;
  fileName: string;
  tabs: {
    live: string;
    batch: string;
    history: string;
  };
  actions: Record<DemoAction, string> & {
    export: string;
  };
  labels: {
    windowStatusRecording: string;
    windowStatusFinished: string;
    localBadge: string;
    recorderPanel: string;
    editorPanel: string;
    waveform: string;
    source: string;
    language: string;
    liveCaption: string;
    helperLocked: string;
    helperReady: string;
    recording: string;
    finished: string;
    segments: string;
  };
  recording: {
    inputSource: string;
    languageValue: string;
    totalSeconds: number;
    finishedDuration: string;
  };
  segments: DemoSegment[];
}

export interface FinalCtaContent {
  eyebrow: string;
  title: string;
  desc: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
  note: string;
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
    workflowLabel: string;
    workflowSteps: string[];
    scrollHint: string;
    btnDownload: string;
    btnDocs: string;
    docsHref: string;
  };
  useCases: UseCasesContent;
  demo: DemoContent;
  features: FeatureContent[];
  finalCta: FinalCtaContent;
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
      desc: 'Sona keeps speech-to-text on your own machine, then lets you review timestamps, clean up wording, translate, and export without leaving the same editor.',
      workflowLabel: 'Workflow',
      workflowSteps: [
        'Record or Import',
        'Review Timestamps',
        'Polish or Translate',
        'Export',
      ],
      scrollHint: 'Scroll for the editor preview',
      btnDownload: 'Download Latest Release',
      btnDocs: 'Read User Guide',
      docsHref: '/user-guide',
    },
    useCases: {
      eyebrow: 'Use Cases',
      title: 'Made for the moments when audio needs to become usable text',
      desc: 'Sona handles local transcription first, then keeps polish, translation, and export in the same working thread instead of sending you across separate tools.',
      labels: {
        context: 'Context',
        workflow: 'Workflow',
        result: 'Result',
      },
      note: 'Local transcription works on-device; polish and translation require a configured LLM provider.',
      items: [
        {
          id: 'meetings',
          href: '/user-guide/live-record',
          title: 'Meeting Notes',
          context:
            'Capture project syncs, interviews, or standups while the room is still talking.',
          workflow:
            'Use Live Record to keep timestamps attached, then run polish for a cleaner internal recap.',
          result:
            'You leave with a shareable draft that still points back to the original audio moments.',
          tags: ['Live Record', 'Timestamps', 'Polish'],
        },
        {
          id: 'lectures',
          href: '/user-guide/edit-and-playback',
          title: 'Lecture Capture',
          context:
            'Record lectures, seminars, or office-hour explanations without losing the structure of the talk.',
          workflow:
            'Transcribe locally, jump back through timestamps, and edit key segments into study-ready notes.',
          result:
            'The transcript stays tied to playback, so review and revision happen in one place.',
          tags: ['Lecture capture', 'Playback sync', 'Study notes'],
        },
        {
          id: 'subtitle-export',
          href: '/user-guide/batch-import',
          title: 'Video Subtitle Export',
          context:
            'Bring in local video or film files when you need subtitles instead of a blank timeline.',
          workflow:
            'Queue them through Batch Import, review the text, then export SRT or VTT once the segments look right.',
          result:
            'You get subtitle files that are ready for handoff, iteration, or platform upload.',
          tags: ['Batch Import', 'SRT / VTT', 'Export'],
        },
        {
          id: 'subtitle-translation',
          href: '/user-guide/ai-polish-and-translate',
          title: 'Subtitle Translation',
          context:
            'Prepare subtitles for bilingual review or international delivery without separating the source text.',
          workflow:
            'Keep the original transcript visible, run Translate, and export translation-only or bilingual output when needed.',
          result:
            'The translated version stays aligned with the source so subtitle comparison is quick and readable.',
          tags: ['Translate', 'Bilingual', 'Side-by-side'],
        },
      ],
    },
    demo: {
      eyebrow: 'Scroll through a live capture',
      title: 'Watch the editor fill before AI steps in.',
      desc: "This mockup follows Sona's real flow: live recording writes timestamped segments first, then polish and translation stay inside the same workspace.",
      appLabel: 'Sona Demo Workspace',
      fileName: 'product-sync-interview.sona',
      tabs: {
        live: 'Live Record',
        batch: 'Batch Import',
        history: 'History',
      },
      actions: {
        recorded: 'Recorded',
        polished: 'AI Polish',
        translated: 'Translate',
        export: 'Export',
      },
      labels: {
        windowStatusRecording: 'Recording',
        windowStatusFinished: 'Recording finished',
        localBadge: '100% local',
        recorderPanel: 'Live Record',
        editorPanel: 'Transcript Editor',
        waveform: 'Waveform',
        source: 'Source',
        language: 'Language',
        liveCaption: 'Live Caption ready',
        helperLocked:
          'Keep scrolling to finish the recording, then inspect Recorded, AI Polish, or Translate.',
        helperReady:
          'Recording finished. Click Recorded, AI Polish, or Translate to inspect the next pass in the same editor.',
        recording: 'Recording',
        finished: 'Finished',
        segments: 'segments',
      },
      recording: {
        inputSource: 'Microphone',
        languageValue: 'English',
        totalSeconds: 78,
        finishedDuration: '01:18',
      },
      segments: [
        {
          time: '00:03',
          raw: 'Let us keep the local recording path for the next release and maybe tighten the onboarding copy after the build settles.',
          polished:
            'Keep the local recording path for the next release, then tighten the onboarding copy once the build is stable.',
          translated:
            '下一版先保留本地录音流程，等构建稳定之后再统一收紧引导文案。',
        },
        {
          time: '00:16',
          raw: 'And I want the timestamps to stay attached so reviewers can jump back to the exact moment in the audio.',
          polished:
            'Keep timestamps attached so reviewers can jump back to the exact moment in the audio while proofreading.',
          translated:
            '时间戳也要继续保留，审阅的人需要能直接回到音频里的对应位置。',
        },
        {
          time: '00:31',
          raw: 'Once the first pass is done, run AI polish so the draft reads cleaner before we share it with the rest of the team.',
          polished:
            'After the first pass, run AI Polish to produce a cleaner draft before sharing it with the rest of the team.',
          translated:
            '初稿出来后先跑一遍 AI Polish，再把更顺的版本发给团队看。',
        },
        {
          time: '00:46',
          raw: 'For external collaborators, generate a Chinese version too, but keep the original English visible right beside it.',
          polished:
            'Generate a Chinese version for external collaborators, but keep the original English visible alongside it.',
          translated:
            '如果要发给外部协作者，再补一份中文版本，但原始英文要继续并排保留。',
        },
        {
          time: '00:59',
          raw: 'That way we can compare wording quickly without splitting the transcript into a separate document.',
          polished:
            'That way the team can compare wording quickly without splitting the transcript into a separate document.',
          translated:
            '这样大家可以直接对照措辞，不必把同一段内容拆成另一份文档。',
        },
        {
          time: '01:14',
          raw: 'If the whole thing stays offline, it still matches the workflow we promised from day one.',
          polished:
            'If the workflow stays offline end to end, it still matches what we promised from day one.',
          translated:
            '只要整条流程继续离线运行，就仍然符合我们一开始承诺的使用体验。',
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
    finalCta: {
      eyebrow: 'Start Here',
      title: 'Download Sona and keep the full transcript workflow in one editor.',
      desc: 'Install the latest release, then record or import audio, review timestamps, polish, translate, and export without breaking the thread.',
      primaryLabel: 'Download Latest Release',
      secondaryLabel: 'Read User Guide',
      secondaryHref: '/user-guide',
      note: 'Windows, macOS, and Linux builds are pulled from the latest GitHub release.',
    },
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
      desc: 'Sona 把语音转文字留在本地机器上完成，再把时间戳整理、润色、翻译和导出接回同一块编辑界面里。',
      workflowLabel: '工作流',
      workflowSteps: ['实时录音/批量导入', '整理时间戳', '润色/翻译', '导出'],
      scrollHint: '向下查看编辑界面',
      btnDownload: '下载最新版本',
      btnDocs: '阅读用户指南',
      docsHref: '/zh/user-guide',
    },
    useCases: {
      eyebrow: '适合这些场景',
      title: '适合这些需要把声音整理成成稿的时刻',
      desc: 'Sona 先把本地转录和整理做好，再把润色、翻译、导出接到同一条工作流里，不用在几套工具之间来回切换。',
      labels: {
        context: '场景',
        workflow: '流程',
        result: '结果',
      },
      note: '离线转录本身不依赖云服务；润色与翻译需要先配置 LLM provider。',
      items: [
        {
          id: 'meetings',
          href: '/zh/user-guide/live-record',
          title: '会议记录',
          context:
            '记录项目例会、访谈或同步会时，希望边说边留下一份可回看的文本。',
          workflow:
            '用 Live Record 实时转录，保留时间戳，再在结束后继续润色成更适合流转的纪要。',
          result:
            '最后得到一份可分享的会议稿，同时还能回到原始音频对应位置继续核对。',
          tags: ['实时录音', '时间戳', '会议纪要'],
        },
        {
          id: 'lectures',
          href: '/zh/user-guide/edit-and-playback',
          title: '课堂记录',
          context:
            '上课、讲座或讨论课内容较长，需要先完整记下，再回看重点段落。',
          workflow:
            '先做本地转录，再根据时间戳回看关键位置，把内容整理成复习笔记。',
          result:
            '转录、播放和编辑保持在同一个界面里，后续复盘不会被拆散。',
          tags: ['课堂录制', '回看定位', '复习笔记'],
        },
        {
          id: 'subtitle-export',
          href: '/zh/user-guide/batch-import',
          title: '视频/影片字幕导出',
          context:
            '手头已经有本地视频或影片素材，需要尽快整理出可交付的字幕文件。',
          workflow:
            '通过 Batch Import 批量导入并转录，检查文本后直接导出 SRT 或 VTT。',
          result:
            '拿到可继续校对、上传或交付的字幕文件，而不是停在一份原始文本上。',
          tags: ['批量导入', 'SRT / VTT', '字幕导出'],
        },
        {
          id: 'subtitle-translation',
          href: '/zh/user-guide/ai-polish-and-translate',
          title: '字幕翻译',
          context:
            '需要在保留原文的前提下生成译文，方便双语审阅或海外发布。',
          workflow:
            '在同一份转录上运行 Translate，让译文跟随原文分段显示，并按需导出翻译或双语版本。',
          result:
            '译文与源文本保持对照关系，做术语校对或版本确认会更快。',
          tags: ['字幕翻译', '双语对照', '导出'],
        },
      ],
    },
    demo: {
      eyebrow: '跟着滚动看实时出字',
      title: '先看录音落进编辑器，再看 AI 接手。',
      desc: '这个展示型 mockup 按照 Sona 的真实顺序来走：先实时录音出字，停录后再在同一块编辑器里查看润色和翻译。',
      appLabel: 'Sona 演示工作区',
      fileName: '产品同步访谈.sona',
      tabs: {
        live: '实时录音',
        batch: '批量导入',
        history: '历史记录',
      },
      actions: {
        recorded: '录音结果',
        polished: '润色',
        translated: '翻译',
        export: '导出',
      },
      labels: {
        windowStatusRecording: '录音中',
        windowStatusFinished: '录音已完成',
        localBadge: '全程离线',
        recorderPanel: '实时录音',
        editorPanel: '转录编辑器',
        waveform: '波形',
        source: '输入源',
        language: '语言',
        liveCaption: 'Live Caption 已就绪',
        helperLocked: '继续下拉让录音跑完，结束后就能点开“录音结果 / 润色 / 翻译”。',
        helperReady: '录音结束了。现在可以点“录音结果 / 润色 / 翻译”，看同一份内容如何继续往下走。',
        recording: '录音中',
        finished: '已完成',
        segments: '段',
      },
      recording: {
        inputSource: '麦克风',
        languageValue: '中文',
        totalSeconds: 78,
        finishedDuration: '01:18',
      },
      segments: [
        {
          time: '00:03',
          raw: '下一版先保留本地录音流程，等构建稳定之后再统一调整引导文案。',
          polished:
            '下一版本继续保留本地录音流程，待构建稳定后再统一优化引导文案。',
          translated:
            'Keep the local recording workflow for the next release, then revisit the onboarding copy once the build is stable.',
        },
        {
          time: '00:16',
          raw: '转录里的时间戳也别去掉，审阅的人需要能直接回到音频里的对应位置。',
          polished:
            '转录文本应继续保留时间戳，方便审阅者在校对时快速定位回原始音频。',
          translated:
            'Timestamps should stay attached so reviewers can jump back to the matching point in the audio.',
        },
        {
          time: '00:31',
          raw: '初稿出来后先做一遍润色，把语气和标点整理顺一点，再发给团队看。',
          polished:
            '初稿生成后，可先执行一次润色，统一语气、断句与标点，再发给团队审阅。',
          translated:
            'Once the first draft is ready, run a polish pass to smooth tone and punctuation before sharing it with the team.',
        },
        {
          time: '00:46',
          raw: '如果要发给海外同事，再补一份英文翻译，但原始中文要一直留在旁边。',
          polished:
            '若需要面向海外同事共享，则补充英文译文，同时保留原始中文内容。',
          translated:
            'If overseas colleagues need it, add an English translation too, while keeping the original Chinese visible.',
        },
        {
          time: '00:59',
          raw: '这样大家可以直接对照措辞，不用把同一段内容拆成两份文件来回切换。',
          polished:
            '这样各方可以直接对照措辞，不必把同一段内容拆成两份文件来回切换。',
          translated:
            'That way everyone can compare wording directly without splitting the same passage into two separate files.',
        },
        {
          time: '01:14',
          raw: '只要整个流程继续离线运行，就符合我们一开始承诺的使用体验。',
          polished:
            '只要整条流程继续离线运行，就仍然符合我们最初承诺的使用体验。',
          translated:
            'As long as the whole workflow stays offline, it still matches the experience we promised from day one.',
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
    finalCta: {
      eyebrow: '从这里开始',
      title: '下载 Sona，把整条转录工作流留在同一块编辑器里。',
      desc: '安装后就能开始实时录音或批量导入，继续整理时间戳、润色、翻译，并按需导出。',
      primaryLabel: '下载最新版本',
      secondaryLabel: '阅读用户指南',
      secondaryHref: '/zh/user-guide',
      note: 'Windows、macOS 和 Linux 构建均来自最新 GitHub Release。',
    },
    footer: {
      license: '基于 MIT 协议开源。',
      repo: 'GitHub 仓库',
      issue: '报告问题',
    },
  },
};
