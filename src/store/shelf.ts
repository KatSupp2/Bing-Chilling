import { create } from "zustand"
import { products, type Product } from "@/data/products"

const shuffle = (list: Product[]) => {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

type ShelfStore = {
  order: Product[]
  version: number
  reshuffle: () => void
}

export const useShelf = create<ShelfStore>()((set) => ({
  order: shuffle(products),
  version: 0,
  reshuffle: () => set((s) => ({ order: shuffle(products), version: s.version + 1 })),
}))
