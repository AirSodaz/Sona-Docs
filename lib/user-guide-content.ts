import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import type { HomeLocale } from '@/lib/homepage-content';

const GITHUB_REPO_URL = 'https://github.com/AirSodaz/sona';
const GITHUB_BLOB_ROOT = `${GITHUB_REPO_URL}/blob/master`;
const USER_GUIDE_CONTENT_DIR = path.join(process.cwd(), 'content', 'user-guide');
const USER_GUIDE_PAGE_ORDER = [
  'overview',
  'getting-started',
  'live-record',
  'batch-import',
  'edit-and-playback',
  'ai-polish-and-translate',
  'workspace-projects-and-inbox',
  'export-and-settings',
  'ai-summary',
  'live-caption-and-voice-typing',
  'vocabulary-and-advanced-settings',
  'cli-guide',
  'api-guide',
  'faq',
] as const;

type UserGuideNavGroupId = 'start' | 'workflow' | 'extended' | 'reference';
type UserGuideSourceDocId = 'user-guide' | 'cli' | 'api';

export type UserGuidePageId = (typeof USER_GUIDE_PAGE_ORDER)[number];

interface UserGuideLocalizedPageCopy {
  title: string;
  navLabel: string;
  description: string;
  contentFile: string;
}

interface UserGuidePageDefinition {
  id: UserGuidePageId;
  slug: string[];
  group: UserGuideNavGroupId;
  sourceDoc?: UserGuideSourceDocId;
  localizations: Record<string, UserGuideLocalizedPageCopy>;
}

interface UserGuideUiCopy {
  guideLabel: string;
  homeLabel: string;
  alternateLanguageLabel: string;
  sourceLabel: string;
  mobileNavLabel: string;
  sidebarTitle: string;
  previousLabel: string;
  nextLabel: string;
  groupLabels: Record<UserGuideNavGroupId, string>;
  overview: {
    cardsEyebrow: string;
    cardsTitle: string;
    cardsDescription: string;
    browseEyebrow: string;
    browseTitle: string;
    browseDescription: string;
  };
  codeBlock: {
    copyLabel: string;
    copiedLabel: string;
  };
}

export interface UserGuideNavItem {
  id: UserGuidePageId;
  title: string;
  description: string;
  path: string;
  active: boolean;
}

export interface UserGuideNavGroup {
  id: UserGuideNavGroupId;
  label: string;
  items: UserGuideNavItem[];
}

export interface UserGuidePageModel {
  id: UserGuidePageId;
  locale: HomeLocale;
  title: string;
  navLabel: string;
  description: string;
  contentFile: string;
  path: string;
  alternatePath: string;
  homeHref: string;
  homeLabel: string;
  alternateLanguageLabel: string;
  sourceDocId: UserGuideSourceDocId;
  sourceHref: string;
  sourceLabel: string;
  guideLabel: string;
  sidebarTitle: string;
  mobileNavLabel: string;
  previousLabel: string;
  nextLabel: string;
  groupId: UserGuideNavGroupId;
  groupLabel: string;
  previousPage: UserGuideNavItem | null;
  nextPage: UserGuideNavItem | null;
}

interface UserGuideAssistantCopy {
  title: string;
  summary: string;
  expandLabel: string;
  collapseLabel: string;
  examplesLabel: string;
  examples: string[];
  inputPlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  youLabel: string;
  assistantLabel: string;
  detailsLabel: string;
  sourcesLabel: string;
  nextPagesLabel: string;
  disabledInline: string;
  genericError: string;
  networkError: string;
  upstreamError: string;
  emptyResponseError: string;
  unavailableError: string;
  emptyQuestionError: string;
  forbiddenOriginError: string;
  challengeError: string;
  challengeExpiredError: string;
  challengePrompt: string;
  challengeVerifyingLabel: string;
  challengeLoadingError: string;
  throttledError: string;
  tooLongError: string;
}

const GUIDE_PREFIXES: Record<HomeLocale, string> = {
  en: '/user-guide',
  'zh-CN': '/user-guide',
  'zh-TW': '/user-guide',
  ja: '/user-guide',
};

