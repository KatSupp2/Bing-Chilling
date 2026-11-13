import { create } from "zustand"
import { useAuth } from "./auth"

type AppNotification = {
  id: string
  message: string
  createdAt: number
  read: boolean
}

type NotificationStore = {
  inboxes: Record<string, AppNotification[]>
  push: (message: string) => void
  markAllRead: () => void
}

const EMPTY: AppNotification[] = []
const currentUser = () => useAuth.getState().user?.email

const useNotificationStore = create<NotificationStore>()((set) => {
  const update = (fn: (items: AppNotification[]) => AppNotification[]) => {
    const key = currentUser()
    if (!key) return
    set((s) => ({ inboxes: { ...s.inboxes, [key]: fn(s.inboxes[key] ?? EMPTY) } }))
  }

  return {
    inboxes: {},
    push: (message) =>
      update((items) => [{ id: crypto.randomUUID(), message, createdAt: Date.now(), read: false }, ...items]),
    markAllRead: () => update((items) => items.map((n) => ({ ...n, read: true }))),
  }
})

type NotificationView = Pick<NotificationStore, "push" | "markAllRead"> & { items: AppNotification[] }

export function useNotifications(): NotificationView
export function useNotifications<T>(selector: (inbox: NotificationView) => T): T
export function useNotifications<T>(selector?: (inbox: NotificationView) => T) {
  const email = useAuth((s) => s.user?.email)
  const items = useNotificationStore((s) => (email && s.inboxes[email]) || EMPTY)
  const push = useNotificationStore((s) => s.push)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const view: NotificationView = { items, push, markAllRead }
  return selector ? selector(view) : view
}
