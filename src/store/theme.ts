import { useEffect } from "react"
import { create } from "zustand"

type Theme = "light" | "dark"

const initial: Theme = "light"

type ThemeState = { theme: Theme; toggle: () => void }

export const useTheme = create<ThemeState>()((set) => ({
  theme: initial,
  toggle: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
}))

export function useApplyTheme() {
  const theme = useTheme((s) => s.theme)
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    root.style.colorScheme = theme
  }, [theme])
  return theme
}
