import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">Buscar en el viaje</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar en el viaje..."
        className="h-12 w-full rounded-md border border-stone-200 bg-white pl-9 pr-3 text-base text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200 sm:h-10 sm:text-sm"
      />
    </label>
  );
}
