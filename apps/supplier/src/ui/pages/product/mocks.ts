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

// ───────── Product Details (slide-out panel) ─────────

/** Full unit label shown on the "Unit Measured" line of the details panel. */
export const UNIT_LABEL: Record<ProductUnit, string> = {
  L: 'Litres (L)',
  pcs: 'Pieces (pcs)',
  Kg: 'Kilograms (Kg)',
};

export interface ProductAttribute {
  label: string;
  value: string;
}

export interface ProductVariant {
  name: string;
  priceNGN: number;
}

export interface ProductDetail {
  /** Number of warehouses the total stock is spread across. */
  warehouseCount: number;
  attributes: ProductAttribute[];
  variants: ProductVariant[];
}

// Seed attributes/variants keyed by category so each product reads differently.
const DETAIL_SEED: Record<ProductCategory, { attributes: ProductAttribute[]; variants: ProductVariant[] }> = {
  Fuel: {
    attributes: [
      { label: 'Viscosity', value: '20W50' },
      { label: 'Size', value: '1L' },
      { label: 'Grade', value: 'Premium' },
    ],
    variants: [
      { name: '1L Bottle', priceNGN: 700 },
      { name: '4L Gallon', priceNGN: 2_400 },
    ],
  },
  Lubricant: {
    attributes: [
      { label: 'Viscosity', value: '5W30' },
      { label: 'Size', value: '5L' },
      { label: 'Grade', value: 'Synthetic' },
    ],
    variants: [
      { name: '1L Bottle', priceNGN: 1_200 },
      { name: '5L Drum', priceNGN: 5_500 },
    ],
  },
  'Spare Parts': {
    attributes: [
      { label: 'Material', value: 'Steel' },
      { label: 'Fit', value: 'Universal' },
      { label: 'Grade', value: 'OEM' },
    ],
    variants: [
      { name: 'Single Unit', priceNGN: 1_500 },
      { name: 'Pack of 10', priceNGN: 13_500 },
    ],
  },
  Additive: {
    attributes: [
      { label: 'Concentration', value: 'High' },
      { label: 'Size', value: '1L' },
      { label: 'Grade', value: 'Industrial' },
    ],
    variants: [
      { name: '1L Bottle', priceNGN: 2_200 },
      { name: '5L Drum', priceNGN: 9_800 },
    ],
  },
};

// TODO(orval): replace with getProductDetail(product.id)
export function buildProductDetail(product: Product): ProductDetail {
  const seed = DETAIL_SEED[product.category];
  return {
    // Spread total stock across warehouses (~6,000 units each), clamped to 1–4.
    warehouseCount: Math.min(4, Math.max(1, Math.ceil(product.totalStock / 6_000))),
    attributes: seed.attributes,
    variants: seed.variants,
  };
}

// ───────── New Product (wizard) ─────────

// TODO(orval): these dropdown option lists come from reference/lookup endpoints
// (categories, units, packaging, tax types). Replace with the generated queries.
export const CATEGORY_OPTIONS = ['Fuel', 'Lubricant', 'Spare Parts', 'Additive'] as const;
export const TYPE_OPTIONS = ['Single Product', 'Product with Variant'] as const;
export const UNIT_OPTIONS = ['Liters (L)', 'Pieces (pcs)', 'Kilograms (Kg)'] as const;
export const PACKAGING_OPTIONS = ['Bulk Tanker', 'Drums', '20L Kegs', 'Pallets'] as const;
export const PRICE_TYPE_OPTIONS = ['Fixed', 'Tiered', 'Cost-Plus'] as const;
export const CURRENCY_OPTIONS = ['NGN', 'USD'] as const;
export const PRICING_TIER_OPTIONS = ['Bronze', 'Silver', 'Gold'] as const;
export const TAX_TYPE_OPTIONS = ['VAT', 'Withholding Tax', 'Custom Duty'] as const;
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

/** A single sellable variant of a "Product with Variant" type product. */
export interface ProductVariantDraft {
  id: string;
  name: string;
  displayName: string;
  costPrice: string;
  sellingPrice: string;
}

/** One row of the tiered (volume-based) pricing table. */
export interface PricingTierDraft {
  id: string;
  tier: string;
  minQuantity: string;
  maxQuantity: string;
  unitPrice: string;
}

export interface NewProductDraft {
  // Step 1 / Basic Info
  name: string;
  category: string;
  type: string;
  measuringUnit: string;
  packagingType: string;
  description: string;
  variants: ProductVariantDraft[];
  // Step 1 / Pricing
  priceType: string;
  currency: string;
  costPrice: string;
  sellingPrice: string;
  pricingTiers: PricingTierDraft[];
  taxEnabled: boolean;
  taxType: string;
  taxRate: string;
  // Step 1 / Warehouse Allocation
  warehouseAllocations: WarehouseAllocationDraft[];
  // Step 2
  visibility: VisibilityOption;
  approvalWorkflow: ApprovalWorkflowOption;
  // Step 3
  automationOption: AutomationOption;
}

