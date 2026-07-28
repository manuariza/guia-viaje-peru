import { transportMeta } from "../utils/format";
import type { TransportMode } from "../types";

const modes: TransportMode[] = ["flight", "car", "train", "bus", "boat"];

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => (
        <span key={mode} className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-600">
          <span className="h-0.5 w-6 rounded-full" style={{ backgroundColor: transportMeta[mode].stroke }} />
          {transportMeta[mode].label}
        </span>
      ))}
    </div>
  );
}
