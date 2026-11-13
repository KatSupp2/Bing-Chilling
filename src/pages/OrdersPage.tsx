import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { TransitionLink } from "@/components/TransitionLink"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatPrice, placeholderImage, type Product } from "@/data/products"
import { cn } from "@/lib/utils"
import { useCart } from "@/store/cart"
import { flyToCart, useCartFx } from "@/store/cartFx"
import { useNotifications } from "@/store/notifications"
import { STATUSES, STATUS_INFO, markOrdersSeen, setOrderStatus, useOrders, type Order, type OrderStatus } from "@/store/orders"

const ADDED_MS = 1400
const FAVORITES_PREVIEW = 4
const TABS = ["pending", "history"] as const

const PENDING_MOOD: Record<OrderStatus, string> = {
  preparing: "Packed with care",
  shipped: "Shipped and moving",
  out: "Almost at your door",
  delivered: "Delivered",
}
type Tab = (typeof TABS)[number]

const dateFormat = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short" })

const fallback = (name: string) => (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget
  img.onerror = null
  img.src = placeholderImage(name)
}

function BuyAgainButton({ product, label = "Buy again", className }: { product: Product; label?: string; className?: string }) {
  const add = useCart((s) => s.add)
  const land = useCartFx((s) => s.land)
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <Button
      variant={added ? "secondary" : "outline"}
      className={cn("shrink-0 rounded-full transition-colors", className)}
      aria-label={`${label}: ${product.name}`}
      onClick={(e) => {
        const img = e.currentTarget.closest("[data-buy-again]")?.querySelector("img")
        flyToCart(img, () => {
          add(product)
          land()
        })
        setAdded(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setAdded(false), ADDED_MS)
      }}
    >
      {added ? "Added" : label}
    </Button>
  )
}

function Tracker({ order }: { order: Order }) {
  const current = STATUSES.indexOf(order.status)
  return (
    <div className="space-y-3">
      <div className="flex items-center" aria-hidden="true">
        {STATUSES.map((status, i) => (
          <div key={status} className={cn("flex items-center", i > 0 && "flex-1")}>
            {i > 0 && (
              <div className="bg-foreground/10 mx-1 h-0.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-foreground h-full transition-[width] duration-500 ease-out"
                  style={{ width: i <= current ? "100%" : "0%" }}
                />
              </div>
            )}
            <span
              className={cn(
                "size-3 shrink-0 rounded-full border-2 transition-colors duration-500",
                i <= current ? "border-foreground bg-foreground" : "border-foreground/20 bg-card",
                i === current && "ring-foreground/15 ring-4",
              )}
            />
          </div>
        ))}
      </div>
      <div className="text-muted-foreground relative h-4 text-[11px]">
        {STATUSES.map((status, i) => (
          <span
            key={status}
            className={cn("absolute top-0 whitespace-nowrap", i === current && "text-foreground font-medium")}
            style={{
              left: `${(i / (STATUSES.length - 1)) * 100}%`,
              transform: i === 0 ? "none" : i === STATUSES.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
            }}
          >
            {STATUS_INFO[status].label}
          </span>
        ))}
      </div>
      <p key={order.status} className="step-in text-sm" aria-live="polite">
        {STATUS_INFO[order.status].detail}
      </p>
    </div>
  )
}

