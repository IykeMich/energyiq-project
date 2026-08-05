import type { product } from '@energyiq/domain';

interface ProductCatalogStatsProps {
  products: product.Product[];
  isLoading?: boolean;
}

function pluralizeSkuCount(count: number): string {
  return `${count} SKU${count === 1 ? '' : 's'}`;
}

/** Product-catalog KPI strip: total + per-status counts, derived from real product data. */
export function ProductCatalogStats({ products, isLoading = false }: ProductCatalogStatsProps) {
  const countByStatus = products.reduce<Record<string, number>>((counts, item) => {
    const status = item.status ?? 'draft';
    counts[status] = (counts[status] ?? 0) + 1;
    return counts;
  }, {});

  const cards: { label: string; value: string }[] = [
    { label: 'Total Products:', value: String(products.length) },
    { label: 'Active:', value: pluralizeSkuCount(countByStatus.active ?? 0) },
    { label: 'Pending Review:', value: pluralizeSkuCount(countByStatus.pending_review ?? 0) },
    { label: 'Paused:', value: pluralizeSkuCount(countByStatus.paused ?? 0) },
    { label: 'Draft:', value: pluralizeSkuCount(countByStatus.draft ?? 0) },
  ];

  return (
    <div className="flex flex-wrap gap-4 rounded-[18px] bg-[#6161611A] p-6">
      {cards.map((card) =>
        isLoading ? (
          <div
            key={card.label}
            className="h-[100px] flex-1 min-w-[180px] animate-pulse rounded-[14px] bg-[#FFFFFF1A]"
          />
        ) : (
          <div
            key={card.label}
            className="flex flex-1 min-w-[180px] flex-col justify-center gap-2 rounded-[14px] bg-[#FFFFFF1A] p-5"
          >
            <span className="text-base text-white">{card.label}</span>
            <span className="text-[22px] font-semibold text-white">{card.value}</span>
          </div>
        ),
      )}
    </div>
  );
}