const userGuideUiContent: Record<HomeLocale, UserGuideUiCopy> = {
  en: {
    guideLabel: 'User Guide',
    homeLabel: 'Back Home',
    alternateLanguageLabel: '简体中文',
    sourceLabel: 'Source Doc',
    mobileNavLabel: 'Guide pages',
    sidebarTitle: 'Browse the guide',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    groupLabels: {
      start: 'Start Here',
      workflow: 'Core Workflows',
      extended: 'Extended Capabilities',
      reference: 'Reference & Help',
    },
    overview: {
      cardsEyebrow: 'Start Here',
      cardsTitle: 'Pick the shortest path to your first useful result.',
      cardsDescription:
        'Most people only need one or two pages to get moving. Start with the path that matches what you are doing right now.',
      browseEyebrow: 'Everything Inside',
      browseTitle: 'The full docs set, organized by the actual Sona workflow.',
      browseDescription:
        'Use the overview when you are new, then move into setup, transcript creation, editing, optional AI steps, workspace organization, export, extended capabilities, CLI reference, and troubleshooting.',
    },
    codeBlock: {
      copyLabel: 'Copy code',
      copiedLabel: 'Copied',
    },
  },
  'zh-CN': {
    guideLabel: '用户指南',
    homeLabel: '返回首页',
    alternateLanguageLabel: 'English',
    sourceLabel: '源文档',
    mobileNavLabel: '指南页面',
    sidebarTitle: '浏览指南',
    previousLabel: '上一页',
    nextLabel: '下一页',
    groupLabels: {
      start: '开始使用',
      workflow: '核心流程',
      extended: '扩展能力',
      reference: '参考与帮助',
    },
    overview: {
      cardsEyebrow: '从这里开始',
      cardsTitle: '先选最接近你当前任务的那条路径。',
      cardsDescription:
        '大多数用户并不需要一次看完整份文档。先进入最短上手路径，再按需要继续查看后续页面。',
      browseEyebrow: '完整内容',
      browseTitle: '整套指南按照 Sona 的真实使用流程组织。',
      browseDescription:
        '建议先看总览，再按“首次设置 -> 创建转录 -> 编辑整理 -> 可选 AI 处理 -> 工作区整理 -> 导出 -> 扩展能力 -> CLI 参考 -> 排障”的顺序继续。',
    },
    codeBlock: {
      copyLabel: '复制代码',
      copiedLabel: '已复制',
    },
  },
  ja: {
    guideLabel: 'ユーザーガイド',
    homeLabel: 'ホームに戻る',
    alternateLanguageLabel: 'English',
    sourceLabel: '源ドキュメント',
    mobileNavLabel: 'ガイドページ',
    sidebarTitle: 'ガイドを参照',
    previousLabel: '前へ',
    nextLabel: '次へ',
    groupLabels: {
      start: 'ここから開始',
      workflow: 'コアワークフロー',
      extended: '拡張機能',
      reference: '参照とヘルプ',
    },
    overview: {
      cardsEyebrow: 'ここから開始',
      cardsTitle: '最初の有益な結果への最短ルートを選択してください。',
      cardsDescription:
        '多くの人は1、2ページ読むだけで開始できます。今やりたいタスクに一致するパスから開始してください。',
      browseEyebrow: 'すべてのコンテンツ',
      browseTitle: 'Sonaの実際のワークフローごとに整理された完全なドキュメントセット。',
      browseDescription:
        '最初は概要を使用し、その後セットアップ、文字起こし作成、編集、オプションのAI手順、ワークスペース整理、エクスポート、拡張機能、CLI参照、トラブルシューティングに進んでください。',
    },
    codeBlock: {
      copyLabel: 'コピー',
      copiedLabel: 'コピーしました',
    },
  },
  'zh-TW': {
    guideLabel: '使用者指南',
    homeLabel: '返回首頁',
    alternateLanguageLabel: 'English',
    sourceLabel: '原始文件',
    mobileNavLabel: '指南頁面',
    sidebarTitle: '瀏覽指南',
    previousLabel: '上一頁',
    nextLabel: '下一頁',
    groupLabels: {
      start: '開始使用',
      workflow: '核心流程',
      extended: '擴充能力',
      reference: '參考與幫助',
    },
    overview: {
      cardsEyebrow: '從這裡開始',
      cardsTitle: '先選最接近您目前任務的那條路徑。',
      cardsDescription:
        '大多數使用者並不需要一次看完整份文件。先進入最短上手路徑，再視需要繼續查看後續頁面。',
      browseEyebrow: '完整內容',
      browseTitle: '整套指南按照 Sona 的真實使用流程組織。',
      browseDescription:
        '建議先看總覽，再按「首次設定 -> 建立轉錄 -> 編輯整理 -> 可選 AI 處理 -> 工作區整理 -> 匯出 -> 擴充能力 -> CLI 參考 -> 疑難排解」的順序繼續。',
    },
    codeBlock: {
      copyLabel: '複製程式碼',
      copiedLabel: '已複製',
    },
  },
};

