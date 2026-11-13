import { create } from "zustand"

const DEMO_ACCOUNT = { name: "Admin", email: "admin", password: "admin" }
type Account = { name: string; email: string; password: string }
type SessionUser = { name: string; email: string }

type AuthState = {
  accounts: Account[]
  user: SessionUser | null
  justRegistered: SessionUser | null
  register: (account: Account) => void
  login: (email: string, password: string) => void
  logout: () => void
  canLogin: (email: string, password: string) => boolean
  clearJustRegistered: () => void
  changePassword: (current: string, next: string) => boolean
  deleteAccount: () => string | null
  isEmailTaken: (email: string) => boolean
}

const normalize = (email: string) => email.trim().toLowerCase()

export const isProtectedAccount = (email: string) => email === DEMO_ACCOUNT.email

export const useAuth = create<AuthState>()((set, get) => ({
  accounts: [DEMO_ACCOUNT],
  user: null,
  justRegistered: null,
  register: ({ name, email, password }) => {
    const key = normalize(email)
    if (get().accounts.some((a) => a.email === key)) return
    const account = { name: name.trim(), email: key, password }
    set((s) => ({ accounts: [...s.accounts, account], justRegistered: { name: account.name, email: key } }))
  },
  login: (email, password) => {
    const account = get().accounts.find((a) => a.email === normalize(email) && a.password === password)
    if (account) set({ user: { name: account.name, email: account.email } })
  },
  logout: () => set({ user: null }),
  canLogin: (email, password) =>
    get().accounts.some((a) => a.email === normalize(email) && a.password === password),
  clearJustRegistered: () => set({ justRegistered: null }),
  changePassword: (current, next) => {
    const email = get().user?.email
    if (!email || isProtectedAccount(email)) return false
    const account = get().accounts.find((a) => a.email === email)
    if (!account || account.password !== current) return false
    set((s) => ({ accounts: s.accounts.map((a) => (a.email === email ? { ...a, password: next } : a)) }))
    return true
  },
  deleteAccount: () => {
    const email = get().user?.email
    if (!email || isProtectedAccount(email)) return null
    set((s) => ({ accounts: s.accounts.filter((a) => a.email !== email), user: null }))
    return email
  },
  isEmailTaken: (email) => get().accounts.some((a) => a.email === normalize(email)),
}))
