import cashPlan from "../data/cashPlan.json";

export function CashPreparation() {
  const total = cashPlan.budget.reduce((sum, item) => sum + item.pen, 0);
  return <section aria-label="Plan de retirada con una Revolut" className="space-y-4 rounded-lg border border-amber-200 bg-white p-4 sm:p-5">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{cashPlan.status}</p>
      <h3 className="mt-1 text-xl font-semibold">{cashPlan.title}</h3>
      <p className="mt-2 text-sm leading-6">{cashPlan.decision}</p>
    </div>
    <table className="w-full text-left text-sm">
      <caption className="mb-2 text-left font-semibold">Efectivo previsto · dos personas · todo el viaje</caption>
      <thead className="border-b text-xs text-stone-500"><tr><th scope="col" className="py-2 pr-3">Concepto</th><th scope="col" className="py-2 text-right">PEN</th></tr></thead>
      <tbody>{cashPlan.budget.map(item => <tr key={item.label} className="border-b border-stone-100 align-top"><td className="py-2 pr-3">{item.label}<p className="mt-1 text-xs text-stone-500">{item.basis}</p></td><td className="whitespace-nowrap py-2 text-right font-semibold">S/{item.pen}</td></tr>)}</tbody>
      <tfoot><tr><th scope="row" className="py-3 pr-3">Total orientativo</th><td className="whitespace-nowrap py-3 text-right font-semibold">S/{total.toLocaleString("es-ES")}</td></tr></tfoot>
    </table>
    <p className="text-sm leading-6 text-stone-600">{cashPlan.scope}</p>
    <p className="rounded-md bg-stone-50 p-3 text-sm leading-6 text-stone-700">{cashPlan.feeExample}</p>
    <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-700">{cashPlan.phases.map(phase => <li key={phase}>{phase}</li>)}</ol>
  </section>;
}
