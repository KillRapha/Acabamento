import type { PropsWithChildren } from "react";

export function Field({ label, helper, children }: PropsWithChildren<{ label: string; helper?: string }>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {helper ? <span className="text-xs text-slate-500">{helper}</span> : null}
    </label>
  );
}
