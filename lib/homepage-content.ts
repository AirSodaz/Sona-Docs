export type HomeLocale = 'en' | 'zh-CN' | 'zh-TW' | 'ja';
export type DemoStageId = 'live' | 'refined';
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
  live: string;
  refined: string;
  translation?: string;
}

export interface DemoStage {
  id: DemoStageId;
  button: string;
  eyebrow: string;
  title: string;
  desc: string;
  status: string;
}

interface DemoActions {
  rename: string;
  summary: string;
  speakerReview: string;
  versions: string;
  polish: string;
  translate: string;
  export: string;
  close: string;
}

interface DemoSegmentActions {
  edit: string;
  merge: string;
  delete: string;
}

interface DemoPlayerContent {
  play: string;
  speed: string;
  volume: string;
}

interface DemoShellContent {
  modes: {
    live: string;
    batch: string;
    projects: string;
  };
  headerActions: {
    notifications: string;
    settings: string;
  };
  live: {
    inputSource: string;
    microphone: string;
    timer: string;
    pause: string;
    stop: string;
    recordingActive: string;
  };
  editor: {
    toolbarUndo: string;
    toolbarRedo: string;
    toolbarBold: string;
    toolbarItalic: string;
    toolbarUnderline: string;
    toolbarSplit: string;
    autosaved: string;
    wordCount: string;
    speaker: string;
  };
}

export interface DemoContent {
  eyebrow: string;
  title: string;
  desc: string;
  appName: string;
  stageLabel: string;
  workflowSteps: string[];
  fileName: string;
  translationLabel: string;
  inputTitle: string;
  actions: DemoActions;
  segmentActions: DemoSegmentActions;
  player: DemoPlayerContent;
  shell: DemoShellContent;
  stages: DemoStage[];
  recording: {
    liveDuration: string;
    finalDuration: string;
    liveCurrentTime: string;
    finalCurrentTime: string;
    liveProgress: number;
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
    privacy: string;
    privacyHref: string;
    license: string;
    repo: string;
    trust: string;
    trustHref: string;
    issue: string;
  };
}