/**
 * Gross margin percentage = (selling - cost) / selling * 100.
 * Returns 0 when selling price is missing/zero so the badge never shows NaN.
 */
export function computeGrossMargin(costPrice: string, sellingPrice: string): number {
  const cost = Number(costPrice);
  const selling = Number(sellingPrice);
  if (!Number.isFinite(selling) || selling <= 0) return 0;
  return Math.round(((selling - cost) / selling) * 100);
}

// ───────── Review & Activation (wizard step 3) ─────────

export const CURRENCY_SYMBOL: Record<string, string> = { NGN: '₦', USD: '$' };

const VISIBILITY_LABEL: Record<VisibilityOption, string> = {
  all: 'All Distributors',
  tier: 'Tier-Based Access',
  selected: 'Selected Distributors',
};

const APPROVAL_LABEL: Record<ApprovalWorkflowOption, string> = {
  auto: 'Auto-Approve',
  manual: 'Manual Approval',
  scheduled: 'Scheduled Activation',
};

/** Number of distributors that can access an "All Distributors" product. */
// TODO(orval): replace with the live distributor-network count from the API.
export const DISTRIBUTOR_NETWORK_SIZE = 128;
// TODO(orval): MOQ is not captured in the wizard yet — supplied by the backend product model.
export const DEFAULT_MIN_ORDER_QUANTITY = '1,000 liters';

/** Derive a placeholder product code from the product name (e.g. "Diesel" → "DIE-001"). */
// TODO(orval): the real product code is generated server-side on creation.
export function buildProductCode(name: string): string {
  const prefix = (name.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'PRD').toUpperCase();
  return `${prefix}-001`;
}

export interface ReviewChecklistItem {
  label: string;
  description?: string;
  ok: boolean;
}

export interface ReviewRow {
  label: string;
  value: string;
}

export interface ReviewSummary {
  snapshot: { name: string; productCode: string; category: string; unit: string; creating: string };
  checklist: ReviewChecklistItem[];
  product: ReviewRow[];
  pricing: ReviewRow[];
  warehouse: ReviewRow[];
  distribution: ReviewRow[];
}

/**
 * Build the read-model shown on the Review & Activation step. Most rows are derived from the
 * draft; the few fields the wizard does not capture fall back to mock/derived values above.
 */
// TODO(orval): replace with the generated product-review query once the create endpoint lands.
export function buildReviewSummary(draft: NewProductDraft): ReviewSummary {
  const name = draft.name || 'Untitled product';
  const currencySymbol = CURRENCY_SYMBOL[draft.currency] ?? '';
  const unitWord = draft.measuringUnit.split(' (')[0] || 'unit';
  const firstAllocation = draft.warehouseAllocations[0];
  const warehouse = WAREHOUSE_OPTIONS.find((option) => option.name === firstAllocation?.warehouseLocation);

  const dash = (value: string) => value || '—';

  return {
    snapshot: {
      name,
      productCode: buildProductCode(draft.name),
      category: dash(draft.category),
      unit: dash(draft.measuringUnit),
      creating: 'Today, 11:00AM',
    },
    checklist: [
      {
        label: 'All mandatory fields completed.',
        description: 'All required information has been provided',
        ok: Boolean(draft.name && draft.category && draft.measuringUnit),
      },
      { label: 'Pricing validated against market rates.', ok: Boolean(draft.sellingPrice) },
      {
        label: 'Inventory levels sufficient for MOQ.',
        ok: draft.warehouseAllocations.some((allocation) => Boolean(allocation.allocatedQuantity)),
      },
      { label: 'Distributor access configured.', ok: Boolean(draft.visibility) },
      { label: 'Quality specifications defined.', ok: true },
    ],
    product: [
      { label: 'Product Name', value: name },
      { label: 'Product Code', value: buildProductCode(draft.name) },
      { label: 'Category', value: dash(draft.category) },
      { label: 'Measurement Unit', value: dash(draft.measuringUnit) },
      { label: 'Packaging Type', value: dash(draft.packagingType) },
    ],
    pricing: [
      { label: 'Price Type', value: dash(draft.priceType) },
      {
        label: 'Selling Price',
        value: draft.sellingPrice
          ? `${currencySymbol}${Number(draft.sellingPrice).toLocaleString()} / ${unitWord}`
          : '—',
      },
      { label: 'Currency', value: dash(draft.currency) },
      { label: 'Pricing Tiers', value: `${draft.pricingTiers.length} Tiers` },
      {
        label: 'Tax Configuration',
        value: draft.taxEnabled ? `${draft.taxType || '—'} ${draft.taxRate || '0'}%` : 'Not Applied',
      },
    ],
    warehouse: [
      { label: 'Warehouse Location', value: dash(firstAllocation?.warehouseLocation) },
      { label: 'Available Stock', value: warehouse ? `${warehouse.availableStockL.toLocaleString()} Liters` : '—' },
      { label: 'Allocated Quantity', value: dash(firstAllocation?.allocatedQuantity) },
      { label: 'Storage Location', value: dash(firstAllocation?.storageLocation) },
    ],
    distribution: [
      { label: 'Visibility Settings', value: VISIBILITY_LABEL[draft.visibility] },
      { label: 'Distributors with Access', value: String(DISTRIBUTOR_NETWORK_SIZE) },
      { label: 'Approval Workflow', value: APPROVAL_LABEL[draft.approvalWorkflow] },
      { label: 'Minimum Order Quantity', value: DEFAULT_MIN_ORDER_QUANTITY },
    ],
  };
}

