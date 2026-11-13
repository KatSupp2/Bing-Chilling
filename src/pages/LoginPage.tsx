import { useRef, useState, type FormEvent } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthShell } from "@/components/AuthShell"
import { TransitionLink } from "@/components/TransitionLink"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"
import { useAuth } from "@/store/auth"
import { useAuthFx } from "@/store/authFx"
import { useWelcome } from "@/store/welcome"

export function LoginPage() {
  const { user, login, canLogin } = useAuth()
  const transitionTo = useTransitionNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const cardRef = useRef<HTMLDivElement>(null)
  const emitFx = useAuthFx((s) => s.emit)
  const showWelcome = useWelcome((s) => s.show)

  const from = (location.state as { from?: unknown } | null)?.from
  const returnTo = typeof from === "string" && from.startsWith("/") && !from.startsWith("/login") && !from.startsWith("/register") ? from : "/"

  if (user) return <Navigate to="/" replace />

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim() && password && canLogin(email, password)) {
      emitFx("success", cardRef.current)
      transitionTo(returnTo, () => {
        login(email, password)
        showWelcome("returning", useAuth.getState().user?.name ?? "")
      })
    } else {
      emitFx("error", cardRef.current)
    }
  }

  return (
    <AuthShell
      variant="signin"
      cardRef={cardRef}
      eyebrow="Sign in"
      title="Welcome back."
      subtitle="Sign in to continue shopping."
      footer={
        <p className="text-muted-foreground">
          New here?{" "}
          <TransitionLink to="/register" className="text-foreground font-medium underline underline-offset-4">
            Create an account
          </TransitionLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email or username</Label>
          <Input
            id="email"
            type="text"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="h-11 w-full rounded-full">
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}
