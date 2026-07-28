import type { ReservationStatus, TransportMode } from "../types";

export const transportMeta: Record<
  TransportMode,
  { label: string; className: string; stroke: string }
> = {
  flight: {
    label: "Avión",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    stroke: "#2563eb",
  },
  car: {
    label: "Coche",
    className: "bg-amber-50 text-amber-800 border-amber-200",
    stroke: "#d97706",
  },
  train: {
    label: "Tren",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    stroke: "#059669",
  },
  bus: {
    label: "Bus",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
    stroke: "#0891b2",
  },
  boat: {
    label: "Lancha",
    className: "bg-teal-50 text-teal-700 border-teal-200",
    stroke: "#0d9488",
  },
  walk: {
    label: "Actividad",
    className: "bg-stone-100 text-stone-700 border-stone-200",
    stroke: "#71717a",
  },
};

export const statusMeta: Record<ReservationStatus, { label: string; className: string }> = {
  pendiente: { label: "Pendiente", className: "bg-amber-50 text-amber-800 border-amber-200" },
  confirmado: { label: "Confirmado", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