const userGuidePageDefinitions: UserGuidePageDefinition[] = [
  {
    id: 'overview',
    slug: [],
    group: 'start',
    localizations: {
      en: {
        title: 'Sona User Guide',
        navLabel: 'Overview',
        description:
          'A product-shaped entry point to the Sona docs, with the shortest paths for setup, live capture, file import, editing, optional AI steps, workspace organization, export, extended capabilities, and help.',
        contentFile: 'en/overview.md',
      },
      'zh-CN': {
        title: 'Sona 用户指南',
        navLabel: '总览',
        description:
          '站内文档入口页，先帮你找到最短上手路径，再进入首次设置、录音转录、文件导入、编辑整理、AI 处理、工作区整理、导出、扩展能力与排障。',
        contentFile: 'zh-CN/overview.md',
      },
      ja: {
        title: 'Sona ユーザーガイド',
        navLabel: '概要',
        description:
          'Sonaドキュメントの入り口。セットアップ、録音、ファイルインポート、編集、AI手順、エクスポート、ヘルプへの最短パスを案内します。',
        contentFile: 'ja/overview.md',
      },
    
      'zh-TW': {
        title: 'Sona 使用者指南',
        navLabel: '總覽',
        description:
          '站內文件進入點，先幫您找到最短上手路徑，再進入首次設定、錄音轉錄、檔案匯入、編輯整理、AI 處理、工作區整理、匯出、擴充能力與疑難排解。',
        contentFile: 'zh-TW/overview.md',
      },
    },
  },
  {
    id: 'getting-started',
    slug: ['getting-started'],
    group: 'start',
    localizations: {
      en: {
        title: 'Getting Started',
        navLabel: 'Getting Started',
        description:
          'Install Sona, complete First Run Setup, download the recommended offline model pack, and reach your first usable local transcription flow.',
        contentFile: 'en/getting-started.md',
      },
      'zh-CN': {
        title: '快速开始',
        navLabel: '快速开始',
        description:
          '完成安装、首次运行设置与推荐离线模型下载，让 Sona 进入第一个可用的本地转录状态。',
        contentFile: 'zh-CN/getting-started.md',
      },
      ja: {
        title: 'はじめに',
        navLabel: 'はじめに',
        description:
          'Sonaのインストール、初回セットアップ、推奨オフラインモデルのダウンロード、そして最初のローカル文字起こしの開始まで。',
        contentFile: 'ja/getting-started.md',
      },
    
      'zh-TW': {
        title: '快速開始',
        navLabel: '快速開始',
        description:
          '完成安裝、首次執行設定與推薦離線模型下載，讓 Sona 進入第一個可用的本機轉錄狀態。',
        contentFile: 'zh-TW/getting-started.md',
      },
    },
  },
  {
    id: 'live-record',
    slug: ['live-record'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Live Record',
        navLabel: 'Live Record',
        description:
          'Capture live audio, keep timestamps attached, surface the session as a draft while recording, and understand the controls around input source, subtitles, shortcuts, and recording flow.',
        contentFile: 'en/live-record.md',
      },
      'zh-CN': {
        title: '实时录音',
        navLabel: '实时录音',
        description:
          '了解实时录音的适用场景、输入源、字幕设置、快捷键，以及录音草稿在工作区中如何一路延续到录音完成。',
        contentFile: 'zh-CN/live-record.md',
      },
      ja: {
        title: 'ライブ録音',
        navLabel: 'ライブ録音',
        description:
          'リアルタイム録音、タイムスタンプの保持、録音中のドラフト表示、入力ソースやショートカットの制御について。',
        contentFile: 'ja/live-record.md',
      },
    
      'zh-TW': {
        title: '即時錄音',
        navLabel: '即時錄音',
        description:
          '了解即時錄音的適用場景、輸入來源、字幕設定、快速鍵，以及錄音草稿在工作區中如何一路延續到錄音完成。',
        contentFile: 'zh-TW/live-record.md',
      },
    },
  },
  {
    id: 'batch-import',
    slug: ['batch-import'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Batch Import',
        navLabel: 'Batch Import',
        description:
          'Queue existing audio or video files, monitor progress, and bring finished transcripts back into the same editor for review and export.',
        contentFile: 'en/batch-import.md',
      },
      'zh-CN': {
        title: '批量转录',
        navLabel: '批量转录',
        description:
          '把已有音频或视频文件排进同一条处理队列，再回到主编辑器继续检查、翻译与导出。',
        contentFile: 'zh-CN/batch-import.md',
      },
      ja: {
        title: 'バッチインポート',
        navLabel: 'バッチインポート',
        description:
          '既存の音声・動画ファイルをキューに追加して進捗を監視し、完了した文字起こしをエディタで確認・エクスポートします。',
        contentFile: 'ja/batch-import.md',
      },
    
      'zh-TW': {
        title: '批次轉錄',
        navLabel: '批次轉錄',
        description:
          '把已有音訊或影片檔案排進同一條處理佇列，再回到主編輯器繼續檢查、翻譯與匯出。',
        contentFile: 'zh-TW/batch-import.md',
      },
    },
  },
  {
    id: 'edit-and-playback',
    slug: ['edit-and-playback'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Edit and Playback',
        navLabel: 'Edit & Playback',
        description:
          'Review transcript segments, keep timestamps aligned to playback, search the transcript, and use the editor tools without leaving the main workspace.',
        contentFile: 'en/edit-and-playback.md',
      },
      'zh-CN': {
        title: '编辑与播放',
        navLabel: '编辑与播放',
        description:
          '围绕时间戳、分段编辑、搜索与播放器，了解 Sona 的主编辑区应该如何配合使用。',
        contentFile: 'zh-CN/edit-and-playback.md',
      },
      ja: {
        title: '編集と再生',
        navLabel: '編集と再生',
        description:
          'セグメントの確認、再生と同期したタイムスタンプの追跡、文字起こしの検索、およびエディタツールの使用方法。',
        contentFile: 'ja/edit-and-playback.md',
      },
    
      'zh-TW': {
        title: '編輯與播放',
        navLabel: '編輯與播放',
        description:
          '在編輯器中檢查文字、跳轉時間戳記、校對說話者標籤，並在 LLM 潤飾、翻譯或重新轉錄後使用版本快照進行對照和復原。',
        contentFile: 'zh-TW/edit-and-playback.md',
      },
    },
  },
  {
    id: 'ai-polish-and-translate',
    slug: ['ai-polish-and-translate'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'AI Polish and Translate',
        navLabel: 'AI Polish & Translate',
        description:
          'Configure providers, feature models, and reasoning options in Settings > LLM Service, then run polish or translation only when needed.',
        contentFile: 'en/ai-polish-and-translate.md',
      },
      'zh-CN': {
        title: 'AI 润色与翻译',
        navLabel: 'AI 润色与翻译',
        description:
          '在设置中绑定 provider、功能模型与深度思考选项，再按需使用润色或翻译。',
        contentFile: 'zh-CN/ai-polish-and-translate.md',
      },
      ja: {
        title: 'AI推敲と翻訳',
        navLabel: 'AI推敲と翻訳',
        description:
          'プロバイダ、モデル、推論オプションの設定（設定 > LLMサービス）と、推敲や翻訳の実行方法。',
        contentFile: 'ja/ai-polish-and-translate.md',
      },
    
      'zh-TW': {
        title: 'AI 潤飾與翻譯',
        navLabel: 'AI 潤飾與翻譯',
        description:
          '使用 LLM 對轉錄文字進行語氣優化、標點整理，或使用翻譯服務生成並排對照的雙語字幕。',
        contentFile: 'zh-TW/ai-polish-and-translate.md',
      },
    },
  },
  {
    id: 'workspace-projects-and-inbox',
    slug: ['workspace-projects-and-inbox'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Workspace, Projects, and Inbox',
        navLabel: 'Workspace / Projects / Inbox',
        description:
          'Organize saved recordings and imports, switch between All Items, Inbox, and projects, and understand how project defaults shape new work.',
        contentFile: 'en/workspace-projects-and-inbox.md',
      },
      'zh-CN': {
        title: '工作区、项目与 Inbox',
        navLabel: '工作区 / 项目 / Inbox',
        description:
          '了解如何在全部内容、Inbox 与项目之间整理已保存内容，以及项目默认值会如何影响后续工作。',
        contentFile: 'zh-CN/workspace-projects-and-inbox.md',
      },
      ja: {
        title: 'ワークスペース、プロジェクト、Inbox',
        navLabel: 'ワークスペース / プロジェクト / Inbox',
        description:
          '録音やインポートの整理、Inboxやプロジェクトの切り替え、プロジェクトのデフォルト設定によるワークフローへの影響について。',
        contentFile: 'ja/workspace-projects-and-inbox.md',
      },
    
      'zh-TW': {
        title: '工作區、專案與 Inbox',
        navLabel: '工作區與專案',
        description:
          '使用工作區跨專案瀏覽或在專案間移動內容，修改專案圖示，並為每個獨立主題設定不同的預設摘要範本、翻譯語言和文字替換規則。',
        contentFile: 'zh-TW/workspace-projects-and-inbox.md',
      },
    },
  },
  {
    id: 'export-and-settings',
    slug: ['export-and-settings'],
    group: 'workflow',
    localizations: {
      en: {
        title: 'Export and Settings',
        navLabel: 'Export / Settings',
        description:
          'Export finished work and quickly find Dashboard, Diagnostics, Backup & Restore, Automation, LLM Service, Shortcuts, Voice Typing, and notification entry points.',
        contentFile: 'en/export-and-settings.md',
      },
      'zh-CN': {
        title: '导出与设置',
        navLabel: '导出 / 设置',
        description:
          '完成导出，并快速理解仪表盘、诊断、备份与恢复、自动化、LLM 服务、快捷键、语音输入法和通知入口分别在哪里。',
        contentFile: 'zh-CN/export-and-settings.md',
      },
      ja: {
        title: 'エクスポートと設定',
        navLabel: 'エクスポート / 設定',
        description:
          '成果物のエクスポート、診断、バックアップと復元、自動化、LLMサービス、ショートカット、音声入力などの設定。',
        contentFile: 'ja/export-and-settings.md',
      },
    
      'zh-TW': {
        title: '匯出與設定',
        navLabel: '匯出與設定',
        description:
          '匯出 SRT、WebVTT、JSON 或純文字，並快速了解儀表板、輸入裝置、自動化監控資料夾、診斷與備份的正確入口。',
        contentFile: 'zh-TW/export-and-settings.md',
      },
    },
  },
  {
    id: 'ai-summary',
    slug: ['ai-summary'],
    group: 'extended',
    localizations: {
      en: {
        title: 'AI Summary',
        navLabel: 'AI Summary',
        description:
          'Assign a Summary Model, configure supported reasoning options, generate or edit the current summary, and understand stale summaries, templates, and export boundaries.',
        contentFile: 'en/ai-summary.md',
      },
      'zh-CN': {
        title: 'AI 摘要',
        navLabel: 'AI 摘要',
        description:
          '绑定摘要模型，配置支持的深度思考选项，生成或编辑当前摘要，并理解摘要过期、模板切换和导出边界。',
        contentFile: 'zh-CN/ai-summary.md',
      },
      ja: {
        title: 'AI要約',
        navLabel: 'AI要約',
        description:
          '要約モデルの割り当て、推論オプションの設定、要約の生成と編集、およびテンプレートとエクスポートについて。',
        contentFile: 'ja/ai-summary.md',
      },
    
      'zh-TW': {
        title: 'AI 摘要',
        navLabel: 'AI 摘要',
        description:
          '在設定中繫結摘要模型並設定 provider，為轉錄建立通用、會議或課堂等不同範本的 AI 歸納摘要，並支援手動微調與複製。',
        contentFile: 'zh-TW/ai-summary.md',
      },
    },
  },
  {
    id: 'live-caption-and-voice-typing',
    slug: ['live-caption-and-voice-typing'],
    group: 'extended',
    localizations: {
      en: {
        title: 'Live Caption and Voice Typing',
        navLabel: 'Live Caption & Voice Typing',
        description:
          'Understand where Live Caption starts, how Settings > Voice Typing handles shortcut and readiness, and how both features reuse the same offline live transcription stack.',
        contentFile: 'en/live-caption-and-voice-typing.md',
      },
      'zh-CN': {
        title: '实时字幕与语音输入法',
        navLabel: '实时字幕与语音输入法',
        description:
          '理解实时字幕的入口在哪里、字幕浮窗设置负责什么，以及语音输入法页如何管理快捷键、就绪状态与同一套离线实时转录依赖。',
        contentFile: 'zh-CN/live-caption-and-voice-typing.md',
      },
      ja: {
        title: 'ライブ字幕と音声入力',
        navLabel: 'ライブ字幕 & 音声入力',
        description:
          'ライブ字幕の開始方法、音声入力のショートカットと準備設定、および共通のオフライン文字起こしスタックの利用について。',
        contentFile: 'ja/live-caption-and-voice-typing.md',
      },
    
      'zh-TW': {
        title: '即時字幕與語音輸入法',
        navLabel: '即時字幕/聽寫',
        description:
          '啟用置頂與點擊穿透的懸浮字幕，或使用語音輸入法（按住說話/切換模式）在其他任何應用程式的文字框中直接進行語音聽寫。',
        contentFile: 'zh-TW/live-caption-and-voice-typing.md',
      },
    },
  },
  {
    id: 'vocabulary-and-advanced-settings',
    slug: ['vocabulary-and-advanced-settings'],
    group: 'extended',
    localizations: {
      en: {
        title: 'Vocabulary and Advanced Settings',
        navLabel: 'Vocabulary & Advanced',
        description:
          'Use hotwords, text replacement, and polish advanced settings when you need finer control, without turning the guide into a full settings manual.',
        contentFile: 'en/vocabulary-and-advanced-settings.md',
      },
      'zh-CN': {
        title: '词汇与高级设置',
        navLabel: '词汇与高级设置',
        description:
          '在需要更细调校时使用热词、文本替换和润色高级设置，而不是把整份指南扩写成完整设置手册。',
        contentFile: 'zh-CN/vocabulary-and-advanced-settings.md',
      },
      ja: {
        title: '語彙と高度な設定',
        navLabel: '語彙 & 高度な設定',
        description:
          'ホットワード、テキスト置換、およびより細かい制御が必要な場合の高度な推敲設定の使用方法。',
        contentFile: 'ja/vocabulary-and-advanced-settings.md',
      },
    
      'zh-TW': {
        title: '詞彙與進階設定',
        navLabel: '進階詞彙設定',
        description:
          '管理說話者檔案以協助校對，設定文字替換與熱詞以增強特定術語辨識，並設定 Auto-Polish 以進行自動正文清洗。',
        contentFile: 'zh-TW/vocabulary-and-advanced-settings.md',
      },
    },
  },
  {
    id: 'cli-guide',
    slug: ['cli'],
    group: 'reference',
    sourceDoc: 'cli',
    localizations: {
      en: {
        title: 'CLI Guide',
        navLabel: 'CLI Guide',
        description:
          "Run Sona's offline batch transcription from the terminal, understand packaged versus source-build entry points, and verify the current command surface.",
        contentFile: 'en/cli-guide.md',
      },
      'zh-CN': {
        title: 'CLI 指南',
        navLabel: 'CLI 指南',
        description:
          '从终端运行 Sona 的离线批量转录，理解安装包与源码构建两种入口，并确认当前命令行能力边界。',
        contentFile: 'zh-CN/cli-guide.md',
      },
      ja: {
        title: 'CLIガイド',
        navLabel: 'CLIガイド',
        description:
          'ターミナルからのオフラインバッチ文字起こしの実行、パッケージ版とソースビルド版の違い、およびコマンドリファレンス。',
        contentFile: 'ja/cli-guide.md',
      },
    
      'zh-TW': {
        title: 'CLI 指南',
        navLabel: 'CLI 參考',
        description:
          '從終端機執行 Sona 的離線批次轉錄，理解安裝包與原始碼建構兩種入口，並確認目前命令列能力邊界。',
        contentFile: 'zh-TW/cli-guide.md',
      },
    },
  },
  {
    id: 'api-guide',
    slug: ['api'],
    group: 'reference',
    sourceDoc: 'api',
    localizations: {
      en: {
        title: 'HTTP API Guide',
        navLabel: 'HTTP API',
        description:
          'Start the local HTTP API server, authenticate requests, submit transcription jobs, inspect status, use configured Cloud ASR providers, and verify webhooks.',
        contentFile: 'en/api-guide.md',
      },
      'zh-CN': {
        title: 'HTTP API 指南',
        navLabel: 'HTTP API',
        description:
          '启动本地 HTTP API 服务，配置认证，提交转录任务，查询状态，使用已配置的云端 ASR，并校验 webhook 签名。',
        contentFile: 'zh-CN/api-guide.md',
      },
      ja: {
        title: 'HTTP APIガイド',
        navLabel: 'HTTP API',
        description:
          'ローカルHTTP APIサーバーの起動、認証、ジョブの送信、ステータスの確認、およびWebhookの検証について。',
        contentFile: 'ja/api-guide.md',
      },
    
      'zh-TW': {
        title: 'HTTP API 指南',
        navLabel: 'HTTP API 參考',
        description:
          '本機 HTTP API 服務參考：認證、提交轉錄任務、查詢狀態、取得健康指標，以及設定 Webhook 簽名驗證。',
        contentFile: 'zh-TW/api-guide.md',
      },
    },
  },
  {
    id: 'faq',
    slug: ['faq'],
    group: 'reference',
    localizations: {
      en: {
        title: 'FAQ and Troubleshooting',
        navLabel: 'FAQ',
        description:
          'Find the common blockers around setup reminders, missing models, recording, drafts, recovery, voice typing, playback, and source builds.',
        contentFile: 'en/faq.md',
      },
      'zh-CN': {
        title: '常见问题与排障',
        navLabel: 'FAQ',
        description:
          '汇总首次设置、模型缺失、录音草稿、恢复中心、语音输入法、播放器与源码构建等常见问题。',
        contentFile: 'zh-CN/faq.md',
      },
      ja: {
        title: 'FAQとトラブルシューティング',
        navLabel: 'FAQ',
        description:
          'セットアップ時のリマインダー、モデル不足、録音、ドラフト、復元、再生、ビルドなどに関するよくある問題。',
        contentFile: 'ja/faq.md',
      },
    
      'zh-TW': {
        title: '常見問題與疑難排解',
        navLabel: 'FAQ & 排障',
        description:
          '彙整首次設定、模型缺少、錄音草稿、復原中心、語音輸入法、播放器與原始碼建構等常見問題。',
        contentFile: 'zh-TW/faq.md',
      },
    },
  },
];

