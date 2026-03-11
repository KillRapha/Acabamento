import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/lib/validators";

export async function GET() {
  const clients = await prisma.client.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = clientSchema.parse(body);

    const client = await prisma.client.create({
      data: {
        name: payload.name,
        phone: payload.phone || null,
        email: payload.email || null,
        notes: payload.notes || null,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível cadastrar o cliente." }, { status: 400 });
  }
}
