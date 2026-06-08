export type ProductStatus = 'active' | 'inactive' | 'draft';
export type ProductCategory = 'Fuel' | 'Lubricant' | 'Spare Parts' | 'Additive';
export type ProductUnit = 'L' | 'pcs' | 'Kg';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  unit: ProductUnit;
  totalStock: number;
  defaultPriceNGN: number;
  status: ProductStatus;
}

const seed: Omit<Product, 'id'>[] = [
  { name: 'Petrol', sku: 'PET-001', category: 'Fuel', unit: 'L', totalStock: 15_000, defaultPriceNGN: 700, status: 'active' },
  { name: 'Diesel', sku: 'DSL-002', category: 'Fuel', unit: 'L', totalStock: 9_000, defaultPriceNGN: 680, status: 'active' },
  { name: 'Kerosene', sku: 'KER-003', category: 'Fuel', unit: 'L', totalStock: 0, defaultPriceNGN: 580, status: 'inactive' },
  { name: 'Lubricant X1', sku: 'LUB-004', category: 'Lubricant', unit: 'L', totalStock: 4_500, defaultPriceNGN: 1_200, status: 'draft' },
  { name: 'Fuel Filter', sku: 'FLT-007', category: 'Spare Parts', unit: 'pcs', totalStock: 2_000, defaultPriceNGN: 1_500, status: 'active' },
  { name: 'Premium Motor Spirit', sku: 'PMS-008', category: 'Fuel', unit: 'L', totalStock: 22_300, defaultPriceNGN: 720, status: 'active' },
  { name: 'Automotive Gas Oil', sku: 'AGO-009', category: 'Fuel', unit: 'L', totalStock: 18_100, defaultPriceNGN: 730, status: 'active' },
  { name: 'Engine Oil 5W-30', sku: 'EO-010', category: 'Lubricant', unit: 'L', totalStock: 1_200, defaultPriceNGN: 4_500, status: 'active' },
  { name: 'Brake Fluid DOT-4', sku: 'BF-011', category: 'Additive', unit: 'L', totalStock: 450, defaultPriceNGN: 2_200, status: 'draft' },
  { name: 'Spark Plug NGK', sku: 'SP-012', category: 'Spare Parts', unit: 'pcs', totalStock: 750, defaultPriceNGN: 850, status: 'active' },
];

export const PRODUCTS_MOCK: Product[] = Array.from({ length: 50 }, (_, i) => ({
  ...seed[i % seed.length],
  id: `prod-${String(i + 1).padStart(3, '0')}`,
  // Add some variance so rows don't repeat verbatim
  totalStock: seed[i % seed.length].totalStock + (i % 7) * 50,
}));

export function formatStock(p: Product): string {
  const formatted = p.totalStock.toLocaleString();
  return p.unit === 'pcs' ? `${formatted}pcs` : `${formatted}${p.unit}`;
}
