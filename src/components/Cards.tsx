import { BookOpen, Calendar, ChevronDown, ExternalLink, Hotel as HotelIcon, Route, Utensils } from "lucide-react";
import type { MouseEvent } from "react";
import type { DayPlan, Hotel, LinkItem, Photo, Transfer } from "../types";
import type { DetailPayload } from "./DetailModal";
import { StatusBadge, TransportBadge, TransportIcon } from "./Badges";
import { photos } from "../data/photos";
import { hotelsForIds } from "../data/hotels";
import { restaurantsForDay } from "../data/restaurants";
import { transfersForIds } from "../data/transfers";
import { ImageWithFallback } from "./ImageWithFallback";
import { ScheduleList } from "./ScheduleList";
import { culturalGuideCrossChecks, culturalGuideForDay } from "../data/culturalGuide";

function stopCardOpen(event: MouseEvent<HTMLElement>) {
  event.stopPropagation();
}

function uniquePhotos(items: Photo[]) {
  const seen = new Set<string>();
  return items.filter((photo) => {
    if (seen.has(photo.url)) return false;
    seen.add(photo.url);
    return true;
  });
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={stopCardOpen}
      className="inline-flex min-h-11 items-center gap-1 rounded-md border border-stone-200 bg-white px-3 text-xs font-semibold text-stone-700 hover:border-stone-300 hover:bg-stone-50 active:translate-y-px"
    >
      {label}
      <ExternalLink className="size-3.5" />
    </a>
  );
}

function hotelLinks(hotel: Hotel): LinkItem[] {
  return [
    { label: `Google Hotels: ${hotel.name}`, url: hotel.googleHotelUrl },
    { label: `Google Maps: ${hotel.name}`, url: hotel.mapUrl },
    { label: `Reserva: ${hotel.name}`, url: hotel.reservationUrl },
    { label: "Descargar TAM Virtual", url: "https://cel.migraciones.gob.pe/ConsultaTAMVirtual/VerificarTAM" },
    { label: "Normativa IGV de SUNAT", url: "https://www.sunat.gob.pe/legislacion/igv/conexas/ds122_01.htm" },
  ];
}

function buildDayDetail(day: DayPlan): DetailPayload {
  const nightHotels = hotelsForIds(day.hotelIds);
  const dayTransfers = transfersForIds(day.transferIds);
  const foodPlaces = restaurantsForDay(day.id);
  const dayPhotos = day.photoIds.map((id) => photos[id]).filter(Boolean);
  const foodPhotos = foodPlaces.flatMap((restaurant) =>
    (restaurant.photoIds ?? []).map((id) => photos[id]).filter(Boolean),
  );

  return {
    title: `${day.date} · ${day.base}`,
    eyebrow: "Día a día",
    description: day.summary,
    location: `${day.altitude} · esfuerzo ${day.effort}`,
    photos: uniquePhotos([...dayPhotos, ...nightHotels.flatMap((hotel) => hotel.photos), ...foodPhotos]),
    links: [
      ...nightHotels.flatMap(hotelLinks),
      ...foodPlaces.flatMap((restaurant) => [
        { label: `Google Maps: ${restaurant.name}`, url: restaurant.mapUrl },
        ...(restaurant.website ? [{ label: `Web: ${restaurant.name}`, url: restaurant.website }] : []),
      ]),
    ],
    sections: [
      { title: "Horario", items: day.blocks },
      {
        title: "Noche / hotel",
        items: nightHotels.length
          ? nightHotels.map((hotel) => `${hotel.name} · ${hotel.city} / ${hotel.zone} · ${hotel.dates} · ${hotel.price}`)
          : ["Sin noche de hotel: día de conexión y vuelo internacional."],
      },
      {
        title: "Vuelos y transportes",
        items: dayTransfers.length
          ? dayTransfers.map(
              (transfer) =>
                `${transfer.from} -> ${transfer.to} · ${transfer.modeLabel} · salida ${transfer.departure} · llegada ${transfer.arrival} · ${transfer.duration} · ${transfer.status}${transfer.status === "pendiente" ? " por cerrar" : ""}`,
            )
          : ["Sin trayectos reservables este día."],
      },
      { title: "Actividades", items: day.activities },
      { title: "Comidas", items: day.foods },
      {
        title: "Restaurantes y lugares recomendados",
        items: foodPlaces.length
          ? foodPlaces.map((restaurant) => `${restaurant.name} · ${restaurant.location}: ${restaurant.note}`)
          : ["Sin recomendación concreta todavía."],
      },
      { title: "Qué pedir / reservar", items: day.orderTips },
      { title: "Compras", items: day.shopping },
      { title: "Plan B", items: [day.planB] },
    ],
  };
}

function formatAmenityValue(value: string) {
  if (value === "si") return "sí";
  return value;
}

