import { Euro } from "lucide-react";
import type { BudgetItem } from "../types";

export function BudgetSummary({ items, total }: { items: BudgetItem[]; total: { label: string; range: string; scope: string } }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-lg border border-stone-900 bg-stone-950 p-5 text-white">
        <Euro className="size-5 text-stone-300" />
        <p className="mt-6 text-sm text-stone-300">{total.label}</p>
        <p className="mt-2 text-3xl font-semibold">{total.range}</p>
        <p className="mt-2 text-sm text-stone-400">{total.scope}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.category} className="rounded-lg border border-stone-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-stone-950">{item.category}</h3>
            <p className="mt-2 text-xl font-semibold text-stone-900">{item.range}</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">{item.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
