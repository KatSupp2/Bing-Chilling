import { create } from "zustand"
import { omit } from "@/lib/utils"
import { useAuth } from "./auth"

type NewsletterStore = { subscriptions: Record<string, string> }

const useNewsletterStore = create<NewsletterStore>()(() => ({ subscriptions: {} }))

const currentUser = () => useAuth.getState().user?.email

export function subscribeNewsletter(address: string) {
  const key = currentUser()
  if (key) useNewsletterStore.setState((s) => ({ subscriptions: { ...s.subscriptions, [key]: address } }))
}

export function unsubscribeNewsletter(key = currentUser()) {
  if (!key) return
  useNewsletterStore.setState((s) => ({ subscriptions: omit(s.subscriptions, key) }))
}

export function useNewsletterAddress() {
  const email = useAuth((s) => s.user?.email)
  return useNewsletterStore((s) => (email ? s.subscriptions[email] : undefined))
}
