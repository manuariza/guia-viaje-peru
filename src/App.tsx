import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { CheckCircle2, Copy, MapPinned, RefreshCw, ShieldCheck } from "lucide-react";
import { AppLayout } from "./components/AppLayout";
import { TransferCard } from "./components/Cards";
import { DetailModal, type DetailPayload } from "./components/DetailModal";
import { HeroSummary } from "./components/HeroSummary";
import { SearchInput } from "./components/SearchInput";
import { Timeline } from "./components/Timeline";
import { TripBudget } from "./components/TripBudget";
import { TravelGuide } from "./components/TravelGuide";
import { CulturalGuide } from "./components/CulturalGuide";
import { TripMap } from "./components/TripMap";
import type { CriticalTask, MapFilterState } from "./types";
import { itinerary } from "./data/itinerary";
import { places } from "./data/places";
import { criticalTasks } from "./data/publicPlanning";
import { transfers } from "./data/transfers";
import { normalize } from "./utils/format";
import { StatusBadge, TransportBadge } from "./components/Badges";
import { culturalGuideForDay } from "./data/culturalGuide";

const tabs = [
  { value: "dias", label: "Día a día" },
  { value: "guia", label: "Guía cultural" },
  { value: "costes", label: "Costes" },
  { value: "pendientes", label: "Preparación" },
  { value: "mapa", label: "Mapa" },
  { value: "trayectos", label: "Trayectos" },
  { value: "resumen", label: "Resumen" },
];

const mapFilters: MapFilterState = {
  mode: "all",
  risk: "all",
  status: "all",
};

const dataVersion = "2026-08-19.5";
const dataUpdatedLabel = "19 agosto 2026 · reservas de Chicha y LIMO en Cusco";

