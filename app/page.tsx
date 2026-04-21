'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Github, Download, Mic, Shield, Bot, Scissors, Globe } from 'lucide-react';
import * as motion from 'motion/react-client';

const translations = {
  zh: {
    nav: { github: "GitHub", download: "免费下载" },
    hero: {
      badge: "快速 · 准确 · 隐私",
      title1: "静谧空间的",
      title2: "转写工具。",
      desc: "Sona 是一款基于 Tauri 和 Sherpa-onnx 构建的离线富文本转录编辑器。让强大的语音识别能力回归本地机器。没有云端，没有订阅，只有你的文字。",
      btnDownload: "下载最新版本",
      btnDocs: "阅读文档"
    },
    features: [
      {
        title: "完全本土运行",
        desc: "绝对的隐私安全。所有处理均在你的本地硬件上使用 Sherpa-onnx 完成，无需联网，远离数据泄露的担忧。"
      },
      {
        title: "内置大模型智能助手",
        desc: "内置本地大语言模型支持。无需离开应用，即可自动优化语句、生成摘要，或是翻译转录内容。"
      },
      {
        title: "极高准确率",
        desc: "提供商业级别的语音识别体验，通过智能断句技术，专为超长音频的精确转写而调优。"
      },
      {
        title: "精巧的富文本编辑器",
        desc: "基于 React 的沉浸式富文本编辑器，允许你轻松调整生成的文字、校准时间戳，让校对变得顺滑。"
      }
    ],
    footer: {
      license: "基于 MIT 协议开源。",
      repo: "GitHub 仓库",
      issue: "报告问题"
    }
  },
  en: {
    nav: { github: "GitHub", download: "Download" },
    hero: {
      badge: "Fast, accurate, private.",
      title1: "Transcription tools",
      title2: "for the quiet spaces.",
      desc: "Sona is an offline transcript editor built with Tauri and Sherpa-onnx. It brings powerful speech-to-text directly to your local machine. No cloud, no subscriptions, just your words.",
      btnDownload: "Download Latest Release",
      btnDocs: "Read Documentation"
    },
    features: [
      {
        title: "Locally Processed",
        desc: "Complete privacy. Everything runs entirely on your local hardware using Sherpa-onnx, avoiding internet bounds and data leaks."
      },
      {
        title: "LLM Assistant",
        desc: "Built-in capabilities with local Large Language Models to automatically polish, summarize, and translate your transcripts."
      },
      {
        title: "High Accuracy",
        desc: "Achieves commercial-grade speech recognition tailored for long audio files with intelligent phrasing."
      },
      {
        title: "Transcript Editor",
        desc: "Rich, interactive editor built with React to easily tweak generated text, align timestamps, and refine your audio."
      }
    ],
    footer: {
      license: "Open sourced under MIT License.",
      repo: "GitHub Repository",
      issue: "Report Issue"
    }
  }
};

export default function Home() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const loc = translations[lang];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#F7F5F2] text-[#2D2D2D] dark:bg-[#121212] dark:text-[#E0E0E0] transition-colors duration-300">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-200 dark:bg-stone-800 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-30 dark:opacity-20 transition-colors duration-300"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-200 dark:bg-stone-800 rounded-full blur-[120px] -z-10 -translate-x-1/4 translate-y-1/4 opacity-30 dark:opacity-20 transition-colors duration-300"></div>
      
      {/* Navigation */}
      <header className="flex justify-between items-center px-6 md:px-16 py-8 w-full max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center"
        >
          <Logo className="w-8 h-8 rounded-lg" />
          <span className="text-[1.7rem] font-serif italic tracking-tighter mt-0.5 text-[#5c4d43] dark:text-[#E0E0E0] -ml-1" style={{fontFamily: 'Georgia, serif'}}>ona</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-6 md:gap-8 text-sm font-medium text-stone-500 dark:text-stone-400"
        >
          <ThemeToggle />
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} 
            className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <Globe size={16} />
            <span className="hidden sm:inline">{lang === 'zh' ? 'English' : '中文'}</span>
            <span className="sm:hidden">{lang === 'zh' ? 'EN' : '中'}</span>
          </button>
          <Link href="https://github.com/AirSodaz/sona" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors flex items-center gap-2" target="_blank">
            <Github size={16} />
            <span className="hidden sm:inline">{loc.nav.github}</span>
          </Link>
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 w-full mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-8 shadow-sm transition-colors duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 dark:bg-stone-500 opacity-30"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-400 dark:bg-stone-500"></span>
            </span>
            {loc.hero.badge}
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif italic mb-6 leading-tight text-[#2D2D2D] dark:text-[#E0E0E0] transition-colors duration-300" style={{fontFamily: 'Georgia, serif'}}>
            {loc.hero.title1} <br/> 
            <span className="text-stone-500 dark:text-stone-400 font-light transition-colors duration-300">{loc.hero.title2}</span>
          </h1>
          
          <p className="text-lg text-stone-500 dark:text-stone-400 mb-10 leading-relaxed font-light max-w-2xl mx-auto transition-colors duration-300">
            {loc.hero.desc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link href="https://github.com/AirSodaz/sona/releases" target="_blank">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-full text-sm font-medium hover:bg-stone-700 dark:hover:bg-white transition-colors shadow-lg shadow-stone-200 dark:shadow-none flex items-center gap-2"
              >
                {loc.hero.btnDownload}
                <Download size={16} />
              </motion.button>
            </Link>
            <Link href="https://github.com/AirSodaz/sona#readme" target="_blank">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-stone-300 dark:border-stone-700 text-[#2D2D2D] dark:text-stone-300 rounded-full text-sm font-medium hover:bg-white dark:hover:bg-stone-800 transition-colors flex items-center gap-2"
              >
                {loc.hero.btnDocs}
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Feature grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid sm:grid-cols-2 gap-12 mt-8 text-left w-full max-w-4xl mx-auto"
        >
          <FeatureCard 
            icon={<Shield size={20} className="text-stone-600 dark:text-stone-400" />}
            title={loc.features[0].title}
            description={loc.features[0].desc}
          />
          <FeatureCard 
            icon={<Bot size={20} className="text-stone-600 dark:text-stone-400" />}
            title={loc.features[1].title}
            description={loc.features[1].desc}
          />
          <FeatureCard 
            icon={<Mic size={20} className="text-stone-600 dark:text-stone-400" />}
            title={loc.features[2].title}
            description={loc.features[2].desc}
          />
          <FeatureCard 
            icon={<Scissors size={20} className="text-stone-600 dark:text-stone-400" />}
            title={loc.features[3].title}
            description={loc.features[3].desc}
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-24 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="container mx-auto px-6 md:px-16 py-12 flex flex-col md:flex-row justify-between items-center text-sm font-light text-stone-500 dark:text-stone-400 max-w-[1400px] gap-6">
          <p>© {new Date().getFullYear()} Sona. {loc.footer.license}</p>
          <div className="flex gap-10 font-medium">
            <Link href="https://github.com/AirSodaz/sona" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">{loc.footer.repo}</Link>
            <Link href="https://github.com/AirSodaz/sona/issues" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">{loc.footer.issue}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col">
      <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800/50 flex items-center justify-center mb-4 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3 transition-colors duration-300">{title}</h3>
      <p className="text-sm text-stone-600 dark:text-stone-400 font-light leading-snug transition-colors duration-300">{description}</p>
    </div>
  );
}
