import {
  AlertTriangle,
  BedDouble,
  Car,
  CheckCircle2,
  CircleDollarSign,
  Plane,
  Ticket,
  Train,
} from "lucide-react";
import { dailyBudgetLines, pendingBudgetLines, planningRatesToEur } from "../data/budget";
import type { BudgetCategory, BudgetCurrency, DailyBudgetLine, DayPlan } from "../types";
import { StatusBadge } from "./Badges";

const categoryLabels: Record<BudgetCategory, string> = {
  vuelo: "Vuelo",
  hotel: "Hotel",
  tren: "Tren",
  entrada: "Entrada",
  traslado: "Traslado",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number, currency: BudgetCurrency) {
  if (currency === "EUR") return `${formatNumber(value)} €`;
  if (currency === "USD") return `${formatNumber(value)} US$`;
  return `S/ ${formatNumber(value)}`;
}

function toEur(line: Pick<DailyBudgetLine, "amount" | "currency">) {
  return line.amount * planningRatesToEur[line.currency];
}

function categoryIcon(category: BudgetCategory) {
  if (category === "vuelo") return <Plane className="size-4" />;
  if (category === "hotel") return <BedDouble className="size-4" />;
  if (category === "tren") return <Train className="size-4" />;
  if (category === "entrada") return <Ticket className="size-4" />;
  return <Car className="size-4" />;
}

function exactTotals(lines: DailyBudgetLine[]) {
  return lines.reduce<Record<BudgetCurrency, number>>(
    (totals, line) => {
      if (!line.included) totals[line.currency] += line.amount;
      return totals;
    },
    { EUR: 0, USD: 0, PEN: 0 },
  );
}

function ExactTotalPills({ lines }: { lines: DailyBudgetLine[] }) {
  const totals = exactTotals(lines);
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(totals) as [BudgetCurrency, number][])
        .filter(([, amount]) => amount > 0)
        .map(([currency, amount]) => (
          <span key={currency} className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-semibold text-stone-700">
            {formatCurrency(amount, currency)}
          </span>
        ))}
    </div>
  );
}

function formatOriginalTotals(lines: DailyBudgetLine[]) {
  const totals = exactTotals(lines);
  return (Object.entries(totals) as [BudgetCurrency, number][])
    .filter(([, amount]) => amount > 0)
    .map(([currency, amount]) => formatCurrency(amount, currency))
    .join(" + ");
}

