import { cn } from "@/lib/utils";

export type BadgeTone = "slate" | "emerald" | "amber" | "blue";

const toneClasses: Record<BadgeTone, string> = {
  slate: "bg-slate-100 text-slate-700 border-slate-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  blue: "bg-blue-50 text-blue-700 border-blue-100",
};

export function Badge({ label, tone = "slate" }: { label: string; tone?: BadgeTone }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", toneClasses[tone])}>
      {label}
    </span>
  );
}
