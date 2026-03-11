import { ClientForm } from "@/components/forms/client-form";
import { EmployeeForm } from "@/components/forms/employee-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { employeeRoleLabel } from "@/lib/constants";
import { getClients, getEmployees } from "@/lib/queries";
import { formatPhone } from "@/lib/utils";

export default async function TeamPage() {
  const [employees, clients] = await Promise.all([getEmployees(), getClients()]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Cadastros"
        title="Equipe e clientes"
        description="Mantenha a base operacional atualizada para lançar lotes e fazer apontamentos com rapidez."
      />

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Nova colaboradora</h2>
          <p className="mt-1 text-sm text-slate-500">Cadastre tiradeiras de linha, passadeiras e equipe de apoio.</p>
        </div>
        <EmployeeForm />
      </Card>

      <div className="space-y-4">
        {employees.map((employee) => (
          <Card key={employee.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-950">{employee.name}</h3>
                <p className="text-sm text-slate-500">{formatPhone(employee.phone)}</p>
              </div>
              <Badge label={employeeRoleLabel[employee.role]} tone="blue" />
            </div>
            <p className="text-sm text-slate-500">{employee._count.productionEntries} apontamentos registrados.</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Novo cliente</h2>
          <p className="mt-1 text-sm text-slate-500">Cadastre os clientes atendidos para organizar os lotes por contrato.</p>
        </div>
        <ClientForm />
      </Card>

      <div className="space-y-4 pb-4">
        {clients.map((client) => (
          <Card key={client.id} className="space-y-2">
            <h3 className="text-base font-semibold text-slate-950">{client.name}</h3>
            <p className="text-sm text-slate-500">{formatPhone(client.phone)}</p>
            <p className="text-sm text-slate-500">{client._count.batches} lotes vinculados</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
