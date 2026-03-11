"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type BatchActionsProps = {
  batchId: string;
};

export function BatchActions({ batchId }: BatchActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  function handleDelete() {
    const confirmed = window.confirm("Tem certeza que deseja excluir este lote?");

    if (!confirmed) return;

    setErrorMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/batches/${batchId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error ?? "Não foi possível excluir o lote.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Link
          href={`/lotes/${batchId}/editar`}
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Editar
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>

      {errorMessage ? (
        <p className="text-sm font-medium text-rose-600">{errorMessage}</p>
      ) : null}
    </div>
  );
}