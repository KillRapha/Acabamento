import Link from "next/link"
import type { ElementType } from "react"
import { AlertTriangle, CheckCircle2, Layers3, Plus, Truck } from "lucide-react"

type DashboardOverviewProps = {
  activeLots: number
  readyToShip: number
  delivered: number
  delayed: number
}

type StatCardProps = {
  title: string
  value: number
  note: string
  icon: ElementType
  tone: string
}

function StatCard({ title, value, note, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="min-h-[168px] rounded-[28px] border border-slate-200/70 bg-white/95 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={2.2} />
      </div>

      <p className="text-[15px] font-semibold leading-5 text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-[40px] font-bold leading-none tracking-[-0.04em] text-slate-950">
        {value}
      </p>

      <p className="mt-3 text-sm font-medium text-slate-400">
        {note}
      </p>
    </article>
  )
}

export function DashboardOverview({
  activeLots,
  readyToShip,
  delivered,
  delayed,
}: DashboardOverviewProps) {
  const stats = [
    {
      title: "Lotes ativos",
      value: activeLots,
      note: "Em andamento",
      icon: Layers3,
      tone: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Prontos para entrega",
      value: readyToShip,
      note: "Aguardando saída",
      icon: Truck,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Entregues",
      value: delivered,
      note: "Finalizados",
      icon: CheckCircle2,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      title: "Atrasados",
      value: delayed,
      note: "Precisam de atenção",
      icon: AlertTriangle,
      tone: "bg-rose-50 text-rose-600",
    },
  ]

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <Link
          href="/lotes/novo"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(2,6,23,0.18)] transition-transform active:scale-[0.99]"
        >
          <Plus className="h-5 w-5" strokeWidth={2.4} />
          Novo lote
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            note={item.note}
            icon={item.icon}
            tone={item.tone}
          />
        ))}
      </div>
    </section>
  )
}
