import {
  AlertTriangleIcon,
  BatchIcon,
  CheckCircleIcon,
  DeliveryIcon,
} from "@/components/icons";
import { Card } from "@/components/ui/card";

type SummaryCardProps = {
  title: string;
  value: number;
  helper: string;
};

function getSummaryConfig(title: string) {
  switch (title) {
    case "Lotes ativos":
      return {
        Icon: BatchIcon,
        iconWrapperClassName: "bg-indigo-50 text-indigo-700",
      };

    case "Prontos para entrega":
      return {
        Icon: DeliveryIcon,
        iconWrapperClassName: "bg-emerald-50 text-emerald-700",
      };

    case "Entregues":
      return {
        Icon: CheckCircleIcon,
        iconWrapperClassName: "bg-sky-50 text-sky-700",
      };

    case "Atrasados":
      return {
        Icon: AlertTriangleIcon,
        iconWrapperClassName: "bg-rose-50 text-rose-700",
      };

    default:
      return {
        Icon: BatchIcon,
        iconWrapperClassName: "bg-slate-100 text-slate-700",
      };
  }
}

export function SummaryCard({ title, value, helper }: SummaryCardProps) {
  const { Icon, iconWrapperClassName } = getSummaryConfig(title);

  return (
    <Card className="space-y-4">
      <div
        className={`flex size-11 items-center justify-center rounded-2xl ${iconWrapperClassName}`}
      >
        <Icon className="size-5" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">
          {value}
        </h2>
        <p className="text-xs leading-5 text-slate-500">{helper}</p>
      </div>
    </Card>
  );
}