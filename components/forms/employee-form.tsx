"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type EmployeeRoleValue =
  | "THREAD_TRIMMER"
  | "IRONER"
  | "SUPERVISOR"
  | "ADMIN";

type EmployeeFormState = {
  name: string;
  role: EmployeeRoleValue;
  phone: string;
};

const roleOptions: Array<{ value: EmployeeRoleValue; label: string }> = [
  { value: "THREAD_TRIMMER", label: "Tiradeira de linha" },
  { value: "IRONER", label: "Passadeira" },
  { value: "SUPERVISOR", label: "Supervisão" },
  { value: "ADMIN", label: "Administrativo" },
];

export function EmployeeForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const [form, setForm] = useState<EmployeeFormState>({
    name: "",
    role: "THREAD_TRIMMER",
    phone: "",
  });

  function updateField<K extends keyof EmployeeFormState>(
    field: K,
    value: EmployeeFormState[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const result = await response.json();

        if (!response.ok) {
          setFeedback(result.error ?? "Não foi possível cadastrar a colaboradora.");
          return;
        }

        setFeedback("Colaboradora cadastrada com sucesso.");
        setForm({
          name: "",
          role: "THREAD_TRIMMER",
          phone: "",
        });

        router.refresh();
      } catch {
        setFeedback("Ocorreu um erro ao salvar a colaboradora.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nome">
        <Input
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="Ex.: Maria Souza"
          required
        />
      </Field>

      <Field label="Função">
        <Select
          value={form.role}
          onChange={(event) =>
            updateField("role", event.target.value as EmployeeRoleValue)
          }
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Telefone">
        <Input
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          placeholder="(62) 99999-9999"
        />
      </Field>

      {feedback ? (
        <p className="text-sm font-medium text-slate-600">{feedback}</p>
      ) : null}

      <Button type="submit" fullWidth disabled={isPending}>
        {isPending ? "Salvando..." : "Cadastrar colaboradora"}
      </Button>
    </form>
  );
}