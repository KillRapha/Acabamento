import { BatchStatus, StageType } from "@prisma/client";

type Progress = {
  stage: StageType;
  completedUnits: number;
};

export function resolveBatchStatus(quantity: number, progressList: Progress[]): BatchStatus {
  const thread = progressList.find((item) => item.stage === StageType.THREAD_TRIMMING)?.completedUnits ?? 0;
  const ironing = progressList.find((item) => item.stage === StageType.IRONING)?.completedUnits ?? 0;

  if (ironing >= quantity) {
    return BatchStatus.READY_FOR_DELIVERY;
  }

  if (thread >= quantity) {
    return BatchStatus.IN_IRONING;
  }

  if (thread > 0) {
    return BatchStatus.IN_THREAD_TRIMMING;
  }

  return BatchStatus.RECEIVED;
}
