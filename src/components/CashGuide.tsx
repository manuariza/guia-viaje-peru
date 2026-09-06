import { useMemo, useState } from "react";
import { Banknote, ExternalLink, MapPin, Navigation } from "lucide-react";
import cash from "../data/cash.json";
import { normalize } from "../utils/format";

const cities = [...new Set(cash.atms.map((atm) => atm.city))];
const sourceUrl = (key: string) => cash.sources[key as keyof typeof cash.sources] ?? key;
const mapQuery = (atm: (typeof cash.atms)[number]) => atm.address;
const location = (id: string) => cash.mapLocations[id as keyof typeof cash.mapLocations];
const mapUrl = (atm: (typeof cash.atms)[number]) => location(atm.id) ? `https://www.google.com/maps?cid=${location(atm.id).cid}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery(atm))}`;
const directionsUrl = (atm: (typeof cash.atms)[number]) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location(atm.id) ? `${location(atm.id).lat},${location(atm.id).lng}` : mapQuery(atm))}`;
const linkClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-stone-700";

export function CashGuide({ query = "" }: { query?: string }) {
  const [city, setCity] = useState("Todas");
  const [network, setNetwork] = useState("Todas");
  const [selectedId, setSelectedId] = useState(cash.atms[0].id);
  const visible = useMemo(() => cash.atms.filter((atm) =>
    (city === "Todas" || atm.city === city) && (network === "Todas" || atm.network === network) &&
    normalize(`${atm.name} ${atm.city} ${atm.address} ${atm.timing}`).includes(normalize(query)),
  ), [city, network, query]);
  const selected = visible.find((atm) => atm.id === selectedId) ?? visible[0];

  return (
    <section className="space-y-5" aria-labelledby="cash-title">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Efectivo en soles · revisado {cash.checkedAt}</p>
        <h2 id="cash-title" className="mt-1 scroll-mt-64 text-2xl font-semibold sm:scroll-mt-36">Cajeros en la ruta</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Primero MultiRed con Revolut o Wise. Aquí tienes {cash.atms.length} opciones, direcciones y rutas. Las ubicaciones proceden de directorios; el cajero confirma el recargo, el límite y la disponibilidad.</p>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        <strong>Elegir PEN y rechazar la conversión a euros.</strong> El S/0 de MultiRed es una experiencia reportada, no una tarifa garantizada. La comisión del cajero, la retirada de tu tarjeta y la conversión son tres costes distintos.
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium sm:flex-none">Ciudad
          <select aria-label="Ciudad" value={city} onChange={(event) => setCity(event.target.value)} className="min-h-11 max-w-full rounded-md border border-stone-300 bg-white px-3">
            {["Todas", ...cities].map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">Red
          <select aria-label="Red" value={network} onChange={(event) => setNetwork(event.target.value)} className="min-h-11 rounded-md border border-stone-300 bg-white px-3">
            {["Todas", "MultiRed", "BanBif"].map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
        <p role="status" className="pb-3 text-sm text-stone-500">{visible.length} cajeros</p>
      </div>

      {selected ? <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white lg:sticky lg:top-32">
          <div className="p-4">
            <h3 className="font-semibold">{selected.name}</h3>
            <p className="mt-1 text-sm text-stone-600">{selected.address}</p>
            <p className="mt-2 text-xs leading-5 text-stone-500">{location(selected.id) ? location(selected.id).note : selected.locationNote}</p>
          </div>
          {location(selected.id) ? <iframe key={selected.id} title={`Mapa de ${selected.name}: ${selected.address}`} src={`https://maps.google.com/maps?cid=${location(selected.id).cid}&z=17&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full border-0 sm:h-96" allowFullScreen /> : <div className="border-y border-stone-200 bg-stone-50 p-5 text-sm leading-6 text-stone-600"><MapPin className="mb-2 size-6" /><strong>Marcador pendiente de confirmar.</strong> No se muestra un punto que pueda llevarte a otro sitio. Abre la búsqueda por dirección y confirma el establecimiento antes de iniciar la ruta.</div>}
          <div className="flex flex-wrap gap-2 p-4">
            <a className={linkClass} href={mapUrl(selected)} target="_blank" rel="noreferrer"><MapPin className="size-4" />Abrir Google Maps</a>
            <a className={linkClass} href={directionsUrl(selected)} target="_blank" rel="noreferrer"><Navigation className="size-4" />Cómo llegar</a>
          </div>
          <p className="px-4 pb-4 text-xs leading-5 text-stone-500">El marcador identifica el establecimiento, no la posición exacta de la máquina. Si no carga, abre Google Maps. Elige allí tu origen y transporte; esta web no solicita tu ubicación.</p>
        </div>
        <div className="grid gap-3" aria-label="Lista de cajeros">
          {visible.map((atm) => {
            const fees = cash.networks.find((item) => item.name === atm.network)!;
            return <article key={atm.id} className={`rounded-lg border bg-white p-4 ${selected.id === atm.id ? "border-stone-800 ring-1 ring-stone-800" : "border-stone-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-xs text-stone-500">{atm.timing}</p><h3 className="mt-1 font-semibold">{atm.name}</h3></div>
                <Banknote className={`mt-1 size-5 shrink-0 ${atm.network === "MultiRed" ? "text-emerald-700" : "text-amber-700"}`} />
              </div>
              <p className="mt-2 text-sm">{atm.address}</p>
              <p className="mt-2 text-sm font-semibold text-stone-800">{fees.feeMax === 0 ? "S/0 reportado" : `S/${fees.feeMin}–${fees.feeMax} orientativos`} · retirada habitual hasta S/{fees.usualLimit}</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{atm.note}</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">{atm.locationNote}</p>
              <p className="mt-1 text-xs leading-5 text-stone-500">{location(atm.id) ? location(atm.id).note : "Marcador no confirmado: los enlaces buscan la dirección."}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className={linkClass} aria-pressed={selected.id === atm.id} onClick={() => { setSelectedId(atm.id); document.getElementById("cash-title")?.scrollIntoView({ block: "start" }); }}><MapPin className="size-4" />Ver ubicación</button>
                <a className={linkClass} href={directionsUrl(atm)} target="_blank" rel="noreferrer"><Navigation className="size-4" />Cómo llegar</a>
                <a className="inline-flex min-h-11 items-center gap-1 px-2 text-xs text-stone-600 underline" href={sourceUrl(atm.source)} target="_blank" rel="noreferrer">Fuente de dirección<ExternalLink className="size-3" /></a>
              </div>
            </article>;
          })}
        </div>
      </div> : <p className="rounded-lg border border-stone-200 bg-white p-5">No hay cajeros con estos filtros. Cambia la ciudad, la red o la búsqueda general.</p>}

      <section className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
        <h3 className="text-lg font-semibold">Qué tarjeta usar</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-3">{cash.cards.map((card) => <div key={card.name}>
          <h4 className="font-semibold">{card.name}</h4>
          <p className="mt-2 text-sm leading-6 text-stone-700">{card.withdrawal}</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{card.conversion}</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{card.advice}</p>
          <a className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm underline" href={sourceUrl(card.source)} target="_blank" rel="noreferrer">Condiciones oficiales<ExternalLink className="size-3" /></a>
        </div>)}</div>
        <p className="mt-4 border-t border-stone-200 pt-4 text-sm leading-6 text-stone-600">{cash.example}</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">{[{ title: "Cuándo reponer efectivo", items: cash.plan }, { title: "En el cajero", items: cash.steps }].map((section) => <section key={section.title} className="rounded-lg border border-stone-200 bg-white p-4 sm:p-5">
        <h3 className="text-lg font-semibold">{section.title}</h3>
        <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-6 text-stone-600">{section.items.map((item) => <li key={item}>{item}</li>)}</ol>
      </section>)}</div>
      <details className="rounded-lg border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-600">
        <summary className="cursor-pointer font-semibold text-stone-800">Fuentes y límites de esta guía</summary>
        <p className="mt-3">Revisión: {cash.checkedAt}. El directorio BN sitúa cajeros, pero no garantiza el recargo con tarjetas extranjeras ni apertura o billetes en tiempo real. Las cifras por red son orientativas, no tarifas de cada dirección. No se han asumido tiempos a pie ni horarios 24 h.</p>
        {cash.networks.map((item) => <p className="mt-2" key={item.name}>{item.name}: {item.note}</p>)}
        <div className="mt-2 flex flex-wrap gap-4"><a className="underline" href={cash.sources.fees} target="_blank" rel="noreferrer">Comparativa de comisiones</a><a className="underline" href={cash.sources.reports} target="_blank" rel="noreferrer">Experiencias de viajeros 2026</a></div>
        <p className="mt-2">Los hilos de Forocoches localizados eran de 2022–2024 y no se utilizan para prometer comisiones actuales.</p>
      </details>
    </section>
  );
}
