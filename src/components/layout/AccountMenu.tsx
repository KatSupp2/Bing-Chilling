import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ConfirmDialog"
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

export function AccountMenu() {
  const user = useAuth((s) => s.user)
  const logout = useAuth((s) => s.logout)
  const transitionTo = useTransitionNavigate()
  const [confirming, setConfirming] = useState(false)

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
            <p className="text-foreground truncate text-sm tracking-wide uppercase" title={user.email}>
              {user.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setConfirming(true)}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Log out?"
        description="You will need to sign in again to continue shopping."
        confirmLabel="Log out"
        onConfirm={() => transitionTo("/login", logout)}
      />
    </>
  )
}
