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
  arch: string
}

function detectPlatform(): { os: string; arch: string } {
  if (typeof window === 'undefined') return { os: 'unknown', arch: 'unknown' }
  
  const ua = window.navigator.userAgent.toLowerCase()
  let os = 'unknown'
  let arch = 'x64' // Default to x64 for most desktop environments

  // Detect OS
  if (ua.includes('win')) os = 'windows'
  else if (ua.includes('mac')) os = 'macos'
  else if (ua.includes('linux')) os = 'linux'

  // Detect Architecture
  // Check userAgentData if available (modern Chromium browsers)
  const nav = window.navigator as any
  if (nav.userAgentData?.getHighEntropyValues) {
    // We can't await this synchronously here, but we check what we can from userAgent string as fallback
  }

  // Fallback Architecture detection via UA and Platform
  const platform = (nav.platform || '').toLowerCase()
  if (
    ua.includes('aarch64') || 
    ua.includes('arm') || 
    platform.includes('arm') || 
    platform.includes('aarch64') ||
    platform.includes('mac') // Modern Macs (M1+) are often Apple Silicon, but UA reports Intel. We default to x64 unless we know better, but for Apple, universal binaries or offering Apple Silicon is common. We'll rely on the specific asset mapping below to provide a safe fallback if we guess wrong.
  ) {
    arch = 'arm64'
  }
  
  // Specific fix for macOS: If it's a Mac, and the platform says 'macintel', it MIGHT be Rosetta 2.
  // Real detection requires async getHighEntropyValues, so for synchronous detection, we rely on the user to pick if the default is wrong, but we'll try to guess based on the presence of 'arm' anywhere or default to x64.
  if (os === 'macos' && !platform.includes('arm') && ua.includes('intel mac os x')) {
     // A lot of Apple Silicon Macs still report Intel Mac OS X.
     // We will default to x64, but the ideal is a universal binary or letting the user choose from a dropdown later.
     arch = 'x64' 
  }

  return { os, arch }
}

function findBestAsset(assets: Asset[], platform: { os: string; arch: string }): Asset | null {
  if (!assets || assets.length === 0) return null;
  
  let candidates: Asset[] = [];
  const { os, arch } = platform;
  
  if (os === 'windows') {
    if (arch === 'arm64') {
      candidates = assets.filter(a => a.name.toLowerCase().includes('arm64') && (a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().endsWith('.msi')));
    }
    // Fallback or explicit x64
    if (candidates.length === 0) {
      candidates = assets.filter(a => a.name.toLowerCase().includes('x64') && (a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().endsWith('.msi')));
    }
    // If still none, just grab any exe
    if (candidates.length === 0) {
      candidates = assets.filter(a => a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().endsWith('.msi'));
    }
  } else if (os === 'macos') {
    if (arch === 'arm64') {
      candidates = assets.filter(a => a.name.toLowerCase().includes('aarch64') && (a.name.toLowerCase().endsWith('.dmg') || a.name.toLowerCase().endsWith('.app.tar.gz')));
    }
    if (candidates.length === 0) {
      candidates = assets.filter(a => (a.name.toLowerCase().includes('x64') || a.name.toLowerCase().includes('x86_64')) && (a.name.toLowerCase().endsWith('.dmg') || a.name.toLowerCase().endsWith('.app.tar.gz')));
    }
    if (candidates.length === 0) {
      candidates = assets.filter(a => a.name.toLowerCase().endsWith('.dmg') || a.name.toLowerCase().endsWith('.app.tar.gz'));
    }
  } else if (os === 'linux') {
    candidates = assets.filter(a => a.name.toLowerCase().includes('amd64') && (a.name.toLowerCase().endsWith('.appimage') || a.name.toLowerCase().endsWith('.deb') || a.name.toLowerCase().endsWith('.rpm')));
    if (candidates.length === 0) {
       candidates = assets.filter(a => a.name.toLowerCase().endsWith('.appimage') || a.name.toLowerCase().endsWith('.deb') || a.name.toLowerCase().endsWith('.rpm'));
    }
  }
  
  if (candidates.length > 0) {
    // Return largest candidate (usually the main installer, not a signature file)
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
          const platform = detectPlatform()
          const bestAsset = findBestAsset(data.assets, platform)
          
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
            os: platform.os,
            arch: platform.arch,
          })
        }
      })
      .catch(() => {
        // Silently ignore network errors to prevent console spam
      })
  }, [])

  let btnText = text;
  if (release?.os === 'windows') {
    btnText = release.arch === 'arm64' ? `${text} (Windows ARM)` : `${text} (Windows)`;
  } else if (release?.os === 'macos') {
    btnText = release.arch === 'arm64' ? `${text} (macOS Apple Silicon)` : `${text} (macOS Intel)`;
  } else if (release?.os === 'linux') {
    btnText = `${text} (Linux)`;
  }

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
