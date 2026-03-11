"use client";

import type { Batch, BatchStageProgress, Client, Employee, ProductionEntry } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { batchStatusLabel, employeeRoleLabel, stageLabel } from "@/lib/constants";
import { formatDate, formatNumber } from "@/lib/utils";

type StageValue = "THREAD_TRIMMING" | "IRONING";
type BatchStatusValue = Batch["status"];

type BatchWithRelations = Batch & {
  client: Client;
  stageProgresses: BatchStageProgress[];
  productionEntries: (ProductionEntry & { employee: Employee })[];
};

const STAGES = {
  THREAD_TRIMMING: "THREAD_TRIMMING" as StageValue,
  IRONING: "IRONING" as StageValue,
};

function getStatusTone(status: BatchStatusValue): "blue" | "amber" | "emerald" | "slate" {
  switch (status) {
    case "READY_FOR_DELIVERY":
      return "emerald";
    case "DELIVERED":
      return "slate";
    case "IN_THREAD_TRIMMING":
    case "IN_IRONING":
      return "amber";
    default:
      return "blue";
  }
}

export function ProductionForm({
  batch,
  employees,
}: {
  batch: BatchWithRelations;
  employees: Employee[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const defaultStage: StageValue =
    batch.status === "IN_IRONING" || batch.status === "READY_FOR_DELIVERY"
      ? STAGES.IRONING
      : STAGES.THREAD_TRIMMING;

  const [form, setForm] = useState({
    batchId: batch.id,
    employeeId: employees[0]?.id ?? "",
    stage: defaultStage,
    quantity: "",
    notes: "",
  });

  const employeesByStage = useMemo(() => {
    if (form.stage === STAGES.THREAD_TRIMMING) {
      return employees.filter(
        (employee) =>
          employee.role === "THREAD_TRIMMER" ||
          employee.role === "SUPERVISOR" ||
          employee.role === "ADMIN",
      );
    }

    return employees.filter(
      (employee) =>
        employee.role === "IRONER" ||
        employee.role === "SUPERVISOR" ||
        employee.role === "ADMIN",
    );
  }, [employees, form.stage]);

  const threadProgress =
    batch.stageProgresses.find((item) => item.stage === STAGES.THREAD_TRIMMING)?.completedUnits ?? 0;

  const ironingProgress =
    batch.stageProgresses.find((item) => item.stage === STAGES.IRONING)?.completedUnits ?? 0;

  function handleStageChange(stage: StageValue) {
    const options =
      stage === STAGES.THREAD_TRIMMING
        ? employees.filter(
            (employee) =>
              employee.role === "THREAD_TRIMMER" ||
              employee.role === "SUPERVISOR" ||
              employee.role === "ADMIN",
          )
        : employees.filter(
            (employee) =>
              employee.role === "IRONER" ||
              employee.role === "SUPERVISOR" ||
              employee.role === "ADMIN",
          );

    setForm((previous) => ({
      ...previous,
      stage,
      employeeId: options[0]?.id ?? "",
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch("/api/production-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setFeedback(payload.error ?? "Não foi possível registrar o apontamento.");
        return;
      }

      setFeedback("Apontamento salvo com sucesso.");
      setForm((previous) => ({
        ...previous,
        quantity: "",
        notes: "",
      }));
      router.refresh();
    });
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {batch.code}
          </p>
          <h3 className="text-base font-semibold text-slate-950">{batch.productName}</h3>
          <p className="text-sm text-slate-500">{batch.client.name}</p>
        </div>
        <Badge label={batchStatusLabel[batch.status]} tone={getStatusTone(batch.status)} />
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Quantidade total</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{formatNumber(batch.quantity)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Entrega</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">{formatDate(batch.dueDate)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">{stageLabel.THREAD_TRIMMING}</p>
          <ProgressBar value={threadProgress} total={batch.quantity} color="bg-amber-500" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-800">{stageLabel.IRONING}</p>
          <ProgressBar value={ironingProgress} total={batch.quantity} color="bg-emerald-500" />
        </div>
      </div>

      <form className="space-y-4 border-t border-slate-100 pt-4" onSubmit={handleSubmit}>
        <Field label="Etapa">
          <Select
            value={form.stage}
            onChange={(event) => handleStageChange(event.target.value as StageValue)}
          >
            <option value={STAGES.THREAD_TRIMMING}>Tiradeira de linha</option>
            <option value={STAGES.IRONING}>Passadeira</option>
          </Select>
        </Field>

        <Field label="Colaboradora">
          <Select
            value={form.employeeId}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, employeeId: event.target.value }))
            }
          >
            {employeesByStage.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} · {employeeRoleLabel[employee.role]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Quantidade produzida">
          <Input
            value={form.quantity}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, quantity: event.target.value }))
            }
            type="number"
            min={1}
            required
          />
        </Field>

        <Field label="Observação">
          <Textarea
            value={form.notes}
            onChange={(event) =>
              setForm((previous) => ({ ...previous, notes: event.target.value }))
            }
            placeholder="Turno, observação de separação ou detalhe interno."
          />
        </Field>

        {feedback ? <p className="text-sm font-medium text-slate-600">{feedback}</p> : null}

        <Button type="submit" fullWidth disabled={isPending || employeesByStage.length === 0}>
          {isPending ? "Salvando..." : "Registrar produção"}
        </Button>
      </form>

      {batch.productionEntries.length > 0 ? (
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-800">Últimos apontamentos</p>

          <div className="space-y-3">
            {batch.productionEntries.map((entry) => (
              <div key={entry.id} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{entry.employee.name}</p>
                    <p className="text-xs text-slate-500">{stageLabel[entry.stage]}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-950">
                    {formatNumber(entry.quantity)} peças
                  </p>
                </div>

                {entry.notes ? (
                  <p className="mt-2 text-xs text-slate-500">{entry.notes}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}