import { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { formatPrice } from "@/data/products"
import { usePerceivedProgress } from "@/hooks/usePerceivedProgress"
import { cn } from "@/lib/utils"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"
import { useAuth } from "@/store/auth"
import { useCart } from "@/store/cart"
import { useNotifications } from "@/store/notifications"
import { useWelcome } from "@/store/welcome"

const STEPS = ["Shipping", "Payment", "Review"] as const

const fakePayment = (fail: boolean) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Payment declined")) : resolve()), fail ? 1500 : 2500),
  )

export function CheckoutPage() {
  const { items, clear } = useCart()
  const push = useNotifications((s) => s.push)
  const transitionTo = useTransitionNavigate()
  const [step, setStep] = useState(0)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const payment = usePerceivedProgress({ holdMs: 1400, failHoldMs: 1600 })
  const firstName = useAuth((s) => s.user?.name.trim().split(/\s+/)[0])

  const busy = payment.status !== "idle"

  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (payment.status === "done") useWelcome.setState((s) => ({ gust: s.gust + 1 }))
  }, [payment.status])

  if (items.length === 0 && !busy) return <Navigate to="/cart" replace />

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const isLast = step === STEPS.length - 1

  const placeOrder = async () => {
    try {
      await payment.run(fakePayment(simulateFailure))
      toast("Order placed. Thank you!", { description: "We'll let you know the moment it ships." })
      push(`Order placed: ${formatPrice(total)}`)
      if (mounted.current) transitionTo("/", clear)
      else clear()
    } catch {
      toast.error("Your payment didn't go through.", {
        description: "No charge was made. Give it another try whenever you're ready.",
      })
      push("Payment failed: no charge was made")
    }
  }

  if (busy) {
    const done = payment.status === "done"
    const failed = payment.status === "failed"
    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    return (
      <Card className="mx-auto max-w-2xl">
        <div className="pay-stage flex min-h-80 flex-col items-center justify-center px-8 py-14 text-center" aria-live="polite">
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.25em] uppercase">
            {done ? "Payment confirmed" : failed ? "Payment declined" : "Processing payment"}
          </p>
          <p
            className={cn(
              "mt-4 text-5xl font-semibold tracking-tighter tabular-nums transition-colors duration-300 sm:text-6xl",
              failed && "pay-declined text-destructive",
              done && "text-emerald-600 dark:text-emerald-400",
            )}
          >
            {formatPrice(total)}
          </p>
          <p
            key={payment.status}
            className={cn(
              "text-muted-foreground mt-3 text-sm",
              (done || failed) && "pay-done text-foreground text-base font-medium",
            )}
          >
            {done
              ? `It's yours${firstName ? `, ${firstName}` : ""}.`
              : failed
                ? "No charge was made. Taking you back to review."
                : `${count} item${count === 1 ? "" : "s"}, almost yours. This only takes a moment.`}
          </p>
          <div className="mt-10 w-full max-w-sm">
            <div className="bg-foreground/10 h-1 w-full overflow-hidden rounded-full">
              <div
                className={cn(
                  "bg-foreground h-full rounded-full transition-[width] ease-out",
                  failed ? "duration-[900ms] ease-in-out" : "duration-200",
                  !done && !failed && "pay-shimmer",
                )}
                style={{ width: `${payment.value}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-3 font-mono text-[11px] tabular-nums">
              {failed ? "Reset" : `${Math.round(payment.value)}%`}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="space-y-3">
        <CardTitle>Checkout</CardTitle>
        <div className="text-muted-foreground flex justify-between text-sm">
          {STEPS.map((s, idx) => (
            <span key={s} className={idx <= step ? "text-foreground font-medium" : ""}>
              {idx + 1}. {s}
            </span>
          ))}
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} />
      </CardHeader>

      <CardContent className="min-h-32">
        {
          <div key={step} className="step-in space-y-3">
            <p className="text-muted-foreground">
              {STEPS[step]} step placeholder. Order total: {formatPrice(total)}
            </p>
            {isLast && (
              <label className="text-muted-foreground flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                />
                Simulate a failed payment
              </label>
            )}
          </div>
        }
      </CardContent>

      <CardFooter className="justify-between">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => (step === 0 ? transitionTo("/cart") : setStep(step - 1))}
        >
          {step === 0 ? "Back to cart" : "Back"}
        </Button>
        {isLast ? (
          <ConfirmDialog
            trigger={<Button disabled={busy}>Place order</Button>}
            title="Place this order?"
            description={`You will be charged ${formatPrice(total)}.`}
            confirmLabel="Place order"
            onConfirm={placeOrder}
          />
        ) : (
          <Button onClick={() => setStep(step + 1)}>Next</Button>
        )}
      </CardFooter>
    </Card>
  )
}
