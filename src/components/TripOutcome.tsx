import outcome from "../data/tripOutcome.json";

export function TripOutcome({ dayId }: { dayId?: string }) {
  if (!dayId) return (
    <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
      <h2 className="text-lg font-semibold text-emerald-950">{outcome.status}</h2>
      <p className="mt-1 text-sm leading-6 text-emerald-900">8–22 de septiembre de 2026. Memoria actualizada el {outcome.updated}. Cada día distingue lo realizado de lo que queda sin confirmar. El plan original se conserva como referencia histórica.</p>
    </section>
  );
  const day = outcome.days[dayId as keyof typeof outcome.days];
  if (!day) return null;
  return (
    <section className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <h4 className="text-sm font-semibold text-emerald-950">Resultado del viaje</h4>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-800">
        {day.confirmed.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {day.uncertain.length > 0 && <div className="mt-4 border-t border-emerald-200 pt-3">
        <p className="text-xs font-semibold uppercase text-stone-600">Por aclarar o evidencia parcial</p>
        <ul className="mt-2 space-y-2 text-sm leading-6 text-stone-700">{day.uncertain.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>}
    </section>
  );
}
