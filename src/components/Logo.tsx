import { cn } from "@/lib/utils"

export function Logo({ className, title = "Bing Chilling" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}
      className={cn("size-9 shrink-0", className)}
    >
      <rect width="64" height="64" rx="15" className="fill-primary" />
      <g className="fill-primary-foreground stroke-primary-foreground" strokeLinejoin="round">
        <rect x="27.5" y="10" width="9" height="6" rx="3" strokeWidth="0" />
        <rect x="22" y="18" width="20" height="6.5" rx="3.25" strokeWidth="0" />
        <rect x="15.5" y="26.5" width="33" height="7" rx="3.5" strokeWidth="0" />
        <path d="M19.5 37.5 H44.5 L32 55 Z" strokeWidth="2.5" />
      </g>
    </svg>
  )
}
