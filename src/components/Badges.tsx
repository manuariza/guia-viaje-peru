import { BusFront, CarFront, Footprints, Plane, Ship, TrainFront } from "lucide-react";
import type { ReservationStatus, TransportMode } from "../types";
import { cn } from "../utils/cn";
import { statusMeta, transportMeta } from "../utils/format";

const badgeBase =
  "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium leading-none";

const transportIcons = {
  flight: Plane,
  car: CarFront,
  train: TrainFront,
  bus: BusFront,
  boat: Ship,
  walk: Footprints,
} satisfies Record<TransportMode, typeof Plane>;

export function TransportIcon({ mode, className = "size-4" }: { mode: TransportMode; className?: string }) {
  const Icon = transportIcons[mode];
  return <Icon className={className} aria-hidden="true" />;
}

export function TransportBadge({ mode, label }: { mode: TransportMode; label?: string }) {
  const meta = transportMeta[mode];

  return (
    <span className={cn(badgeBase, meta.className)}>
      <TransportIcon mode={mode} className="size-3.5 shrink-0" />
      {label ?? meta.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const meta = statusMeta[status];
  return <span className={cn(badgeBase, meta.className)}>{meta.label}</span>;
}
