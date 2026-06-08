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

// ───────── New Product (wizard) ─────────

export const CATEGORY_OPTIONS = ['Fuel', 'Lubricant', 'Spare Parts', 'Additive'] as const;
export const TYPE_OPTIONS = ['Single Product', 'Bundle', 'Service'] as const;
export const UNIT_OPTIONS = ['Liters (L)', 'Pieces (pcs)', 'Kilograms (Kg)'] as const;
export const PACKAGING_OPTIONS = ['Bulk Tanker', 'Drums', '20L Kegs', 'Pallets'] as const;
export const PRICE_TYPE_OPTIONS = ['Fixed Pricing', 'Tiered Pricing', 'Cost-Plus'] as const;
export const CURRENCY_OPTIONS = ['NGN', 'USD'] as const;
export const PRICING_TIER_OPTIONS = ['Bronze', 'Silver', 'Gold'] as const;
export const TAX_OPTIONS = ['VAT 7.5%', 'Tax Exempt', 'Reduced VAT 5%'] as const;
export const WAREHOUSE_OPTIONS = [
  { id: 'wh-lagos-main', name: 'Lagos Main Depot', availableStockL: 240_000 },
  { id: 'wh-lekki', name: 'Lekki Tank Farm', availableStockL: 180_000 },
  { id: 'wh-awka', name: 'Awka Central Depot', availableStockL: 120_000 },
  { id: 'wh-abuja', name: 'Abuja Storage Facility', availableStockL: 95_000 },
  { id: 'wh-ph', name: 'Port Harcourt Depot', availableStockL: 150_000 },
] as const;
export const STORAGE_LOCATION_OPTIONS = ['Tank-A1', 'Tank-A2', 'Tank-B1', 'Tank-B2', 'Bay-1', 'Bay-2'] as const;

export interface WarehouseAssignTarget {
  id: string;
  name: string;
  location: string;
  usedL: number;
  capacityL: number;
}

export const WAREHOUSES_FOR_ASSIGN: WarehouseAssignTarget[] = [
  { id: 'wh-lagos-central', name: 'Lagos Central Depot',     location: 'Lagos Island, Lagos',      usedL: 3_200,  capacityL: 5_000 },
  { id: 'wh-lekki',         name: 'Lekki Tank Farm',         location: 'Lekki, Lagos',             usedL: 7_400,  capacityL: 10_000 },
  { id: 'wh-awka',          name: 'Awka Central Depot',      location: 'Awka, Anambra State',      usedL: 8_300,  capacityL: 10_000 },
  { id: 'wh-abuja',         name: 'Abuja Storage Facility',  location: 'Wuse, Abuja',              usedL: 8_300,  capacityL: 10_000 },
  { id: 'wh-ph',            name: 'Port Harcourt Depot',     location: 'Port Harcourt, Rivers State', usedL: 8_300, capacityL: 10_000 },
];

export const COMPLIANCE_OFFICERS = ['Joshua Obi', 'Amaka Eze', 'Tunde Bakare', 'Sarah Adeleke'] as const;

export type VisibilityOption = 'all' | 'tier' | 'selected';
export type ApprovalWorkflowOption = 'auto' | 'manual' | 'scheduled';
export type AutomationOption = 'publish-now' | 'schedule' | 'save-draft' | 'submit-review';

export interface WarehouseAllocationDraft {
  id: string;
  warehouseLocation: string;
  allocatedQuantity: string;
  storageLocation: string;
}

export interface NewProductDraft {
  // Step 1 / Basic Info
  name: string;
  category: string;
  type: string;
  measuringUnit: string;
  packagingType: string;
  description: string;
  // Step 1 / Pricing
  priceType: string;
  sellingPrice: string;
  currency: string;
  pricingTier: string;
  taxConfiguration: string;
  // Step 1 / Warehouse Allocation
  warehouseAllocations: WarehouseAllocationDraft[];
  // Step 2
  visibility: VisibilityOption;
  approvalWorkflow: ApprovalWorkflowOption;
  // Step 3
  automationOption: AutomationOption;
}

// ───────── Categories ─────────

export interface ProductCategoryRow {
  id: string;
  name: string;
  description: string;
  numberOfProducts: number;
  status: 'active' | 'inactive';
}

export const CATEGORIES_DATA: ProductCategoryRow[] = [
  { id: 'cat-fuel',      name: 'Fuel',        description: 'Fuel-based products',     numberOfProducts: 3, status: 'active' },
  { id: 'cat-lubricant', name: 'Lubricant',   description: 'Engine oils & additives', numberOfProducts: 1, status: 'active' },
  { id: 'cat-spare',     name: 'Spare Parts', description: 'Non-liquid items',        numberOfProducts: 1, status: 'active' },
  { id: 'cat-additive',  name: 'Additive',    description: 'Non-liquid items',        numberOfProducts: 1, status: 'active' },
  { id: 'cat-chemical',  name: 'Chemicals',   description: 'Non-liquid items',        numberOfProducts: 1, status: 'active' },
];

export function emptyCategory(): Omit<ProductCategoryRow, 'id'> {
  return { name: '', description: '', numberOfProducts: 0, status: 'active' };
}

// ───────── Units of Measure ─────────

export interface ProductUnitRow {
  id: string;
  name: string;
  description: string;
  type: 'Volume' | 'Count' | 'Weight';
  shortCode: string;
}

export const UNITS_DATA: ProductUnitRow[] = [
  { id: 'unit-litre',   name: 'Litre',       description: 'Used for fuel & chemicals', type: 'Volume', shortCode: 'L' },
  { id: 'unit-pieces',  name: 'Pieces',      description: 'Physical components',       type: 'Count',  shortCode: 'pcs' },
  { id: 'unit-kg',      name: 'Kilogram',    description: 'Powders & solids',          type: 'Weight', shortCode: 'kg' },
  { id: 'unit-pack',    name: 'Pack',        description: 'Packaged goods',            type: 'Count',  shortCode: 'pcks' },
  { id: 'unit-ml',      name: 'Milliliters', description: 'Non-liquid items',          type: 'Volume', shortCode: 'ml' },
  { id: 'unit-barrel',  name: 'Barrels',     description: 'Non-liquid items',          type: 'Volume', shortCode: 'bbl' },
];

export const UNIT_TYPE_OPTIONS = ['Volume', 'Count', 'Weight'] as const;

export function emptyUnit(): Omit<ProductUnitRow, 'id'> {
  return { name: '', description: '', type: 'Volume', shortCode: '' };
}

// ───────── New Product Draft ─────────

export function emptyDraft(): NewProductDraft {
  return {
    name: '',
    category: '',
    type: 'Single Product',
    measuringUnit: '',
    packagingType: '',
    description: '',
    priceType: 'Fixed Pricing',
    sellingPrice: '',
    currency: 'NGN',
    pricingTier: '',
    taxConfiguration: '',
    warehouseAllocations: [
      { id: 'wa-1', warehouseLocation: '', allocatedQuantity: '', storageLocation: '' },
    ],
    visibility: 'all',
    approvalWorkflow: 'auto',
    automationOption: 'publish-now',
  };
}