const userGuidePageDefinitionById = Object.fromEntries(
  userGuidePageDefinitions.map((definition) => [definition.id, definition]),
) as Record<UserGuidePageId, UserGuidePageDefinition>;

const userGuidePageDefinitionBySlug = Object.fromEntries(
  userGuidePageDefinitions.map((definition) => [
    definition.slug.join('/'),
    definition,
  ]),
) as Record<string, UserGuidePageDefinition>;

const userGuidePageIdSet = new Set<string>(USER_GUIDE_PAGE_ORDER);

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function getOtherLocale(locale: HomeLocale): HomeLocale {
  if (locale === 'zh-TW') {
    return 'en';
  }
  return locale === 'en' ? 'zh-CN' : 'en';
}

function getLocaleHomeHref(locale: HomeLocale) {
  return '/';
}

function getGuideSourceHref(locale: HomeLocale) {
  if (locale === 'zh-CN') {
    return `${GITHUB_BLOB_ROOT}/docs/user-guide.zh-CN.md`;
  }
  if (locale === 'zh-TW') {
    return `${GITHUB_BLOB_ROOT}/docs/user-guide.zh-TW.md`;
  }
  if (locale === 'ja') {
    return `${GITHUB_BLOB_ROOT}/docs/user-guide.ja.md`;
  }
  return `${GITHUB_BLOB_ROOT}/docs/user-guide.md`;
}

