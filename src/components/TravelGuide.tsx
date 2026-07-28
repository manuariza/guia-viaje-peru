import {
  CalendarClock,
  ChevronDown,
  ExternalLink,
  Footprints,
  Landmark,
  MapPin,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import type { GuideCategory } from "../data/travelGuide";
import { destinationGuides } from "../data/travelGuide";

const categoryOrder: GuideCategory[] = ["restaurante", "cultura", "actividad", "compras"];

const categoryMeta = {
  restaurante: { label: "Restaurantes", icon: Utensils },
  cultura: { label: "Museos y cultura", icon: Landmark },
  actividad: { label: "Actividades y entradas", icon: Footprints },
  compras: { label: "Mercados y compras", icon: ShoppingBag },
} satisfies Record<GuideCategory, { label: string; icon: typeof Utensils }>;

export function TravelGuide() {
  return (
    <section aria-labelledby="travel-guide-title">
      <div className="mb-4">
        <h3 id="travel-guide-title" className="text-lg font-semibold text-stone-950">
          Restaurantes y actividades
        </h3>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-stone-500">
          Opciones ordenadas según el itinerario, con indicaciones prácticas para reservar cultura, comidas y compras artesanales.
        </p>
      </div>

      <div className="space-y-3">
        {destinationGuides.map((destination, index) => (
          <details
            key={destination.id}
            open={index === 0}
            className="group overflow-hidden rounded-lg border border-stone-200 bg-white"
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3 p-4 active:bg-stone-50">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-stone-500">{destination.dates}</p>
                <h4 className="mt-1 text-base font-semibold text-stone-950">{destination.place}</h4>
                <p className="mt-1 text-sm leading-5 text-stone-600">{destination.summary}</p>
              </div>
              <ChevronDown className="mt-1 size-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" />
            </summary>

            <div className="border-t border-stone-200 px-4 pb-4">
              {categoryOrder.map((category) => {
                const items = destination.items.filter((item) => item.category === category);
                if (!items.length) return null;
                const meta = categoryMeta[category];
                const Icon = meta.icon;

                return (
                  <section key={category} className="border-b border-stone-100 py-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-stone-500" />
                      <h5 className="text-xs font-semibold uppercase text-stone-500">{meta.label}</h5>
                    </div>

                    <div className="mt-3 divide-y divide-stone-100">
                      {items.map((item) => (
                        <article key={item.id} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h6 className="text-sm font-semibold text-stone-950">{item.name}</h6>
                            {item.important ? (
                              <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800">
                                Gestionar antes
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-2 flex items-start gap-2 text-xs font-medium leading-5 text-stone-500">
                            <CalendarClock className="mt-0.5 size-3.5 shrink-0" />
                            {item.timing}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-stone-700">{item.description}</p>

                          <dl className="mt-3 grid gap-2 rounded-md bg-stone-50 p-3 text-sm leading-5">
                            <div>
                              <dt className="font-semibold text-stone-800">¿Reservar?</dt>
                              <dd className="mt-1 text-stone-600">{item.reservation}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-stone-800">Cómo hacerlo</dt>
                              <dd className="mt-1 text-stone-600">{item.booking}</dd>
                            </div>
                          </dl>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 hover:border-stone-300 active:translate-y-px"
                            >
                              Información oficial
                              <ExternalLink className="size-3.5" />
                            </a>
                            {item.mapUrl ? (
                              <a
                                href={item.mapUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 hover:border-stone-300 active:translate-y-px"
                              >
                                <MapPin className="size-3.5" />
                                Mapa
                              </a>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
