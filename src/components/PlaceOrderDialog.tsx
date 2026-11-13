import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatPrice } from "@/data/products"
import { cn } from "@/lib/utils"

const HOLD_MS = 1200

function HoldToConfirm({ onConfirm, children }: { onConfirm: () => void; children: ReactNode }) {
  const [holding, setHolding] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const start = () => {
    if (holding) return
    setHolding(true)
    timer.current = window.setTimeout(() => {
      setHolding(false)
      onConfirm()
    }, HOLD_MS)
  }
  const stop = () => {
    window.clearTimeout(timer.current)
    setHolding(false)
  }

  return (
    <button
      type="button"
      aria-describedby="hold-hint"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        start()
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault()
          start()
        }
      }}
      onKeyUp={(e) => (e.key === " " || e.key === "Enter") && stop()}
      onBlur={stop}
      onContextMenu={(e) => e.preventDefault()}
      className="bg-primary text-primary-foreground focus-visible:ring-ring/50 relative h-12 flex-1 touch-none overflow-hidden rounded-full px-6 text-sm font-medium outline-none select-none focus-visible:ring-3"
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-primary-foreground/25 absolute inset-y-0 left-0 ease-linear",
          holding ? "w-full transition-[width]" : "w-0 transition-[width] duration-200",
        )}
        style={holding ? { transitionDuration: `${HOLD_MS}ms` } : undefined}
      />
      <span className="relative">{holding ? "Keep holding…" : children}</span>
    </button>
  )
}

export function PlaceOrderDialog({
  trigger,
  total,
  itemCount,
  shipTo,
  payment,
  delivery,
  onConfirm,
}: {
  trigger: ReactNode
  total: number
  itemCount: number
  shipTo: string
  payment: string
  delivery: string
  onConfirm: () => void
}) {
  const [open, setOpen] = useState(false)

  const rows = [
    ["Items", `${itemCount} item${itemCount === 1 ? "" : "s"}`],
    ["Delivering to", shipTo],
    ["Delivery", delivery],
    ["Paying with", payment],
  ]

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 p-0 sm:max-w-md">
        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.25em] uppercase">Confirm your order</p>
            <AlertDialogTitle className="text-2xl font-semibold tracking-tight">Ready to place it?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              Take a moment to check everything. Once placed, your order goes straight to packing.
            </AlertDialogDescription>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">You'll be charged</p>
            <p className="text-5xl font-semibold tracking-tighter tabular-nums">{formatPrice(total)}</p>
          </div>

          <dl className="divide-y rounded-xl border text-sm">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-6 px-4 py-2.5">
                <dt className="text-muted-foreground shrink-0">{label}</dt>
                <dd className="truncate text-right font-medium">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-muted/50 space-y-3 border-t p-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <AlertDialogCancel className="h-12 rounded-full px-6" autoFocus>
              Not yet
            </AlertDialogCancel>
            <HoldToConfirm
              onConfirm={() => {
                setOpen(false)
                onConfirm()
              }}
            >
              Hold to place order
            </HoldToConfirm>
          </div>
          <p id="hold-hint" className="sr-only">
            Press and hold the button for a second to confirm. Letting go early cancels.
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
