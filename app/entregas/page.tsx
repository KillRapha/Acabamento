import { DeliveryAction } from "@/components/forms/delivery-action";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { batchStatusLabel } from "@/lib/constants";
import { getDeliveryBoard, getStatusTone } from "@/lib/queries";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function DeliveriesPage() {
  const batches = await getDeliveryBoard();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Entregas"
        title="Controle de saída"
        description="Veja o que já está pronto e conclua a entrega com um toque, mantendo histórico e rastreabilidade."
      />

      <div className="space-y-4">
        {batches.map((batch) => {
          const ironingProgress = batch.stageProgresses.find((item) => item.stage === "IRONING")?.completedUnits ?? 0;

          return (
            <Card key={batch.id} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{batch.code}</p>
                  <h2 className="text-base font-semibold text-slate-950">{batch.productName}</h2>
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
                  <p className="text-xs font-medium text-slate-500">Entrega prevista</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">{formatDate(batch.dueDate)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">Passadeira concluída</p>
                <ProgressBar value={ironingProgress} total={batch.quantity} color="bg-emerald-500" />
              </div>

              <DeliveryAction batchId={batch.id} isDelivered={batch.status === "DELIVERED"} />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
