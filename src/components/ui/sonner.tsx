import { Toaster as Sonner, type ToasterProps } from "sonner"
import { OctagonXIcon } from "lucide-react"

const Toaster = (props: ToasterProps) => (
  <Sonner
    className="toaster group"
    icons={{ error: <OctagonXIcon className="size-4" /> }}
    style={
      {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      } as React.CSSProperties
    }
    toastOptions={{ classNames: { toast: "cn-toast" } }}
    {...props}
  />
)

export { Toaster }
