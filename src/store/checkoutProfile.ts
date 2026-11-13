import { create } from "zustand"
import type { PaymentInfo, ShippingInfo } from "@/lib/checkout"
import { useAuth } from "./auth"

type SavedDetails = { shipping: ShippingInfo; payment: Omit<PaymentInfo, "cvc"> }

type CheckoutProfileStore = {
  profiles: Record<string, SavedDetails>
}

const useCheckoutProfileStore = create<CheckoutProfileStore>()(() => ({ profiles: {} }))

export function saveCheckoutDetails(shipping: ShippingInfo, payment: PaymentInfo) {
  const key = useAuth.getState().user?.email
  if (!key) return
  const saved: SavedDetails = {
    shipping: { ...shipping },
    payment: { method: payment.method, card: payment.card, expiry: payment.expiry, gcash: payment.gcash },
  }
  useCheckoutProfileStore.setState((s) => ({ profiles: { ...s.profiles, [key]: saved } }))
}

export function getCheckoutDetails(): SavedDetails | undefined {
  const key = useAuth.getState().user?.email
  return key ? useCheckoutProfileStore.getState().profiles[key] : undefined
}
