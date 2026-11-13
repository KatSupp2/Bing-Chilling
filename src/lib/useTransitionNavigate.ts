import { useCallback } from "react"
import { flushSync } from "react-dom"
import { useNavigate } from "react-router-dom"

const AUTH_ROUTES = ["/login", "/register"]
const isAuth = (path: string) => AUTH_ROUTES.includes(path.split("?")[0])

const scrollMemory = new Map<string, number>()
let transitionId = 0
let lastShop = "/"

export const lastShopUrl = () => lastShop

export function useTransitionNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (to: string, before?: () => void, { toTop = false }: { toTop?: boolean } = {}) => {
      const from = window.location.pathname + window.location.search
      const scene = isAuth(from) || isAuth(to)
      const go = () => {
        scrollMemory.set(from, window.scrollY)
        if (window.location.pathname === "/") lastShop = from
        flushSync(() => {
          before?.()
          navigate(to)
        })
        window.scrollTo({ top: scene || toTop ? 0 : (scrollMemory.get(to) ?? 0), behavior: "instant" })
        if (scene) lastShop = "/"
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!document.startViewTransition || reduceMotion) {
        go()
        return
      }
      const root = document.documentElement
      const id = ++transitionId
      root.dataset.vt = scene ? "scene" : "app"
      const transition = document.startViewTransition(go)
      transition.finished.finally(() => {
        if (id === transitionId) delete root.dataset.vt
      })
    },
    [navigate],
  )
}
