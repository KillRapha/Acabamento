import { BatchStatus, StageType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { batchSchema } from "@/lib/validators";

export async function GET() {
  const batches = await prisma.batch.findMany({
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    include: {
      client: true,
      stageProgresses: true,
    },
  });

  return NextResponse.json(batches);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = batchSchema.parse(body);

    const batch = await prisma.batch.create({
      data: {
        code: payload.code,
        clientId: payload.clientId,
        productName: payload.productName,
        quantity: payload.quantity,
        dueDate: new Date(`${payload.dueDate}T18:00:00`),
        notes: payload.notes || null,
        status: BatchStatus.RECEIVED,
        stageProgresses: {
          create: [
            { stage: StageType.THREAD_TRIMMING, sortOrder: 1 },
            { stage: StageType.IRONING, sortOrder: 2 },
          ],
        },
      },
      include: {
        stageProgresses: true,
      },
    });

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível cadastrar o lote. Verifique se o código já não existe." }, { status: 400 });
  }
}
