import { create } from "zustand"
import { omit } from "@/lib/utils"
import type { Product } from "@/data/products"
import { useAuth } from "./auth"

export type CartItem = Product & { quantity: number }

type CartStore = {
  carts: Record<string, CartItem[]>
  add: (product: Product) => void
  decrement: (id: string) => void
  remove: (id: string) => void
  insert: (item: CartItem, index: number) => void
  clear: () => void
}

const EMPTY: CartItem[] = []
const currentUser = () => useAuth.getState().user?.email

const useCartStore = create<CartStore>()((set) => {
  const update = (fn: (items: CartItem[]) => CartItem[]) => {
    const key = currentUser()
    if (!key) return
    set((s) => ({ carts: { ...s.carts, [key]: fn(s.carts[key] ?? EMPTY) } }))
  }

  return {
    carts: {},
    add: (product) =>
      update((items) =>
        items.some((i) => i.id === product.id)
          ? items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...items, { ...product, quantity: 1 }],
      ),
    decrement: (id) =>
      update((items) => items.map((i) => (i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i))),
    remove: (id) => update((items) => items.filter((i) => i.id !== id)),
    insert: (item, index) =>
      update((items) =>
        items.some((i) => i.id === item.id)
          ? items
          : [...items.slice(0, index), item, ...items.slice(index)],
      ),
    clear: () => update(() => EMPTY),
  }
})

type CartView = Pick<CartStore, "add" | "decrement" | "remove" | "insert" | "clear"> & { items: CartItem[] }

export function useCart(): CartView
export function useCart<T>(selector: (cart: CartView) => T): T
export function useCart<T>(selector?: (cart: CartView) => T) {
  const email = useAuth((s) => s.user?.email)
  const items = useCartStore((s) => (email && s.carts[email]) || EMPTY)
  const add = useCartStore((s) => s.add)
  const decrement = useCartStore((s) => s.decrement)
  const remove = useCartStore((s) => s.remove)
  const insert = useCartStore((s) => s.insert)
  const clear = useCartStore((s) => s.clear)
  const view: CartView = { items, add, decrement, remove, insert, clear }
  return selector ? selector(view) : view
}


export const forgetCart = (email: string) => useCartStore.setState((s) => ({ carts: omit(s.carts, email) }))
