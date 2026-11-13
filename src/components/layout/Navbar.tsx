import { Link, useLocation } from "react-router-dom"
import { PackageIcon, ShoppingCartIcon } from "lucide-react"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"
import { TransitionLink } from "@/components/TransitionLink"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import { AccountMenu } from "./AccountMenu"
import { NotificationBell } from "./NotificationBell"
import { SearchBar } from "./SearchBar"
import { cn } from "@/lib/utils"
import { useCart } from "@/store/cart"
import { useCartFx } from "@/store/cartFx"
import { useUnseenOrderCount } from "@/store/orders"
import { useShelf } from "@/store/shelf"

export function Navbar() {
  const count = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const landed = useCartFx((s) => s.landed)
  const { pathname, search } = useLocation()
  const transitionTo = useTransitionNavigate()
  const reshuffle = useShelf((s) => s.reshuffle)
  const pending = useUnseenOrderCount()

  return (
    <header className="vt-header bg-muted fixed top-4 right-4 left-20 z-40 rounded-2xl border shadow-md sm:right-auto sm:left-1/2 sm:w-[min(760px,calc(100%-12rem))] sm:-translate-x-1/2">
      <div className="flex h-14 items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <Link
          to="/"
          aria-label="Bing Chilling home"
          className="flex shrink-0 items-center"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
            e.preventDefault()
            if (pathname === "/" && !search) {
              const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
              window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" })
              reshuffle()
            } else {
              transitionTo("/", reshuffle, { toTop: true })
            }
          }}
        >
          <Logo title="" />
        </Link>
        <div className="flex flex-1 justify-center">
          <SearchBar />
        </div>
        <NotificationBell />
        <Button variant="ghost" size="icon" className="relative" asChild>
          <TransitionLink
            to="/orders"
            aria-label={pending > 0 ? `Your orders, ${pending} new` : "Your orders"}
          >
            <PackageIcon />
            {pending > 0 && (
              <Badge key={`orders-${pending}`} className="cart-badge-pop absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
                {pending}
              </Badge>
            )}
          </TransitionLink>
        </Button>
        <Button variant="ghost" size="icon" className="relative" asChild>
          <TransitionLink to="/cart" aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`} data-cart-target>
            <span key={`icon-${landed}`} className={cn("flex", landed > 0 && "cart-bump")}>
              <ShoppingCartIcon />
            </span>
            {count > 0 && (
              <Badge
                key={`badge-${landed}`}
                className={cn("absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]", landed > 0 && "cart-badge-pop")}
              >
                {count}
              </Badge>
            )}
          </TransitionLink>
        </Button>
        <AccountMenu />
      </div>
    </header>
  )
}