function getCliSourceHref(locale: HomeLocale) {
  if (locale === 'zh-CN') {
    return `${GITHUB_BLOB_ROOT}/docs/cli.zh-CN.md`;
  }
  if (locale === 'zh-TW') {
    return `${GITHUB_BLOB_ROOT}/docs/cli.zh-TW.md`;
  }
  if (locale === 'ja') {
    return `${GITHUB_BLOB_ROOT}/docs/cli.ja.md`;
  }
  return `${GITHUB_BLOB_ROOT}/docs/cli.md`;
}

function getApiSourceHref(locale: HomeLocale) {
  if (locale === 'zh-CN') {
    return `${GITHUB_BLOB_ROOT}/docs/api.zh-CN.md`;
  }
  if (locale === 'zh-TW') {
    return `${GITHUB_BLOB_ROOT}/docs/api.zh-TW.md`;
  }
  if (locale === 'ja') {
    return `${GITHUB_BLOB_ROOT}/docs/api.ja.md`;
  }
  return `${GITHUB_BLOB_ROOT}/docs/api.md`;
}

function getSourceDocHref(sourceDocId: UserGuideSourceDocId, locale: HomeLocale) {
  switch (sourceDocId) {
    case 'api':
      return getApiSourceHref(locale);
    case 'cli':
      return getCliSourceHref(locale);
    case 'user-guide':
      return getGuideSourceHref(locale);
  }
}

