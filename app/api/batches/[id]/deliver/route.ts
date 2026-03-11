import { BatchStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        status: BatchStatus.DELIVERED,
        deliveredAt: new Date(),
      },
    });

    return NextResponse.json(batch);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível concluir a entrega." }, { status: 400 });
  }
}
