"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import * as motion from 'motion/react-client'

interface Asset {
  name: string
  size: number
  url: string
}

interface ReleaseInfo {
  version: string
  size: string
  url: string
  os: string
}

function detectOS() {
  if (typeof window === 'undefined') return 'unknown'
  const ua = window.navigator.userAgent.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('mac')) return 'macos'
  if (ua.includes('linux')) return 'linux'
  return 'unknown'
}

function findBestAsset(assets: Asset[], os: string): Asset | null {
  if (!assets || assets.length === 0) return null;
  
  let candidates: Asset[] = [];
  
  if (os === 'windows') {
    candidates = assets.filter(a => a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().endsWith('.msi'));
  } else if (os === 'macos') {
    candidates = assets.filter(a => a.name.toLowerCase().endsWith('.dmg') || a.name.toLowerCase().endsWith('.pkg') || a.name.toLowerCase().endsWith('.app.tar.gz'));
  } else if (os === 'linux') {
    candidates = assets.filter(a => a.name.toLowerCase().endsWith('.appimage') || a.name.toLowerCase().endsWith('.deb') || a.name.toLowerCase().endsWith('.rpm'));
  }
  
  if (candidates.length > 0) {
    // Return largest candidate (usually the main installer)
    return candidates.reduce((prev, current) => (prev.size > current.size) ? prev : current);
  }
  
  return null;
}

export function DownloadButton({ text }: { text: string }) {
  const [release, setRelease] = useState<ReleaseInfo | null>(null)

  useEffect(() => {
    fetch('/api/github-release')
      .then((res) => {
        if (!res.ok) return null;
        return res.json()
      })
      .then((data) => {
        if (data && data.version) {
          const os = detectOS()
          const bestAsset = findBestAsset(data.assets, os)
          
          let downloadUrl = data.url
          let sizeStr = ''
          
          if (bestAsset) {
            downloadUrl = bestAsset.url
            sizeStr = (bestAsset.size / (1024 * 1024)).toFixed(1) + ' MB'
          }
          
          setRelease({
            version: data.version,
            size: sizeStr,
            url: downloadUrl,
            os,
          })
        }
      })
      .catch(() => {
        // Silently ignore network errors to prevent console spam
      })
  }, [])

  let btnText = text;
  if (release?.os === 'windows') btnText = `${text} (Windows)`;
  else if (release?.os === 'macos') btnText = `${text} (macOS)`;
  else if (release?.os === 'linux') btnText = `${text} (Linux)`;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <Link href={release?.url || "https://github.com/AirSodaz/sona/releases"} target="_blank">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 rounded-full text-sm font-medium hover:bg-stone-700 dark:hover:bg-white transition-colors shadow-lg shadow-stone-200 dark:shadow-none flex items-center gap-2"
        >
          {btnText}
          <Download size={16} />
        </motion.button>
      </Link>
      <div className="h-6 mt-2 absolute -bottom-8 flex items-center justify-center w-full">
        {release ? (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-stone-400 dark:text-stone-500 font-mono tracking-wider"
          >
            {release.version} {release.size ? `· ~${release.size}` : ''}
          </motion.span>
        ) : null}
      </div>
    </div>
  )
}
