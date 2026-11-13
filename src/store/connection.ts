import { create } from "zustand"

type ConnectionStore = {
  offline: boolean
  simulated: boolean
  since: number
  goOffline: (simulated: boolean) => void
  goOnline: () => void
}

export const useConnection = create<ConnectionStore>()((set) => ({
  offline: false,
  simulated: false,
  since: 0,
  goOffline: (simulated) => set({ offline: true, simulated, since: Date.now() }),
  goOnline: () => set({ offline: false, simulated: false }),
}))
