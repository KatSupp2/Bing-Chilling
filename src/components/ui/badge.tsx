import * as React from "react"
import { cn } from "cn"

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all bg-primary text-primary-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
