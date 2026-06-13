export type HomeLocale = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko';
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
