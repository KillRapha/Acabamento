import { ProductionForm } from "@/components/forms/production-form";
import { PageHeader } from "@/components/ui/page-header";
import { getEmployees, getProductionBoard } from "@/lib/queries";

export default async function ProductionPage() {
  const [batches, employees] = await Promise.all([getProductionBoard(), getEmployees()]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Produção"
        title="Apontamento por etapa"
        description="Registre as quantidades feitas pela tiradeira de linha e pela passadeira sem sair do celular."
      />
      <div className="space-y-4">
        {batches.map((batch) => (
          <ProductionForm key={batch.id} batch={batch} employees={employees.filter((employee) => employee.isActive)} />
        ))}
      </div>
    </div>
  );
}
