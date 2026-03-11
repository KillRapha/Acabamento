import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const code = String(body.code ?? "").trim();
    const productName = String(body.productName ?? "").trim();
    const quantity = Number(body.quantity);
    const clientId = String(body.clientId ?? "").trim();
    const status = String(body.status ?? "").trim();
    const dueDate = String(body.dueDate ?? "").trim();

    if (!code || !productName || !clientId || !status || !dueDate || Number.isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Preencha os campos obrigatórios corretamente." },
        { status: 400 }
      );
    }

    const updatedBatch = await prisma.batch.update({
      where: { id },
      data: {
        code,
        productName,
        quantity,
        clientId,
        status: status as any,
        dueDate: new Date(dueDate),
      },
    });

    return NextResponse.json(updatedBatch);
  } catch (error) {
    console.error("Erro ao atualizar lote:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o lote." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    await prisma.batch.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao excluir lote:", error);

    if (error?.code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Este lote possui registros vinculados e não pode ser excluído diretamente.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Não foi possível excluir o lote." },
      { status: 500 }
    );
  }
}