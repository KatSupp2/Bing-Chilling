import type { ReactNode, Ref } from "react"
import { Logo } from "@/components/Logo"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  variant: "signin" | "register"
  cardRef?: Ref<HTMLDivElement>
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

const HEADLINES = {
  signin: { lead: "Cool deals,", trail: "chill prices" },
  register: { lead: "Join the", trail: "chill side" },
}

export function AuthShell({ variant, cardRef, title, subtitle, children, footer }: AuthShellProps) {
  const register = variant === "register"
  const headline = HEADLINES[variant]

  return (
    <div className="flex min-h-svh items-center justify-center px-4 pt-24 pb-10 md:py-24">
      <div
        ref={cardRef}
        className={cn(
          "vt-auth-card bg-card text-card-foreground grid w-full max-w-5xl overflow-hidden rounded-3xl border shadow-2xl",
          register ? "md:grid-cols-[1fr_1.15fr]" : "md:grid-cols-[1.15fr_1fr]",
        )}
      >
        <section
          className={cn(
            "vt-auth-brand flex flex-col justify-center border-b p-8 md:border-b-0 md:p-12",
            register ? "bg-muted/60 md:order-2 md:border-l" : "md:border-r",
          )}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Logo title="" className="size-8 md:size-9" />
              <p className="font-mono text-base font-medium tracking-[0.2em] uppercase md:text-lg">Bing Chilling</p>
            </div>
            <h1 className="text-5xl leading-[0.95] font-semibold tracking-tighter md:text-6xl lg:text-7xl">
              {headline.lead}
              <br />
              <span className="text-muted-foreground">{headline.trail}</span>
            </h1>
            <p className="text-muted-foreground max-w-sm text-base">Curated, minimal, delivered.</p>
          </div>
        </section>

        <section className={cn("vt-auth-form flex flex-col justify-center p-8 md:p-12", register && "md:order-1")}>
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 border-t pt-6 text-sm">{footer}</div>
        </section>
      </div>
    </div>
  )
}
