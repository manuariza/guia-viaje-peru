import { BookOpen, ChevronDown, FileText, MapPinned } from "lucide-react";
import {
  culturalDayGuides,
  culturalGuideAppendices,
  culturalGuideCrossChecks,
  culturalGuideIntroduction,
} from "../data/culturalGuide";
import { normalize } from "../utils/format";
import { MarkdownDocument } from "./MarkdownDocument";

function CrossCheck({ items }: { items: string[] }) {
  return (
    <aside className="mt-7 rounded-lg border border-stone-200 bg-stone-50 p-3 sm:p-4">
      <div className="flex items-start gap-2.5">
        <MapPinned className="mt-0.5 size-4 shrink-0 text-stone-600" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-700">Nota práctica para este día</p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-700">
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export function CulturalGuide({ query = "" }: { query?: string }) {
  const needle = normalize(query);
  const days = culturalDayGuides.filter((section) =>
    !needle || normalize(`${section.title} ${section.markdown}`).includes(needle),
  );

  return (
    <section aria-labelledby="cultural-guide-title" className="space-y-4">
      <div className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-stone-950 text-white">
            <BookOpen className="size-5" />
          </span>
          <div>
            <h3 id="cultural-guide-title" className="text-lg font-semibold text-stone-950">Guía cultural del viaje</h3>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-600">
              Historia, arqueología, tradiciones y anécdotas organizadas por los días reales del viaje. Las notas prácticas aparecen al final de cada capítulo.
            </p>
          </div>
        </div>

        <details className="group mt-4 rounded-md border border-stone-200 bg-stone-50">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm font-semibold text-stone-800">
              <FileText className="size-4 text-stone-500" />
              Cómo leer esta guía
            </span>
            <ChevronDown className="size-4 shrink-0 text-stone-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-stone-200 p-3 sm:p-4">
            <MarkdownDocument markdown={culturalGuideIntroduction} />
          </div>
        </details>
      </div>

      {days.length ? days.map((section, index) => (
        <details
          key={section.id}
          open={!query && index === 0}
          className="group overflow-hidden rounded-lg border border-stone-200 bg-white"
        >
          <summary className="flex min-h-14 cursor-pointer list-none items-start justify-between gap-3 p-4 active:bg-stone-50 sm:p-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Guía para el viaje</p>
              <h4 className="mt-1 text-base font-semibold leading-6 text-stone-950 sm:text-lg">{section.title}</h4>
            </div>
            <ChevronDown className="mt-1 size-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-stone-200 p-4 sm:p-5 md:p-6">
            <MarkdownDocument markdown={section.markdown} />
            {culturalGuideCrossChecks[section.dayId]?.length ? (
              <CrossCheck items={culturalGuideCrossChecks[section.dayId]} />
            ) : null}
          </div>
        </details>
      )) : (
        <div className="rounded-lg border border-stone-200 bg-white p-5 text-sm text-stone-600">
          No hay ningún día de la guía que coincida con la búsqueda actual.
        </div>
      )}

      {!query && culturalGuideAppendices.map((section) => (
        <details key={section.id} className="group overflow-hidden rounded-lg border border-stone-200 bg-white">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5">
            <h4 className="text-base font-semibold text-stone-950">{section.title}</h4>
            <ChevronDown className="size-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-stone-200 p-4 sm:p-5 md:p-6">
            <MarkdownDocument markdown={section.markdown} />
          </div>
        </details>
      ))}
    </section>
  );
}
