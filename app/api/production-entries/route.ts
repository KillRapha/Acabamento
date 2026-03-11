import { StageType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveBatchStatus } from "@/lib/batch-status";
import { productionEntrySchema } from "@/lib/validators";

export async function GET() {
  const entries = await prisma.productionEntry.findMany({
    include: {
      batch: true,
      employee: true,
    },
    orderBy: { workedAt: "desc" },
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = productionEntrySchema.parse(body);

    const result = await prisma.$transaction(async (transaction) => {
      const batch = await transaction.batch.findUnique({
        where: { id: payload.batchId },
        include: { stageProgresses: true },
      });

      if (!batch) {
        throw new Error("Lote não encontrado.");
      }

      const progress = batch.stageProgresses.find((item) => item.stage === payload.stage);

      if (!progress) {
        throw new Error("Etapa não encontrada.");
      }

      if (payload.stage === StageType.IRONING) {
        const threadProgress = batch.stageProgresses.find((item) => item.stage === StageType.THREAD_TRIMMING)?.completedUnits ?? 0;

        if (threadProgress < batch.quantity) {
          throw new Error("A passadeira só pode receber apontamento após a tiradeira concluir o lote.");
        }
      }

      const nextCompletedUnits = Math.min(progress.completedUnits + payload.quantity, batch.quantity);

      await transaction.productionEntry.create({
        data: {
          batchId: payload.batchId,
          employeeId: payload.employeeId,
          stage: payload.stage,
          quantity: payload.quantity,
          notes: payload.notes || null,
        },
      });

      await transaction.batchStageProgress.update({
        where: {
          batchId_stage: {
            batchId: payload.batchId,
            stage: payload.stage,
          },
        },
        data: {
          startedAt: progress.startedAt ?? new Date(),
          completedUnits: nextCompletedUnits,
          finishedAt: nextCompletedUnits >= batch.quantity ? new Date() : null,
        },
      });

      const refreshedProgressList = batch.stageProgresses.map((item) =>
        item.stage === payload.stage ? { ...item, completedUnits: nextCompletedUnits } : item,
      );

      const nextStatus = resolveBatchStatus(batch.quantity, refreshedProgressList);

      const updatedBatch = await transaction.batch.update({
        where: { id: payload.batchId },
        data: { status: nextStatus },
      });

      return updatedBatch;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Não foi possível registrar o apontamento." }, { status: 400 });
  }
}