function getReadmeHref(locale: HomeLocale) {
  if (locale === 'zh-CN') {
    return `${GITHUB_BLOB_ROOT}/README.zh-CN.md`;
  }
  if (locale === 'zh-TW') {
    return `${GITHUB_BLOB_ROOT}/README.zh-TW.md`;
  }
  if (locale === 'ja') {
    return `${GITHUB_BLOB_ROOT}/README.ja.md`;
  }
  return `${GITHUB_BLOB_ROOT}/README.md`;
}

export function buildUserGuidePath(
  locale: HomeLocale,
  pageId: UserGuidePageId,
) {
  const prefix = GUIDE_PREFIXES[locale];
  const slug = userGuidePageDefinitionById[pageId].slug;

  return slug.length > 0 ? `${prefix}/${slug.join('/')}` : prefix;
}

function buildUserGuideNavItem(
  locale: HomeLocale,
  pageId: UserGuidePageId,
  active: boolean,
): UserGuideNavItem {
  const definition = userGuidePageDefinitionById[pageId];
  const localized = definition.localizations[locale];

  return {
    id: pageId,
    title: localized.navLabel,
    description: localized.description,
    path: buildUserGuidePath(locale, pageId),
    active,
  };
}

export function getUserGuidePageById(
  locale: HomeLocale,
  pageId: UserGuidePageId,
): UserGuidePageModel {
  const definition = userGuidePageDefinitionById[pageId];
  const localized = definition.localizations[locale];
  const ui = userGuideUiContent[locale];
  const sourceDocId = definition.sourceDoc ?? 'user-guide';
  const currentIndex = USER_GUIDE_PAGE_ORDER.indexOf(pageId);
  const previousId =
    currentIndex > 0 ? USER_GUIDE_PAGE_ORDER[currentIndex - 1] : null;
  const nextId =
    currentIndex < USER_GUIDE_PAGE_ORDER.length - 1
      ? USER_GUIDE_PAGE_ORDER[currentIndex + 1]
      : null;

  return {
    id: pageId,
    locale,
    title: localized.title,
    navLabel: localized.navLabel,
    description: localized.description,
    contentFile: localized.contentFile,
    path: buildUserGuidePath(locale, pageId),
    alternatePath: buildUserGuidePath(getOtherLocale(locale), pageId),
    homeHref: getLocaleHomeHref(locale),
    homeLabel: ui.homeLabel,
    alternateLanguageLabel: ui.alternateLanguageLabel,
    sourceDocId,
    sourceHref: getSourceDocHref(sourceDocId, locale),
    sourceLabel: ui.sourceLabel,
    guideLabel: ui.guideLabel,
    sidebarTitle: ui.sidebarTitle,
    mobileNavLabel: ui.mobileNavLabel,
    previousLabel: ui.previousLabel,
    nextLabel: ui.nextLabel,
    groupId: definition.group,
    groupLabel: ui.groupLabels[definition.group],
    previousPage: previousId
      ? buildUserGuideNavItem(locale, previousId, false)
      : null,
    nextPage: nextId ? buildUserGuideNavItem(locale, nextId, false) : null,
  };
}

