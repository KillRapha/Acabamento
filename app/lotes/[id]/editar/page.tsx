import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditBatchForm } from "@/components/forms/edit-batch-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBatchPage({ params }: PageProps) {
  const { id } = await params;

  const [batch, clients] = await Promise.all([
    prisma.batch.findUnique({
      where: { id },
    }),
    prisma.client.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!batch) {
    notFound();
  }

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Edição
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Editar lote
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize as informações do lote de forma rápida e segura.
        </p>
      </div>

      <EditBatchForm batch={batch} clients={clients} />
    </div>
  );
}