export const actionLinkClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-background active:bg-surface-container-high transition-colors duration-200';

const formatter = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export function formatPrice(price: number | string | null | undefined) {
  if (price == null || (typeof price === 'string' && !price.trim()) || !Number.isFinite(Number(price))) return 'Precio no disponible';
  return `$${formatter.format(Number(price))}`;
}
