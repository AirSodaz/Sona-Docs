import 'server-only';

import { GoogleGenAI } from '@google/genai';
import { ProxyAgent, setGlobalDispatcher } from 'undici';

let cachedClient: GoogleGenAI | null = null;
let didInitializeTransport = false;
let configuredProxyUrl: string | null = null;

function getConfiguredProxyUrl() {
  const proxyUrl =
    process.env.HTTPS_PROXY?.trim() || process.env.HTTP_PROXY?.trim();

  return proxyUrl || null;
}

function ensureGeminiTransport() {
  if (didInitializeTransport) {
    return configuredProxyUrl;
  }

  configuredProxyUrl = getConfiguredProxyUrl();

  if (configuredProxyUrl) {
    setGlobalDispatcher(new ProxyAgent(configuredProxyUrl));
  }

  didInitializeTransport = true;

  return configuredProxyUrl;
}

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  ensureGeminiTransport();

  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

export function getGeminiTransportDiagnostics() {
  const proxyUrl = ensureGeminiTransport();

  return {
    hasProxy: Boolean(proxyUrl),
    proxyUrl,
  };
}
