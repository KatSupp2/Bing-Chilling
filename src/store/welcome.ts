import { create } from "zustand"

type WelcomeMoment = {
  headline: string
  subline?: string
  duration?: number
  id: number
}

type WelcomeState = {
  current: WelcomeMoment | null
  gust: number
  show: (kind: "new" | "returning" | "farewell", name: string) => void
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
    if (kind === "farewell") {
      set({
        current: {
          headline: `Until next time, ${who}`,
          subline: "The door's always open. Come back anytime",
          duration: 2800,
          id: nextId++,
        },
      })
      return
    }
    const headline = kind === "new" ? `Welcome, ${who}` : `${greeting()}, ${who}`
    set({ current: { headline, id: nextId++ } })
  },
  dismiss: () => set((s) => (s.current ? { current: null, gust: s.gust + 1 } : s)),
}))
