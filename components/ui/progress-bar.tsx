import { cn } from "@/lib/utils";

export function ProgressBar({ value, total, color = "bg-slate-950" }: { value: number; total: number; color?: string }) {
  const percentage = total === 0 ? 0 : Math.min(100, Math.round((value / total) * 100));

  return (
    <div className="space-y-2">
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{percentage}% concluído</span>
        <span>
          {value}/{total}
        </span>
      </div>
    </div>
  );
}
