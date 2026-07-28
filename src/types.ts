export type TransportMode = "flight" | "car" | "train" | "bus" | "boat" | "walk";

export type RiskLevel = "low" | "medium" | "high";

export type ReservationStatus =
  | "pendiente"
  | "confirmado";

export type EffortLevel = "suave" | "medio" | "alto" | "logístico";

export type AmenityState = "si" | "no" | "pendiente" | "incluido";

export type MapFilterState = {
  mode: "all" | TransportMode | "hotels" | "activities";
  risk: "all" | RiskLevel;
  status: "all" | ReservationStatus;
};

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Photo {
  url: string;
  alt: string;
  caption: string;
  credit: string;
  sourceUrl: string;
}

export interface FoodRecommendation {
  id: string;
  name: string;
  location: string;
  note: string;
  mapUrl: string;
  website?: string;
  photoIds?: string[];
  placeIds: string[];
  dayIds: string[];
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface Place {
  id: string;
  name: string;
  kind: "ciudad" | "hotel" | "aeropuerto" | "actividad" | "base" | "sitio";
  date?: string;
  coordinates: Coordinates;
  altitude?: string;
  description: string;
  worth: string;
  effort: EffortLevel;
  transportModes?: TransportMode[];
  activities: string[];
  foods: string[];
  shopping: string[];
  tips: string[];
  links: LinkItem[];
  photos: Photo[];
}

export interface Transfer {
  id: string;
  date: string;
  from: string;
  to: string;
  mode: TransportMode;
  modeLabel: string;
  departure: string;
  arrival: string;
  duration: string;
  type: string;
  risk: RiskLevel;
  notes: string;
  status: ReservationStatus;
  mapUrl?: string;
  placeIds: string[];
}

export interface DayPlan {
  id: string;
  date: string;
  base: string;
  summary: string;
  blocks: string[];
  activities: string[];
  foods: string[];
  orderTips: string[];
  shopping: string[];
  effort: EffortLevel;
  altitude: string;
  planB: string;
  hotelIds: string[];
  transferIds: string[];
  photoIds: string[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  zone: string;
  dates: string;
  checkIn?: string;
  checkOut?: string;
  coordinates: Coordinates;
  features: string[];
  amenities: Record<"desayuno" | "piscina" | "restaurante" | "spa" | "traslado", AmenityState>;
  status: ReservationStatus;
  price: string;
  reservationUrl: string;
  mapUrl: string;
  googleHotelUrl: string;
  notes: string;
  photos: Photo[];
}

export interface BudgetItem {
  category: string;
  range: string;
  notes: string;
}

export type BudgetCurrency = "EUR" | "USD" | "PEN";

export type BudgetCategory = "vuelo" | "hotel" | "tren" | "entrada" | "traslado";

export interface DailyBudgetLine {
  id: string;
  dayId: string;
  category: BudgetCategory;
  title: string;
  amount: number;
  currency: BudgetCurrency;
  status: ReservationStatus;
  note: string;
  included?: boolean;
  estimated?: boolean;
}

export interface PendingBudgetLine {
  id: string;
  date: string;
  title: string;
  note: string;
  amount?: number;
  currency?: BudgetCurrency;
}

export interface CriticalTask {
  id: string;
  title: string;
  due: string;
  status: ReservationStatus;
  risk: RiskLevel;
  priority: "prioritario" | "secundario";
  details: string[];
  links?: LinkItem[];
}
