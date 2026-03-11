import { EmployeeRole, StageType } from "@prisma/client";
import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Informe o nome do cliente."),
  phone: z.string().optional().nullable(),
  email: z.string().email("Informe um e-mail válido.").optional().or(z.literal("")),
  notes: z.string().optional().nullable(),
});

export const employeeSchema = z.object({
  name: z.string().min(2, "Informe o nome da colaboradora."),
  role: z.nativeEnum(EmployeeRole),
  phone: z.string().optional().nullable(),
});

export const batchSchema = z.object({
  code: z.string().min(3, "Informe o código do lote."),
  clientId: z.string().min(1, "Selecione o cliente."),
  productName: z.string().min(3, "Informe a peça."),
  quantity: z.coerce.number().int().positive("A quantidade deve ser maior que zero."),
  dueDate: z.string().min(1, "Informe a data de entrega."),
  notes: z.string().optional().nullable(),
});

export const productionEntrySchema = z.object({
  batchId: z.string().min(1, "Selecione o lote."),
  employeeId: z.string().min(1, "Selecione a colaboradora."),
  stage: z.nativeEnum(StageType),
  quantity: z.coerce.number().int().positive("Informe uma quantidade válida."),
  notes: z.string().optional().nullable(),
});
