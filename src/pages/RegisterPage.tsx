import { useEffect, useRef, useState, type FormEvent } from "react"
import { Navigate } from "react-router-dom"
import { AuthShell } from "@/components/AuthShell"
import { TransitionLink } from "@/components/TransitionLink"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"
import { useAuth } from "@/store/auth"
import { useAuthFx } from "@/store/authFx"

type Errors = Partial<Record<"name" | "email" | "password" | "confirm", string>>

const CREATING_MS = 600

export function RegisterPage() {
  const { user, register, isEmailTaken } = useAuth()
  const transitionTo = useTransitionNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState<Errors>({})
  const cardRef = useRef<HTMLDivElement>(null)
  const emitFx = useAuthFx((s) => s.emit)
  const [creating, setCreating] = useState(false)
  const creatingTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(creatingTimer.current), [])

  if (user) return <Navigate to="/" replace />

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = (): Errors => {
    const next: Errors = {}
    if (!form.name.trim()) next.name = "Please enter your name"
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email address"
    else if (isEmailTaken(form.email)) next.email = "An account with this email already exists"
    if (form.password.length < 6) next.password = "Use at least 6 characters"
    if (form.confirm !== form.password) next.confirm = "Passwords do not match"
    return next
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (creating) return
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      emitFx("error", cardRef.current)
      return
    }

    setCreating(true)
    register({ name: form.name, email: form.email, password: form.password })
    creatingTimer.current = window.setTimeout(() => transitionTo("/login"), CREATING_MS)
  }

  const field = (id: keyof typeof form, label: string, type = "text", autoComplete?: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        className="h-11"
        value={form[id]}
        onChange={update(id)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      {errors[id] && (
        <p id={`${id}-error`} className="text-destructive text-xs">
          {errors[id]}
        </p>
      )}
    </div>
  )

  return (
    <AuthShell
      variant="register"
      cardRef={cardRef}
      title="Create an account"
      subtitle="Pull up a chair, we saved you a spot"
      footer={
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <TransitionLink to="/login" className="text-foreground font-medium underline underline-offset-4">
            Sign in
          </TransitionLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("name", "Name", "text", "name")}
          {field("email", "Email", "email", "email")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("password", "Password", "password", "new-password")}
          {field("confirm", "Confirm password", "password", "new-password")}
        </div>
        <Button type="submit" className="mt-1 h-11 w-full rounded-full" disabled={creating} aria-busy={creating}>
          {creating ? "Creating your account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  )
}
