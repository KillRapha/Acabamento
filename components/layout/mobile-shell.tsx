import type { PropsWithChildren } from "react";
import { MobileNav } from "@/components/navigation/mobile-nav";

export function MobileShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-transparent px-4 pb-28 pt-6">
        <main className="flex-1 space-y-5">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
