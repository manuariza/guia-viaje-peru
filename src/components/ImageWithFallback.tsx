import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";

export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackLabel,
  loading = "lazy",
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: "eager" | "lazy";
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex min-h-32 items-center justify-center bg-stone-100 px-4 text-center text-sm font-medium text-stone-500",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <span className="inline-flex max-w-52 flex-col items-center gap-2">
          <ImageOff className="size-5 text-stone-400" />
          {fallbackLabel ?? alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
