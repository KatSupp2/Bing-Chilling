import { useState, type FormEvent } from "react"
import { TransitionLink } from "@/components/TransitionLink"
import { subscribeNewsletter } from "@/store/newsletter"
import { toast } from "sonner"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/store/auth"
import { useConnection } from "@/store/connection"
import { useNotifications } from "@/store/notifications"

const year = new Date().getFullYear()

const shop = (category: string) => `/?cat=${encodeURIComponent(category)}`

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Shop",
    links: [
      ["All products", "/"],
      ["Apparel", shop("Apparel")],
      ["Home & Living", shop("Home & Living")],
      ["Bags & Accessories", shop("Bags & Accessories")],
      ["Audio", shop("Audio")],
      ["Phones & Cameras", shop("Phones & Cameras")],
    ],
  },
  {
    title: "Explore",
    links: [
      ["PC Parts", shop("PC Parts")],
      ["Beauty", shop("Beauty")],
      ["Sports & Outdoors", shop("Sports & Outdoors")],
      ["Footwear", shop("Footwear")],
      ["Gaming", shop("Gaming")],
      ["Toys & Hobbies", shop("Toys & Hobbies")],
    ],
  },
  {
    title: "Your account",
    links: [
      ["Manage account", "/account"],
      ["Pending orders", "/orders?tab=pending"],
      ["Order history", "/orders?tab=history"],
      ["Cart", "/cart"],
    ],
  },
]

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
    subscribeNewsletter(value)
    setEmail("")
  }

  const link = "text-background/70 hover:text-background transition-colors"

  return (
    <footer data-invert-zone className="text-background mt-16">
      <div className="mx-auto max-w-6xl px-4 pt-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Logo
                title=""
                className="[&_.fill-primary]:fill-background [&_.fill-primary-foreground]:fill-foreground [&_.stroke-primary-foreground]:stroke-foreground"
              />
              <span className="text-lg font-semibold">Bing Chilling</span>
            </div>
            <p className="text-background/70 text-sm">Cool deals, chill prices</p>
          </div>

          <form onSubmit={subscribe} noValidate className="w-full space-y-2 md:max-w-md">
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
              {status?.type === "success" && <span className="text-background/80">{status.message}</span>}
            </p>
          </form>
        </div>

        <nav aria-label="Footer" className="border-background/15 mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 text-xs md:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-background text-xs font-semibold">{column.title}</p>
              <ul className="space-y-2.5">
                {column.links.map(([label, to]) => (
                  <li key={label}>
                    <TransitionLink to={to} className={link}>
                      {label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="space-y-3">
            <p className="text-background text-xs font-semibold">Help</p>
            <ul className="text-background/70 space-y-2.5">
              <li>7-day easy returns</li>
              <li>Support Mon–Sat, 9am–6pm</li>
              <li>
                <button type="button" onClick={() => goOffline(true)} className={link}>
                  Lost Connection?
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="border-background/15 text-background/60 mt-10 flex flex-col gap-3 border-t py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>© {year} Bing Chilling</p>
            <div className="flex items-center gap-3">
              <TransitionLink to="/account" className={link}>
                Manage account
              </TransitionLink>
              <span aria-hidden="true" className="text-background/30">
                |
              </span>
              <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={link}>
                Back to top
              </button>
            </div>
          </div>
          <p>Philippines</p>
        </div>
      </div>
    </footer>
  )
}
