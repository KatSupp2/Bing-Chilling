import { useState, type FormEvent } from "react"
import { ArrowUpIcon, CheckCircle2Icon } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/store/auth"
import { useConnection } from "@/store/connection"
import { useNotifications } from "@/store/notifications"

const year = new Date().getFullYear()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

export function Footer() {
  const goOffline = useConnection((s) => s.goOffline)
  const pushNotification = useNotifications((s) => s.push)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null)

  const subscribe = (e: FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) {
      setStatus({ type: "error", message: "Please enter your email address." })
      return
    }
    if (!EMAIL_PATTERN.test(value)) {
      setStatus({ type: "error", message: "That doesn't look like an email. Try something like you@text.com" })
      return
    }
    const firstName = useAuth.getState().user?.name.trim().split(/\s+/)[0]
    const hi = firstName ? `, ${firstName}` : ""
    setStatus({ type: "success", message: `You're in${hi}. Something good will find you at ${value}.` })
    toast(`Welcome to the inner circle${hi}.`, {
      description: "Only early drops and deals worth your time.",
      position: "bottom-left",
    })
    pushNotification("You joined the Bing Chilling community")
    setEmail("")
  }

  return (
    <footer data-invert-zone className="text-background mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="max-w-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Logo
              title=""
              className="[&_.fill-primary]:fill-background [&_.fill-primary-foreground]:fill-foreground [&_.stroke-primary-foreground]:stroke-foreground"
            />
            <span className="text-lg font-semibold">Bing Chilling</span>
          </div>
          <p className="text-background/70 text-sm">Cool deals, chill prices</p>
          <form onSubmit={subscribe} noValidate className="space-y-2">
            <label htmlFor="newsletter" className="text-sm font-medium">
              Join the community
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status?.type === "error") setStatus(null)
                }}
                placeholder="you@example.com"
                aria-invalid={status?.type === "error"}
                aria-describedby="newsletter-status"
                className="border-background/40 text-background placeholder:text-background/60 focus:border-background aria-invalid:border-destructive bg-foreground h-9 min-w-0 flex-1 rounded-md border px-3 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-background text-foreground h-9 rounded-md px-4 text-sm font-medium transition-opacity hover:opacity-90"
              >
                Sign up
              </button>
            </div>
            <p id="newsletter-status" aria-live="polite" className="min-h-5 text-xs">
              {status?.type === "error" && <span className="text-destructive">{status.message}</span>}
              {status?.type === "success" && (
                <span className="text-background/80 inline-flex items-center gap-1">
                  <CheckCircle2Icon className="size-3.5" /> {status.message}
                </span>
              )}
            </p>
          </form>
        </div>
      </div>

      <div className="border-background/15 border-t">
        <div className="text-background/60 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>© {year} Bing Chilling</p>
            <button
              type="button"
              onClick={() => goOffline(true)}
              className="hover:text-background underline-offset-4 transition-colors hover:underline"
            >
              Lost Connection?
            </button>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-background flex items-center gap-1 transition-colors"
          >
            Back to top <ArrowUpIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
