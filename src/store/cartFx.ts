import { create } from "zustand"

type CartFxStore = {
  landed: number
  land: () => void
}

export const useCartFx = create<CartFxStore>()((set) => ({
  landed: 0,
  land: () => set((s) => ({ landed: s.landed + 1 })),
}))

const FLIGHT_MS = 650
const END_SIZE = 28

export function flyToCart(img: HTMLImageElement | null | undefined, onArrive: () => void) {
  const target = document.querySelector("[data-cart-target]")
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!img || !target || reduceMotion || typeof img.animate !== "function") {
    onArrive()
    return
  }

  const from = img.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const ghost = img.cloneNode() as HTMLImageElement
  ghost.alt = ""
  ghost.removeAttribute("loading")
  ghost.setAttribute("aria-hidden", "true")
  Object.assign(ghost.style, {
    position: "fixed",
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    margin: "0",
    objectFit: "cover",
    transformOrigin: "center",
    zIndex: "60",
    pointerEvents: "none",
    boxShadow: "0 12px 32px rgb(0 0 0 / 0.25)",
  })
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const endScale = END_SIZE / Math.max(from.width, from.height)

  const animation = ghost.animate(
    [
      { transform: "translate(0, 0) scale(1)", borderRadius: "12px", opacity: 1, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      { transform: `translate(${dx * 0.3}px, ${dy * 0.3 - 40}px) scale(0.4)`, borderRadius: "24px", opacity: 1, offset: 0.4, easing: "cubic-bezier(0.55, 0, 0.75, 0.2)" },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale})`, borderRadius: "50%", opacity: 0.6 },
    ],
    { duration: FLIGHT_MS, fill: "forwards" },
  )
  const finish = () => {
    ghost.remove()
    onArrive()
  }
  animation.onfinish = finish
  animation.oncancel = finish
}
