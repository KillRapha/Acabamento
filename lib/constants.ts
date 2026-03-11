import type { BatchStatus, EmployeeRole, StageType } from "@prisma/client";

export const batchStatusLabel: Record<BatchStatus, string> = {
  RECEIVED: "Recebido",
  IN_THREAD_TRIMMING: "Na tiradeira",
  IN_IRONING: "Na passadeira",
  READY_FOR_DELIVERY: "Pronto para entrega",
  DELIVERED: "Entregue",
};

export const employeeRoleLabel: Record<EmployeeRole, string> = {
  THREAD_TRIMMER: "Tiradeira de linha",
  IRONER: "Passadeira",
  SUPERVISOR: "Supervisão",
  ADMIN: "Administração",
};

export const stageLabel: Record<StageType, string> = {
  THREAD_TRIMMING: "Tiradeira de linha",
  IRONING: "Passadeira",
};
