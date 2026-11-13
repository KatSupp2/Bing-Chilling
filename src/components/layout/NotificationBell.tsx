import { BellIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/store/notifications"

export function NotificationBell() {
  const { items, markAllRead } = useNotifications()
  const unread = items.filter((n) => !n.read).length

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        >
          <BellIcon />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">{unread}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-80 p-0">
        <div className="flex items-center justify-between gap-2 py-1.5 pr-1.5 pl-3">
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
            Notifications{unread > 0 ? ` · ${unread} new` : ""}
          </p>
          <DropdownMenuItem
            disabled={unread === 0}
            onSelect={(e) => {
              e.preventDefault()
              markAllRead()
            }}
            className="h-7 px-2 text-xs font-medium"
          >
            Mark all as read
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="my-0" />
        {items.length === 0 ? (
          <p className="text-muted-foreground px-3 py-6 text-center text-sm">No notifications yet</p>
        ) : (
          <ul className="max-h-80 overflow-y-auto py-1">
            {items.map((n) => (
              <li key={n.id} className="flex items-start gap-2.5 px-3 py-2">
                <span
                  aria-hidden="true"
                  className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-foreground")}
                />
                <div className="min-w-0">
                  <p className={cn("text-sm", n.read ? "text-muted-foreground" : "font-medium")}>
                    {n.message}
                    {!n.read && <span className="sr-only"> (unread)</span>}
                  </p>
                  <p className="text-muted-foreground text-xs">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