export function getUserGuidePageFromSlug(
  locale: HomeLocale,
  slug: string[] | undefined,
) {
  const normalizedSlug = slug ?? [];
  const definition = userGuidePageDefinitionBySlug[normalizedSlug.join('/')];

  if (!definition) {
    return null;
  }

  return getUserGuidePageById(locale, definition.id);
}

export function getUserGuideNavigation(
  locale: HomeLocale,
  activePageId: UserGuidePageId,
): UserGuideNavGroup[] {
  const ui = userGuideUiContent[locale];

  return (Object.keys(ui.groupLabels) as UserGuideNavGroupId[]).map(
    (groupId) => ({
      id: groupId,
      label: ui.groupLabels[groupId],
      items: USER_GUIDE_PAGE_ORDER.filter(
        (pageId) => userGuidePageDefinitionById[pageId].group === groupId,
      ).map((pageId) =>
        buildUserGuideNavItem(locale, pageId, pageId === activePageId),
      ),
    }),
  );
}

export function getUserGuideOverviewCards(locale: HomeLocale) {
  return (['getting-started', 'live-record', 'batch-import'] as const).map((pageId) =>
    buildUserGuideNavItem(locale, pageId, false),
  );
}

export function getAllUserGuidePages(locale: HomeLocale) {
  return USER_GUIDE_PAGE_ORDER.map((pageId) => getUserGuidePageById(locale, pageId));
}

export function isUserGuidePageId(value: string): value is UserGuidePageId {
  return userGuidePageIdSet.has(value);
}

export function getUserGuideStaticParams() {
  return USER_GUIDE_PAGE_ORDER.map((pageId) => ({
    slug: userGuidePageDefinitionById[pageId].slug,
  }));
}

export function getAllUserGuidePaths() {
  const localePrefixes: Record<HomeLocale, string> = {
    en: '/en',
    'zh-CN': '/zh-CN',
    'zh-TW': '/zh-TW',
    ja: '/ja',
  };
  return (['en', 'zh-CN', 'zh-TW', 'ja'] as HomeLocale[]).flatMap((locale) =>
    USER_GUIDE_PAGE_ORDER.map((pageId) => `${localePrefixes[locale]}${buildUserGuidePath(locale, pageId)}`),
  );
}

export function getUserGuideUiCopy(locale: HomeLocale) {
  return userGuideUiContent[locale];
}

export function getUserGuideAssistantCopy(
  locale: HomeLocale,
  pageTitle: string,
): UserGuideAssistantCopy {
  if (locale === 'ja') {
    return {
      title: 'AIに質問',
      summary: 'ガイドの内容のみを回答し、このページを優先します。',
      expandLabel: '開く',
      collapseLabel: '閉じる',
      examplesLabel: '質問例',
      examples: [
        `「${pageTitle}」ページは何のためのものですか？`,
        `「${pageTitle}」の後に何を読むべきですか？`,
        'SonaでAIの校正や翻訳はどこで設定しますか？',
      ],
      inputPlaceholder:
        'このページ、次のステップ、または機能の場所について質問してください...',
      submitLabel: '質問',
      submittingLabel: '思考中...',
      youLabel: 'あなた',
      assistantLabel: 'ガイドAI',
      detailsLabel: 'ソースと次のステップ',
      sourcesLabel: 'ソース',
      nextPagesLabel: '次のページ',
      disabledInline:
        'このデプロイメントでは、保護されたガイドQAが有効になっていません。',
      genericError:
        '現在ガイドアシスタントが回答できません。しばらくしてからもう一度お試しください。',
      networkError:
        'サーバーが現在Geminiに接続できません。サーバーのネットワークまたはプロキシを確認して、もう一度お試しください。',
      upstreamError:
        'Geminiがこの質問に対してアップストリームエラーを返しました。しばらくしてからもう一度お試しください。',
      emptyResponseError:
        'Geminiが利用可能な回答テキストなしで返答しました。もう一度質問してみてください。',
      unavailableError:
        'このデプロイメントでは、現在AIの質問は利用できません。',
      emptyQuestionError: '送信する前に質問を入力してください。',
      forbiddenOriginError:
        'このホストは、保護されたガイドアシスタントの使用を許可されていません。',
      challengeError:
        '質問を続けるには、確認チャレンジを完了してください。',
      challengeExpiredError:
        '確認の期限が切れました。もう一度チャレンジを完了してください。',
      challengePrompt:
        'ガイドQAを引き続き使用するには、確認チャレンジを完了してください。',
      challengeVerifyingLabel: '検証中...',
      challengeLoadingError:
        '検証ウィジェットを読み込めませんでした。リフレッシュしてもう一度お試しください。',
      throttledError:
        '検証の失敗が多すぎます。しばらく待ってからもう一度お試しください。',
      tooLongError: '質問は1200文字以内で入力してください。',
    };
  }

  if (locale === 'en') {
    return {
      title: 'Ask AI',
      summary: 'Guide-only answers, with this page prioritized.',
      expandLabel: 'Open',
      collapseLabel: 'Close',
      examplesLabel: 'Try asking',
      examples: [
        `What is the ${pageTitle} page for?`,
        `What should I read after ${pageTitle}?`,
        'Where do I set up AI polish or translation in Sona?',
      ],
      inputPlaceholder:
        'Ask about this page, the next step, or where a feature lives in the guide...',
      submitLabel: 'Ask',
      submittingLabel: 'Thinking...',
      youLabel: 'You',
      assistantLabel: 'Guide AI',
      detailsLabel: 'Sources and next step',
      sourcesLabel: 'Sources',
      nextPagesLabel: 'Next pages',
      disabledInline:
        'This deployment has not enabled protected guide Q&A.',
      genericError:
        'The guide assistant could not answer right now. Please try again in a moment.',
      networkError:
        'The server could not reach Gemini right now. Please check the server network or proxy and try again.',
      upstreamError:
        'Gemini returned an upstream error for this question. Please try again in a moment.',
      emptyResponseError:
        'Gemini replied without usable answer text. Please try asking again.',
      unavailableError:
        'AI questions are not available on this deployment right now.',
      emptyQuestionError: 'Enter a question before sending it.',
      forbiddenOriginError:
        'This host is not allowed to use the protected guide assistant.',
      challengeError:
        'Please complete the verification challenge to continue asking questions.',
      challengeExpiredError:
        'Verification expired. Please complete the challenge again.',
      challengePrompt:
        'Complete the verification challenge to continue using guide Q&A.',
      challengeVerifyingLabel: 'Verifying...',
      challengeLoadingError:
        'The verification widget could not load. Please refresh and try again.',
      throttledError:
        'Too many verification failures. Please wait and try again later.',
      tooLongError: 'Keep the question under 1200 characters.',
    };
  }

  return {
    title: '向 AI 提问',
    summary: '只回答本指南内容，并优先参考当前页。',
    expandLabel: '展开',
    collapseLabel: '收起',
    examplesLabel: '可以这样问',
    examples: [
      `“${pageTitle}”这一页主要是做什么的？`,
      `看完“${pageTitle}”后，下一步应该看哪一页？`,
      'Sona 里的 AI 润色或翻译应该去哪里设置？',
    ],
    inputPlaceholder:
      '可以问这页内容、下一步流程，或某项功能在指南里的位置……',
    submitLabel: '发送',
    submittingLabel: '正在思考...',
    youLabel: '你',
    assistantLabel: '指南 AI',
    detailsLabel: '来源与下一步',
    sourcesLabel: '来源页',
    nextPagesLabel: '下一步',
    disabledInline: '当前部署尚未启用受保护的文档问答。',
    genericError: '指南助手暂时无法回答，请稍后再试。',
    networkError:
      '服务器当前无法连到 Gemini。请检查服务端网络或代理后再试。',
    upstreamError:
      'Gemini 这次返回了上游错误，请稍后重试。',
    emptyResponseError:
      'Gemini 这次没有返回可用答案文本，可以再问一次。',
    unavailableError: '当前部署暂时不可用 AI 问答。',
    emptyQuestionError: '请先输入问题再发送。',
    forbiddenOriginError: '当前域名不允许使用受保护的指南问答。',
    challengeError: '请先完成验证挑战，再继续提问。',
    challengeExpiredError: '验证已过期，请重新完成一次挑战。',
    challengePrompt: '继续使用指南问答前，请先完成下面的验证。',
    challengeVerifyingLabel: '正在验证...',
    challengeLoadingError: '验证组件加载失败，请刷新后重试。',
    throttledError: '验证失败次数过多，请稍后再试。',
    tooLongError: '问题请控制在 1200 个字符以内。',
  };
}

