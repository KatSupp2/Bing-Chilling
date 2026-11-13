import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AddToCartButton } from "@/components/AddToCartButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice, placeholderImage, products } from "@/data/products"
import { cn } from "@/lib/utils"
import { useShelf } from "@/store/shelf"

const ALL = "all"
const categories = [...new Set(products.map((p) => p.category))].sort((a, b) => a.localeCompare(b))
const HEADINGS = ["All products", ...categories]

export function HomePage() {
  const [params, setParams] = useSearchParams()
  const rawQuery = params.get("q") ?? ""
  const q = rawQuery.trim().toLowerCase()
  const category = categories.includes(params.get("cat") ?? "") ? params.get("cat")! : null
  const [announcement, setAnnouncement] = useState("")

  const shelf = useShelf((s) => s.order)
  const shelfVersion = useShelf((s) => s.version)
  const results = shelf.filter((p) => {
    if (category && p.category !== category) return false
    return !q || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q)
  })

  const selectCategory = (value: string) => {
    const next = new URLSearchParams(params)
    if (value === ALL) next.delete("cat")
    else next.set("cat", value)
    setParams(next)
  }

  const heading = category ?? "All products"

  const filterKey = `${q}|${category ?? ""}`
  const lastFilterKey = useRef(filterKey)
  useEffect(() => {
    if (lastFilterKey.current === filterKey) return
    lastFilterKey.current = filterKey
    if (window.scrollY > 0) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" })
    }
  }, [filterKey])

  return (
    <section className="space-y-6">
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="inline-grid text-2xl font-semibold whitespace-nowrap">
            {HEADINGS.map((label) => (
              <span
                key={label}
                aria-hidden={label !== heading}
                className={cn("col-start-1 row-start-1", label !== heading && "invisible")}
              >
                {label}
              </span>
            ))}
          </h1>
          <span aria-hidden="true" className="text-muted-foreground/40 text-2xl font-light">
            |
          </span>
          <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
            {q ? `${results.length} results for "${rawQuery}"` : `${results.length} items`}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full px-4" aria-label={`Filter by category: ${heading}`}>
              <span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">Category</span>
              <span>{category ?? "All"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[60vh] w-56 overflow-y-auto">
            <DropdownMenuRadioGroup value={category ?? ALL} onValueChange={selectCategory}>
              <DropdownMenuRadioItem value={ALL}>All products</DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {categories.map((c) => (
                <DropdownMenuRadioItem key={c} value={c}>
                  {c}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {results.length === 0 ? (
        <p className="text-muted-foreground">
          No products match{q ? ` "${rawQuery}"` : ""}
          {category ? ` in ${category}` : ""}. Try another keyword or category.
        </p>
      ) : (
        <div key={shelfVersion} className="step-in grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
          {results.map((p) => (
            <Card key={p.id} className="overflow-hidden pt-0">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="bg-muted aspect-[4/3] w-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget
                  img.onerror = null
                  img.src = placeholderImage(p.name)
                }}
              />
              <CardHeader>
                <CardTitle>{p.name}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-lg font-semibold">{formatPrice(p.price)}</CardContent>
              <CardFooter className="mt-auto">
                <AddToCartButton product={p} onAdded={(item) => setAnnouncement(`${item.name} added to cart`)} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
