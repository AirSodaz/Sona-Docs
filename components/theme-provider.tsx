"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  systemTheme: ResolvedTheme
  setTheme: (theme: Theme | ((theme: Theme) => Theme)) => void
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  storageKey?: string
  attribute?: "class" | `data-${string}`
  disableTransitionOnChange?: boolean
}

const DEFAULT_STORAGE_KEY = "theme"
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light"
}

function getStoredTheme(storageKey: string, fallback: Theme): Theme {
  if (typeof window === "undefined") {
    return fallback
  }

  try {
    const value = window.localStorage.getItem(storageKey)

    if (value === "light" || value === "dark" || value === "system") {
      return value
    }
  } catch {
    // Ignore storage failures in private browsing or restricted embeds.
  }

  return fallback
}

function temporarilyDisableTransitions() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{transition:none!important}",
    ),
  )
  document.head.appendChild(style)
  window.getComputedStyle(document.body)
  window.setTimeout(() => style.remove(), 1)
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = DEFAULT_STORAGE_KEY,
  attribute = "class",
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const fallbackTheme = enableSystem ? defaultTheme : defaultTheme === "system" ? "light" : defaultTheme
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getStoredTheme(storageKey, fallbackTheme),
  )
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() =>
    getSystemTheme(),
  )

  const resolvedTheme = theme === "system" ? systemTheme : theme

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)

    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light")
    }

    handleChange()
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  React.useEffect(() => {
    const root = document.documentElement

    if (disableTransitionOnChange) {
      temporarilyDisableTransitions()
    }

    if (attribute === "class") {
      root.classList.toggle("dark", resolvedTheme === "dark")
    } else {
      root.setAttribute(attribute, resolvedTheme)
    }

    root.style.colorScheme = resolvedTheme
  }, [attribute, disableTransitionOnChange, resolvedTheme])

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return
      }

      setThemeState(
        event.newValue === "light" ||
          event.newValue === "dark" ||
          event.newValue === "system"
          ? event.newValue
          : fallbackTheme,
      )
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [fallbackTheme, storageKey])

  const setTheme = React.useCallback<ThemeContextValue["setTheme"]>(
    (nextTheme) => {
      setThemeState((currentTheme) => {
        const value =
          typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme

        try {
          window.localStorage.setItem(storageKey, value)
        } catch {
          // Ignore storage failures in private browsing or restricted embeds.
        }

        return value
      })
    },
    [storageKey],
  )

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, systemTheme, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
