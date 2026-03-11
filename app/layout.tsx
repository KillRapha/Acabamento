import type { Metadata } from "next";
import { MobileShell } from "@/components/layout/mobile-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "JeansFlow Mobile",
  description: "Controle mobile de lotes, produção e entrega para acabamento de jeans.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <MobileShell>{children}</MobileShell>
      </body>
    </html>
  );
}
