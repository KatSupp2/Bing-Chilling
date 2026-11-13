import { create } from "zustand"
import { omit } from "@/lib/utils"
import { useAuth } from "./auth"
import type { CartItem } from "./cart"

export const STATUSES = ["preparing", "shipped", "out", "delivered"] as const
export type OrderStatus = (typeof STATUSES)[number]

export const STATUS_INFO: Record<OrderStatus, { label: string; detail: string; notice: string }> = {
  preparing: { label: "Preparing", detail: "We're carefully packing your order", notice: "is being prepared" },
  shipped: { label: "Shipped", detail: "On its way to your local hub", notice: "has shipped" },
  out: { label: "Out for delivery", detail: "Your rider is on the way and will arrive today", notice: "is out for delivery" },
  delivered: { label: "Delivered", detail: "Delivered. Enjoy it!", notice: "has been delivered" },
}

export type Order = {
  id: string
  placedAt: number
  items: CartItem[]
  subtotal: number
  fee: number
  total: number
  delivery: string
  eta: string
  shipTo: string
  payment: string
  status: OrderStatus
  updatedAt: number
  deliveredAt?: number
}

type NewOrder = Omit<Order, "id" | "placedAt" | "status" | "updatedAt" | "deliveredAt">

type OrdersStore = {
  histories: Record<string, Order[]>
  seenAt: Record<string, number>
  markSeen: () => void
  record: (order: NewOrder) => Order | null
  setStatus: (id: string, status: OrderStatus) => void
}

const EMPTY: Order[] = []
const currentUser = () => useAuth.getState().user?.email

const orderId = () =>
  `BC-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`

const useOrdersStore = create<OrdersStore>()((set) => ({
  histories: {},
  seenAt: {},
  markSeen: () => {
    const key = currentUser()
    if (key) set((s) => ({ seenAt: { ...s.seenAt, [key]: Date.now() } }))
  },
  record: (details) => {
    const key = currentUser()
    if (!key) return null
    const order: Order = {
      ...details,
      items: details.items.map((i) => ({ ...i })),
      id: orderId(),
      placedAt: Date.now(),
      updatedAt: Date.now(),
      status: "preparing",
    }
    set((s) => ({ histories: { ...s.histories, [key]: [order, ...(s.histories[key] ?? EMPTY)] } }))
    return order
  },
  setStatus: (id, status) => {
    const key = currentUser()
    if (!key) return
    set((s) => ({
      histories: {
        ...s.histories,
        [key]: (s.histories[key] ?? EMPTY).map((o) =>
          o.id === id ? { ...o, status, updatedAt: Date.now(), deliveredAt: status === "delivered" ? Date.now() : undefined } : o,
        ),
      },
    }))
  },
}))

export const recordOrder = (details: NewOrder) => useOrdersStore.getState().record(details)
export const setOrderStatus = (id: string, status: OrderStatus) => useOrdersStore.getState().setStatus(id, status)

export function useOrders() {
  const email = useAuth((s) => s.user?.email)
  return useOrdersStore((s) => (email && s.histories[email]) || EMPTY)
}

export const markOrdersSeen = () => useOrdersStore.getState().markSeen()

export function useUnseenOrderCount() {
  const email = useAuth((s) => s.user?.email)
  return useOrdersStore((s) => {
    if (!email) return 0
    const seen = s.seenAt[email] ?? 0
    return (s.histories[email] ?? EMPTY).filter((o) => o.status !== "delivered" && o.updatedAt > seen).length
  })
}


export const forgetOrders = (email: string) =>
  useOrdersStore.setState((s) => ({ histories: omit(s.histories, email), seenAt: omit(s.seenAt, email) }))