// ───────── Publish-flow success modal details ─────────
// TODO(orval): the values below are confirmation read-models returned by the create/publish
// mutation. Replace with the generated response once the endpoint lands.

/** "Product Published Successfully" → Activation Details rows. */
export function buildActivationDetails(draft: NewProductDraft): ReviewRow[] {
  return [
    { label: 'Activation Time', value: 'Immediate' },
    { label: 'Available to', value: `${DISTRIBUTOR_NETWORK_SIZE} Distributors` },
    { label: 'Distributor Tiers', value: draft.visibility === 'all' ? 'All Tiers' : VISIBILITY_LABEL[draft.visibility] },
    { label: 'Approval Workflow', value: APPROVAL_LABEL[draft.approvalWorkflow] },
  ];
}

/** "Product Saved as Draft" → Draft Details rows. */
export function buildDraftDetails(): ReviewRow[] {
  return [
    { label: 'Draft Status', value: 'Saved Successfully' },
    { label: 'Last Modified', value: 'Today, 11:00AM' },
    { label: 'Completion Status', value: '97% Complete' },
  ];
}

/** "Submitted for Review Successfully" → Review Process Details rows. */
export function buildReviewProcessDetails(officer: string): ReviewRow[] {
  return [
    { label: 'Review Status', value: 'Pending Review' },
    { label: 'Assigned Officer', value: `${officer || '—'} (Compliance Team)` },
    { label: 'Estimated Timeline', value: '24-48 Hours' },
  ];
}

/** Format a yyyy-mm-dd value as e.g. "December 13, 2025"; falls back to the raw string. */
export function formatScheduleDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date || '—';
  return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** Format a 24h "HH:MM" value as e.g. "09:00AM EST"; falls back to the raw string. */
export function formatScheduleTime(time: string): string {
  const [hourPart, minutePart] = time.split(':');
  const hour = Number(hourPart);
  if (!time || Number.isNaN(hour)) return time || '—';
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(hour12).padStart(2, '0')}:${minutePart ?? '00'}${period} EST`;
}

/** "Activation Scheduled Successfully" → Scheduled Activation Details rows. */
export function buildScheduledDetails(date: string, time: string): ReviewRow[] {
  const scheduled = new Date(`${date}T${time || '00:00'}:00`);
  let timeUntil = 'Pending';
  if (!Number.isNaN(scheduled.getTime())) {
    const diffMs = scheduled.getTime() - Date.now();
    if (diffMs > 0) {
      const totalHours = Math.floor(diffMs / 3_600_000);
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      timeUntil = `${days} Days, ${hours} hours`;
    } else {
      timeUntil = 'Activating soon';
    }
  }
  return [
    { label: 'Scheduled Date', value: formatScheduleDate(date) },
    { label: 'Scheduled Time', value: formatScheduleTime(time) },
    { label: 'Time Until Activation', value: timeUntil },
  ];
}

/**
 * Mocked product publish/activation call used to drive the loading state.
 * Resolves after a short delay so the UI can show a spinner before the success modal.
 */
// TODO(orval): replace with the generated create/publish-product mutation.
export function mockProductAction(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1_200));
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
    variants: [],
    priceType: 'Tiered',
    currency: 'NGN',
    costPrice: '',
    sellingPrice: '',
    pricingTiers: [],
    taxEnabled: false,
    taxType: '',
    taxRate: '',
    warehouseAllocations: [
      { id: 'wa-1', warehouseLocation: '', allocatedQuantity: '', storageLocation: '' },
    ],
    visibility: 'all',
    approvalWorkflow: 'auto',
    automationOption: 'publish-now',
  };
}
