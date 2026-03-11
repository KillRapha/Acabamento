import type { SVGProps } from "react";

function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </IconBase>
  );
}

export function BatchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M4 7.5 12 4l8 3.5-8 3.5L4 7.5Z" />
      <path d="M4 12.5 12 16l8-3.5" />
      <path d="M4 17.5 12 21l8-3.5" />
    </IconBase>
  );
}

export function ProductionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 2v5" />
      <path d="M12 17v5" />
      <path d="M4.93 4.93l3.53 3.53" />
      <path d="M15.54 15.54l3.53 3.53" />
      <path d="M2 12h5" />
      <path d="M17 12h5" />
      <path d="M4.93 19.07l3.53-3.53" />
      <path d="M15.54 8.46l3.53-3.53" />
      <circle cx="12" cy="12" r="3.5" />
    </IconBase>
  );
}

export function DeliveryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h3l3 3v2h-6z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="17.5" cy="17.5" r="1.5" />
    </IconBase>
  );
}

export function TeamIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M17 21v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V21" />
      <circle cx="10" cy="7" r="4" />
      <path d="M21 21v-1a3 3 0 0 0-2.4-2.94" />
      <path d="M16 3.13a3.5 3.5 0 0 1 0 6.75" />
    </IconBase>
  );
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3L15.8 9.4" />
    </IconBase>
  );
}

export function AlertTriangleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 4 20 18H4L12 4Z" />
      <path d="M12 9v4" />
      <path d="M12 16h.01" />
    </IconBase>
  );
}