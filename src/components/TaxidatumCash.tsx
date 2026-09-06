import taxidatum from "../data/taxidatum.json";

export function TaxidatumCash() {
  const total = taxidatum.services.reduce((sum, service) => sum + service.pen, 0);
  const usd = taxidatum.services.reduce((sum, service) => sum + service.usd, 0);
  const beforeCusco = taxidatum.services.filter((service) => service.dayId <= "2026-09-16").reduce((sum, service) => sum + service.pen, 0);
  return <section aria-labelledby="taxidatum-cash-title" className="space-y-4 rounded-lg border border-emerald-200 bg-white p-4 sm:p-5">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">7 servicios confirmados · {taxidatum.confirmedOn}</p>
      <h3 id="taxidatum-cash-title" className="mt-1 text-xl font-semibold">Taxidatum · reservar S/{total.toLocaleString("es-ES")} en efectivo</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{taxidatum.payment} Total alternativo: {usd} USD. Confirmado no significa pagado.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Desglose de Taxidatum por fecha, recogida y coste pendiente</caption>
        <thead className="border-b border-stone-300 text-xs text-stone-500"><tr><th className="p-2">Fecha</th><th className="p-2">Servicio / recogida</th><th className="p-2 text-right">Efectivo PEN</th><th className="hidden p-2 text-right sm:table-cell">Alternativa USD</th></tr></thead>
        <tbody>{taxidatum.services.map(service => <tr key={service.id} className="border-b border-stone-100 align-top">
          <td className="whitespace-nowrap p-2 font-medium">{service.date}</td><td className="p-2"><span className="font-medium">{service.title}</span><p className="mt-1 text-xs text-stone-500">{service.pickup}</p></td><td className="whitespace-nowrap p-2 text-right font-semibold">S/{service.pen}</td><td className="hidden p-2 text-right text-stone-500 sm:table-cell">{service.usd} USD</td>
        </tr>)}</tbody>
        <tfoot><tr className="font-semibold"><th colSpan={2} className="p-2">Total pendiente · dos personas</th><td className="p-2 text-right">S/{total.toLocaleString("es-ES")}</td><td className="hidden whitespace-nowrap p-2 text-right sm:table-cell">{usd} USD</td></tr></tfoot>
      </table>
    </div>
    <p className="text-sm leading-6 text-stone-600">{taxidatum.collectionTiming} Los servicios del 11 al 16 suman S/{beforeCusco.toLocaleString("es-ES")}; separar además S/34 para el traslado del 19. Preparar el efectivo en Lima o Arequipa antes de llegar al Valle, con dinero adicional para entradas y otros gastos.</p>
    <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">{taxidatum.day13Warning}</p>
    <p className="text-xs leading-5 text-stone-500">Fuente: {taxidatum.source} El proveedor también ofreció tarjeta con recargo del 5 %; aquí se presupuesta la opción en efectivo elegida por los viajeros.</p>
  </section>;
}
