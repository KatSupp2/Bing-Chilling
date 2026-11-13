import { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PlaceOrderDialog } from "@/components/PlaceOrderDialog"
import { PaymentStep, ReviewStep, ShippingStep } from "@/components/CheckoutSteps"
import { formatPrice } from "@/data/products"
import { usePerceivedProgress } from "@/hooks/usePerceivedProgress"
import {
  DELIVERY,
  paymentSummary,
  validatePayment,
  validateShipping,
  type Errors,
  type PaymentInfo,
  type ShippingInfo,
} from "@/lib/checkout"
import { cn } from "@/lib/utils"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"
import { useAuth } from "@/store/auth"
import { useCart } from "@/store/cart"
import { useNotifications } from "@/store/notifications"
import { recordOrder } from "@/store/orders"
import { getCheckoutDetails, saveCheckoutDetails } from "@/store/checkoutProfile"
import { useWelcome } from "@/store/welcome"

const STEPS = ["Shipping", "Payment", "Review"] as const
const NEXT_LABELS = ["Continue to payment", "Review order"]

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
  const userName = useAuth((s) => s.user?.name ?? "")
  const firstName = userName.trim().split(/\s+/)[0]
  const [saved] = useState(getCheckoutDetails)
  const [shipping, setShipping] = useState<ShippingInfo>(
    () => saved?.shipping ?? { name: userName, phone: "", address: "", city: "", delivery: "standard" },
  )
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(() =>
    saved ? { ...saved.payment, cvc: "" } : { method: "card", card: "", expiry: "", cvc: "", gcash: "" },
  )
  const [errors, setErrors] = useState<Errors>({})

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

  let subtotal = 0
  let count = 0
  for (const i of items) {
    subtotal += i.price * i.quantity
    count += i.quantity
  }
  const delivery = DELIVERY[shipping.delivery]
  const total = subtotal + delivery.fee

  const goTo = (next: number) => {
    setErrors({})
    setStep(next)
  }

  const continueToNext = () => {
    const found = step === 0 ? validateShipping(shipping) : validatePayment(paymentInfo)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      document.getElementById(`${step === 0 ? "ship" : "pay"}-${first}`)?.focus()
      return
    }
    goTo(step + 1)
  }
  const isLast = step === STEPS.length - 1

  const placeOrder = async () => {
    try {
      await payment.run(fakePayment(simulateFailure))
      saveCheckoutDetails(shipping, paymentInfo)
      const order = recordOrder({
        items,
        subtotal,
        fee: delivery.fee,
        total,
        delivery: delivery.label,
        eta: delivery.detail,
        shipTo: `${shipping.name}, ${shipping.address}, ${shipping.city}`,
        payment: paymentSummary(paymentInfo),
      })
      toast("Order placed. Thank you!", {
        description: "We'll let you know the moment it ships.",
      })
      push(order ? `Order ${order.id} placed: ${formatPrice(total)}` : `Order placed: ${formatPrice(total)}`)
      if (mounted.current) transitionTo("/orders?tab=pending", clear)
      else clear()
    } catch {
      toast("Your payment didn't go through.", {
        description: "No charge was made. Give it another try whenever you're ready.",
      })
      push("Payment failed: no charge was made")
    }
  }

  if (busy) {
    const done = payment.status === "done"
    const failed = payment.status === "failed"
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
        <div key={step} className="step-in">
          {saved && step < 2 && (
            <p className="bg-muted/60 text-muted-foreground mb-6 rounded-lg px-3 py-2 text-xs">
              {step === 0
                ? "Welcome back. We've filled in your details from last time."
                : paymentInfo.method === "card"
                  ? "Your saved card is ready. Just add the CVC to continue."
                  : "We've kept your payment choice from last time."}
            </p>
          )}
          {step === 0 && (
            <ShippingStep
              value={shipping}
              onChange={(next) => {
                setShipping(next)
                if (Object.keys(errors).length) setErrors(validateShipping(next))
              }}
              errors={errors}
            />
          )}
          {step === 1 && (
            <PaymentStep
              value={paymentInfo}
              onChange={(next) => {
                setPaymentInfo(next)
                if (Object.keys(errors).length) setErrors(validatePayment(next))
              }}
              errors={errors}
            />
          )}
          {isLast && (
            <ReviewStep items={items} shipping={shipping} payment={paymentInfo} subtotal={subtotal} onEdit={goTo}>
              <label className="text-muted-foreground flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                />
                Failed payment
              </label>
            </ReviewStep>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => (step === 0 ? transitionTo("/cart") : goTo(step - 1))}
        >
          {step === 0 ? "Back to cart" : "Back"}
        </Button>
        {isLast ? (
          <PlaceOrderDialog
            trigger={<Button disabled={busy}>Place order</Button>}
            total={total}
            itemCount={count}
            shipTo={`${shipping.name}, ${shipping.address}, ${shipping.city}`}
            delivery={`${delivery.label} · ${delivery.detail.toLowerCase()}`}
            payment={paymentSummary(paymentInfo)}
            onConfirm={placeOrder}
          />
        ) : (
          <Button onClick={continueToNext}>{NEXT_LABELS[step]}</Button>
        )}
      </CardFooter>
    </Card>
  )
}