export const getUserGuideMarkdown = cache(
  async (locale: HomeLocale, pageId: UserGuidePageId) => {
    const page = getUserGuidePageById(locale, pageId);
    const filePath = path.join(USER_GUIDE_CONTENT_DIR, page.contentFile);

    return readFile(filePath, 'utf8');
  },
);

const legacyRelativeLinkOverrides: Record<string, string> = {
  'user-guide.md': 'guide:overview',
  'user-guide.zh-CN.md': 'guide:overview',
  'user-guide.zh-TW.md': 'guide:overview',
  cli: 'guide:cli-guide',
  'cli.md': 'guide:cli-guide',
  'cli.zh-CN.md': 'guide:cli-guide',
  'cli.zh-TW.md': 'guide:cli-guide',
  api: 'guide:api-guide',
  'api.md': 'guide:api-guide',
  'api.zh-CN.md': 'guide:api-guide',
  'api.zh-TW.md': 'guide:api-guide',
  '../README.md': 'readme',
  '../README.zh-CN.md': 'readme',
  '../README.zh-TW.md': 'readme',
};

function normalizeUserGuideHrefToken(href: string) {
  const normalizedHref = href.replace(/^\.\//, '');

  return (
    legacyRelativeLinkOverrides[href] ??
    legacyRelativeLinkOverrides[normalizedHref] ??
    normalizedHref
  );
}

export function getUserGuidePageIdFromHrefToken(
  href: string | undefined,
): UserGuidePageId | null {
  if (!href) {
    return null;
  }

  const token = normalizeUserGuideHrefToken(href);

  if (!token.startsWith('guide:')) {
    return null;
  }

  const pageId = token.replace('guide:', '');

  return isUserGuidePageId(pageId) ? pageId : null;
}

export function resolveUserGuideHref(
  locale: HomeLocale,
  href: string | undefined,
) {
  if (!href) {
    return { href: '#', external: false };
  }

  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('#')
  ) {
    return { href, external: isExternalHref(href) };
  }

  if (href.startsWith('/')) {
    return { href, external: false };
  }

  const normalizedHref = href.replace(/^\.\//, '');
  const token = normalizeUserGuideHrefToken(href);
  const pageId = getUserGuidePageIdFromHrefToken(href);

  if (pageId) {
    return {
      href: buildUserGuidePath(locale, pageId),
      external: false,
    };
  }

  if (token === 'readme') {
    return {
      href: getReadmeHref(locale),
      external: true,
    };
  }

  return {
    href: `${GITHUB_BLOB_ROOT}/docs/${normalizedHref}`,
    external: true,
  };
}
