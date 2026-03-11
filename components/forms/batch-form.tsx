"use client";

import type { Client } from "@prisma/client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function getTodayDateInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

export function BatchForm({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    clientId: clients[0]?.id ?? "",
    productName: "",
    quantity: "",
    dueDate: getTodayDateInputValue(),
    notes: "",
  });

  const isDisabled = useMemo(() => clients.length === 0, [clients.length]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setFeedback(payload.error ?? "Não foi possível cadastrar o lote.");
        return;
      }

      setFeedback("Lote cadastrado com sucesso.");
      router.push("/lotes");
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Field label="Código do lote" helper="Use um identificador simples para rastrear o pedido.">
        <Input value={form.code} onChange={(event) => setForm((previous) => ({ ...previous, code: event.target.value }))} placeholder="Ex.: LT-2026-003" required />
      </Field>
      <Field label="Cliente">
        <Select
          value={form.clientId}
          onChange={(event) => setForm((previous) => ({ ...previous, clientId: event.target.value }))}
          disabled={isDisabled}
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Peça">
        <Input value={form.productName} onChange={(event) => setForm((previous) => ({ ...previous, productName: event.target.value }))} placeholder="Ex.: Calça jeans slim" required />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Quantidade">
          <Input value={form.quantity} onChange={(event) => setForm((previous) => ({ ...previous, quantity: event.target.value }))} type="number" min={1} required />
        </Field>
        <Field label="Entrega">
          <Input value={form.dueDate} onChange={(event) => setForm((previous) => ({ ...previous, dueDate: event.target.value }))} type="date" required />
        </Field>
      </div>
      <Field label="Observações">
        <Textarea value={form.notes} onChange={(event) => setForm((previous) => ({ ...previous, notes: event.target.value }))} placeholder="Separação por grade, prioridade, cuidados ou recados internos." />
      </Field>

      {clients.length === 0 ? <p className="text-sm text-amber-600">Cadastre um cliente antes de lançar o primeiro lote.</p> : null}
      {feedback ? <p className="text-sm font-medium text-slate-600">{feedback}</p> : null}

      <Button type="submit" fullWidth disabled={isPending || isDisabled}>
        {isPending ? "Salvando..." : "Cadastrar lote"}
      </Button>
    </form>
  );
}
