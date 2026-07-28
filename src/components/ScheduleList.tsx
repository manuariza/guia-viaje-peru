const schedulePattern = /^((?:\d{2}:\d{2})(?:[-–](?:\d{2}:\d{2}))?|Noche)(?:[:\s]+)(.*)$/i;

function splitScheduleItem(item: string) {
  const match = item.match(schedulePattern);
  if (!match) {
    return { time: "Orden", text: item };
  }

  return {
    time: match[1],
    text: match[2].trim(),
  };
}

export function ScheduleList({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <ol className="relative ml-2 border-l border-stone-200">
      {items.map((item, index) => {
        const { time, text } = splitScheduleItem(item);

        return (
          <li key={`${item}-${index}`} className={compact ? "relative pb-3 pl-4 last:pb-0" : "relative pb-4 pl-5 last:pb-0"}>
            <span className="absolute -left-[5px] mt-1 size-2.5 rounded-full border-2 border-white bg-stone-950 shadow-sm" />
            <div className={compact ? "grid gap-1 sm:grid-cols-[92px_1fr]" : "grid gap-1 sm:grid-cols-[112px_1fr]"}>
              <time className="text-xs font-semibold tabular-nums uppercase text-stone-500">{time}</time>
              <p className={compact ? "text-sm leading-5 text-stone-700" : "text-sm leading-6 text-stone-700"}>{text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
