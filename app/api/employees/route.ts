import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validators";

export async function GET() {
  const employees = await prisma.employee.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] });
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = employeeSchema.parse(body);

    const employee = await prisma.employee.create({
      data: {
        name: payload.name,
        role: payload.role,
        phone: payload.phone || null,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível cadastrar a colaboradora." }, { status: 400 });
  }
}