export function DayCard({
  day,
  onOpen,
  defaultOpen = false,
}: {
  day: DayPlan;
  onOpen: (detail: DetailPayload) => void;
  defaultOpen?: boolean;
}) {
  const foodPlaces = restaurantsForDay(day.id);
  const nightHotels = hotelsForIds(day.hotelIds);
  const dayTransfers = transfersForIds(day.transferIds);
  const cover = day.photoIds.map((id) => photos[id]).find(Boolean);
  const culturalGuide = culturalGuideForDay(day.id);
  const openDay = () => onOpen(buildDayDetail(day));
  const openCulturalGuide = () => {
    if (!culturalGuide) return;
    const crossChecks = culturalGuideCrossChecks[day.id] ?? [];
    const practicalNote = crossChecks.length
      ? `\n\n## Nota práctica para este día\n\n${crossChecks.map((item) => `- ${item}`).join("\n")}`
      : "";
    onOpen({
      title: culturalGuide.title,
      eyebrow: "Guía cultural",
      description: "Historia, arqueología, tradiciones y anécdotas para leer durante este día.",
      sections: [],
      longformMarkdown: `${culturalGuide.markdown}${practicalNote}`,
    });
  };

  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-sm">
      <details className="group" open={defaultOpen}>
        <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-stone-500">{day.date}</p>
            <h3 className="mt-1 text-lg font-semibold text-stone-950 sm:text-xl">{day.base}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{day.summary}</p>
            <span className="mt-3 inline-flex min-h-8 items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-2.5 text-xs font-semibold text-stone-600">
              <Calendar className="size-4" />
              {day.effort}
            </span>
          </div>
          <ChevronDown className="mt-1 size-5 shrink-0 text-stone-500 transition-transform group-open:rotate-180" />
        </summary>

        <div className="border-t border-stone-200">
          {cover ? (
            <ImageWithFallback
              src={cover.url}
              alt={cover.alt}
              fallbackLabel={day.base}
              className="hidden h-52 w-full object-cover sm:block"
            />
          ) : null}

          <div className="p-3.5 md:p-5">
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase text-stone-500">Orden del día</h4>
            <ScheduleList items={day.blocks} compact />
          </div>

          <section className="mt-5 rounded-lg border border-stone-200 bg-stone-50 p-3">
            <div className="flex items-center gap-2">
              <Route className="size-4 text-stone-500" />
              <h4 className="text-xs font-semibold uppercase text-stone-500">Vuelos y transportes</h4>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {dayTransfers.length ? (
                dayTransfers.map((transfer) => (
                  <div key={transfer.id} className="rounded-md border border-stone-200 bg-white p-3">
                    <div className="flex flex-wrap gap-2">
                      <TransportBadge mode={transfer.mode} label={transfer.modeLabel} />
                      <StatusBadge status={transfer.status} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-stone-950">
                      {transfer.from} {"->"} {transfer.to}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-stone-500">
                      Salida: {transfer.departure} · Llegada: {transfer.arrival} · {transfer.duration}
                    </p>
                    {transfer.status === "pendiente" ? (
                      <p className="mt-2 text-xs font-medium text-amber-800">
                        Pendiente de cerrar: origen {transfer.from}, destino {transfer.to}.
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-600">Sin trayectos reservables este día.</p>
              )}
            </div>
          </section>

          <div className="mt-5 grid gap-3 xl:grid-cols-2">
            <section className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center gap-2">
                <HotelIcon className="size-4 text-stone-500" />
                <h4 className="text-xs font-semibold uppercase text-stone-500">Noche / hotel</h4>
              </div>
              <div className="mt-3 space-y-3">
                {nightHotels.length ? (
                  nightHotels.map((hotel) => (
                    <div key={hotel.id}>
                      <p className="text-sm font-semibold text-stone-950">{hotel.name}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {hotel.city} · {hotel.zone} · {hotel.price}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <ActionLink href={hotel.googleHotelUrl} label="Fotos hotel" />
                        <ActionLink href={hotel.mapUrl} label="Maps" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-600">Sin hotel: conexión y vuelo internacional.</p>
                )}
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center gap-2">
                <Utensils className="size-4 text-stone-500" />
                <h4 className="text-xs font-semibold uppercase text-stone-500">Comidas recomendadas</h4>
              </div>
              <div className="mt-3 space-y-3">
                {foodPlaces.length ? (
                  foodPlaces.slice(0, 4).map((restaurant) => (
                    <div key={restaurant.id}>
                      <p className="text-sm font-semibold text-stone-950">{restaurant.name}</p>
                      <p className="mt-1 text-xs leading-5 text-stone-500">{restaurant.note}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <ActionLink href={restaurant.mapUrl} label="Google Maps" />
                        {restaurant.website ? <ActionLink href={restaurant.website} label="Web" /> : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-600">Sin restaurante concreto todavía.</p>
                )}
              </div>
            </section>
          </div>

          <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={openDay}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-semibold text-white active:translate-y-px sm:w-auto"
            >
              Ver detalles y fotos
              <ExternalLink className="size-4" />
            </button>
            {culturalGuide ? (
              <button
                type="button"
                onClick={openCulturalGuide}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 active:translate-y-px sm:w-auto"
              >
                <BookOpen className="size-4" />
                Leer historia del día
              </button>
            ) : null}
          </div>
          </div>
        </div>
      </details>
    </article>
  );
}

export function TransferCard({
  transfer,
  onOpen,
}: {
  transfer: Transfer;
  onOpen: (detail: DetailPayload) => void;
}) {
  const openTransfer = () =>
    onOpen({
      title: `${transfer.from} -> ${transfer.to}`,
      eyebrow: transfer.date,
      description: transfer.notes,
      location: `${transfer.departure} · ${transfer.arrival} · ${transfer.duration}`,
      links: transfer.mapUrl ? [{ label: "Abrir Google Maps", url: transfer.mapUrl }] : [],
      sections: [
        { title: "Trayecto", items: [transfer.type, transfer.modeLabel, transfer.duration] },
        { title: "Estado", items: [`Estado: ${transfer.status}`] },
      ],
    });

  return (
    <article
      className="rounded-lg border border-stone-200 bg-white p-4 transition hover:border-stone-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-stone-500">{transfer.date}</p>
          <h3 className="mt-1 text-base font-semibold text-stone-950">{transfer.from}</h3>
          <p className="text-sm text-stone-500">{"->"} {transfer.to}</p>
        </div>
        <TransportIcon mode={transfer.mode} className="size-5 shrink-0 text-stone-500" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <TransportBadge mode={transfer.mode} label={transfer.modeLabel} />
        <StatusBadge status={transfer.status} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="font-medium text-stone-500">Salida</dt>
          <dd className="mt-1 text-stone-900">{transfer.departure}</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-500">Llegada</dt>
          <dd className="mt-1 text-stone-900">{transfer.arrival}</dd>
        </div>
        <div className="col-span-2">
          <dt className="font-medium text-stone-500">Duración</dt>
          <dd className="mt-1 text-stone-900">{transfer.duration}</dd>
        </div>
      </dl>
      {transfer.mapUrl ? (
        <div className="mt-4">
          <ActionLink href={transfer.mapUrl} label="Ver ruta" />
        </div>
      ) : null}
      <button
        type="button"
        onClick={openTransfer}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-stone-950 px-3 text-sm font-semibold text-white active:translate-y-px"
      >
        Ver detalles
      </button>
    </article>
  );
}

export function HotelCard({
  hotel,
  onOpen,
}: {
  hotel: Hotel;
  onOpen: (detail: DetailPayload) => void;
}) {
  const cover = hotel.photos[0];
  const openHotel = () =>
    onOpen({
      title: hotel.name,
      eyebrow: hotel.dates,
      description: hotel.notes,
      location: `${hotel.city} · ${hotel.zone}`,
      photos: hotel.photos,
      links: hotelLinks(hotel),
      sections: [
        { title: "Características", items: hotel.features },
        {
          title: "Check-in / check-out",
          items: [`Entrada: ${hotel.checkIn ?? "confirmar con el hotel"}`, `Salida: ${hotel.checkOut ?? "confirmar con el hotel"}`],
        },
        {
          title: "IGV para turistas extranjeros",
          items: [
            "Presentar el pasaporte original de cada huésped y la TAM Virtual para acreditar la condición de turista extranjero.",
            "Descargar gratuitamente una TAM por viajero después de entrar en Perú y guardarlas sin conexión; en los aeropuertos peruanos normalmente no se sella el pasaporte.",
            "No hay que pagar el 18 % por adelantado. Si el alojamiento no puede acreditar la condición turística, puede intentar añadir el IGV al hacer el check-in.",
          ],
        },
        {
          title: "Servicios",
          items: Object.entries(hotel.amenities).map(([key, value]) => `${key}: ${formatAmenityValue(value)}`),
        },
        { title: "Información de referencia", items: [`Estado en el itinerario modelo: ${hotel.status}`, `Precio: ${hotel.price}`] },
      ],
    });

  return (
    <article
      onClick={openHotel}
      className="grid cursor-pointer overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-sm sm:grid-cols-[260px_1fr]"
    >
      <ImageWithFallback
        src={cover?.url}
        alt={cover?.alt ?? hotel.name}
        fallbackLabel={hotel.name}
        className="h-44 w-full object-cover sm:h-full"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-stone-500">{hotel.dates}</p>
            <h3 className="mt-1 text-base font-semibold text-stone-950">{hotel.name}</h3>
            <p className="mt-1 text-sm text-stone-500">{hotel.city} · {hotel.zone}</p>
          </div>
          <HotelIcon className="size-4 shrink-0 text-stone-400" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status={hotel.status} />
          <span className="rounded-md border border-stone-200 bg-stone-50 px-2 py-1 text-[11px] font-medium text-stone-600">
            {hotel.price}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionLink href={hotel.googleHotelUrl} label="Fotos hotel" />
          <ActionLink href={hotel.mapUrl} label="Maps" />
          <ActionLink href={hotel.reservationUrl} label="Reserva" />
        </div>
      </div>
    </article>
  );
}
