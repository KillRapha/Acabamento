import { BatchStatus, StageType } from "@prisma/client";
import type { BadgeTone } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalBatches, activeBatches, readyBatches, deliveredBatches, overdueBatches, recentBatches, teamSummary] =
    await Promise.all([
      prisma.batch.count(),
      prisma.batch.count({ where: { status: { not: BatchStatus.DELIVERED } } }),
      prisma.batch.count({ where: { status: BatchStatus.READY_FOR_DELIVERY } }),
      prisma.batch.count({ where: { status: BatchStatus.DELIVERED } }),
      prisma.batch.count({
        where: {
          status: { notIn: [BatchStatus.DELIVERED, BatchStatus.READY_FOR_DELIVERY] },
          dueDate: { lt: today },
        },
      }),
      prisma.batch.findMany({
        take: 6,
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
        include: {
          client: true,
          stageProgresses: true,
        },
      }),
      prisma.employee.findMany({
        where: { isActive: true },
        include: {
          productionEntries: {
            take: 1,
            orderBy: { workedAt: "desc" },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

  const summaryCards = [
    { title: "Lotes ativos", value: activeBatches, helper: `${totalBatches} lotes cadastrados no total.` },
    { title: "Prontos para entrega", value: readyBatches, helper: "Lotes aguardando saída." },
    { title: "Entregues", value: deliveredBatches, helper: "Pedidos concluídos." },
    { title: "Atrasados", value: overdueBatches, helper: "Precisam de ação imediata." },
  ];

  const stageTotals = recentBatches.reduce(
    (acc, batch) => {
      const thread = batch.stageProgresses.find((item) => item.stage === StageType.THREAD_TRIMMING)?.completedUnits ?? 0;
      const ironing = batch.stageProgresses.find((item) => item.stage === StageType.IRONING)?.completedUnits ?? 0;

      acc.thread += thread;
      acc.ironing += ironing;
      return acc;
    },
    { thread: 0, ironing: 0 },
  );

  const teamCards = teamSummary.map((employee) => ({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    lastProductionAt: employee.productionEntries[0]?.workedAt ?? null,
  }));

  return {
    summaryCards,
    stageTotals,
    recentBatches,
    teamCards,
  };
}

export async function getClients() {
  return prisma.client.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { batches: true } },
    },
  });
}

export async function getEmployees() {
  return prisma.employee.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { productionEntries: true } },
    },
  });
}

export async function getBatches() {
  return prisma.batch.findMany({
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    include: {
      client: true,
      stageProgresses: true,
      productionEntries: {
        include: {
          employee: true,
        },
        orderBy: { workedAt: "desc" },
        take: 4,
      },
    },
  });
}

export async function getProductionBoard() {
  return prisma.batch.findMany({
    where: {
      status: {
        in: [BatchStatus.RECEIVED, BatchStatus.IN_THREAD_TRIMMING, BatchStatus.IN_IRONING, BatchStatus.READY_FOR_DELIVERY],
      },
    },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    include: {
      client: true,
      stageProgresses: true,
      productionEntries: {
        include: { employee: true },
        orderBy: { workedAt: "desc" },
        take: 5,
      },
    },
  });
}

export async function getDeliveryBoard() {
  return prisma.batch.findMany({
    where: {
      status: {
        in: [BatchStatus.READY_FOR_DELIVERY, BatchStatus.DELIVERED],
      },
    },
    orderBy: [{ dueDate: "asc" }, { deliveredAt: "desc" }],
    include: {
      client: true,
      stageProgresses: true,
    },
  });
}

export function getStatusTone(status: BatchStatus): BadgeTone {
  switch (status) {
    case BatchStatus.READY_FOR_DELIVERY:
      return "emerald";
    case BatchStatus.DELIVERED:
      return "slate";
    case BatchStatus.IN_THREAD_TRIMMING:
    case BatchStatus.IN_IRONING:
      return "amber";
    default:
      return "blue";
  }
}