export const homePageContent = {
  en: {
    metadata: {
      title: 'Sona | Offline Transcript Editor',
      description:
        'Powerful, offline transcript editor built with Tauri and Sherpa-onnx. Fast, accurate, and private speech-to-text.',
    },
    nav: {
      github: 'GitHub',
      languageToggleHref: '/',
      languageToggleLabel: '简体中文',
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
      eyebrow: 'Product Preview',
      title: 'One editor from first words to final text.',
      desc: 'Sona keeps the capture, timestamps, polish, translation, and export path inside one working surface.',
      appName: 'Sona',
      stageLabel: 'Stage',
      workflowSteps: ['Record', 'Edit', 'Polish / Translate', 'Export'],
      fileName: 'demo-session.sona',
      translationLabel: 'Translation',
      inputTitle: 'Live Record',
      actions: {
        rename: 'Rename',
        summary: 'Summary',
        speakerReview: 'Speaker Review',
        versions: 'Versions',
        polish: 'Polish',
        translate: 'Translate',
        export: 'Export',
        close: 'Close',
      },
      segmentActions: {
        edit: 'Edit segment',
        merge: 'Merge with next segment',
        delete: 'Delete segment',
      },
      player: {
        play: 'Play',
        speed: 'Playback speed',
        volume: 'Volume',
      },
      shell: {
        modes: {
          live: 'Live Record',
          batch: 'Batch Import',
          projects: 'Workspace',
        },
        headerActions: {
          notifications: 'Notifications',
          settings: 'Settings',
        },
        live: {
          inputSource: 'Input source',
          microphone: 'Microphone',
          timer: '00:00:54',
          pause: 'Pause',
          stop: 'Stop',
          recordingActive: 'Recording active',
        },
        editor: {
          toolbarUndo: 'Undo',
          toolbarRedo: 'Redo',
          toolbarBold: 'Bold',
          toolbarItalic: 'Italic',
          toolbarUnderline: 'Underline',
          toolbarSplit: 'Split segment',
          autosaved: 'Saved',
          wordCount: '89 words',
          speaker: 'Speaker 1',
        },
      },
      stages: [
        {
          id: 'live',
          button: 'Live Capture',
          eyebrow: 'Stage 01',
          title: 'Words land while the conversation is still moving.',
          desc: 'The transcript arrives first, with timing intact and almost no chrome between the audio and the page.',
          status: 'Capturing locally',
        },
        {
          id: 'refined',
          button: 'Refined Text',
          eyebrow: 'Stage 02',
          title: 'Clean wording appears without splitting the thread.',
          desc: 'Once the capture is there, polish and translation stay attached to the same transcript instead of becoming a second document.',
          status: 'Text polished',
        },
      ],
      recording: {
        liveDuration: '00:54',
        finalDuration: '01:18',
        liveCurrentTime: '00:37',
        finalCurrentTime: '01:18',
        liveProgress: 68,
      },
      segments: [
        {
          time: '00:03',
          live: 'Let us keep the local recording path for the next release and tighten the onboarding copy once the build settles.',
          refined:
            'Keep the local recording path for the next release, then tighten the onboarding copy once the build is stable.',
        },
        {
          time: '00:18',
          live: 'And keep the timestamps attached so reviewers can jump back to the exact moment in the audio.',
          refined:
            'Keep timestamps attached so reviewers can jump back to the exact moment in the audio while proofreading.',
        },
        {
          time: '00:34',
          live: 'Once the first pass is done, run AI polish so the draft reads cleaner before the team sees it.',
          refined:
            'After the first pass, run AI Polish to produce a cleaner draft before the rest of the team reviews it.',
        },
        {
          time: '00:49',
          live: 'For external collaborators, generate a Chinese version too, but keep the original English visible beside it.',
          refined:
            'Generate a Chinese version for external collaborators, while keeping the original English visible alongside it.',
          translation:
            '如果要发给外部协作者，再补一份中文版本，但原始英文要继续并排保留。',
        },
        {
          time: '01:06',
          live: 'That way we can compare wording quickly without splitting the transcript into a separate document.',
          refined:
            'That way the team can compare wording quickly without splitting the transcript into a separate document.',
        },
      ],
    },
    features: [
      {
        title: 'Locally Processed',
        desc: 'Local-first by default. Transcription runs on your hardware with Sherpa-onnx; optional downloads, updates, sync, and provider-backed AI actions connect only when you choose them.',
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
      privacy: 'Privacy',
      privacyHref: '/privacy',
      repo: 'GitHub Repository',
      trust: 'Trust',
      trustHref: '/trust',
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
      docsHref: '/user-guide',
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
          href: '/user-guide/live-record',
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
          href: '/user-guide/edit-and-playback',
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
          href: '/user-guide/batch-import',
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
          href: '/user-guide/ai-polish-and-translate',
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
      eyebrow: '产品预览',
      title: '从实时出字到成稿，都留在同一块编辑器里。',
      desc: 'Sona 把转录、时间戳、润色、翻译和导出路径收进同一个工作界面。',
      appName: 'Sona',
      stageLabel: '阶段',
      workflowSteps: ['录音', '整理', '润色 / 翻译', '导出'],
      fileName: '演示会话.sona',
      translationLabel: '译文',
      inputTitle: '实时录音',
      actions: {
        rename: '重命名',
        summary: '摘要',
        speakerReview: '说话人校正',
        versions: '版本',
        polish: '润色',
        translate: '翻译',
        export: '导出',
        close: '关闭',
      },
      segmentActions: {
        edit: '编辑分段',
        merge: '合并下一段',
        delete: '删除分段',
      },
      player: {
        play: '播放',
        speed: '播放速度',
        volume: '音量',
      },
      shell: {
        modes: {
          live: '实时录音',
          batch: '批量导入',
          projects: '工作区',
        },
        headerActions: {
          notifications: '通知',
          settings: '设置',
        },
        live: {
          inputSource: '输入来源',
          microphone: '麦克风',
          timer: '00:00:54',
          pause: '暂停',
          stop: '停止',
          recordingActive: '录音进行中',
        },
        editor: {
          toolbarUndo: '撤销',
          toolbarRedo: '重做',
          toolbarBold: '加粗',
          toolbarItalic: '斜体',
          toolbarUnderline: '下划线',
          toolbarSplit: '拆分分段',
          autosaved: '已保存',
          wordCount: '89 字',
          speaker: '说话人 1',
        },
      },
      stages: [
        {
          id: 'live',
          button: '实时出字',
          eyebrow: '阶段 01',
          title: '先让内容落进编辑器，再决定怎么整理。',
          desc: '最先出现的是带时间的转录正文，界面本身尽量退后，不把注意力抢走。',
          status: '本地转录进行中',
        },
        {
          id: 'refined',
          button: '整理后',
          eyebrow: '阶段 02',
          title: '文字变顺了，但仍然留在同一份稿子里。',
          desc: '录音结束之后，再继续润色和翻译；原文、时间点和译文仍然挂在同一条阅读线上。',
          status: '文本已整理',
        },
      ],
      recording: {
        liveDuration: '00:54',
        finalDuration: '01:18',
        liveCurrentTime: '00:37',
        finalCurrentTime: '01:18',
        liveProgress: 68,
      },
      segments: [
        {
          time: '00:03',
          live: '下一版先保留本地录音流程，等构建稳定之后再统一调整引导文案。',
          refined:
            '下一版本继续保留本地录音流程，待构建稳定后再统一优化引导文案。',
        },
        {
          time: '00:18',
          live: '转录里的时间戳也别去掉，审阅的人需要能直接回到音频里的对应位置。',
          refined:
            '转录文本应继续保留时间戳，方便审阅者在校对时快速定位回原始音频。',
        },
        {
          time: '00:34',
          live: '初稿出来后先做一遍润色，把语气和标点整理顺一点，再发给团队看。',
          refined:
            '初稿生成后，可先执行一次润色，统一语气、断句与标点，再发给团队审阅。',
        },
        {
          time: '00:49',
          live: '如果要发给海外同事，再补一份英文翻译，但原始中文要一直留在旁边。',
          refined:
            '若需要面向海外同事共享，则补充英文译文，同时保留原始中文内容。',
          translation:
            'If overseas colleagues need it, add an English translation too, while keeping the original Chinese visible.',
        },
        {
          time: '01:06',
          live: '这样大家可以直接对照措辞，不用把同一段内容拆成两份文件来回切换。',
          refined:
            '这样各方可以直接对照措辞，不必把同一段内容拆成两份文件来回切换。',
        },
      ],
    },
    features: [
      {
        title: '本地优先处理',
        desc: '默认先在本地完成转录。Sona 使用 Sherpa-onnx 在你的设备上处理音频；模型下载、更新、同步和 provider 支持的 AI 动作只在你选择时联网。',
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
      desc: '安装后就能开始实时录音 or 批量导入，继续整理时间戳、润色、翻译，并按需导出。',
      primaryLabel: '下载最新版本',
      secondaryLabel: '阅读用户指南',
      secondaryHref: '/user-guide',
      note: 'Windows、macOS 和 Linux 构建均来自最新 GitHub Release。',
    },
    footer: {
      license: '基于 MIT 协议开源。',
      privacy: '隐私',
      privacyHref: '/privacy',
      repo: 'GitHub 仓库',
      trust: '信任',
      trustHref: '/trust',
      issue: '报告问题',
    },
  },
} as any as Record<HomeLocale, HomePageContent>;

homePageContent['zh-TW'] = {
  metadata: {
    title: 'Sona | 離線轉錄編輯器',
    description:
      '基於 Tauri 和 Sherpa-onnx 建構的離線轉錄編輯器，提供快速、準確、注重隱私的本機語音轉文字體驗。',
  },
  nav: {
    github: 'GitHub',
    languageToggleHref: '/',
    languageToggleLabel: 'English',
    languageToggleShortLabel: 'EN',
  },
  hero: {
    badge: '快速 · 準確 · 隱私',
    title1: '靜謐空間的',
    title2: '轉錄工具。',
    desc: 'Sona 把語音轉文字留在本機電腦上完成，再把時間戳記整理、潤飾、翻譯和匯出接回同一塊編輯介面裡。',
    workflowLabel: '工作流程',
    workflowSteps: ['即時錄音/批次匯入', '整理時間戳記', '潤飾/翻譯', '匯出'],
    scrollHint: '向下查看編輯介面',
    btnDownload: '下載最新版本',
    btnDocs: '閱讀使用者指南',
    docsHref: '/user-guide',
  },
  useCases: {
    eyebrow: '適合這些場景',
    title: '適合這些需要把聲音整理成稿的時刻',
    desc: 'Sona 先把本機轉錄和整理做好，再把潤飾、翻譯、匯出接到同一條工作流程裡，不用在幾套工具之間來回切換。',
    labels: {
      context: '場景',
      workflow: '流程',
      result: '結果',
    },
    note: '離線轉錄本身不依賴雲端服務；潤飾與翻譯需要先設定 LLM provider。',
    items: [
      {
        id: 'meetings',
        href: '/user-guide/live-record',
        title: '會議記錄',
        context:
          '記錄專案常會、訪談或同步會時，希望邊說邊留下一份可回看的文字。',
        workflow:
          '用 Live Record 即時轉錄，保留時間戳記，再在結束後繼續潤飾成更適合傳閱的紀要。',
        result:
          '最後得到一份可分享的會議稿，同時還能回到原始音訊對應位置繼續核對。',
        tags: ['即時錄音', '時間戳記', '會議紀要'],
      },
      {
        id: 'lectures',
        href: '/user-guide/edit-and-playback',
        title: '課堂記錄',
        context:
          '上課、講座或討論課內容較長，需要先完整記下，再回看重點段落。',
        workflow:
          '先做本機轉錄，再根據時間戳記回看關鍵位置，把內容整理成複習筆記。',
        result:
          '轉錄、播放和編輯保持在同一個介面裡，後續複盤不會被拆散。',
        tags: ['課堂錄製', '回看定位', '複習筆記'],
      },
      {
        id: 'subtitle-export',
        href: '/user-guide/batch-import',
        title: '影片字幕匯出',
        context:
          '手頭已經有本機影片素材，需要儘快整理出可交付的字幕檔案。',
        workflow:
          '透過 Batch Import 批次匯入並轉錄，檢查文字後直接匯出 SRT 或 VTT。',
        result:
          '拿到可繼續校對、上傳或交付的字幕檔案，而不是停在一份原始文字上。',
        tags: ['批次匯入', 'SRT / VTT', '字幕匯出'],
      },
      {
        id: 'subtitle-translation',
        href: '/user-guide/ai-polish-and-translate',
        title: '字幕翻譯',
        context:
          '需要在保留原文的前提下生成譯文，方便雙語審閱或海外發布。',
        workflow:
          '在同一份轉錄上執行 Translate，讓譯文跟隨原文分段顯示，並視需要匯出翻譯或雙語版本。',
        result:
          '譯文與源文字保持對照關係，做術語校對或版本確認會更快。',
        tags: ['字幕翻譯', '雙語對照', '匯出'],
      },
    ],
  },
  demo: {
    eyebrow: '產品預覽',
    title: '從即時出字到成稿，都留在同一塊編輯器裡。',
    desc: 'Sona 把轉錄、時間戳記、潤飾、翻譯和匯出路徑收進同一個工作介面。',
    appName: 'Sona',
    stageLabel: '階段',
    workflowSteps: ['錄音', '整理', '潤飾 / 翻譯', '匯出'],
    fileName: '展示會話.sona',
    translationLabel: '譯文',
    inputTitle: '即時錄音',
    actions: {
      rename: '重新命名',
      summary: '摘要',
      speakerReview: '說話者校正',
      versions: '版本',
      polish: '潤飾',
      translate: '翻譯',
      export: '匯出',
      close: '關閉',
    },
    segmentActions: {
      edit: '編輯分段',
      merge: '合併下一段',
      delete: '刪除分段',
    },
    player: {
      play: '播放',
      speed: '播放速度',
      volume: '音量',
    },
    shell: {
      modes: {
        live: '即時錄音',
        batch: '批次匯入',
        projects: '工作區',
      },
      headerActions: {
        notifications: '通知',
        settings: '設定',
      },
      live: {
        inputSource: '輸入來源',
        microphone: '麥克風',
        timer: '00:00:54',
        pause: '暫停',
        stop: '停止',
        recordingActive: '錄音進行中',
      },
      editor: {
        toolbarUndo: '復原',
        toolbarRedo: '重做',
        toolbarBold: '粗體',
        toolbarItalic: '斜體',
        toolbarUnderline: '底線',
        toolbarSplit: '拆分分段',
        autosaved: '已儲存',
        wordCount: '89 字',
        speaker: '說話者 1',
      },
    },
    stages: [
      {
        id: 'live',
        button: '即時出字',
        eyebrow: '階段 01',
        title: '先讓內容落進編輯器，再決定怎麼整理。',
        desc: '最先出現的是帶時間的轉錄正文，介面本身儘量退後，不把注意力搶走。',
        status: '本機轉錄進行中',
      },
      {
        id: 'refined',
        button: '整理後',
        eyebrow: '階段 02',
        title: '文字變順了，但仍然留在同一份稿子裡。',
        desc: '錄音結束之後，再繼續潤飾和翻譯；原文、時間點與譯文仍然掛在同一條閱讀線上。',
        status: '文字已整理',
      },
    ],
    recording: {
      liveDuration: '00:54',
      finalDuration: '01:18',
      liveCurrentTime: '00:37',
      finalCurrentTime: '01:18',
      liveProgress: 68,
    },
    segments: [
      {
        time: '00:03',
        live: '下一版先保留本機錄音流程，等建構穩定之後再統一調整引導文案。',
        refined:
          '下一版本繼續保留本機錄音流程，待建構穩定後再統一優化引導文案。',
      },
      {
        time: '00:18',
        live: '轉錄裡的時間戳記也別去掉，審閱的人需要能直接回到音訊裡的對應位置。',
        refined:
          '轉錄文字應繼續保留時間戳記，方便審閱者在校對時快速定位回原始音訊。',
      },
      {
        time: '00:34',
        live: '初稿出來後先做一遍潤飾，把語氣和標點整理順一點，再發給團隊看。',
        refined:
          '初稿生成後，可先執行一次潤飾，統一語氣、斷句與標點，再發給團隊審閱。',
      },
      {
        time: '00:49',
        live: '如果要發給海外同事，再補一份英文翻譯，但原始中文要一直留在旁邊。',
        refined:
          '若需要面向海外同事共享，則補充英文譯文，同時保留原始中文內容。',
        translation:
          'If overseas colleagues need it, add an English translation too, while keeping the original Chinese visible.',
      },
      {
        time: '01:06',
        live: '這樣大家可以直接對照措辭，不用把同一段內容拆成兩份檔案來回切換。',
        refined:
          '這樣各方可以直接對照措辭，不必把同一段內容拆成兩份檔案來回切換。',
      },
    ],
  },
  features: [
    {
      title: '本機優先處理',
      desc: '預設先在本機完成轉錄。Sona 使用 Sherpa-onnx 在您的裝置上處理音訊；模型下載、更新、同步和 provider 支援的 AI 動作只在您選擇時連網。',
    },
    {
      title: '內建大模型智慧助手',
      desc: '內建本機大語言模型支援。無需離開應用程式，即可自動優化語句、生成摘要，或是翻譯轉錄內容。',
    },
    {
      title: '極高準確率',
      desc: '提供商業級的語音辨識體驗，透過智慧斷句技術，專為超長音訊的精確轉錄而調校。',
    },
    {
      title: '精巧的富文字編輯器',
      desc: '基於 React 的沉浸式富文字編輯器，允許您輕鬆調整生成的文字、校正時間戳記，讓校對變得順滑。',
    },
  ],
  finalCta: {
    eyebrow: '從這裡開始',
    title: '下載 Sona，把整條轉錄工作流程留在同一塊編輯器裡。',
    desc: '安裝後就能開始即時錄音或批次匯入，繼續整理時間戳記、潤飾、翻譯，並視需要匯出。',
    primaryLabel: '下載最新版本',
    secondaryLabel: '閱讀使用者指南',
    secondaryHref: '/user-guide',
    note: 'Windows、macOS 和 Linux 建構均來自最新 GitHub Release。',
  },
  footer: {
    license: '基於 MIT 協定開源。',
    privacy: '隱私',
    privacyHref: '/privacy',
    repo: 'GitHub 儲存庫',
    trust: '信任',
    trustHref: '/trust',
    issue: '回報問題',
  },
} as any;

homePageContent.ja = {
  metadata: {
    title: 'Sona | オフライン文字起こしエディタ',
    description:
      'TauriとSherpa-onnxで構築された強力なオフライン文字起こしエディタ。高速、正確、かつプライベートな音声テキスト変換。',
  },
} as any;
