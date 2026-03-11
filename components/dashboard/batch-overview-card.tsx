import type { Batch, BatchStageProgress, Client } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { batchStatusLabel, stageLabel } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/utils";
import { getStatusTone } from "@/lib/queries";

type BatchOverviewCardProps = {
  batch: Batch & {
    client: Client;
    stageProgresses: BatchStageProgress[];
  };
};

export function BatchOverviewCard({ batch }: BatchOverviewCardProps) {
  const threadProgress = batch.stageProgresses.find((item) => item.stage === "THREAD_TRIMMING")?.completedUnits ?? 0;
  const ironingProgress = batch.stageProgresses.find((item) => item.stage === "IRONING")?.completedUnits ?? 0;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{batch.code}</p>
          <h3 className="text-base font-semibold text-slate-950">{batch.productName}</h3>
          <p className="text-sm text-slate-500">{batch.client.name}</p>
        </div>
        <Badge label={batchStatusLabel[batch.status]} tone={getStatusTone(batch.status)} />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Quantidade</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{formatNumber(batch.quantity)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Entrega</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{formatDate(batch.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">{stageLabel.THREAD_TRIMMING}</p>
          <ProgressBar value={threadProgress} total={batch.quantity} color="bg-amber-500" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">{stageLabel.IRONING}</p>
          <ProgressBar value={ironingProgress} total={batch.quantity} color="bg-emerald-500" />
        </div>
      </div>
    </Card>
  );
}
