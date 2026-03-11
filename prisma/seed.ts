import { PrismaClient, BatchStatus, EmployeeRole, StageType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.productionEntry.deleteMany();
  await prisma.batchStageProgress.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.client.deleteMany();

  const [clientA, clientB] = await Promise.all([
    prisma.client.create({
      data: {
        name: "Denim Norte",
        phone: "(62) 99999-1111",
        email: "contato@denimnorte.com",
      },
    }),
    prisma.client.create({
      data: {
        name: "Urban Wear GO",
        phone: "(62) 99999-2222",
        email: "producao@urbanweargo.com",
      },
    }),
  ]);

  const [threadTrimmer, ironingA, ironingB] = await Promise.all([
    prisma.employee.create({
      data: { name: "Marlene", role: EmployeeRole.THREAD_TRIMMER, phone: "(62) 99999-3333" },
    }),
    prisma.employee.create({
      data: { name: "Silvana", role: EmployeeRole.IRONER, phone: "(62) 99999-4444" },
    }),
    prisma.employee.create({
      data: { name: "Patrícia", role: EmployeeRole.IRONER, phone: "(62) 99999-5555" },
    }),
  ]);

  const batch1 = await prisma.batch.create({
    data: {
      code: "LT-2026-001",
      productName: "Calça Jeans Slim Azul",
      quantity: 800,
      dueDate: new Date("2026-03-16T18:00:00.000Z"),
      status: BatchStatus.IN_THREAD_TRIMMING,
      clientId: clientA.id,
      notes: "Prioridade alta. Separar por grade antes da entrega.",
      stageProgresses: {
        create: [
          { stage: StageType.THREAD_TRIMMING, completedUnits: 420, startedAt: new Date(), sortOrder: 1 },
          { stage: StageType.IRONING, completedUnits: 120, sortOrder: 2 },
        ],
      },
    },
  });

  const batch2 = await prisma.batch.create({
    data: {
      code: "LT-2026-002",
      productName: "Jaqueta Jeans Over",
      quantity: 260,
      dueDate: new Date("2026-03-14T18:00:00.000Z"),
      status: BatchStatus.READY_FOR_DELIVERY,
      clientId: clientB.id,
      notes: "Cliente pediu revisão visual final.",
      stageProgresses: {
        create: [
          { stage: StageType.THREAD_TRIMMING, completedUnits: 260, startedAt: new Date(), finishedAt: new Date(), sortOrder: 1 },
          { stage: StageType.IRONING, completedUnits: 260, startedAt: new Date(), finishedAt: new Date(), sortOrder: 2 },
        ],
      },
    },
  });

  await prisma.productionEntry.createMany({
    data: [
      { batchId: batch1.id, employeeId: threadTrimmer.id, quantity: 220, stage: StageType.THREAD_TRIMMING, notes: "Primeiro turno" },
      { batchId: batch1.id, employeeId: threadTrimmer.id, quantity: 200, stage: StageType.THREAD_TRIMMING, notes: "Segundo turno" },
      { batchId: batch1.id, employeeId: ironingA.id, quantity: 120, stage: StageType.IRONING, notes: "Lote parcial" },
      { batchId: batch2.id, employeeId: threadTrimmer.id, quantity: 260, stage: StageType.THREAD_TRIMMING },
      { batchId: batch2.id, employeeId: ironingB.id, quantity: 260, stage: StageType.IRONING },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
