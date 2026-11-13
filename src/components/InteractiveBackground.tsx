import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useWelcome } from "@/store/welcome"

type Line = { y: number; phase: number }

const LINE_GAP = 26
const LINE_ALPHA = 0.24
const LIGHT_SURFACE_BOOST = 1.5

const WAVE_AMP = 22
const WAVE_FREQ = 0.0038
const WAVE_SPEED = 0.0003
const LINE_WIDTH = 1.4

const buildLines = (height: number): Line[] =>
  Array.from({ length: Math.ceil(height / LINE_GAP) + 3 }, (_, i) => ({
    y: (i - 1) * LINE_GAP,
    phase: i * 0.22,
  }))

const SPACING = 10
const SIGMA_X = 85
const RANGE_Y = 140
const SOFT = 30
const PUSH = 1.1
const TENSION = 0.22
const SPRING = 0.03
const DAMPING = 0.9
const GUST_TIME = 900
const GUST_WIDTH = 120
const GUST_PUSH = 1.3
const HIDE_FADE_MS = 1100

export function InteractiveBackground({ visible = true }: { visible?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hiddenSince = useRef<number | null>(visible ? null : 0)
  useEffect(() => {
    hiddenSince.current = visible ? null : performance.now()
  }, [visible])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = 0
    let height = 0
    let color = "#171717"
    let offsets: Float32Array[] = []
    let velocities: Float32Array[] = []
    let lines: Line[] = []
    let ys = new Float32Array(0)
    let inverse = "#ffffff"
    let alphaBoost = 1
    let invertedBoost = 1
    const paths: Path2D[] = []
    const mouse = { x: -9999, y: -9999, active: false }
    let frame = 0
    let gustAt: number | null = null

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.ceil(width / SPACING) + 2
      lines = buildLines(height)
      offsets = lines.map(() => new Float32Array(count))
      velocities = lines.map(() => new Float32Array(count))
      readColor()
    }

    const readColor = () => {
      const css = getComputedStyle(document.documentElement)
      color = css.getPropertyValue("--foreground").trim() || color
      inverse = css.getPropertyValue("--background").trim() || inverse
      const dark = document.documentElement.classList.contains("dark")
      alphaBoost = dark ? 1 : LIGHT_SURFACE_BOOST
      invertedBoost = dark ? LIGHT_SURFACE_BOOST : 1
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = color
      ctx.lineWidth = LINE_WIDTH
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      let gustFront: number | null = null
      let gustStrength = 0
      if (gustAt !== null) {
        const age = time - gustAt
        if (age >= 0 && age < GUST_TIME) {
          const p = age / GUST_TIME
          gustFront = -GUST_WIDTH * 2 + (width + GUST_WIDTH * 4) * p
          gustStrength = Math.sin(Math.PI * p)
        } else if (age >= GUST_TIME) {
          gustAt = null
        }
      }

      lines.forEach((line, li) => {
        const off = offsets[li]
        const vel = velocities[li]
        ctx.globalAlpha = LINE_ALPHA * alphaBoost
        const n = off.length
        if (ys.length !== n) ys = new Float32Array(n)

        for (let i = 0; i < n; i++) {
          ys[i] = line.y + WAVE_AMP * Math.sin(i * SPACING * WAVE_FREQ + time * WAVE_SPEED + line.phase)
        }

        if (!reduceMotion) {
          for (let i = 0; i < n; i++) {
            const left = off[i > 0 ? i - 1 : i]
            const right = off[i < n - 1 ? i + 1 : i]
            let force = -SPRING * off[i] + TENSION * (left + right - 2 * off[i])

            if (mouse.active) {
              const dx = i * SPACING - mouse.x
              const dy = ys[i] + off[i] - mouse.y
              const ady = Math.abs(dy)
              if (Math.abs(dx) < SIGMA_X * 3 && ady < RANGE_Y) {
                const gx = Math.exp(-(dx * dx) / (2 * SIGMA_X * SIGMA_X))
                const gy = 0.5 * (1 + Math.cos((Math.PI * ady) / RANGE_Y))
                const dir = dy / Math.sqrt(dy * dy + SOFT * SOFT)
                force += PUSH * dir * gx * gy
              }
            }

            if (gustFront !== null) {
              const d = (i * SPACING - gustFront) / GUST_WIDTH
              force -= GUST_PUSH * gustStrength * Math.exp(-d * d)
            }
            vel[i] = (vel[i] + force) * DAMPING
          }
          for (let i = 0; i < n; i++) off[i] += vel[i]
        }

        const path = new Path2D()
        path.moveTo(0, ys[0] + off[0])
        for (let i = 1; i < n - 1; i++) {
          const x = i * SPACING
          const y = ys[i] + off[i]
          const midX = x + SPACING / 2
          const midY = (y + ys[i + 1] + off[i + 1]) / 2
          path.quadraticCurveTo(x, y, midX, midY)
        }
        path.lineTo((n - 1) * SPACING, ys[n - 1] + off[n - 1])
        paths[li] = path
        ctx.stroke(path)
      })

      const zone = document.querySelector<HTMLElement>("[data-invert-zone]")?.getBoundingClientRect()
      if (zone && zone.bottom > 0 && zone.top < height) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(zone.left, zone.top, zone.width, zone.height)
        ctx.clip()
        ctx.globalAlpha = 1
        ctx.fillStyle = color
        ctx.fillRect(zone.left, zone.top, zone.width, zone.height)
        ctx.strokeStyle = inverse
        ctx.globalAlpha = LINE_ALPHA * invertedBoost
        for (let li = 0; li < lines.length; li++) ctx.stroke(paths[li])
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }

    const loop = (time: number) => {
      const hidden = hiddenSince.current
      if (hidden === null || time - hidden < HIDE_FADE_MS) draw(time)
      frame = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }

    resize()
    window.addEventListener("resize", resize)
    const onScroll = () => draw(0)
    if (reduceMotion) window.addEventListener("scroll", onScroll, { passive: true })

    const themeObserver = new MutationObserver(() => {
      readColor()
      if (reduceMotion) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const unsubscribeGust = useWelcome.subscribe((state, prev) => {
      if (!reduceMotion && state.gust !== prev.gust) gustAt = performance.now()
    })

    if (reduceMotion) {
      draw(0)
    } else {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.documentElement.addEventListener("pointerleave", onLeave)
      frame = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(frame)
      unsubscribeGust()
      themeObserver.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 h-full w-full transition-opacity duration-1000 ease-out",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  )
}
