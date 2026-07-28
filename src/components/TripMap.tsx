import { useEffect, useMemo, useRef } from "react";
import L, { type Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapFilterState, Place, Transfer } from "../types";
import type { DetailPayload } from "./DetailModal";
import { transportMeta } from "../utils/format";
import { MapLegend } from "./MapLegend";
import { restaurantsForPlace } from "../data/restaurants";

const makeMarker = (place: Place) => {
  const color = place.kind === "hotel" ? "#a16207" : place.kind === "aeropuerto" ? "#2563eb" : "#292524";
  return L.divIcon({
    className: "journey-marker",
    html: `<span style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

const placeToDetail = (place: Place): DetailPayload => {
  const foodPlaces = restaurantsForPlace(place.id);

  return {
    title: place.name,
    eyebrow: place.date,
    description: `${place.description} ${place.worth}`,
    location: place.altitude,
    photos: place.photos,
    links: [
      ...place.links,
      ...foodPlaces.flatMap((restaurant) => [
        { label: `Google Maps: ${restaurant.name}`, url: restaurant.mapUrl },
        ...(restaurant.website ? [{ label: `Web: ${restaurant.name}`, url: restaurant.website }] : []),
      ]),
    ],
    sections: [
      { title: "Actividades recomendadas", items: place.activities },
      { title: "Comidas", items: place.foods },
      {
        title: "Restaurantes y lugares recomendados",
        items: foodPlaces.length
          ? foodPlaces.map((restaurant) => `${restaurant.name} · ${restaurant.location}: ${restaurant.note}`)
          : ["Sin recomendación concreta todavía."],
      },
      { title: "Compras", items: place.shopping },
      { title: "Consejos", items: place.tips },
    ],
  };
};

export function TripMap({
  places,
  transfers,
  filters,
  onOpen,
}: {
  places: Place[];
  transfers: Transfer[];
  filters: MapFilterState;
  onOpen: (detail: DetailPayload) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const placeById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places]);

  const visibleTransfers = useMemo(
    () => transfers.filter((transfer) => filters.mode === "all" || filters.mode === transfer.mode),
    [filters.mode, transfers],
  );

  const visiblePlaceIds = useMemo(() => {
    const mode = filters.mode;
    if (mode === "all") return new Set(places.map((place) => place.id));
    if (mode === "hotels") return new Set(places.filter((place) => place.kind === "hotel").map((place) => place.id));
    if (mode === "activities") {
      return new Set(places.filter((place) => ["sitio", "actividad"].includes(place.kind)).map((place) => place.id));
    }
    const ids = new Set<string>();
    visibleTransfers.forEach((transfer) => transfer.placeIds.forEach((id) => ids.add(id)));
    places
      .filter((place) => place.transportModes?.includes(mode))
      .forEach((place) => ids.add(place.id));
    return ids;
  }, [filters.mode, places, visibleTransfers]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      doubleClickZoom: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      zoomAnimation: false,
      zoomControl: false,
    }).setView([-13.6, -72.2], 5);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.stop();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layer = L.layerGroup().addTo(map);

    visibleTransfers.forEach((transfer) => {
      const coordinates = transfer.placeIds
        .map((id) => placeById.get(id))
        .filter((place): place is Place => Boolean(place))
        .map((place) => [place.coordinates.lat, place.coordinates.lng] as [number, number]);

      if (coordinates.length > 1) {
        L.polyline(coordinates, {
          color: transportMeta[transfer.mode].stroke,
          weight: 3,
          opacity: 0.78,
          dashArray: transfer.mode === "flight" ? "8 10" : undefined,
        })
          .bindTooltip(`${transfer.date}: ${transfer.from} -> ${transfer.to}`)
          .addTo(layer);
      }
    });

    places
      .filter((place) => visiblePlaceIds.has(place.id))
      .forEach((place) => {
        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          icon: makeMarker(place),
          title: place.name,
        }).addTo(layer);

        const image = place.photos[0]?.url
          ? `<img src="${place.photos[0].url}" alt="" onerror="this.style.display='none'" style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin:8px 0;" />`
          : "";
        const popupId = `popup-${place.id}`;
        marker.bindPopup(`
          <div class="map-popup">
            <strong>${place.name}</strong>
            <p>${place.date ?? ""}${place.altitude ? ` · ${place.altitude}` : ""}</p>
            ${image}
            <p>${place.description}</p>
            <button id="${popupId}" type="button">Ver detalles</button>
          </div>
        `);
        marker.on("popupopen", () => {
          const button = document.getElementById(popupId);
          button?.addEventListener("click", () => onOpen(placeToDetail(place)), { once: true });
        });
        marker.on("dblclick", () => onOpen(placeToDetail(place)));
      });

    const visiblePlaces = places.filter((place) => visiblePlaceIds.has(place.id));
    if (visiblePlaces.length > 1) {
      const bounds = L.latLngBounds(visiblePlaces.map((place) => [place.coordinates.lat, place.coordinates.lng]));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: filters.mode === "all" ? 5 : 9 });
    }

    return () => {
      layer.remove();
    };
  }, [filters.mode, onOpen, placeById, places, visiblePlaceIds, visibleTransfers]);

  return (
    <section className="relative z-0 rounded-lg border border-stone-200 bg-white p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-950">Mapa interactivo</h2>
          <p className="mt-1 text-sm text-stone-500">Marcadores, popups y rutas coloreadas por transporte.</p>
        </div>
        <MapLegend />
      </div>
      <div ref={containerRef} className="relative z-0 h-[52dvh] min-h-[320px] max-h-[520px] overflow-hidden rounded-lg border border-stone-200 bg-stone-100 md:h-[560px] md:min-h-[420px] md:max-h-none" />
    </section>
  );
}
