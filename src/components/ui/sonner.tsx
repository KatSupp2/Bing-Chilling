import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = (props: ToasterProps) => (
  <Sonner
    className="toaster group"
    style={
      {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "calc(var(--radius) * 1.8)",
        "--width": "420px",
      } as React.CSSProperties
    }
    toastOptions={{
      duration: 5000,
      classNames: {
        toast: "cn-toast !w-fit !min-w-72 !max-w-[min(var(--width),calc(100vw-2rem))] !gap-4 !px-5 !py-4 !shadow-xl",
        title: "!text-base !font-semibold !leading-snug",
        description: "!text-sm !leading-relaxed !text-muted-foreground",
        actionButton:
          "!h-8 !shrink-0 !rounded-full !border !border-border !bg-transparent !px-3.5 !font-mono !text-[10px] !font-medium !tracking-[0.18em] !text-foreground !uppercase !transition-colors hover:!bg-muted",
      },
    }}
    {...props}
  />
)

export { Toaster }
