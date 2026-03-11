import { BatchForm } from "@/components/forms/batch-form";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getClients } from "@/lib/queries";

export default async function NewBatchPage() {
  const clients = await getClients();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Novo lote"
        title="Registrar entrada"
        description="Lance rapidamente o cliente, a peça, a quantidade recebida e o prazo de entrega para iniciar o fluxo da produção."
      />
      <Card>
        <BatchForm clients={clients} />
      </Card>
    </div>
  );
}
