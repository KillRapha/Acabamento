import Link from "next/link";
import { BatchOverviewCard } from "@/components/dashboard/batch-overview-card";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { TeamHighlightCard } from "@/components/dashboard/team-highlight-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getDashboardData } from "@/lib/queries";

export default async function DashboardPage() {
  const { summaryCards, stageTotals, recentBatches, teamCards } = await getDashboardData();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Painel mobile"
        title="Controle de acabamento"
        description="Acompanhe lotes, produtividade das tiradeiras e passadeiras, além das entregas do dia em um fluxo simples e rápido."
        action={
          <Link href="/lotes/novo">
            <Button fullWidth>Novo lote</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} title={card.title} value={card.value} helper={card.helper} />
        ))}
      </div>

      <Card className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Visão operacional</p>
          <h2 className="text-lg font-semibold text-slate-950">Progresso recente das etapas</h2>
          <p className="text-sm text-slate-500">Peças registradas nos lotes mais próximos da entrega.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-700">Tiradeira de linha</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-amber-950">{stageTotals.thread}</p>
            <p className="mt-1 text-xs text-amber-700">peças já apontadas</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-700">Passadeira</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-950">{stageTotals.ironing}</p>
            <p className="mt-1 text-xs text-emerald-700">peças já apontadas</p>
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Lotes críticos</p>
            <h2 className="text-lg font-semibold text-slate-950">Fila de produção</h2>
          </div>
          <Link href="/lotes" className="text-sm font-semibold text-slate-700">
            Ver todos
          </Link>
        </div>
        <div className="space-y-4">
          {recentBatches.map((batch) => (
            <BatchOverviewCard key={batch.id} batch={batch} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Equipe ativa</p>
            <h2 className="text-lg font-semibold text-slate-950">Apontamentos recentes</h2>
          </div>
          <Link href="/equipe" className="text-sm font-semibold text-slate-700">
            Gerenciar
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {teamCards.map((member) => (
            <TeamHighlightCard key={member.id} name={member.name} role={member.role} lastProductionAt={member.lastProductionAt} />
          ))}
        </div>
      </section>
    </div>
  );
}
