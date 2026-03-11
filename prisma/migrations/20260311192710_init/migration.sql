-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('THREAD_TRIMMER', 'IRONER', 'SUPERVISOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('RECEIVED', 'IN_THREAD_TRIMMING', 'IN_IRONING', 'READY_FOR_DELIVERY', 'DELIVERED');

-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('THREAD_TRIMMING', 'IRONING');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "notes" TEXT,
    "status" "BatchStatus" NOT NULL DEFAULT 'RECEIVED',
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchStageProgress" (
    "id" TEXT NOT NULL,
    "stage" "StageType" NOT NULL,
    "completedUnits" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL,
    "batchId" TEXT NOT NULL,

    CONSTRAINT "BatchStageProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionEntry" (
    "id" TEXT NOT NULL,
    "stage" "StageType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "workedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "batchId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "ProductionEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_code_key" ON "Batch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "BatchStageProgress_batchId_stage_key" ON "BatchStageProgress"("batchId", "stage");

-- CreateIndex
CREATE INDEX "ProductionEntry_batchId_stage_idx" ON "ProductionEntry"("batchId", "stage");

-- CreateIndex
CREATE INDEX "ProductionEntry_employeeId_workedAt_idx" ON "ProductionEntry"("employeeId", "workedAt");

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchStageProgress" ADD CONSTRAINT "BatchStageProgress_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEntry" ADD CONSTRAINT "ProductionEntry_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEntry" ADD CONSTRAINT "ProductionEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
