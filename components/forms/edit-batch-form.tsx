"use client";

import type { Batch, Client } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type EditBatchFormProps = {
  batch: Batch;
  clients: Client[];
};

const statusOptions = [
  { value: "RECEIVED", label: "Recebido" },
  { value: "IN_THREAD_TRIMMING", label: "Em tiradeira" },
  { value: "IN_IRONING", label: "Em passadeira" },
  { value: "READY_FOR_DELIVERY", label: "Pronto para entrega" },
  { value: "DELIVERED", label: "Entregue" },
];

function formatDateForInput(date: Date | string) {
  const parsedDate = new Date(date);
  return parsedDate.toISOString().split("T")[0];
}

export function EditBatchForm({ batch, clients }: EditBatchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    code: batch.code,
    productName: batch.productName,
    quantity: String(batch.quantity),
    clientId: batch.clientId,
    status: batch.status,
    dueDate: formatDateForInput(batch.dueDate),
  });

  function handleChange(field: string, value: string) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/batches/${batch.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          quantity: Number(formData.quantity),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error ?? "Não foi possível atualizar o lote.");
        return;
      }

      setSuccessMessage("Lote atualizado com sucesso.");
      router.push("/lotes");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Código do lote
            </label>
            <input
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              placeholder="Ex.: LT-001"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Produto
            </label>
            <input
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              placeholder="Ex.: Calça Jeans"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Quantidade
            </label>
            <input
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Cliente
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => handleChange("clientId", e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              required
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              required
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Prazo de entrega
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
              required
            />
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-sm font-medium text-rose-600">{errorMessage}</p>
        ) : null}

        {successMessage ? (
          <p className="mt-4 text-sm font-medium text-emerald-600">
            {successMessage}
          </p>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push("/lotes")}
            className="h-11 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="h-11 rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </form>
  );
}