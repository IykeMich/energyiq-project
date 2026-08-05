// TODO(orval): replace with aggregated stock from a warehouse-allocations query once available
export const PRODUCT_STOCK_MOCK_QUANTITY = 15000;

// TODO(orval): replace with real product attributes once the API returns them
export const PRODUCT_ATTRIBUTES_MOCK: { label: string; value: string }[] = [
  { label: 'Viscosity', value: '20W50' },
  { label: 'Size', value: '1L' },
  { label: 'Grade', value: 'Premium' },
];

// TODO(orval): replace with a per-product stock percentage derived from real
// warehouse-allocation aggregation once the API returns it.
export function getProductStockMockPercentage(productId: string): number {
  let hash = 0;
  for (let index = 0; index < productId.length; index += 1) {
    hash = (hash * 31 + productId.charCodeAt(index)) % 100;
  }
  return Math.abs(hash);
}

/** Pure — stays even after the percentage above is backed by real data. */
export function getStockTierColor(percentage: number): string {
  if (percentage >= 50) return '#388E3C';
  if (percentage >= 10) return '#FB8C1C';
  return '#D30A0A';
}
