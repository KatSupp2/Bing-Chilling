import { create } from "zustand"

export type AuthFxEvent = { kind: "error" | "success"; x: number; y: number; id: number }

type AuthFxState = {
  last: AuthFxEvent | null
  emit: (kind: AuthFxEvent["kind"], origin?: Element | null) => void
}

let nextId = 1

export const useAuthFx = create<AuthFxState>()((set) => ({
  last: null,
  emit: (kind, origin) => {
    const rect = origin?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    set({ last: { kind, x, y, id: nextId++ } })
  },
}))
