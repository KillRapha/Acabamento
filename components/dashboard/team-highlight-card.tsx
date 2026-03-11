import type { EmployeeRole } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { employeeRoleLabel } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export function TeamHighlightCard({
  name,
  role,
  lastProductionAt,
}: {
  name: string;
  role: EmployeeRole;
  lastProductionAt: Date | null;
}) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="size-11 rounded-2xl bg-slate-950 text-center text-sm font-bold leading-[44px] text-white">
          {name.slice(0, 1)}
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{employeeRoleLabel[role]}</span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-950">{name}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {lastProductionAt ? `Último apontamento em ${formatDate(lastProductionAt)}` : "Sem apontamentos registrados ainda."}
        </p>
      </div>
    </Card>
  );
}
