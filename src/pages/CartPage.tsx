import { useState } from "react"
import { TransitionLink } from "@/components/TransitionLink"
import { lastShopUrl } from "@/lib/useTransitionNavigate"
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/data/products"
import { cn } from "@/lib/utils"
import { useCart, type CartItem } from "@/store/cart"

export function CartPage() {
  const { items, add, decrement, remove, insert } = useCart()
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const [leaving, setLeaving] = useState<ReadonlySet<string>>(new Set())

  const finishRemoval = (item: CartItem) => {
    const index = items.findIndex((i) => i.id === item.id)
    remove(item.id)
    setLeaving((s) => {
      const next = new Set(s)
      next.delete(item.id)
      return next
    })
    toast(`${item.name} removed from cart`, {
      action: { label: "Undo", onClick: () => insert(item, Math.max(index, 0)) },
    })
  }

  const slideOff = (item: CartItem) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishRemoval(item)
      return
    }
    setLeaving((s) => new Set(s).add(item.id))
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild>
          <TransitionLink to={lastShopUrl()}>Browse products</TransitionLink>
        </Button>
      </div>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Your cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 overflow-x-clip">
        {items.map((i) => (
          <div
            key={i.id}
            className={cn("flex items-center justify-between gap-4", leaving.has(i.id) && "cart-row-leave")}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget && e.animationName === "cart-row-out") finishRemoval(i)
            }}
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{i.name}</p>
              <p className="text-muted-foreground text-sm">{formatPrice(i.price * i.quantity)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <div className="flex items-center rounded-full border" role="group" aria-label={`Quantity of ${i.name}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                  disabled={i.quantity <= 1}
                  onClick={() => decrement(i.id)}
                  aria-label={`One fewer ${i.name}`}
                >
                  <MinusIcon />
                </Button>
                <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                  {i.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={() => add(i)}
                  aria-label={`One more ${i.name}`}
                >
                  <PlusIcon />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${i.name}`}
                disabled={leaving.has(i.id)}
                onClick={() => slideOff(i)}
              >
                <Trash2Icon />
              </Button>
            </div>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="text-muted-foreground text-xs">7-day easy returns · Support Mon–Sat, 9am–6pm</p>
      </CardContent>
      <CardFooter className="flex-col-reverse gap-2 sm:flex-row">
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <TransitionLink to={lastShopUrl()}>Continue shopping</TransitionLink>
        </Button>
        <Button className="w-full sm:flex-1" asChild>
          <TransitionLink to="/checkout">Proceed to checkout</TransitionLink>
        </Button>
      </CardFooter>
    </Card>
  )
}
