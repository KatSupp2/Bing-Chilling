import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Footer } from "./Footer"
import { Navbar } from "./Navbar"
import { useAuth } from "@/store/auth"

export function AppLayout() {
  const user = useAuth((s) => s.user)
  const { pathname, search } = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: pathname + search }} />

  return (
    <div className="vt-app-shell flex min-h-svh flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-28 pb-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
