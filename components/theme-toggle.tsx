"use client"

import { Moon, Sun } from "lucide-react"
import { useSyncExternalStore } from "react"
import { useTheme } from "@/components/theme-provider"

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  const { resolvedTheme, setTheme } = useTheme()

  if (!mounted) {
    return (
      <div className="inline-flex h-8 w-8 items-center justify-center p-2">
        <div className="h-4 w-4" />
      </div>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative inline-flex items-center justify-center rounded-md p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors focus:outline-none cursor-pointer"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