function DayBudgetCard({ day, lines }: { day: DayPlan; lines: DailyBudgetLine[] }) {
  const dailyEur = lines.reduce((total, line) => total + toEur(line), 0);

  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-stone-200 bg-stone-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{day.date}</p>
          <h3 className="mt-1 text-base font-semibold text-stone-950">{day.base}</h3>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-medium text-stone-500">Total asignado al día</p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums text-stone-950">≈ {formatCurrency(dailyEur, "EUR")}</p>
          <div className="mt-2 flex sm:justify-end">
            <ExactTotalPills lines={lines} />
          </div>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {lines.map((line) => (
          <div key={line.id} className="grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_180px] md:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2 py-1 text-xs font-semibold text-stone-700">
                  {categoryIcon(line.category)}
                  {categoryLabels[line.category]}
                </span>
                <StatusBadge status={line.status} />
                {line.estimated ? (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                    Estimación
                  </span>
                ) : null}
              </div>
              <h4 className="mt-2 font-semibold text-stone-950">{line.title}</h4>
              <p className="mt-1 text-sm leading-6 text-stone-600">{line.note}</p>
            </div>
            <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 md:text-right">
              <p className="text-base font-semibold tabular-nums text-stone-950">
                {line.included ? "Incluido" : formatCurrency(line.amount, line.currency)}
              </p>
              {!line.included && line.currency !== "EUR" ? (
                <p className="mt-1 text-xs tabular-nums text-stone-500">≈ {formatCurrency(toEur(line), "EUR")}</p>
              ) : null}
              {line.included ? <p className="mt-1 text-xs text-stone-500">0 € adicionales</p> : null}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export function TripBudget({ days }: { days: DayPlan[] }) {
  const totalEur = dailyBudgetLines.reduce((total, line) => total + toEur(line), 0);
  const documentedLines = dailyBudgetLines.filter((line) => !line.estimated);
  const documentedEur = documentedLines.reduce((total, line) => total + toEur(line), 0);
  const estimatedEur = dailyBudgetLines.filter((line) => line.estimated).reduce((total, line) => total + toEur(line), 0);
  const totals = exactTotals(documentedLines);
  const hotelLines = dailyBudgetLines.filter((line) => line.category === "hotel");
  const flightLines = dailyBudgetLines.filter((line) => line.category === "vuelo" && !line.included);
  const trainLines = dailyBudgetLines.filter((line) => line.category === "tren" && !line.included);
  const entryLines = dailyBudgetLines.filter((line) => line.category === "entrada");

  const summaryCards = [
    {
      label: "Vuelos",
      value: flightLines.reduce((total, line) => total + toEur(line), 0),
      note: `${formatOriginalTotals(flightLines)} · incluye ${formatCurrency(estimatedEur, "EUR")} estimados de maletas`,
      icon: <Plane className="size-4" />,
    },
    {
      label: "Hoteles y lodge",
      value: hotelLines.reduce((total, line) => total + toEur(line), 0),
      note: `${formatOriginalTotals(hotelLines)} · 13 noches`,
      icon: <BedDouble className="size-4" />,
    },
    {
      label: "Inca Rail",
      value: trainLines.reduce((total, line) => total + toEur(line), 0),
      note: `${formatOriginalTotals(trainLines)} · ida y vuelta`,
      icon: <Train className="size-4" />,
    },
    {
      label: "Machu Picchu",
      value: entryLines.reduce((total, line) => total + toEur(line), 0),
      note: `${formatOriginalTotals(entryLines)} · 2 entradas`,
      icon: <Ticket className="size-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.05fr_1.95fr]">
        <div className="rounded-lg border border-stone-900 bg-stone-950 p-5 text-white sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-white/10 text-stone-100">
              <CircleDollarSign className="size-5" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-200">
              <CheckCircle2 className="size-3.5" />
              Presupuesto de referencia
            </span>
          </div>
          <p className="mt-7 text-sm text-stone-300">Total previsto para 2 personas</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">≈ {formatCurrency(totalEur, "EUR")}</p>
          <p className="mt-2 text-sm text-stone-400">≈ {formatCurrency(totalEur / 2, "EUR")} por persona</p>
          <p className="mt-3 text-xs leading-5 text-stone-400">
            Partidas con precio de referencia: ≈ {formatCurrency(documentedEur, "EUR")} · Estimación de maletas: ≈ {formatCurrency(estimatedEur, "EUR")}
          </p>
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Importes en moneda de origen</p>
            <div className="mt-3 grid gap-1 text-sm tabular-nums text-stone-200">
              <span>{formatCurrency(totals.EUR, "EUR")}</span>
              <span>{formatCurrency(totals.USD, "USD")}</span>
              <span>{formatCurrency(totals.PEN, "PEN")}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-stone-400">
              Las tarifas son orientativas y deben revisarse en las webs públicas antes de reservar.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-600">
                <span className="grid size-8 place-items-center rounded-md bg-stone-100 text-stone-600">{card.icon}</span>
                {card.label}
              </div>
              <p className="mt-5 text-2xl font-semibold tabular-nums text-stone-950">≈ {formatCurrency(card.value, "EUR")}</p>
              <p className="mt-1 text-sm text-stone-500">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-950">
        El equivalente en euros usa el cambio fijo de planificación del proyecto: 1 USD = 0,86 € y 1 PEN = 0,23 €. Los totales exactos en moneda original son los que mandan si el cambio varía.
      </div>

      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="size-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-stone-950">Cómo leer este presupuesto</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Es una referencia para dos adultos en septiembre de 2026, no una cotización ni una garantía de disponibilidad.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-stone-700 md:grid-cols-2">
          <p className="rounded-md border border-emerald-200 bg-white px-3 py-2"><strong>Alcance:</strong> vuelos, alojamientos, tren, entradas principales y algunos traslados para dos personas.</p>
          <p className="rounded-md border border-emerald-200 bg-white px-3 py-2"><strong>Precios:</strong> importes obtenidos para este itinerario; pueden variar según fecha, disponibilidad y tarifa.</p>
          <p className="rounded-md border border-emerald-200 bg-white px-3 py-2"><strong>Sin duplicados:</strong> los regresos o traslados incluidos aparecen a coste adicional cero.</p>
          <p className="rounded-md border border-emerald-200 bg-white px-3 py-2"><strong>Fuera del total:</strong> bus de Machu Picchu, algunos taxis, comidas, seguro, propinas y compras.</p>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-stone-950">Coste día a día</h2>
          <p className="mt-1 text-sm leading-6 text-stone-500">
            Los hoteles de varias noches se reparten por noche para que cada día sea legible; el total de referencia se mantiene exacto.
          </p>
        </div>
        <div className="space-y-4">
          {days.map((day) => (
            <DayBudgetCard
              key={day.id}
              day={day}
              lines={dailyBudgetLines.filter((line) => line.dayId === day.id)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-amber-100 text-amber-700">
            <AlertTriangle className="size-4" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-stone-950">Pendiente y fuera del total</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              Estos importes no se mezclan con el presupuesto principal hasta disponer de una compra o un precio final.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {pendingBudgetLines.map((line) => (
            <article key={line.id} className="rounded-md border border-amber-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{line.date}</p>
                  <h3 className="mt-1 font-semibold text-stone-950">{line.title}</h3>
                </div>
                {line.amount && line.currency ? (
                  <span className="shrink-0 rounded-md bg-amber-100 px-2.5 py-1 text-sm font-semibold tabular-nums text-amber-900">
                    {formatCurrency(line.amount, line.currency)}
                  </span>
                ) : (
                  <span className="shrink-0 rounded-md bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">Sin precio</span>
                )}
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">{line.note}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
