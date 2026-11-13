import type { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/data/products"
import { DELIVERY, METHODS, digits, paymentSummary, type Errors, type PaymentInfo, type ShippingInfo } from "@/lib/checkout"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/store/cart"

function Field({
  id,
  label,
  error,
  className,
  ...props
}: { id: string; label: string; error?: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className="h-10"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  )
}

function Option({
  name,
  checked,
  onSelect,
  title,
  detail,
  aside,
}: {
  name: string
  checked: boolean
  onSelect: () => void
  title: string
  detail: string
  aside?: ReactNode
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-3 text-sm transition-colors",
        checked ? "border-foreground" : "hover:bg-muted/50",
      )}
    >
      <span className="flex items-center gap-3">
        <input type="radio" name={name} checked={checked} onChange={onSelect} className="accent-foreground size-4" />
        <span>
          <span className="block font-medium">{title}</span>
          <span className="text-muted-foreground block text-xs">{detail}</span>
        </span>
      </span>
      {aside && <span className="font-medium tabular-nums">{aside}</span>}
    </label>
  )
}

export function ShippingStep({
  value,
  onChange,
  errors,
}: {
  value: ShippingInfo
  onChange: (next: ShippingInfo) => void
  errors: Errors
}) {
  const set = (key: keyof ShippingInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">Where should we send it?</h3>
        <p className="text-muted-foreground text-sm">We'll only use this to get your order to you.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ship-name" label="Full name" autoComplete="name" value={value.name} onChange={set("name")} error={errors.name} />
        <Field
          id="ship-phone"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0917 123 4567"
          value={value.phone}
          onChange={set("phone")}
          error={errors.phone}
        />
        <Field
          id="ship-address"
          label="Street address"
          autoComplete="street-address"
          placeholder="Unit, building, street"
          className="sm:col-span-2"
          value={value.address}
          onChange={set("address")}
          error={errors.address}
        />
        <Field id="ship-city" label="City" autoComplete="address-level2" value={value.city} onChange={set("city")} error={errors.city} />
      </div>
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Delivery speed</legend>
        {(Object.keys(DELIVERY) as ShippingInfo["delivery"][]).map((key) => (
          <Option
            key={key}
            name="delivery"
            checked={value.delivery === key}
            onSelect={() => onChange({ ...value, delivery: key })}
            title={DELIVERY[key].label}
            detail={DELIVERY[key].detail}
            aside={DELIVERY[key].fee ? formatPrice(DELIVERY[key].fee) : "Free"}
          />
        ))}
      </fieldset>
    </div>
  )
}

export function PaymentStep({
  value,
  onChange,
  errors,
}: {
  value: PaymentInfo
  onChange: (next: PaymentInfo) => void
  errors: Errors
}) {
  const cardDisplay = digits(value.card).replace(/(\d{4})(?=\d)/g, "$1 ")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium">How would you like to pay?</h3>
        <p className="text-muted-foreground text-sm">You won't be charged until you place your order.</p>
      </div>
      <fieldset className="space-y-2">
        <legend className="sr-only">Payment method</legend>
        {(Object.keys(METHODS) as PaymentInfo["method"][]).map((key) => (
          <Option
            key={key}
            name="method"
            checked={value.method === key}
            onSelect={() => onChange({ ...value, method: key })}
            title={METHODS[key].label}
            detail={METHODS[key].detail}
          />
        ))}
      </fieldset>
      {value.method === "card" && (
        <div key="card" className="step-in grid gap-4 sm:grid-cols-4">
          <Field
            id="pay-card"
            label="Card number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            className="sm:col-span-2"
            value={cardDisplay}
            onChange={(e) => onChange({ ...value, card: digits(e.target.value).slice(0, 16) })}
            error={errors.card}
          />
          <Field
            id="pay-expiry"
            label="Expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={value.expiry}
            onChange={(e) => {
              const d = digits(e.target.value).slice(0, 4)
              onChange({ ...value, expiry: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d })
            }}
            error={errors.expiry}
          />
          <Field
            id="pay-cvc"
            label="CVC"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={value.cvc}
            onChange={(e) => onChange({ ...value, cvc: digits(e.target.value).slice(0, 4) })}
            error={errors.cvc}
          />
        </div>
      )}
      {value.method === "gcash" && (
        <div key="gcash" className="step-in max-w-xs">
          <Field
            id="pay-gcash"
            label="GCash mobile number"
            type="tel"
            inputMode="tel"
            placeholder="0917 123 4567"
            value={value.gcash}
            onChange={(e) => onChange({ ...value, gcash: e.target.value })}
            error={errors.gcash}
          />
        </div>
      )}
      {value.method === "cod" && (
        <p key="cod" className="step-in text-muted-foreground text-sm">
          Please have the exact amount ready when your order arrives.
        </p>
      )}
    </div>
  )
}

function ReviewSection({ title, onEdit, children }: { title: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">{title}</p>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-xs font-medium underline-offset-4 hover:underline">
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export function ReviewStep({
  items,
  shipping,
  payment,
  subtotal,
  onEdit,
  children,
}: {
  items: CartItem[]
  shipping: ShippingInfo
  payment: PaymentInfo
  subtotal: number
  onEdit: (step: number) => void
  children?: ReactNode
}) {
  const fee = DELIVERY[shipping.delivery].fee
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-medium">One last look</h3>
        <p className="text-muted-foreground text-sm">Make sure everything's right before we send it your way.</p>
      </div>
      <ReviewSection title="Your items">
        <ul className="space-y-1 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-4">
              <span className="truncate">
                {i.name} <span className="text-muted-foreground">× {i.quantity}</span>
              </span>
              <span className="shrink-0 tabular-nums">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </ReviewSection>
      <div className="grid gap-5 sm:grid-cols-2">
        <ReviewSection title="Delivering to" onEdit={() => onEdit(0)}>
          <p className="text-sm">
            {shipping.name}
            <br />
            {shipping.address}, {shipping.city}
            <br />
            <span className="text-muted-foreground">
              {shipping.phone} · {DELIVERY[shipping.delivery].label}
            </span>
          </p>
        </ReviewSection>
        <ReviewSection title="Paying with" onEdit={() => onEdit(1)}>
          <p className="text-sm">{paymentSummary(payment)}</p>
        </ReviewSection>
      </div>
      <Separator />
      <div className="space-y-1 text-sm">
        <div className="text-muted-foreground flex justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="text-muted-foreground flex justify-between">
          <span>Delivery</span>
          <span className="tabular-nums">{fee ? formatPrice(fee) : "Free"}</span>
        </div>
        <div className="flex justify-between pt-1 text-base font-semibold">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(subtotal + fee)}</span>
        </div>
      </div>
      {children}
    </div>
  )
}
