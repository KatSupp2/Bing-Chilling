export const DELIVERY = {
  standard: { label: "Standard delivery", detail: "Arrives in 3–5 days", fee: 0 },
  express: { label: "Express delivery", detail: "Arrives in 1–2 days", fee: 150 },
} as const

export const CARD_BRANDS = { visa: "Visa", mastercard: "Mastercard" } as const
export type CardBrand = keyof typeof CARD_BRANDS

export const BANKS = { maribank: "MariBank", gcash: "GCash", maya: "Maya", gotyme: "GoTyme Bank" } as const
export type BankKey = keyof typeof BANKS

export const METHODS = {
  card: { label: "Credit or debit card", detail: "Visa, Mastercard" },
  bank: { label: "Online banking", detail: "MariBank, GCash, Maya, GoTyme Bank" },
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
  brand: CardBrand
  bank: BankKey
  number: string
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
  if (p.method === "cod" || !missing(p.number)) return {}
  return { number: p.method === "card" ? "Add your card number" : `Add your ${BANKS[p.bank]} number` }
}

export const paymentSummary = (p: PaymentInfo) =>
  p.method === "cod"
    ? METHODS.cod.label
    : `${p.method === "card" ? CARD_BRANDS[p.brand] : BANKS[p.bank]} ending in ${digits(p.number).slice(-4)}`

export const EMPTY_PAYMENT: PaymentInfo = { method: "card", brand: "visa", bank: "gcash", number: "" }
