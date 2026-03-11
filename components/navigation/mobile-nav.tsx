"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BatchIcon,
  DeliveryIcon,
  HomeIcon,
  ProductionIcon,
  TeamIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const items: NavItem[] = [
  { href: "/" as Route, label: "Início", Icon: HomeIcon },
  { href: "/lotes" as Route, label: "Lotes", Icon: BatchIcon },
  { href: "/producao" as Route, label: "Produção", Icon: ProductionIcon },
  { href: "/entregas" as Route, label: "Entregas", Icon: DeliveryIcon },
  { href: "/equipe" as Route, label: "Equipe", Icon: TeamIcon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-24px)] max-w-[398px] items-center justify-between rounded-[28px] border border-white/70 bg-white/95 px-3 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.15)] backdrop-blur">
      {items.map(({ href, label, Icon }) => {
        const isActive =
          pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-w-[62px] flex-col items-center gap-1.5 rounded-2xl px-2.5 py-2.5 transition-all duration-200",
              isActive
                ? "bg-slate-950 text-white shadow-[0_10px_24px_rgba(2,6,23,0.28)]"
                : "text-slate-600 hover:bg-slate-100 active:scale-[0.98]"
            )}
          >
            <div
              className={cn(
                "flex size-7 items-center justify-center rounded-xl transition-colors",
                isActive ? "bg-white/10" : "bg-transparent"
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  isActive ? "text-white" : "text-slate-700"
                )}
              />
            </div>

            <span
              className={cn(
                "text-[11px] font-semibold leading-none tracking-[-0.01em]",
                isActive ? "text-white" : "text-slate-700"
              )}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}