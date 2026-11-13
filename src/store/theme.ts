import { useEffect } from "react"
import { flushSync } from "react-dom"
import { create } from "zustand"

type Theme = "light" | "dark"

type ThemeState = { theme: Theme; toggle: () => void }

export const useTheme = create<ThemeState>()((set) => ({
  theme: "light",
  toggle: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
}))

const applyToDocument = (theme: Theme) => {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export function toggleThemeFrom(x: number, y: number) {
  const root = document.documentElement
  const flip = () => {
    useTheme.getState().toggle()
    applyToDocument(useTheme.getState().theme)
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!document.startViewTransition || reduceMotion || root.dataset.vt) {
    flip()
    return
  }
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  root.style.setProperty("--reveal-x", `${x}px`)
  root.style.setProperty("--reveal-y", `${y}px`)
  root.style.setProperty("--reveal-r", `${radius}px`)
  root.dataset.vt = "theme"
  const transition = document.startViewTransition(() => flushSync(flip))
  transition.finished.finally(() => {
    if (root.dataset.vt === "theme") delete root.dataset.vt
  })
}

export function useApplyTheme() {
  const theme = useTheme((s) => s.theme)
  useEffect(() => applyToDocument(theme), [theme])
  return theme
}
