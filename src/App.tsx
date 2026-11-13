import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { LogoBackground } from "@/components/LogoBackground"
import { Toaster } from "@/components/ui/sonner"
import { AppLayout } from "@/components/layout/AppLayout"
import { InteractiveBackground } from "@/components/InteractiveBackground"
import { OfflineScreen } from "@/components/OfflineScreen"
import { ThemeToggle } from "@/components/ThemeToggle"
import { WelcomeOverlay } from "@/components/WelcomeOverlay"
import { useApplyTheme } from "@/store/theme"
import { CartPage } from "@/pages/CartPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { OrdersPage } from "@/pages/OrdersPage"
import { RegisterPage } from "@/pages/RegisterPage"

const AUTH_ROUTES = ["/login", "/register"]

function Backgrounds() {
  const { pathname } = useLocation()
  const onAuth = AUTH_ROUTES.includes(pathname)
  return (
    <>
      <InteractiveBackground visible={!onAuth} />
      <LogoBackground active={onAuth} vortex={pathname === "/register"} />
    </>
  )
}

export default function App() {
  const theme = useApplyTheme()

  return (
    <BrowserRouter>
      <Backgrounds />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WelcomeOverlay />
      <OfflineScreen />
      <div className="vt-theme-toggle bg-muted fixed top-4 right-4 z-50 flex h-14 items-center rounded-2xl border px-2.5 shadow-md">
        <ThemeToggle />
      </div>
      <Toaster position="top-right" theme={theme} offset={{ top: 88, right: 16 }} mobileOffset={{ top: 88 }} />
    </BrowserRouter>
  )
}
