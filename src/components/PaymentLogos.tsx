import { cn } from "@/lib/utils"
import type { BankKey, CardBrand } from "@/lib/checkout"

function Chip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-7 shrink-0 items-center justify-center rounded-md bg-white px-2 ring-1 ring-black/10",
        className,
      )}
    >
      {children}
    </span>
  )
}

function VisaMark() {
  return (
    <Chip className="w-12">
      <span className="text-[13px] font-black tracking-tight text-[#1A1F71] italic">VISA</span>
    </Chip>
  )
}

function MastercardMark() {
  return (
    <Chip className="w-12">
      <svg viewBox="0 0 38 24" className="h-4">
        <circle cx="13" cy="12" r="10" fill="#EB001B" />
        <circle cx="25" cy="12" r="10" fill="#F79E1B" />
        <path d="M19 4a10 10 0 0 1 0 16a10 10 0 0 1 0-16z" fill="#FF5F00" />
      </svg>
    </Chip>
  )
}

const BANK_WORDMARKS: Record<BankKey, React.ReactNode> = {
  maribank: <span className="text-[11px] font-bold tracking-tight text-black">MariBank</span>,
  gcash: <span className="text-[12px] font-bold tracking-tight text-black">GCash</span>,
  maya: <span className="text-[13px] font-extrabold tracking-tight text-black lowercase">maya</span>,
  gotyme: (
    <span className="text-[11px] font-bold tracking-tight text-black">
      Go<span className="font-light">Tyme</span>
    </span>
  ),
}

export function CardLogo({ brand }: { brand: CardBrand }) {
  return brand === "visa" ? <VisaMark /> : <MastercardMark />
}

export function BankLogo({ bank }: { bank: BankKey }) {
  return <Chip className="min-w-16">{BANK_WORDMARKS[bank]}</Chip>
}
