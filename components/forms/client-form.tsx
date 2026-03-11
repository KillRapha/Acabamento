"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  name: "",
  phone: "",
  email: "",
  notes: "",
};

export function ClientForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialState);
  const [feedback, setFeedback] = useState<string | null>(null);

  function updateField(field: keyof typeof initialState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        setFeedback(payload.error ?? "Não foi possível cadastrar o cliente.");
        return;
      }

      setForm(initialState);
      setFeedback("Cliente cadastrado com sucesso.");
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Field label="Nome do cliente">
        <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Ex.: Denim Norte" required />
      </Field>
      <Field label="Telefone">
        <Input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="(62) 99999-0000" />
      </Field>
      <Field label="E-mail">
        <Input value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="cliente@empresa.com" type="email" />
      </Field>
      <Field label="Observações">
        <Textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Preferências, restrições ou detalhes do contrato." />
      </Field>

      {feedback ? <p className="text-sm font-medium text-slate-600">{feedback}</p> : null}

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "Salvando..." : "Cadastrar cliente"}
      </Button>
    </form>
  );
}
