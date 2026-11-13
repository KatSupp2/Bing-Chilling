import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useAuthFx, type AuthFxEvent } from "@/store/authFx"

const BODY = new Path2D()
BODY.roundRect(27.5, 10, 9, 6, 3)
BODY.roundRect(22, 18, 20, 6.5, 3.25)
BODY.roundRect(15.5, 26.5, 33, 7, 3.5)
const CONE = new Path2D("M19.5 37.5 H44.5 L32 55 Z")

const SPACING = 78
const GLYPH_SIZE = 26
const TILT = (-14 * Math.PI) / 180
const DRIFT_X = 0.02
const DRIFT_Y = 0.02
const BASE_ALPHA = 0.14
const LIGHT_MODE_BOOST = 1.5
const FADE_OUT = 1400
const SUCCESS_WARP = 900
const SHUDDER_PX = 4

const SPIN_SPEED = 0.0008
const SPIRAL_TWIST = 2.4
const SPIRAL_RADIUS = 320
const BREATHE = 0.07
const STORM_CALM = 1800
const STORM_BUILD = 1800
const PHASE_HOME = 0.06
const ENTER_SPREAD = 900
const ENTER_MS = 600
const ENTER_SHIFT = 16
const SHUDDER_TIME = 600
const RED_TIME = 900
const RED_HOLD = 0.35

const PERIOD_X = SPACING
const PERIOD_Y = SPACING * 2

const easeInOut = (t: number) => t * t * (3 - 2 * t)

