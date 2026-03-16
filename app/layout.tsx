import "./globals.css"
import type { ReactNode } from "react"
import { MobileNav } from "@/components/navigation/mobile-nav"

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-100 text-slate-950">
        {children}
        <MobileNav />
      </body>
    </html>
  )
}
