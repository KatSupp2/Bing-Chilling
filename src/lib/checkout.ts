export const DELIVERY = {
  standard: { label: "Standard delivery", detail: "Arrives in 3–5 days", fee: 0 },
  express: { label: "Express delivery", detail: "Arrives in 1–2 days", fee: 150 },
} as const

export const METHODS = {
  card: { label: "Credit or debit card", detail: "Visa, Mastercard, JCB" },
  gcash: { label: "GCash", detail: "Pay with your GCash number" },
  cod: { label: "Cash on delivery", detail: "Pay when your order arrives" },
} as const

export type ShippingInfo = {
  name: string
  phone: string
  address: string
  city: string
  delivery: keyof typeof DELIVERY
}

export type PaymentInfo = {
  method: keyof typeof METHODS
  card: string
  expiry: string
  cvc: string
  gcash: string
}

export type Errors = Partial<Record<string, string>>

export const digits = (value: string) => value.replace(/\D/g, "")
const missing = (value: string) => value.trim() === ""

export function validateShipping(s: ShippingInfo): Errors {
  const errors: Errors = {}
  if (missing(s.name)) errors.name = "Who should we deliver to?"
  if (missing(s.phone)) errors.phone = "Add a number we can reach you on"
  if (missing(s.address)) errors.address = "Add your street, building and unit"
  if (missing(s.city)) errors.city = "Add your city"
  return errors
}

export function validatePayment(p: PaymentInfo): Errors {
  const errors: Errors = {}
  if (p.method === "card") {
    if (missing(p.card)) errors.card = "Add your card number"
    if (missing(p.expiry)) errors.expiry = "Add the expiry date"
    if (missing(p.cvc)) errors.cvc = "Add the code on the back"
  }
  if (p.method === "gcash" && missing(p.gcash)) errors.gcash = "Add your GCash number"
  return errors
}

export const paymentSummary = (p: PaymentInfo) =>
  p.method === "card"
    ? `Card ending in ${digits(p.card).slice(-4)}`
    : p.method === "gcash"
      ? `GCash ending in ${digits(p.gcash).slice(-4)}`
      : METHODS.cod.label
