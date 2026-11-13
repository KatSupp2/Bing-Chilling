import { useEffect, useRef, useState } from "react"
import { Logo } from "@/components/Logo"
import { toggleThemeFrom, useTheme } from "@/store/theme"

const CORD = 52
const MAX_PULL = 72
const MIN_PULL = -12
const TRIGGER = 30
const MAX_ANGLE = 40
const TAP_KICK = 14
const SPRING_Y = 0.15
const DAMP_Y = 0.82
const SPRING_A = 0.012
const DAMP_A = 0.975
const FRAME = 1000 / 60

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function PullSwitch() {
  const dark = useTheme((s) => s.theme === "dark")
  const [grabbing, setGrabbing] = useState(false)
  const swingRef = useRef<HTMLDivElement>(null)
  const cordRef = useRef<HTMLButtonElement>(null)
  const charmRef = useRef<HTMLSpanElement>(null)
  const sim = useRef({ y: 0, vy: 0, a: 0, va: 0, last: 0, frame: 0, tapPending: false })
  const drag = useRef<{ x: number; y: number; moved: boolean; t: number } | null>(null)

  const render = () => {
    const s = sim.current
    if (swingRef.current) swingRef.current.style.transform = `rotate(${s.a}deg)`
    if (cordRef.current) cordRef.current.style.transform = `translateY(${s.y - MAX_PULL}px)`
  }

  const fire = () => {
    const rect = charmRef.current?.getBoundingClientRect()
    toggleThemeFrom(rect ? rect.left + rect.width / 2 : 32, rect ? rect.top + rect.height / 2 : 64)
  }

  const step = (now: number) => {
    const s = sim.current
    const f = s.last ? Math.min((now - s.last) / FRAME, 3) : 1
    s.last = now
    if (!drag.current?.moved) {
      const wasFalling = s.vy > 0
      s.vy = (s.vy - SPRING_Y * s.y * f) * Math.pow(DAMP_Y, f)
      s.y += s.vy * f
      if (s.y < MIN_PULL) {
        s.y = MIN_PULL
        s.vy = Math.abs(s.vy) * 0.3
      }
      if (s.tapPending && wasFalling && s.vy <= 0) {
        s.tapPending = false
        fire()
      }
      s.va = (s.va - SPRING_A * s.a * f) * Math.pow(DAMP_A, f)
      s.a = clamp(s.a + s.va * f, -MAX_ANGLE, MAX_ANGLE)
    }
    render()
    const settled =
      !drag.current && !s.tapPending && Math.abs(s.y) < 0.1 && Math.abs(s.vy) < 0.05 && Math.abs(s.a) < 0.05 && Math.abs(s.va) < 0.02
    if (settled) {
      s.y = s.vy = s.a = s.va = 0
      s.last = 0
      s.frame = 0
      render()
      return
    }
    s.frame = requestAnimationFrame(step)
  }

  const wake = () => {
    if (!sim.current.frame) sim.current.frame = requestAnimationFrame(step)
  }

  useEffect(() => () => cancelAnimationFrame(sim.current.frame), [])

  const tap = () => {
    if (reducedMotion()) {
      fire()
      return
    }
    const s = sim.current
    if (s.tapPending) return
    s.tapPending = true
    s.vy = TAP_KICK
    s.va += (Math.random() < 0.5 ? -1 : 1) * (0.7 + Math.random() * 0.6)
    wake()
  }

  return (
    <div className="vt-theme-toggle pointer-events-none fixed top-0 left-6 z-50 sm:left-8">
      <span aria-hidden="true" className="bg-foreground/30 absolute top-0 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-b-full" />
      <div className="cord-sway origin-top">
        <div ref={swingRef} className="origin-top">
          <button
            ref={cordRef}
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label="Dark mode"
            className={
              "group pointer-events-auto relative flex w-10 touch-none flex-col items-center outline-none select-none " +
              (grabbing ? "cursor-grabbing" : "cursor-grab")
            }
            style={{ transform: `translateY(${-MAX_PULL}px)` }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              drag.current = { x: e.clientX, y: e.clientY, moved: false, t: performance.now() }
            }}
            onPointerMove={(e) => {
              const d = drag.current
              if (!d || reducedMotion()) return
              const dx = e.clientX - d.x
              const dy = e.clientY - d.y
              if (!d.moved && Math.hypot(dx, dy) < 4) return
              if (!d.moved) {
                d.moved = true
                setGrabbing(true)
              }
              const s = sim.current
              const now = performance.now()
              const dt = Math.max((now - d.t) / FRAME, 0.5)
              d.t = now
              const y = clamp(dy * 0.85, 0, MAX_PULL)
              const a = clamp((Math.atan2(-dx, CORD + y + 14) * 180) / Math.PI, -MAX_ANGLE, MAX_ANGLE)
              s.vy = (y - s.y) / dt
              s.va = (a - s.a) / dt
              s.y = y
              s.a = a
              wake()
            }}
            onPointerUp={() => {
              const d = drag.current
              drag.current = null
              setGrabbing(false)
              if (!d) return
              if (!d.moved) {
                tap()
                return
              }
              const s = sim.current
              if (s.y >= TRIGGER) fire()
              s.vy = Math.min(s.vy, 0)
              wake()
            }}
            onPointerCancel={() => {
              drag.current = null
              setGrabbing(false)
              wake()
            }}
            onClick={(e) => {
              if (e.detail === 0) tap()
            }}
          >
            <span className="bg-foreground/40 w-px" style={{ height: CORD + MAX_PULL }} />
            <span
              ref={charmRef}
              className="group-focus-visible:ring-ring/60 -mt-px rounded-[10px] shadow-md transition-transform group-hover:scale-105 group-focus-visible:ring-3"
            >
              <Logo title="" className="size-7" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
