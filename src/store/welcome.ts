import { create } from "zustand"

type WelcomeMoment = {
  headline: string
  id: number
}

type WelcomeState = {
  current: WelcomeMoment | null
  gust: number
  show: (kind: "new" | "returning", name: string) => void
  dismiss: () => void
}

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

let nextId = 1

export const useWelcome = create<WelcomeState>()((set) => ({
  current: null,
  gust: 0,
  show: (kind, name) => {
    const who = name.trim() || "friend"
    const headline = kind === "new" ? `Welcome, ${who}.` : `${greeting()}, ${who}.`
    set({ current: { headline, id: nextId++ } })
  },
  dismiss: () => set((s) => (s.current ? { current: null, gust: s.gust + 1 } : s)),
}))