function includesQuery(values: string[], query: string) {
  if (!query) return true;
  const needle = normalize(query);
  return values.some((value) => normalize(value).includes(needle));
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-[22px] font-semibold text-stone-950 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<DetailPayload | null>(null);

  const openDetail = (payload: DetailPayload) => setDetail(payload);
  const openTaskDetail = (task: CriticalTask, eyebrow = "Pendiente") =>
    openDetail({
      title: task.title,
      eyebrow,
      description: `Fecha objetivo: ${task.due}`,
      links: task.links ?? [],
      sections: [
        { title: "Detalle operativo", items: task.details },
        { title: "Estado", items: [`Estado: ${task.status}`, `Prioridad: ${task.priority}`] },
      ],
    });

  const filteredTransfers = useMemo(
    () =>
      transfers.filter((transfer) =>
        includesQuery(
          [transfer.date, transfer.from, transfer.to, transfer.modeLabel, transfer.notes, transfer.status],
          query,
        ),
      ),
    [query],
  );

  const filteredDays = useMemo(
    () =>
      itinerary.filter((day) =>
        includesQuery(
          [
            day.date,
            day.base,
            day.summary,
            ...day.activities,
            ...day.foods,
            ...day.shopping,
            culturalGuideForDay(day.id)?.markdown ?? "",
          ],
          query,
        ),
      ),
    [query],
  );

  const isClosedTask = (task: CriticalTask) => task.status === "confirmado";
  const keyTasks = criticalTasks.filter((task) => task.priority === "prioritario" && !isClosedTask(task));
  const priorityTasks = criticalTasks.filter(
    (task) => task.priority === "prioritario" && !isClosedTask(task),
  );
  const secondaryTasks = criticalTasks.filter(
    (task) => task.priority === "secundario" && !isClosedTask(task),
  );
  const completedTasks = criticalTasks.filter(isClosedTask);
  const openTaskCount = criticalTasks.length - completedTasks.length;
  const refreshPublishedData = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("v", `${dataVersion}-${Date.now()}`);
    window.location.assign(url.toString());
  };

  return (
    <AppLayout>
      <Tabs.Root defaultValue="dias" className="space-y-5 sm:space-y-6">
        <header className="sticky top-0 z-40 -mx-3 border-b border-stone-200 bg-stone-50/95 px-3 py-2 backdrop-blur md:-mx-6 md:px-6 md:py-3 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">Guía de viaje · Perú 2026</p>
                <p className="text-sm font-medium text-stone-950">Itinerario de referencia</p>
                <p className="mt-0.5 text-[11px] text-stone-500">Actualizado: {dataUpdatedLabel}</p>
              </div>
              <button
                type="button"
                onClick={refreshPublishedData}
                className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 hover:border-stone-300 active:translate-y-px"
              >
                <RefreshCw className="size-3.5" />
                Actualizar
              </button>
            </div>

            <Tabs.List className="grid grid-cols-3 gap-1 rounded-lg border border-stone-200 bg-white p-1 sm:flex sm:overflow-x-auto">
              {tabs.map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="min-h-11 min-w-0 rounded-md px-1.5 text-xs font-medium text-stone-500 outline-none transition focus-visible:ring-2 focus-visible:ring-stone-400 data-[state=active]:bg-stone-950 data-[state=active]:text-white sm:shrink-0 sm:px-3 sm:text-sm"
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <SearchInput value={query} onChange={setQuery} />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(
                  "Perú 2026 · Madrid -> Lima -> Arequipa -> Valle Sagrado -> Machu Picchu -> Cusco -> Amazonía -> Lima -> Madrid",
                )
              }
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-2 text-sm font-medium text-stone-700 hover:border-stone-300 active:translate-y-px sm:px-3"
            >
              <Copy className="size-4" />
              Copiar ruta
            </button>
            <a
              href="https://maps.google.com/?q=Peru"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-2 text-sm font-medium text-stone-700 hover:border-stone-300 active:translate-y-px sm:px-3"
            >
              <MapPinned className="size-4" />
              Ver mapa
            </a>
          </div>
        </div>

        <Tabs.Content value="resumen" className="space-y-6 outline-none">
          <HeroSummary
            criticalTasks={keyTasks}
            onOpenTask={(task) => openTaskDetail(task, "Punto crítico")}
          />
          <TripMap places={places} transfers={transfers} filters={mapFilters} onOpen={openDetail} />
        </Tabs.Content>

        <Tabs.Content value="mapa" className="space-y-6 outline-none">
          <TripMap places={places} transfers={filteredTransfers} filters={mapFilters} onOpen={openDetail} />
        </Tabs.Content>

        <Tabs.Content value="trayectos" className="space-y-6 outline-none">
          <SectionHeader title="Trayectos" description="Tabla y tarjetas de todos los movimientos del viaje." />
          <div className="hidden overflow-hidden rounded-lg border border-stone-200 bg-white lg:block">
            <div className="hidden grid-cols-[110px_1fr_1fr_190px_120px] gap-4 border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs font-semibold uppercase text-stone-500 lg:grid">
              <span>Fecha</span>
              <span>Desde</span>
              <span>Hasta</span>
              <span>Medio</span>
              <span>Estado</span>
            </div>
            {filteredTransfers.map((transfer) => (
              <button
                type="button"
                key={transfer.id}
                onClick={() =>
                  openDetail({
                    title: `${transfer.from} -> ${transfer.to}`,
                    eyebrow: transfer.date,
                    description: transfer.notes,
                    location: `${transfer.departure} / ${transfer.arrival} · ${transfer.duration}`,
                    links: transfer.mapUrl ? [{ label: "Abrir Google Maps", url: transfer.mapUrl }] : [],
                    sections: [{ title: "Tipo", items: [transfer.type, transfer.modeLabel] }],
                  })
                }
                className="grid w-full gap-3 border-b border-stone-100 px-4 py-4 text-left text-sm transition last:border-b-0 hover:bg-stone-50 lg:grid-cols-[110px_1fr_1fr_190px_120px] lg:items-center"
              >
                <span className="font-medium text-stone-500">{transfer.date}</span>
                <span className="font-semibold text-stone-950">{transfer.from}</span>
                <span className="text-stone-700">{transfer.to}</span>
                <TransportBadge mode={transfer.mode} label={transfer.modeLabel} />
                <StatusBadge status={transfer.status} />
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {filteredTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} onOpen={openDetail} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="dias" className="space-y-6 outline-none">
          <SectionHeader title="Día a día" description="Cronología completa con horarios, transportes, comidas y planes B." />
          <Timeline days={filteredDays} onOpen={openDetail} />
        </Tabs.Content>

        <Tabs.Content value="guia" className="space-y-6 outline-none">
          <SectionHeader
            title="Guía cultural del viaje"
            description="Historia, arqueología, tradiciones y anécdotas organizadas por cada fecha del viaje."
          />
          <CulturalGuide query={query} />
        </Tabs.Content>

        <Tabs.Content value="costes" className="space-y-6 outline-none">
          <SectionHeader
            title="Coste total del viaje"
            description="Presupuesto de referencia para 2 adultos, con desglose por categoría, moneda y día."
          />
          <TripBudget days={itinerary} />
        </Tabs.Content>

        <Tabs.Content value="pendientes" className="space-y-6 outline-none">
          <SectionHeader
            title="Preparación del viaje"
            description="Lista reutilizable de compras, reservas y comprobaciones recomendadas."
          />

          <section className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-stone-500">Cómo utilizar esta lista</p>
            <p className="mt-2 text-sm font-semibold text-stone-950">Referencia revisada el {dataUpdatedLabel}</p>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              {openTaskCount} acciones que conviene completar antes del viaje y {completedTasks.length} decisiones de referencia ya resueltas en este itinerario.
            </p>
            <button
              type="button"
              onClick={refreshPublishedData}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 text-sm font-semibold text-stone-700 hover:border-stone-300 active:translate-y-px"
            >
              <RefreshCw className="size-4" />
              Actualizar contenido
            </button>
          </section>

          <section>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-stone-950">Prioritarios pendientes</h3>
              <p className="mt-1 text-sm text-stone-500">Reservas o decisiones que afectan directamente al itinerario.</p>
            </div>
            <div className="grid gap-4">
              {priorityTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => openTaskDetail(task)}
                  className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-left transition hover:border-amber-300 active:translate-y-px"
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 size-4 shrink-0 text-amber-700" />
                    <div>
                      <h4 className="font-semibold text-stone-950">{task.title}</h4>
                      <p className="mt-1 text-sm text-stone-600">{task.due}</p>
                      <p className="mt-3 text-sm leading-6 text-stone-700">{task.details[0]}</p>
                      {task.details[1] ? <p className="mt-2 text-sm leading-6 text-stone-600">{task.details[1]}</p> : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-stone-950">Pendientes secundarios</h3>
              <p className="mt-1 text-sm text-stone-500">
                Compras y controles importantes, pero que no bloquean el viaje principal.
              </p>
            </div>
            <div className="grid gap-4">
              {secondaryTasks.map((task) => (
                <button
                  type="button"
                  key={task.id}
                  onClick={() => openTaskDetail(task, "Pendiente secundario")}
                  className="w-full rounded-lg border border-stone-200 bg-white p-4 text-left transition hover:border-stone-300 active:translate-y-px"
                >
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 size-4 shrink-0 text-stone-400" />
                  <div>
                    <h4 className="font-semibold text-stone-950">{task.title}</h4>
                    <p className="mt-1 text-sm text-stone-500">{task.due}</p>
                    <p className="mt-3 text-sm leading-6 text-stone-600">{task.details[0]}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-stone-950">Opciones de referencia ya seleccionadas</h3>
              <p className="mt-1 text-sm text-stone-500">
                Estos puntos se conservan como referencia, pero no requieren volver a decidirse.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {completedTasks.map((task) => (
                <button
                  type="button"
                  key={task.id}
                  onClick={() => openTaskDetail(task, "Cerrado")}
                  className="w-full rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left transition hover:border-emerald-300 active:translate-y-px"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-emerald-700" />
                    <div>
                      <h4 className="font-semibold text-stone-950">{task.title}</h4>
                      <p className="mt-1 text-sm text-stone-500">{task.due}</p>
                      <p className="mt-3 text-sm leading-6 text-stone-700">{task.details[0]}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge status={task.status} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <TravelGuide />
        </Tabs.Content>

      </Tabs.Root>

      <DetailModal detail={detail} open={Boolean(detail)} onOpenChange={(open) => !open && setDetail(null)} />
    </AppLayout>
  );
}
