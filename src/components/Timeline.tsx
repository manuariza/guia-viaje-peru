import type { DayPlan } from "../types";
import type { DetailPayload } from "./DetailModal";
import { DayCard } from "./Cards";

export function Timeline({ days, onOpen }: { days: DayPlan[]; onOpen: (detail: DetailPayload) => void }) {
  return (
    <div className="space-y-4">
      {days.map((day, index) => (
        <DayCard key={day.id} day={day} onOpen={onOpen} defaultOpen={index === 0} />
      ))}
    </div>
  );
}
