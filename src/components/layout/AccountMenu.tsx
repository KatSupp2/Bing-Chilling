import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/Logo"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"
import { useAuth } from "@/store/auth"
import { useCart } from "@/store/cart"

export function AccountMenu() {
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const transitionTo = useTransitionNavigate()
  const [confirming, setConfirming] = useState(false)
  const cartCount = useCart((c) => c.items.reduce((sum, i) => sum + i.quantity, 0))

  if (!user) return null
  const firstName = user.name.trim().split(/\s+/)[0] || user.name

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="max-w-[8rem] shrink-0 px-2.5 font-medium"
            aria-label={`Account menu, signed in as ${user.name}`}
          >
            <span className="truncate">{firstName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={10} className="w-max max-w-72 min-w-40">
          <DropdownMenuLabel className="space-y-1 py-2 font-normal">
            <p className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">Signed in as</p>
            <p className="text-foreground truncate text-sm tracking-wide uppercase">
              {user.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirming(true)}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 p-0 sm:max-w-md">
          <div className="space-y-6 p-7">
            <Logo title="" className="size-12" />
            <div className="space-y-2">
              <p className="text-muted-foreground font-mono text-xs tracking-[0.25em] uppercase">Signing out</p>
              <AlertDialogTitle className="text-4xl font-semibold tracking-tighter">Heading out, {firstName}?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-base">
                {cartCount > 0
                  ? `Your cart (${cartCount} item${cartCount === 1 ? "" : "s"}) and orders will be right here when you sign back in.`
                  : "Your cart and orders will be right here when you sign back in."}
              </AlertDialogDescription>
            </div>
          </div>
          <div className="bg-muted/50 flex flex-col gap-3 border-t p-7 sm:flex-row">
            <AlertDialogCancel className="h-12 flex-1 rounded-full text-base" autoFocus>
              Stay signed in
            </AlertDialogCancel>
            <Button
              className="h-12 flex-1 rounded-full text-base"
              onClick={() => {
                setConfirming(false)
                transitionTo("/login", logout)
              }}
            >
              Log out
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
