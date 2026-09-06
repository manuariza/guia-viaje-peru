import { useMemo, useState } from "react";
import { ChevronDown, Download, ExternalLink, MapPin, Search, ShoppingBag } from "lucide-react";
import shopping from "../data/shopping.json";
import { normalize } from "../utils/format";

const categories = [
  ["todos", "Todo"], ["mercados", "Mercados y puestos"], ["artesanos", "Talleres y comunidades"],
  ["charangos", "Charangos"], ["vasijas", "Vasijas silbadoras"],
];
const priorities = { prioritario: "Priorizar por ruta u oficio", comparar: "Para comparar", confirmar: "Confirmar antes de ir" };
const linkStyle = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-medium hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700";

export function ShoppingGuide({ query = "" }: { query?: string }) {
  const [category, setCategory] = useState("todos");
  const [city, setCity] = useState("todas");
  const [search, setSearch] = useState("");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const visible = useMemo(() => shopping.venues.filter((venue) =>
    (category === "todos" || venue.categories.includes(category)) &&
    (city === "todas" || venue.city === city) && (!priorityOnly || venue.priority === "prioritario") &&
    [query, search].every((needle) => normalize([venue.city, venue.name, venue.kind, venue.products, venue.context, venue.address].join(" ")).includes(normalize(needle))),
  ), [category, city, search, priorityOnly, query]);
  const mapUrl = (term: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(term)}`;

  return (
    <section aria-labelledby="shopping-title" className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Guía para comprar · {shopping.updated}</p>
        <h2 id="shopping-title" className="mt-2 text-2xl font-semibold text-stone-950">Compras y artesanía</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Mercados tradicionales, textiles de comunidades, charangos y vasijas silbadoras. Elegid una ciudad o un producto para ver dónde ir, qué preguntar y cuánto se ha publicado.</p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Tradición y autoría", "Chinchero, CTTC, Awamaki, Fundo El Fierro y San Blas: las paradas que priorizar para conocer la procedencia.", "artesanos"],
          ["Charango · buscar entre S/300–500", "Presupuesto orientativo para iniciación. Comparar en Pacha (Pisac) y Sabino (Cusco); sus tarifas están por consultar.", "charangos"],
          ["Vasija · web USD 149–320", "Old Peru y ALQA publican piezas hidráulicas. Es una referencia de catálogo, no un precio medio; confirmar stock, recogida y documentación.", "vasijas"],
        ].map(([title, text, value]) => <button key={value} type="button" onClick={() => { setCategory(value); setCity("todas"); setSearch(""); setPriorityOnly(false); }} className="rounded-lg border border-stone-200 bg-white p-4 text-left hover:border-stone-400 focus-visible:outline-2 focus-visible:outline-stone-700">
          <p className="text-sm font-semibold text-stone-950">{title}</p><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
          <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-stone-700">Ver opciones <ShoppingBag className="size-3.5" /></span>
        </button>)}
      </div>

      <details className="group rounded-lg border border-cyan-200 bg-cyan-50/60 p-4" open>
        <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-stone-900">Revisión específica de vasijas silbadoras <ChevronDown className="size-5 shrink-0 group-open:rotate-180" /></summary>
        <p className="mt-3 text-sm leading-6 text-stone-700">{shopping.vesselReview.summary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">{shopping.vesselReview.coverage.map((item) => <div key={item.city} className="rounded-md border border-cyan-100 bg-white/80 p-3"><h3 className="text-sm font-semibold text-stone-900">{item.city}</h3><p className="mt-1 text-sm leading-6 text-stone-600">{item.result}</p></div>)}</div>
        <p className="mt-4 text-xs leading-5 text-stone-600">{shopping.vesselReview.outsideRoute}</p>
      </details>

      <details className="group rounded-lg border border-stone-200 bg-white p-4">
        <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-stone-900">Precios de referencia y cómo compararlos <ChevronDown className="size-5 shrink-0 group-open:rotate-180" /></summary>
        <p className="mt-3 text-sm leading-6 text-stone-600">{shopping.scope}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">{shopping.priceGuide.map((item) => <div key={item.title} className="rounded-md bg-stone-50 p-3"><h3 className="text-sm font-semibold text-stone-900">{item.title}</h3><p className="mt-2 text-sm leading-6 text-stone-600">{item.text}</p></div>)}</div>
        <div className="mt-4 overflow-x-auto rounded-md border border-stone-200" role="region" aria-label="Tabla de precios publicados" tabIndex={0}>
          <table className="w-full min-w-[600px] text-left text-sm">
            <caption className="sr-only">Precios publicados en la investigación del 6 de septiembre de 2026</caption>
            <thead className="bg-stone-100 text-stone-800"><tr>{["Producto", "Tienda", "Precio", "Qué significa"].map((label) => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead>
            <tbody className="divide-y divide-stone-200">{shopping.prices.map((price) => <tr key={`${price.seller}-${price.product}`}>
              <th scope="row" className="min-w-40 px-3 py-3 align-top font-medium text-stone-900">{price.product}</th>
              <td className="px-3 py-3 align-top"><a href={price.url} target="_blank" rel="noreferrer" className="underline decoration-stone-300 underline-offset-4">{price.seller}</a></td>
              <td className="whitespace-nowrap px-3 py-3 align-top font-semibold">{price.currency === "PEN" ? "S/" : "USD "}{price.amount}</td>
              <td className="min-w-64 px-3 py-3 align-top leading-6 text-stone-600">{price.context}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </details>

      <details className="group rounded-lg border border-stone-200 bg-white p-4">
        <summary className="flex min-h-7 cursor-pointer list-none items-center justify-between gap-3 font-semibold text-stone-900">Cuándo encaja en la ruta <ChevronDown className="size-5 shrink-0 group-open:rotate-180" /></summary>
        <div className="mt-3 grid gap-3 md:grid-cols-2">{shopping.route.map((stop) => <div key={stop.city} className="border-l-2 border-stone-200 pl-3"><h3 className="text-sm font-semibold">{stop.city} · {stop.date}</h3><p className="mt-1 text-sm leading-6 text-stone-600">{stop.tip}</p>{stop.links?.length ? <div className="mt-3 flex flex-wrap gap-2">{stop.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className={linkStyle}>{link.label}<ExternalLink className="size-3.5" /></a>)}</div> : null}</div>)}</div>
      </details>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
        <strong>Antes de pagar una réplica:</strong> acordar la documentación oficial y su plazo. Comprar el 17–18 en Cusco puede dejar poco tiempo para tramitarla. <a href={shopping.advice[3].url} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-4">Consultar el procedimiento</a>.
      </div>

      <section aria-label="Directorio de compras" className="space-y-4">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex flex-wrap gap-2" aria-label="Tipo de compra">{categories.map(([value, label]) => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={`min-h-11 rounded-md border px-3 py-2 text-sm font-medium ${category === value ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 text-stone-700 hover:bg-stone-50"}`}>{label}</button>)}</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-stone-600">Ciudad
              <select aria-label="Ciudad" value={city} onChange={(event) => setCity(event.target.value)} className="mt-1 block min-h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-900">
                <option value="todas">Todas las ciudades</option>{shopping.route.map((stop) => <option key={stop.city} value={stop.city}>{stop.city}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-stone-600">Buscar tienda o producto
              <span className="relative mt-1 block"><Search className="absolute left-3 top-3.5 size-4 text-stone-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ej. alpaca, cerámica, Sabino…" className="min-h-11 w-full rounded-md border border-stone-200 py-2 pl-9 pr-3 text-sm text-stone-900" /></span>
            </label>
          </div>
          <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-700"><input type="checkbox" checked={priorityOnly} onChange={(event) => setPriorityOnly(event.target.checked)} className="size-4 accent-stone-800" />Solo opciones prioritarias por ruta u oficio</label>
          <p className="mt-1 text-xs leading-5 text-stone-500">«Prioritario» expresa una recomendación de visita, no confirma apertura, stock ni precio. El filtro de vasijas también incluye mercados donde preguntar; leed la disponibilidad.</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2"><p role="status" className="text-sm font-medium text-stone-600">{visible.length} de {shopping.venues.length} lugares{query ? ` · búsqueda general: «${query}»` : ""}</p><a className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4" href={`${import.meta.env.BASE_URL}shopping/directorio-compras.csv`} download><Download className="size-4" />Descargar directorio CSV</a></div>
        {visible.length === 0 && <p className="rounded-lg border border-dashed border-stone-300 p-6 text-sm leading-6 text-stone-600">No hay lugares que coincidan con estos filtros. Elegid otra ciudad o producto, desmarcad las prioridades o borrad la búsqueda.</p>}
        <div className="grid items-start gap-4 lg:grid-cols-2">{visible.map((venue) => <article key={venue.id} className="min-w-0 rounded-lg border border-stone-200 bg-white p-4 sm:p-5" data-shopping-id={venue.id}>
          <div className="flex flex-wrap items-center gap-2 text-xs"><span className="font-semibold uppercase text-stone-500">{venue.city}</span><span className={`rounded px-2 py-1 ${venue.priority === "confirmar" ? "bg-amber-50 text-amber-900" : venue.priority === "prioritario" ? "bg-emerald-50 text-emerald-900" : "bg-stone-100 text-stone-600"}`}>{priorities[venue.priority as keyof typeof priorities]}</span></div>
          <h3 className="mt-2 text-lg font-semibold leading-6 text-stone-950">{venue.name}</h3>
          <p className="mt-1 text-xs leading-5 text-stone-500">{venue.kind} · {venue.when}</p>
          <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-stone-700"><MapPin className="mt-1 size-4 shrink-0" />{venue.address}</p>
          <p className="mt-3 text-sm leading-6 text-stone-700">{venue.products}</p>
          <div className="mt-3 rounded-md bg-stone-50 p-3"><p className="text-xs font-semibold uppercase text-stone-500">Precio de referencia</p><p className="mt-1 text-sm font-medium leading-6 text-stone-900">{venue.price}</p></div>
          {venue.vesselEvidence && <div className="mt-3 rounded-md border border-cyan-200 bg-cyan-50 p-3"><p className="text-xs font-semibold uppercase text-cyan-900">Evidencia sobre la vasija</p><p className="mt-1 text-sm leading-6 text-cyan-950">{venue.vesselEvidence}</p></div>}
          <p className="mt-3 text-sm leading-6 text-stone-600"><strong className="text-stone-800">Disponibilidad: </strong>{venue.availability}</p>
          <a href={mapUrl(venue.mapQuery)} target="_blank" rel="noreferrer" aria-label={`Google Maps · ${venue.name}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700 sm:w-auto"><MapPin className="size-4" />Abrir en Google Maps<ExternalLink className="size-3.5" /></a>
          <details className="group mt-3 border-t border-stone-100 pt-2"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-stone-700">Contexto, consejos y fuentes<ChevronDown className="size-4 shrink-0 group-open:rotate-180" /></summary>
            <p className="mt-1 text-sm leading-6 text-stone-600">{venue.context}</p><p className="mt-3 text-sm leading-6 text-stone-600"><strong className="text-stone-800">Al comprar: </strong>{venue.advice}</p>
            {venue.contact && <p className="mt-3 text-sm">Contacto publicado: <a className="underline underline-offset-4" href={venue.contactUrl ?? `tel:${venue.contact.replaceAll(" ", "")}`}>{venue.contact}</a></p>}
            <div className="mt-3 flex flex-wrap gap-2">{venue.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className={linkStyle}>{source.label}<ExternalLink className="size-3.5 shrink-0" /></a>)}</div>
          </details>
        </article>)}</div>
        <p className="text-xs leading-5 text-stone-500">{shopping.mapsNote}</p>
      </section>

      <section aria-labelledby="shopping-advice" className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
        <h3 id="shopping-advice" className="text-lg font-semibold text-stone-950">Qué preguntar antes de comprar</h3>
        <div className="mt-3 divide-y divide-stone-100">{shopping.advice.map((item) => <details key={item.title} className="group py-2"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-stone-800">{item.title}<ChevronDown className="size-4 shrink-0 group-open:rotate-180" /></summary><p className="pb-2 text-sm leading-6 text-stone-600">{item.text}</p>{item.url && <a href={item.url} target="_blank" rel="noreferrer" className={linkStyle}>Fuente / más información<ExternalLink className="size-3.5" /></a>}</details>)}</div>
        <a href={`${import.meta.env.BASE_URL}shopping/guia-compras.md`} download className={`${linkStyle} mt-4`}><Download className="size-4" />Guardar guía completa con consejos</a>
      </section>
    </section>
  );
}
