import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/data/products"
import { useCart } from "@/store/cart"
import { flyToCart, useCartFx } from "@/store/cartFx"

const ADDED_MS = 1400

export function AddToCartButton({ product, onAdded }: { product: Product; onAdded?: (p: Product) => void }) {
  const add = useCart((s) => s.add)
  const land = useCartFx((s) => s.land)
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <Button
      className="w-full transition-colors"
      variant={added ? "secondary" : "default"}
      onClick={(e) => {
        const img = e.currentTarget.closest("[data-slot='card']")?.querySelector("img")
        flyToCart(img, () => {
          add(product)
          land()
        })
        onAdded?.(product)
        setAdded(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setAdded(false), ADDED_MS)
      }}
    >
      {added ? "Added to cart" : "Add to cart"}
    </Button>
  )
}
