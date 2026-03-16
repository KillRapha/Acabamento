"use client"

import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import { House, Layers3, Sparkles, Truck, Users2 } from "lucide-react"

type NavItem = {
  href: Route
  label: string
  icon: LucideIcon
}

const items: NavItem[] = [
  { href: "/", label: "Início", icon: House },
  { href: "/lotes", label: "Lotes", icon: Layers3 },
  { href: "/producao", label: "Produção", icon: Sparkles },
  { href: "/entregas", label: "Entregas", icon: Truck },
  { href: "/equipe", label: "Equipe", icon: Users2 },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-md -translate-x-1/2 px-1">
      <nav className="rounded-[28px] border border-slate-200/80 bg-white/95 p-2 shadow-[0_14px_30px_rgba(15,23,42,0.10)] backdrop-blur">
        <ul className="grid grid-cols-5 gap-1">
          {items.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href))

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2 transition-all",
                    isActive
                      ? "bg-slate-950 text-white shadow-[0_10px_20px_rgba(2,6,23,0.18)]"
                      : "text-slate-500 hover:bg-slate-100",
                  ].join(" ")}
                >
                  <Icon
                    className={isActive ? "h-5 w-5" : "h-5 w-5"}
                    strokeWidth={2.2}
                  />
                  <span
                    className={[
                      "text-[11px] font-semibold leading-none",
                      isActive ? "text-white" : "text-slate-600",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
