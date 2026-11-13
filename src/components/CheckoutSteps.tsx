import type { ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { formatPrice, placeholderImage } from "@/data/products"
import { BankLogo, CardLogo } from "@/components/PaymentLogos"
import {
  BANKS,
  CARD_BRANDS,
  DELIVERY,
  METHODS,
  digits,
  paymentSummary,
  type BankKey,
  type Errors,
  type PaymentInfo,
  type ShippingInfo,
} from "@/lib/checkout"
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
        className="h-11"
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
      <h3 className="text-lg font-semibold tracking-tight">Where should we send it?</h3>
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

function ProviderPicker<K extends string>({
  label,
  options,
  value,
  onSelect,
  logo,
}: {
  label: string
  options: Record<K, string>
  value: K
  onSelect: (key: K) => void
  logo: (key: K) => ReactNode
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {(Object.keys(options) as K[]).map((key) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(key)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition-colors",
              active ? "border-foreground" : "hover:bg-muted/50",
            )}
          >
            {logo(key)}
            <span className={cn(active ? "font-medium" : "text-muted-foreground")}>{options[key]}</span>
          </button>
        )
      })}
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
  const isCard = value.method === "card"
  const shown = isCard ? digits(value.number).replace(/(\d{4})(?=\d)/g, "$1 ") : value.number

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold tracking-tight">How would you like to pay?</h3>
      <fieldset className="space-y-2">
        <legend className="sr-only">Payment method</legend>
        {(Object.keys(METHODS) as PaymentInfo["method"][]).map((key) => (
          <Option
            key={key}
            name="method"
            checked={value.method === key}
            onSelect={() => key !== value.method && onChange({ ...value, method: key, number: "" })}
            title={METHODS[key].label}
            detail={METHODS[key].detail}
            aside={
              key === "card" ? (
                <span className="hidden gap-1.5 sm:flex">
                  <CardLogo brand="visa" />
                  <CardLogo brand="mastercard" />
                </span>
              ) : key === "bank" ? (
                <span className="hidden gap-1.5 sm:flex">
                  {(Object.keys(BANKS) as BankKey[]).map((b) => (
                    <BankLogo key={b} bank={b} />
                  ))}
                </span>
              ) : undefined
            }
          />
        ))}
      </fieldset>
      {value.method !== "cod" && (
        <div key={value.method} className="step-in space-y-4">
          {isCard ? (
            <ProviderPicker
              label="Card type"
              options={CARD_BRANDS}
              value={value.brand}
              onSelect={(brand) => onChange({ ...value, brand })}
              logo={(brand) => <CardLogo brand={brand} />}
            />
          ) : (
            <ProviderPicker
              label="Bank or e-wallet"
              options={BANKS}
              value={value.bank}
              onSelect={(bank) => onChange({ ...value, bank })}
              logo={(bank) => <BankLogo bank={bank} />}
            />
          )}
          <Field
            id="pay-number"
            label={isCard ? "Card number" : `${BANKS[value.bank]} account or mobile number`}
            inputMode="numeric"
            autoComplete={isCard ? "cc-number" : "off"}
            placeholder={isCard ? "1234 5678 9012 3456" : "0917 123 4567"}
            className="max-w-sm"
            value={shown}
            onChange={(e) => onChange({ ...value, number: digits(e.target.value).slice(0, isCard ? 16 : 13) })}
            error={errors.number}
          />
        </div>
      )}
    </div>
  )
}

function ReviewPanel({ title, change, onChange, children }: { title: string; change: string; onChange: () => void; children: ReactNode }) {
  return (
    <div className="bg-muted/30 flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-base font-semibold">{title}</p>
        <button
          type="button"
          onClick={onChange}
          className="hover:bg-muted rounded-full border px-3 py-1 text-xs font-medium transition-colors"
        >
          {change}
        </button>
      </div>
      <div className="space-y-1 text-sm">{children}</div>
    </div>
  )
}

export function ReviewStep({
  shipping,
  payment,
  onEdit,
  children,
}: {
  shipping: ShippingInfo
  payment: PaymentInfo
  onEdit: (step: number) => void
  children?: ReactNode
}) {
  const delivery = DELIVERY[shipping.delivery]
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold tracking-tight">Make sure everything's right before we send it your way.</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <ReviewPanel title="Delivery" change="Change" onChange={() => onEdit(0)}>
          <p className="font-medium">{shipping.name}</p>
          <p>
            {shipping.address}, {shipping.city}
          </p>
          <p className="text-muted-foreground">{shipping.phone}</p>
          <p className="text-muted-foreground pt-2">
            {delivery.label} · {delivery.detail.toLowerCase()}
          </p>
        </ReviewPanel>
        <ReviewPanel title="Payment" change="Change" onChange={() => onEdit(1)}>
          <div className="flex items-center gap-3">
            {payment.method === "card" && <CardLogo brand={payment.brand} />}
            {payment.method === "bank" && <BankLogo bank={payment.bank} />}
            <p className="font-medium">{paymentSummary(payment)}</p>
          </div>
        </ReviewPanel>
      </div>
      {children}
    </div>
  )
}

export function OrderSummary({
  items,
  subtotal,
  fee,
  className,
}: {
  items: CartItem[]
  subtotal: number
  fee: number
  className?: string
}) {
  return (
    <aside className={cn("bg-card ring-foreground/10 rounded-xl p-6 ring-1", className)}>
      <p className="text-lg font-semibold tracking-tight">Order summary</p>
      <ul className="mt-5 space-y-4">
        {items.map((i) => (
          <li key={i.id} className="flex items-center gap-3">
            <img
              src={i.image}
              alt=""
              className="bg-muted size-14 shrink-0 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = placeholderImage(i.name)
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{i.name}</p>
              <p className="text-muted-foreground text-xs">Qty {i.quantity}</p>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums">{formatPrice(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>
      <Separator className="my-5" />
      <div className="space-y-2 text-sm">
        <div className="text-muted-foreground flex justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <div className="text-muted-foreground flex justify-between">
          <span>Delivery</span>
          <span className="tabular-nums">{fee ? formatPrice(fee) : "Free"}</span>
        </div>
      </div>
      <Separator className="my-5" />
      <div className="flex items-baseline justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-2xl font-semibold tracking-tight tabular-nums">{formatPrice(subtotal + fee)}</span>
      </div>
    </aside>
  )
}
