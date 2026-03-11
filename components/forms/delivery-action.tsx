"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeliveryAction({ batchId, isDelivered }: { batchId: string; isDelivered: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleAction() {
    if (isDelivered) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/batches/${batchId}/deliver`, {
        method: "PATCH",
      });

      const payload = await response.json();

      if (!response.ok) {
        setFeedback(payload.error ?? "Não foi possível concluir a entrega.");
        return;
      }

      setFeedback("Entrega concluída com sucesso.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Button type="button" fullWidth variant={isDelivered ? "secondary" : "success"} disabled={isPending || isDelivered} onClick={handleAction}>
        {isPending ? "Atualizando..." : isDelivered ? "Entrega finalizada" : "Marcar como entregue"}
      </Button>
      {feedback ? <p className="text-center text-xs font-medium text-slate-500">{feedback}</p> : null}
    </div>
  );
}
