import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const urlQuery = params.get("q") ?? ""
  const [query, setQuery] = useState(urlQuery)

  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery)
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery)
    setQuery(urlQuery)
  }

  useEffect(() => {
    const t = setTimeout(() => {
      const current = params.get("q") ?? ""
      if (query === current) return
      const next = new URLSearchParams(params)
      if (query) next.set("q", query)
      else next.delete("q")
      const qs = next.toString()
      navigate(qs ? `/?${qs}` : "/", { replace: true })
    }, 300)
    return () => clearTimeout(t)
  }, [query, params, navigate])

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        type="search"
        placeholder="Search products..."
        aria-label="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}