function StatusControl({ order, onChange }: { order: Order; onChange: (status: OrderStatus) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">Status</span>
      <div role="radiogroup" aria-label={`Status of order ${order.id}`} className="bg-muted flex flex-wrap gap-1 rounded-full p-1">
        {STATUSES.map((status) => {
          const active = order.status === status
          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => !active && onChange(status)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {STATUS_INFO[status].label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function OrderCard({
  order,
  repeatCounts,
  onStatus,
}: {
  order: Order
  repeatCounts: Map<string, number>
  onStatus: (order: Order, status: OrderStatus) => void
}) {
  const count = order.items.reduce((sum, i) => sum + i.quantity, 0)
  const delivered = order.status === "delivered"
  return (
    <Card className="step-in gap-0 py-0">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 border-b px-5 py-4">
        <div>
          <p className="font-medium">{dateFormat.format(order.placedAt)}</p>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.15em] uppercase">
            Order <span className="select-all">{order.id}</span> · {count} item{count === 1 ? "" : "s"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums">{formatPrice(order.total)}</p>
          {delivered && order.deliveredAt && (
            <p className="text-muted-foreground text-xs">Delivered {dateFormat.format(order.deliveredAt)}</p>
          )}
        </div>
      </div>

      {!delivered && (
        <div className="border-b px-5 py-4">
          <Tracker order={order} />
        </div>
      )}

      <ul className="divide-y">
        {order.items.map((item) => {
          const times = repeatCounts.get(item.id) ?? 1
          return (
            <li key={item.id} data-buy-again className="flex items-center gap-4 px-5 py-3">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                onError={fallback(item.name)}
                className="bg-muted size-14 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-muted-foreground text-sm">
                  {item.quantity} × {formatPrice(item.price)}
                  {times > 1 && <span className="ml-2 text-xs">· in {times} of your orders</span>}
                </p>
              </div>
              <BuyAgainButton product={item} />
            </li>
          )
        })}
      </ul>

      <div className="text-muted-foreground bg-muted/50 space-y-3 border-t px-5 py-3 text-xs">
        <div className="grid gap-1 sm:grid-cols-3">
          <p>
            <span className="text-foreground font-medium">Delivery</span> · {order.delivery}
          </p>
          <p className="truncate" title={order.shipTo}>
            <span className="text-foreground font-medium">To</span> · {order.shipTo}
          </p>
          <p>
            <span className="text-foreground font-medium">Paid with</span> · {order.payment}
          </p>
        </div>
        <StatusControl order={order} onChange={(status) => onStatus(order, status)} />
      </div>
    </Card>
  )
}

function OneLine({ lead, trail }: { lead: string; trail: string }) {
  return (
    <>
      {lead}
      <span aria-hidden="true" className="text-muted-foreground/40 mx-[0.3em] font-light">
        |
      </span>
      <span className="sr-only">, </span>
      <span className="text-muted-foreground">{trail}</span>
    </>
  )
}

type Favorite = { product: Product; orders: number; lastAt: number }

const favoritesOf = (orders: Order[]) => {
  const byId = new Map<string, Favorite>()
  for (const order of orders) {
    for (const item of order.items) {
      const seen = byId.get(item.id)
      if (seen) seen.orders += 1
      else byId.set(item.id, { product: item, orders: 1, lastAt: order.placedAt })
    }
  }
  return [...byId.values()].sort((a, b) => b.orders - a.orders || b.lastAt - a.lastAt)
}

export function OrdersPage() {
  const orders = useOrders()
  const push = useNotifications((s) => s.push)
  const [showAllFavorites, setShowAllFavorites] = useState(false)
  const [params, setParams] = useSearchParams()

  const { pending, delivered, favorites, repeatCounts } = useMemo(() => {
    const pending: Order[] = []
    const delivered: Order[] = []
    for (const o of orders) (o.status === "delivered" ? delivered : pending).push(o)
    const favorites = favoritesOf(orders)
    return { pending, delivered, favorites, repeatCounts: new Map(favorites.map((f) => [f.product.id, f.orders])) }
  }, [orders])

  useEffect(() => {
    markOrdersSeen()
  }, [orders])
  const requested = params.get("tab")
  const tab: Tab = TABS.includes(requested as Tab) ? (requested as Tab) : pending.length > 0 || delivered.length === 0 ? "pending" : "history"

  const selectTab = (next: Tab) => {
    const p = new URLSearchParams(params)
    p.set("tab", next)
    setParams(p, { replace: true })
  }

  const changeStatus = (order: Order, status: OrderStatus) => {
    setOrderStatus(order.id, status)
    push(`Order ${order.id} ${STATUS_INFO[status].notice}`)
    if (status === "delivered") {
      toast(`Order ${order.id} has been delivered`, { description: "Hope you love it. It's now in your order history." })
      selectTab("history")
    }
  }

  const shown = tab === "pending" ? pending : delivered

  const [lead, trail] =
    orders.length === 0
      ? ["Nothing here yet", "your first order awaits"]
      : pending.length > 0
        ? [
            `${pending.length} order${pending.length === 1 ? "" : "s"} on the way`,
            PENDING_MOOD[pending.reduce((far, o) => (STATUSES.indexOf(o.status) > STATUSES.indexOf(far) ? o.status : far), pending[0].status)],
          ]
        : ["All delivered", `${delivered.length} order${delivered.length === 1 ? "" : "s"} enjoyed`]

  if (orders.length === 0) {
    return (
      <div className="step-in flex flex-col items-center py-16 text-center md:py-24">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.25em] uppercase">Your orders</p>
        <h1 className="mt-4 text-2xl leading-tight font-semibold tracking-tighter sm:text-3xl md:whitespace-nowrap lg:text-4xl">
          <OneLine lead={lead} trail={trail} />
        </h1>
        <Button className="mt-10 h-11 rounded-full px-6" asChild>
          <TransitionLink to="/">Start shopping</TransitionLink>
        </Button>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-10">
      <div className="step-in space-y-8">
        <div>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.25em] uppercase">Your orders</p>
          <h1 className="mt-4 text-2xl leading-tight font-semibold tracking-tighter sm:text-3xl md:whitespace-nowrap lg:text-4xl">
            <OneLine lead={lead} trail={trail} />
          </h1>
        </div>
        <div role="tablist" aria-label="Orders" className="bg-muted inline-flex gap-1 rounded-full p-1">
          {TABS.map((t) => {
            const active = tab === t
            const n = t === "pending" ? pending.length : delivered.length
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(t)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "pending" ? "Pending" : "History"}
                {t === "pending" && n > 0 && <span className="text-muted-foreground ml-1.5 tabular-nums">{n}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div key={tab} role="tabpanel" className="step-in space-y-8">
        {tab === "history" && favorites.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground font-mono text-[11px] tracking-[0.25em] uppercase">Buy again</p>
              {favorites.length > FAVORITES_PREVIEW && (
                <button
                  type="button"
                  aria-expanded={showAllFavorites}
                  onClick={() => setShowAllFavorites((v) => !v)}
                  className="text-muted-foreground hover:text-foreground font-mono text-[11px] tracking-[0.2em] uppercase underline-offset-4 transition-colors hover:underline"
                >
                  {showAllFavorites ? "Show less" : `Show all (${favorites.length})`}
                </button>
              )}
            </div>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {(showAllFavorites ? favorites : favorites.slice(0, FAVORITES_PREVIEW)).map(({ product, orders: times }) => (
                <li
                  key={product.id}
                  data-buy-again
                  className="bg-card ring-foreground/10 step-in min-w-0 overflow-hidden rounded-xl ring-1"
                >
                  <img
                    src={product.image}
                    alt=""
                    loading="lazy"
                    onError={fallback(product.name)}
                    className="bg-muted aspect-[4/3] w-full object-cover"
                  />
                  <div className="space-y-2 p-3">
                    <div>
                      <p className="truncate text-sm font-medium" title={product.name}>
                        {product.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {times > 1 ? `Ordered ${times} times` : "Ordered once"} · {formatPrice(product.price)}
                      </p>
                    </div>
                    <BuyAgainButton product={product} label="Add to cart" className="w-full" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {shown.length === 0 ? (
          <div className="py-10">
            <p className="text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
              {tab === "pending" ? (
                <OneLine lead="Nothing on the way" trail="ready when you are" />
              ) : (
                <OneLine lead="No deliveries yet" trail="they'll land here soon" />
              )}
            </p>
            <Button className="mt-8 h-11 rounded-full px-6" asChild>
              <TransitionLink to="/">Start shopping</TransitionLink>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((order) => (
              <OrderCard key={order.id} order={order} repeatCounts={repeatCounts} onStatus={changeStatus} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
