import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4">
      <div className="space-y-1">
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p> : null}
        <h1 className="text-[28px] font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {action}
    </header>
  );
}
