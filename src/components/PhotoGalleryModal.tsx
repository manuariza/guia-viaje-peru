import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, X } from "lucide-react";
import type { Photo } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";

export function PhotoGalleryModal({
  title,
  photos,
  open,
  onOpenChange,
}: {
  title: string;
  photos: Photo[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[2100] bg-stone-950/35 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-[2101] flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[86dvh] sm:w-[min(960px,calc(100vw-24px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:border-stone-200">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 sm:px-5 sm:py-4">
            <Dialog.Title className="min-w-0 break-words text-base font-semibold text-stone-950">{title}</Dialog.Title>
            <Dialog.Description className="sr-only">
              Galería de fotos con crédito y enlace de origen para cada imagen.
            </Dialog.Description>
            <Dialog.Close className="grid size-11 shrink-0 place-items-center rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:translate-y-px">
              <X className="size-5" />
              <span className="sr-only">Cerrar galería</span>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5">
            {photos.length === 0 ? (
              <p className="text-sm text-stone-500">Todavía no hay fotos para esta ficha.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {photos.map((photo) => (
                  <figure key={`${photo.url}-${photo.caption}`} className="overflow-hidden rounded-lg border border-stone-200">
                    <ImageWithFallback
                      src={photo.url}
                      alt={photo.alt}
                      fallbackLabel={photo.caption}
                      className="h-48 w-full object-cover sm:h-56"
                    />
                    <figcaption className="space-y-2 p-3">
                      <p className="text-sm font-medium text-stone-900">{photo.caption}</p>
                      <a
                        className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-900"
                        href={photo.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {photo.credit}
                        <ExternalLink className="size-3" />
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
