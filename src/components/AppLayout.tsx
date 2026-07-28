import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] overflow-x-clip bg-stone-50 text-stone-950">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-3 md:px-6 md:py-4 lg:px-8">{children}</div>
    </div>
  );
}
