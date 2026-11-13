import { useCallback, useEffect, useRef, useState } from "react"

type Status = "idle" | "running" | "done" | "failed"

const CAP = 90
const TAU = 600

type Options = {
  holdMs?: number
  failHoldMs?: number
}

export function usePerceivedProgress({ holdMs = 500, failHoldMs = 0 }: Options = {}) {
  const [value, setValue] = useState(0)
  const [status, setStatus] = useState<Status>("idle")
  const frame = useRef<number | null>(null)
  const running = useRef(false)

  const stop = () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
  }

  useEffect(() => stop, [])

  const run = useCallback(
    async <T,>(task: Promise<T>): Promise<T> => {
      if (running.current) throw new Error("Progress is already running")
      running.current = true
      setStatus("running")
      setValue(0)

      const start = performance.now()
      const tick = (now: number) => {
        setValue(CAP * (1 - Math.exp(-(now - start) / TAU)))
        frame.current = requestAnimationFrame(tick)
      }
      frame.current = requestAnimationFrame(tick)

      try {
        const result = await task
        stop()
        setValue(100)
        setStatus("done")
        await new Promise((r) => setTimeout(r, holdMs))
        return result
      } catch (err) {
        stop()
        setValue(0)
        if (failHoldMs > 0) {
          setStatus("failed")
          await new Promise((r) => setTimeout(r, failHoldMs))
        }
        setStatus("idle")
        throw err
      } finally {
        running.current = false
      }
    },
    [holdMs, failHoldMs],
  )

  return { value, status, run }
}
