import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/store/auth"
import { useConnection } from "@/store/connection"
import { useWelcome } from "@/store/welcome"

const CHECK_MS = 1200
const BACK_MS = 900

type Phase = "away" | "checking" | "still" | "back"

export function OfflineScreen() {
  const offline = useConnection((s) => s.offline)
  const since = useConnection((s) => s.since)
  const goOffline = useConnection((s) => s.goOffline)

  useEffect(() => {
    const onOffline = () => goOffline(false)
    window.addEventListener("offline", onOffline)
    return () => window.removeEventListener("offline", onOffline)
  }, [goOffline])

  if (!offline) return null
  return <OfflineStage key={since} />
}

function OfflineStage() {
  const simulated = useConnection((s) => s.simulated)
  const goOnline = useConnection((s) => s.goOnline)
  const firstName = useAuth((s) => s.user?.name.trim().split(/\s+/)[0])
  const [phase, setPhase] = useState<Phase>("away")
  const timers = useRef<number[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return
    const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)")]
    if (focusable.length === 0) {
      e.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
      e.preventDefault()
      first.focus()
    }
  }

  useEffect(() => {
    buttonRef.current?.focus()
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  const welcomeBack = () => {
    setPhase("back")
    later(() => {
      goOnline()
      useWelcome.setState((s) => ({ gust: s.gust + 1 }))
    }, BACK_MS)
  }

  useEffect(() => {
    if (simulated) return
    const onOnline = () => welcomeBack()
    window.addEventListener("online", onOnline)
    return () => window.removeEventListener("online", onOnline)
  })

  useEffect(() => {
    if (phase === "still") buttonRef.current?.focus()
  }, [phase])

  const tryAgain = () => {
    dialogRef.current?.focus()
    setPhase("checking")
    later(() => (!simulated && navigator.onLine ? welcomeBack() : setPhase("still")), CHECK_MS)
  }

  const headline =
    phase === "back" ? "You're back." : `Take a breather${firstName ? `, ${firstName}` : ""}.`
  const body =
    phase === "still"
      ? "Still away. No rush at all, take your time. We'll be right here when it returns."
      : "Your connection stepped out for a moment. Everything you were doing is safe, your cart included. We'll pick up right where you left off."

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      onKeyDown={trapFocus}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      aria-describedby="offline-body"
      className="offline-veil bg-background/92 fixed outline-none inset-0 z-[45] flex items-center justify-center px-6"
    >
      <div className="max-w-md text-center">
        <div className="relative mx-auto flex size-24 items-center justify-center">
          <span aria-hidden="true" className="offline-breathe border-foreground/20 absolute inset-0 rounded-full border" />
          <span
            aria-hidden="true"
            className="offline-breathe bg-foreground/5 absolute inset-3 rounded-full"
            style={{ animationDelay: "400ms" }}
          />
          <Logo title="" className="relative size-10" />
        </div>

        <p className="text-muted-foreground mt-8 font-mono text-[11px] tracking-[0.25em] uppercase">
          {phase === "back" ? "Connected" : "Connection paused"}
        </p>
        <h2 id="offline-title" key={phase === "back" ? "back" : "away"} className="offline-text mt-3 text-4xl font-semibold tracking-tighter md:text-5xl">
          {headline}
        </h2>
        <p id="offline-body" aria-live="polite" className="text-muted-foreground mt-4 text-base leading-relaxed">
          {phase === "back" ? "Picking up right where you left off." : body}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button
            ref={buttonRef}
            className="h-11 min-w-40 rounded-full"
            disabled={phase === "checking" || phase === "back"}
            aria-busy={phase === "checking"}
            onClick={tryAgain}
          >
            {phase === "checking" ? "Reconnecting…" : phase === "back" ? "Welcome back" : "Try again"}
          </Button>
          {simulated && phase !== "back" && (
            <Button
              variant="outline"
              className="h-11 min-w-40 rounded-full"
              disabled={phase === "checking"}
              onClick={() => {
                dialogRef.current?.focus()
                welcomeBack()
              }}
            >
              Back Online!
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