export function LogoBackground({ active, vortex = false }: { active: boolean; vortex?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(active)
  const vortexRef = useRef(vortex)
  useEffect(() => {
    vortexRef.current = vortex
  }, [vortex])
  const startRef = useRef<() => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = 0
    let height = 0
    let dpr = 1
    let fg = "#171717"
    let danger = "#dc2626"
    let alphaBoost = 1
    let frame = 0
    let running = false
    let deactivatedAt = 0
    let lastErrorAt: number | null = null
    let success: { at: number; x: number; y: number } | null = null
    let enteredAt: number | null = null
    let posX = 0
    let posY = 0
    let lastTime: number | null = null
    let storm = 0
    let phase = 0
    let buildP = 0

    const readColors = () => {
      const css = getComputedStyle(document.documentElement)
      fg = css.getPropertyValue("--foreground").trim() || fg
      danger = css.getPropertyValue("--destructive").trim() || danger
      alphaBoost = document.documentElement.classList.contains("dark") ? 1 : LIGHT_MODE_BOOST
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      readColors()
      if (reduceMotion || !running) draw(performance.now())
    }

    const wrap = (v: number, period: number) => ((v % period) + period) % period

    const draw = (now: number) => {
      if (enteredAt !== null && now - enteredAt > ENTER_SPREAD + ENTER_MS) enteredAt = null
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineJoin = "round"
      ctx.lineWidth = 2.5

      if (!reduceMotion) {
        const dt = lastTime === null ? 0 : Math.min(now - lastTime, 50)
        lastTime = now
        posX = wrap(posX + DRIFT_X * dt, PERIOD_X)
        posY = wrap(posY + DRIFT_Y * dt, PERIOD_Y)

        const stormTarget = vortexRef.current ? 1 : 0
        if (stormTarget === 1) {
          buildP = Math.min(1, buildP + dt / STORM_BUILD)
          storm = Math.max(storm, easeInOut(buildP))
        } else {
          buildP = Math.max(0, buildP - dt / STORM_CALM)
          storm = Math.min(storm, easeInOut(buildP))
          if (storm < 0.001) storm = 0
        }
        phase += SPIN_SPEED * storm * dt
        if (stormTarget === 0) {
          const offset = Math.atan2(Math.sin(phase), Math.cos(phase))
          phase = offset - offset * PHASE_HOME * (1 - storm)
          if (Math.abs(phase) < 0.0005 && storm === 0) phase = 0
        }
      }
      const ox = posX
      const oy = posY
      const swirling = storm > 0 || phase !== 0
      const cx = width / 2
      const cy = height / 2

      const errAge = lastErrorAt === null ? Infinity : now - lastErrorAt
      const shakeAmp = errAge < SHUDDER_TIME ? SHUDDER_PX * (1 - errAge / SHUDDER_TIME) ** 2 : 0
      const redIn = Math.sin(Math.min(errAge / 80, 1) * (Math.PI / 2))
      const redP = errAge / RED_TIME
      const redOut = redP < RED_HOLD ? 1 : 1 - ((redP - RED_HOLD) / (1 - RED_HOLD)) ** 2
      const red = errAge < RED_TIME ? redIn * redOut : 0

      const warp = success ? Math.min(Math.max((now - success.at) / SUCCESS_WARP, 0), 1) : 0
      const warpEase = warp * warp * (3 - 2 * warp)

      const reach = swirling ? Math.hypot(width, height) / 2 + SPACING : 0
      const cMin = swirling ? Math.floor((cx - reach) / SPACING) - 2 : -2
      const cMax = swirling ? Math.ceil((cx + reach) / SPACING) + 2 : Math.ceil(width / SPACING) + 3
      const rMin = swirling ? Math.floor((cy - reach) / SPACING) - 3 : -2
      const rMax = swirling ? Math.ceil((cy + reach) / SPACING) + 3 : Math.ceil(height / SPACING) + 4

      for (let r = rMin; r < rMax; r++) {
        const stagger = ((r % 2) + 2) % 2 ? SPACING / 2 : 0
        for (let c = cMin; c < cMax; c++) {
          let x = c * SPACING + stagger + ox
          let y = r * SPACING + oy
          let scale = 1
          let alpha = BASE_ALPHA * alphaBoost
          let rot = TILT

          if (swirling) {
            const dx = x - cx
            const dy = y - cy
            const dist = Math.hypot(dx, dy)
            const ang = Math.atan2(dy, dx)
            const twist = storm * SPIRAL_TWIST * Math.exp(-dist / SPIRAL_RADIUS)
            const turn = phase + twist
            const radius = dist * (1 + storm * BREATHE * Math.sin(now * 0.0035 + ang * 3 + dist * 0.012))
            x = cx + Math.cos(ang + turn) * radius
            y = cy + Math.sin(ang + turn) * radius
            rot = TILT + turn * 1.15
            alpha += storm * 0.04
          }

          if (shakeAmp > 0) {
            const seed = r * 131 + c * 17
            x += Math.sin(now * 0.09 + seed) * shakeAmp
            y += Math.cos(now * 0.11 + seed * 1.3) * shakeAmp
          }

          if (enteredAt !== null) {
            const d = Math.min(Math.max((x / width + y / height) / 2, 0), 1)
            const p = Math.min(Math.max((now - enteredAt - d * ENTER_SPREAD) / ENTER_MS, 0), 1)
            const e = 1 - (1 - p) ** 3
            alpha *= e
            scale *= 0.6 + 0.4 * e
            x -= (1 - e) * ENTER_SHIFT
            y -= (1 - e) * ENTER_SHIFT
          }

          if (success && warp > 0) {
            x = success.x + (x - success.x) * (1 + warpEase * 0.9)
            y = success.y + (y - success.y) * (1 + warpEase * 0.9)
            scale *= 1 + warpEase * 0.8
            alpha *= 1 - warpEase
          }

          if (x < -60 || x > width + 60 || y < -60 || y > height + 60 || alpha <= 0.005) continue

          const k = (GLYPH_SIZE / 64) * scale * dpr
          const cos = Math.cos(rot) * k
          const sin = Math.sin(rot) * k
          ctx.setTransform(cos, sin, -sin, cos, x * dpr, y * dpr)
          ctx.translate(-32, -32)

          ctx.globalAlpha = alpha
          ctx.fillStyle = fg
          ctx.strokeStyle = fg
          ctx.fill(BODY)
          ctx.fill(CONE)
          ctx.stroke(CONE)

          if (red > 0.01) {
            ctx.globalAlpha = Math.min(alpha + 0.55, 0.85) * red
            ctx.fillStyle = danger
            ctx.strokeStyle = danger
            ctx.fill(BODY)
            ctx.fill(CONE)
            ctx.stroke(CONE)
          }
        }
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      draw(now)
      if (!activeRef.current && now - deactivatedAt > FADE_OUT) {
        running = false
        return
      }
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (activeRef.current) {
        success = null
        lastErrorAt = null
        enteredAt = reduceMotion ? null : performance.now()
      } else {
        deactivatedAt = performance.now()
      }
      if (reduceMotion) {
        draw(performance.now())
        return
      }
      if (!running) {
        running = true
        lastTime = null
        frame = requestAnimationFrame(loop)
      }
    }
    startRef.current = start

    const handleFx = (ev: AuthFxEvent) => {
      if (reduceMotion) return
      if (ev.kind === "error") lastErrorAt = performance.now()
      else success = { at: performance.now(), x: ev.x, y: ev.y }
    }
    const unsubscribe = useAuthFx.subscribe((state, prev) => {
      if (state.last && state.last !== prev.last) handleFx(state.last)
    })

    const themeObserver = new MutationObserver(() => {
      readColors()
      if (reduceMotion || !running) draw(performance.now())
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    resize()
    window.addEventListener("resize", resize)
    if (activeRef.current) start()

    return () => {
      cancelAnimationFrame(frame)
      unsubscribe()
      themeObserver.disconnect()
      window.removeEventListener("resize", resize)
    }
  }, [])

  useEffect(() => {
    if (activeRef.current === active) return
    activeRef.current = active
    startRef.current()
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full transition-opacity duration-1000 ease-out",
        active ? "opacity-100" : "opacity-0",
      )}
    />
  )
}
