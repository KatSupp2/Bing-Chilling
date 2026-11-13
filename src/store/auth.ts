import { create } from "zustand"

const DEMO_ACCOUNT = { name: "Admin", email: "admin", password: "admin" }
type Account = { name: string; email: string; password: string }
type SessionUser = { name: string; email: string }

type AuthState = {
  accounts: Account[]
  user: SessionUser | null
  register: (account: Account) => void
  login: (email: string, password: string) => void
  logout: () => void
  canLogin: (email: string, password: string) => boolean
  isEmailTaken: (email: string) => boolean
}

const normalize = (email: string) => email.trim().toLowerCase()

export const useAuth = create<AuthState>()((set, get) => ({
  accounts: [DEMO_ACCOUNT],
  user: null,
  register: ({ name, email, password }) => {
    const key = normalize(email)
    if (get().accounts.some((a) => a.email === key)) return
    const account = { name: name.trim(), email: key, password }
    set((s) => ({ accounts: [...s.accounts, account], user: { name: account.name, email: key } }))
  },
  login: (email, password) => {
    const account = get().accounts.find((a) => a.email === normalize(email) && a.password === password)
    if (account) set({ user: { name: account.name, email: account.email } })
  },
  logout: () => set({ user: null }),
  canLogin: (email, password) =>
    get().accounts.some((a) => a.email === normalize(email) && a.password === password),
  isEmailTaken: (email) => get().accounts.some((a) => a.email === normalize(email)),
}))
