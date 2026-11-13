import { useState, type FormEvent, type ReactNode } from "react"
import { toast } from "sonner"
import { Logo } from "@/components/Logo"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"
import { isProtectedAccount, useAuth } from "@/store/auth"
import { forgetCart } from "@/store/cart"
import { forgetCheckoutDetails } from "@/store/checkoutProfile"
import { unsubscribeNewsletter, useNewsletterAddress } from "@/store/newsletter"
import { forgetNotifications, useNotifications } from "@/store/notifications"
import { forgetOrders } from "@/store/orders"
import { useWelcome } from "@/store/welcome"

const PERKS = [
  ["First look at new drops", "See fresh arrivals before anyone else"],
  ["Deals picked for you", "Chill prices on things you'll actually like"],
  ["Only when it's worth it", "No noise, never more than we'd want ourselves"],
]

const PROTECTED_NOTE = "This account is protected, so it can't be changed or deleted."

function Section({
  title,
  description,
  action,
  danger,
  children,
}: {
  title: string
  description: ReactNode
  action?: ReactNode
  danger?: boolean
  children?: ReactNode
}) {
  return (
    <section className={cn("bg-card ring-foreground/10 rounded-xl p-6 ring-1", danger && "ring-destructive/30")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-lg space-y-1">
          <h2 className={cn("text-lg font-semibold tracking-tight", danger && "text-destructive")}>{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function PasswordForm({ onDone }: { onDone: () => void }) {
  const changePassword = useAuth((s) => s.changePassword)
  const push = useNotifications((s) => s.push)
  const [form, setForm] = useState({ current: "", next: "", confirm: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found: typeof errors = {}
    if (!form.current) found.current = "Enter your current password"
    if (form.next.length < 6) found.next = "Use at least 6 characters"
    if (form.confirm !== form.next) found.confirm = "Passwords do not match"
    if (Object.keys(found).length === 0 && !changePassword(form.current, form.next)) {
      found.current = "That isn't your current password"
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return
    toast("Password updated", { description: "Use your new password next time you sign in." })
    push("Your password was changed")
    onDone()
  }

  const field = (id: keyof typeof form, label: string, autoComplete: string) => (
    <div className="space-y-2">
      <Label htmlFor={`pw-${id}`}>{label}</Label>
      <Input
        id={`pw-${id}`}
        type="password"
        className="h-11"
        autoComplete={autoComplete}
        value={form[id]}
        onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
        aria-invalid={Boolean(errors[id])}
      />
      {errors[id] && <p className="text-destructive text-xs">{errors[id]}</p>}
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="step-in mt-6 space-y-4 border-t pt-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {field("current", "Current password", "current-password")}
        {field("next", "New password", "new-password")}
        {field("confirm", "Confirm new password", "new-password")}
      </div>
      <div className="flex gap-3">
        <Button type="submit" className="h-10 rounded-full px-5">
          Save password
        </Button>
        <Button type="button" variant="outline" className="h-10 rounded-full px-5" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export function AccountPage() {
  const user = useAuth((s) => s.user)
  const deleteAccount = useAuth((s) => s.deleteAccount)
  const transitionTo = useTransitionNavigate()
  const newsletter = useNewsletterAddress()
  const [dialog, setDialog] = useState<"newsletter" | "delete" | null>(null)
  const [editingPassword, setEditingPassword] = useState(false)
  const [deleteText, setDeleteText] = useState("")

  if (!user) return null
  const locked = isProtectedAccount(user.email)
  const firstName = user.name.trim().split(/\s+/)[0]

  const confirmDelete = () => {
    const email = user.email
    transitionTo("/login", () => {
      if (!deleteAccount()) return
      forgetCart(email)
      forgetOrders(email)
      forgetNotifications(email)
      forgetCheckoutDetails(email)
      unsubscribeNewsletter(email)
      useWelcome.getState().show("farewell", firstName)
    })
  }

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.25em] uppercase">Your account</p>
        <h1 className="mt-4 text-2xl leading-tight font-semibold tracking-tighter sm:text-3xl md:whitespace-nowrap lg:text-4xl">
          {user.name}
          <span aria-hidden="true" className="text-muted-foreground/40 mx-[0.3em] font-light">
            |
          </span>
          <span className="text-muted-foreground">{user.email}</span>
        </h1>
      </div>

      <div className="step-in space-y-4">
        <Section
          title="Newsletter"
          description={
            newsletter
              ? `You're subscribed with ${newsletter}. Early drops and deals, only when they're worth it.`
              : "You're not subscribed. You can join anytime"
          }
          action={
            newsletter && (
              <Button variant="outline" className="h-10 rounded-full px-5" onClick={() => setDialog("newsletter")}>
                Unsubscribe
              </Button>
            )
          }
        />

        <Section
          title="Password"
          description={locked ? PROTECTED_NOTE : "Choose a new password for signing in."}
          action={
            !locked &&
            !editingPassword && (
              <Button variant="outline" className="h-10 rounded-full px-5" onClick={() => setEditingPassword(true)}>
                Change password
              </Button>
            )
          }
        >
          {editingPassword && <PasswordForm onDone={() => setEditingPassword(false)} />}
        </Section>

        <Section
          danger
          title="Delete account"
          description={
            locked
              ? PROTECTED_NOTE
              : "Permanently removes your account, cart, orders, notifications and saved details. This can't be undone."
          }
          action={
            !locked && (
              <Button
                variant="outline"
                className="text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive h-10 rounded-full px-5"
                onClick={() => {
                  setDeleteText("")
                  setDialog("delete")
                }}
              >
                Delete account
              </Button>
            )
          }
        />
      </div>

      <AlertDialog open={dialog === "newsletter"} onOpenChange={(open) => !open && setDialog(null)}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 p-0 sm:max-w-lg">
          <div className="space-y-7 p-7">
            <Logo title="" className="size-12" />
            <div className="space-y-2">
              <p className="text-muted-foreground font-mono text-xs tracking-[0.25em] uppercase">Before you go</p>
              <AlertDialogTitle className="text-4xl font-semibold tracking-tighter">
                We'll miss you, {firstName}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-base">
                Leaving means {newsletter} stops getting:
              </AlertDialogDescription>
            </div>
            <ul className="divide-y rounded-xl border">
              {PERKS.map(([title, detail]) => (
                <li key={title} className="space-y-0.5 px-5 py-4">
                  <p className="text-base font-medium">{title}</p>
                  <p className="text-muted-foreground text-sm">{detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted/50 flex flex-col gap-3 border-t p-7 sm:flex-row-reverse">
            <Button className="h-12 flex-1 rounded-full text-base" autoFocus onClick={() => setDialog(null)}>
              Stay subscribed
            </Button>
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-full text-base"
              onClick={() => {
                setDialog(null)
                toast(`All set, ${firstName}`, {
                  description: "We'll give your inbox a rest. You're always welcome back.",
                  position: "bottom-left",
                })
                unsubscribeNewsletter()
              }}
            >
              Unsubscribe anyway
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialog === "delete"} onOpenChange={(open) => !open && setDialog(null)}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] gap-0 p-0 sm:max-w-md">
          <div className="space-y-4 p-6">
            <AlertDialogTitle className="text-destructive text-2xl font-semibold tracking-tight">
              Delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              Your account, cart, orders, notifications and saved details will be removed for good. This can't be undone.
            </AlertDialogDescription>
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                Type <span className="font-mono font-semibold">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirm"
                className="h-11"
                autoComplete="off"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
              />
            </div>
          </div>
          <div className="bg-muted/50 flex flex-col-reverse gap-3 border-t p-6 sm:flex-row">
            <AlertDialogCancel className="h-11 flex-1 rounded-full" autoFocus>
              Keep my account
            </AlertDialogCancel>
            <Button
              className="bg-destructive hover:bg-destructive/90 h-11 flex-1 rounded-full text-white"
              disabled={deleteText !== "DELETE"}
              onClick={() => {
                setDialog(null)
                confirmDelete()
              }}
            >
              Delete account
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
