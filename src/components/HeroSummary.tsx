import { AlertTriangle, CalendarDays, Hotel, MapPinned, Plane, Train, TriangleAlert } from "lucide-react";
import type { CriticalTask } from "../types";
import { StatusBadge } from "./Badges";

export function HeroSummary({
  criticalTasks,
  onOpenTask,
}: {
  criticalTasks: CriticalTask[];
  onOpenTask: (task: CriticalTask) => void;
}) {
  const keyPendingCount = criticalTasks.filter((task) => task.status !== "confirmado").length;
  const stats = [
    { label: "Días de viaje", value: "15", icon: CalendarDays },
    { label: "Bases", value: "6", icon: MapPinned },
    { label: "Vuelos", value: "5", icon: Plane },
    { label: "Trenes", value: "2", icon: Train },
    { label: "Hoteles/lodge", value: "6", icon: Hotel },
    { label: "Pendientes clave", value: String(keyPendingCount), icon: TriangleAlert },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-lg border border-stone-200 bg-white p-5 md:p-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold text-stone-950 md:text-6xl">Perú 2026</h1>
          <p className="mt-4 text-base leading-7 text-stone-600 md:text-lg">
            {"Madrid -> Lima -> Arequipa -> Valle Sagrado -> Machu Picchu -> Cusco -> Amazonía -> Lima -> Madrid"}
          </p>
          <p className="mt-3 text-sm font-medium text-stone-500">8 septiembre - 22 septiembre 2026 · 2 adultos</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <Icon className="size-4 text-stone-500" />
                <p className="mt-4 text-2xl font-semibold text-stone-950">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-stone-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <aside>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-700" />
            <h2 className="text-sm font-semibold text-amber-950">Pendientes</h2>
          </div>
          <div className="mt-4 space-y-2">
            {criticalTasks.slice(0, 5).map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onOpenTask(task)}
                className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-left transition hover:border-amber-300"
              >
                <p className="text-sm font-medium text-stone-900">{task.title}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge status={task.status} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
