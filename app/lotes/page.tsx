import Link from "next/link";
import type { BatchStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BatchActions } from "@/components/lotes/batch-actions";
import { batchStatusLabel } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/utils";

function getStatusTone(status: BatchStatus): "blue" | "amber" | "emerald" | "slate" {
  switch (status) {
    case "READY_FOR_DELIVERY":
      return "emerald";
    case "DELIVERED":
      return "slate";
    case "IN_THREAD_TRIMMING":
    case "IN_IRONING":
      return "amber";
    default:
      return "blue";
  }
}

export default async function BatchesPage() {
  const batches = await prisma.batch.findMany({
    include: {
      client: true,
      stageProgresses: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-5 px-4 pb-28 pt-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Produção
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Lotes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe, edite e gerencie os lotes cadastrados.
          </p>
        </div>

        <Link
          href="/lotes/novo"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Novo lote
        </Link>
      </div>

      {batches.length === 0 ? (
        <Card className="space-y-3 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100">
            <span className="text-xl">📦</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold text-slate-900">
              Nenhum lote cadastrado
            </h2>
            <p className="text-sm leading-6 text-slate-500">
              Cadastre o primeiro lote para começar a controlar a produção.
            </p>
          </div>

          <Link
            href="/lotes/novo"
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Cadastrar lote
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {batches.map((batch) => {
            const threadProgress =
              batch.stageProgresses.find(
                (item) => item.stage === "THREAD_TRIMMING"
              )?.completedUnits ?? 0;

            const ironingProgress =
              batch.stageProgresses.find((item) => item.stage === "IRONING")
                ?.completedUnits ?? 0;

            return (
              <Card key={batch.id} className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {batch.code}
                    </p>
                    <h2 className="text-base font-semibold text-slate-950">
                      {batch.productName}
                    </h2>
                    <p className="text-sm text-slate-500">{batch.client.name}</p>
                  </div>

                  <Badge
                    label={batchStatusLabel[batch.status]}
                    tone={getStatusTone(batch.status)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-3xl bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Quantidade
                    </p>
                    <p className="mt-1 text-base font-semibold text-slate-950">
                      {formatNumber(batch.quantity)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">Entrada</p>
                    <p className="mt-1 text-base font-semibold text-slate-950">
                      {formatDate(batch.entryDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">Entrega</p>
                    <p className="mt-1 text-base font-semibold text-slate-950">
                      {formatDate(batch.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800">
                      Tiradeira de linha
                    </p>
                    <ProgressBar
                      value={threadProgress}
                      total={batch.quantity}
                      color="bg-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800">
                      Passadeira
                    </p>
                    <ProgressBar
                      value={ironingProgress}
                      total={batch.quantity}
                      color="bg-emerald-500"
                    />
                  </div>
                </div>

                {batch.notes ? (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                    {batch.notes}
                  </p>
                ) : null}

                <BatchActions batchId={batch.id} />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}