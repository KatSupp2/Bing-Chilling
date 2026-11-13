import type { ComponentProps } from "react"
import { Link } from "react-router-dom"
import { useTransitionNavigate } from "@/lib/useTransitionNavigate"

export function TransitionLink({ to, onClick, ...props }: ComponentProps<typeof Link> & { to: string }) {
  const transitionTo = useTransitionNavigate()
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        transitionTo(to)
      }}
      {...props}
    />
  )
}
