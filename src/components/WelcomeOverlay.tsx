import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useWelcome } from "@/store/welcome"

const SHOW_MS = 1200
const LEAVE_MS = 300

export function WelcomeOverlay() {
  const current = useWelcome((s) => s.current)
  const dismiss = useWelcome((s) => s.dismiss)
  const [leavingId, setLeavingId] = useState<number | null>(null)

  const leave = useCallback(() => {
    if (!current) return
    setLeavingId(current.id)
    window.setTimeout(dismiss, LEAVE_MS)
  }, [current, dismiss])

  useEffect(() => {
    if (!current) return
    const timer = window.setTimeout(leave, SHOW_MS)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && leave()
    window.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("keydown", onKey)
    }
  }, [current, leave])

  if (!current) return null

  return (
    <div
      key={current.id}
      role="status"
      aria-live="polite"
      onClick={leave}
      className={cn(
        "welcome-veil bg-background/85 fixed inset-0 z-[60] flex cursor-pointer items-center justify-center overflow-hidden",
        leavingId === current.id && "welcome-leave",
      )}
    >
      {[18, 34, 52, 67, 81].map((top, i) => (
        <span
          key={top}
          aria-hidden="true"
          className="welcome-breeze via-foreground/25 pointer-events-none absolute left-0 h-px w-2/5 bg-gradient-to-r from-transparent to-transparent"
          style={{ top: `${top}%`, animationDelay: `${i * 50}ms` }}
        />
      ))}

      <div className="welcome-content relative px-6 text-center">
        <h2 className="text-5xl leading-[1.05] font-semibold tracking-tighter md:text-7xl">
          {current.headline.split("").map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="welcome-letter inline-block whitespace-pre"
              style={{ animationDelay: `${60 + i * 11}ms` }}
            >
              {ch}
            </span>
          ))}
          <span className="sr-only">{current.headline}</span>
        </h2>
      </div>
    </div>
  )
}
