import * as Dialog from "@radix-ui/react-dialog";
import { ExternalLink, Images, MapPin, X } from "lucide-react";
import type { LinkItem, Photo } from "../types";
import { PhotoGalleryModal } from "./PhotoGalleryModal";
import { useState } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { ScheduleList } from "./ScheduleList";
import { MarkdownDocument } from "./MarkdownDocument";

export type DetailSection = {
  title: string;
  items: string[];
};

export type DetailPayload = {
  title: string;
  eyebrow?: string;
  description?: string;
  location?: string;
  photos?: Photo[];
  links?: LinkItem[];
  sections?: DetailSection[];
  longformMarkdown?: string;
};

export function DetailModal({
  detail,
  open,
  onOpenChange,
}: {
  detail: DetailPayload | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const photos = detail?.photos ?? [];

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[2000] bg-stone-950/35 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-[2001] flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[88dvh] sm:w-[min(820px,calc(100vw-24px))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:border-stone-200">
            {detail ? (
              <>
                <div className="flex shrink-0 items-start justify-between gap-3 border-b border-stone-200 bg-white px-4 py-3 sm:gap-4 sm:px-5 sm:py-4">
                  <div className="min-w-0">
                    {detail.eyebrow ? (
                      <p className="text-[11px] font-semibold uppercase text-stone-500">
                        {detail.eyebrow}
                      </p>
                    ) : null}
                    <Dialog.Title className="mt-1 break-words text-lg font-semibold text-stone-950 sm:text-xl">
                      {detail.title}
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                      Detalle del viaje con contexto, actividades, recomendaciones, fotos y enlaces útiles.
                    </Dialog.Description>
                    {detail.location ? (
                      <p className="mt-2 flex items-start gap-1 text-sm text-stone-500">
                        <MapPin className="mt-0.5 size-4 shrink-0" />
                        {detail.location}
                      </p>
                    ) : null}
                  </div>
                  <Dialog.Close className="grid size-11 shrink-0 place-items-center rounded-md border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:translate-y-px">
                    <X className="size-5" />
                    <span className="sr-only">Cerrar detalle</span>
                  </Dialog.Close>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  {photos[0] ? (
                    <button
                      type="button"
                      onClick={() => setGalleryOpen(true)}
                      className="group relative block h-48 w-full shrink-0 overflow-hidden text-left sm:h-64"
                    >
                      <ImageWithFallback
                        src={photos[0].url}
                        alt={photos[0].alt}
                        fallbackLabel={photos[0].caption}
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-xs font-semibold text-stone-900 shadow-sm">
                        <Images className="size-4" />
                        Galería
                      </span>
                    </button>
                  ) : null}

                  <div className="space-y-6 p-4 sm:p-5">
                    {detail.description ? (
                      <p className="max-w-3xl text-sm leading-6 text-stone-700">{detail.description}</p>
                    ) : null}

                    {detail.sections?.map((section) => (
                      <section key={section.title}>
                        <h3 className="text-sm font-semibold text-stone-950">{section.title}</h3>
                        {section.title.toLowerCase().includes("horario") ? (
                          <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3 sm:p-4">
                            <ScheduleList items={section.items} />
                          </div>
                        ) : (
                          <ul className="mt-3 grid gap-2 text-sm text-stone-600">
                            {section.items.map((item, index) => (
                              <li key={`${item}-${index}`} className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    ))}

                    {detail.longformMarkdown ? (
                      <section>
                        <MarkdownDocument markdown={detail.longformMarkdown} />
                      </section>
                    ) : null}

                    {detail.links?.length ? (
                      <section>
                        <h3 className="text-sm font-semibold text-stone-950">Enlaces útiles</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {detail.links.map((link, index) => (
                            <a
                              key={`${link.url}-${link.label}-${index}`}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:border-stone-300 hover:bg-stone-50 active:translate-y-px sm:w-auto"
                            >
                              {link.label}
                              <ExternalLink className="size-4" />
                            </a>
                          ))}
                        </div>
                      </section>
                    ) : null}
                  </div>
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <PhotoGalleryModal
        title={detail ? `Galería · ${detail.title}` : "Galería"}
        photos={photos}
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
      />
    </>
  );
}
