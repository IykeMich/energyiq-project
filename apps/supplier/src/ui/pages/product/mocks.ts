import type { product as productApi } from '@energyiq/domain';

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

// Category and unit options now come from the live category/unit endpoints
// (see product-basic-info-tab.tsx). The lists below have no backend-provided
// lookup endpoint — product_type/price_type are fixed enums on the API, and
// packaging_type/tax_type/pricing-tier labels are freeform strings with no
// reference endpoint, so these stay as UI-suggested option lists.
export const TYPE_OPTIONS = ['Single Product', 'Product with Variant'] as const;
export const PACKAGING_OPTIONS = ['Bulk Tanker', 'Drums', '20L Kegs', 'Pallets'] as const;
export const PRICE_TYPE_OPTIONS = ['Fixed', 'Tiered', 'Cost-Plus'] as const;
export const CURRENCY_OPTIONS = ['NGN', 'USD'] as const;
export const PRICING_TIER_OPTIONS = ['Bronze', 'Silver', 'Gold'] as const;
// Only VAT/GST/SalesTax map to the backend tax_type enum; the other labels
// are still offered in the UI but fall back to 'None' when submitted (see
// add-product-page.tsx's toUpsertRequest).
export const TAX_TYPE_OPTIONS = ['VAT', 'GST', 'SalesTax', 'Withholding Tax', 'Custom Duty'] as const;
// Warehouse options for the "Warehouse Allocation" wizard tab now come from
// the live GET /v1/warehouses endpoint (see hooks/use-warehouses.ts,
// product-warehouse-tab.tsx) — there is no UI-only fallback list for it.
export const STORAGE_LOCATION_OPTIONS = ['Tank-A1', 'Tank-A2', 'Tank-B1', 'Tank-B2', 'Bay-1', 'Bay-2'] as const;
export const CREDIT_TERM_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Cash on Delivery', 'Advance Payment'] as const;
export const RETURN_REASON_OPTIONS = ['Damaged Item', 'Wrong Item Received', 'Quality Issues', 'Late Delivery'] as const;

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
// Only these two map to the backend's approval_workflow enum ('auto-approve' | 'scheduled').
export type ApprovalWorkflowOption = 'auto' | 'scheduled';
export type AutomationOption = 'publish-now' | 'schedule' | 'save-draft' | 'submit-review';

export interface WarehouseAllocationDraft {
  id: string;
  warehouseId: string;
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

export interface ProductDraftErrors {
  name?: string;
  category?: string;
  measuringUnit?: string;
  costPrice?: string;
  sellingPrice?: string;
  warehouseId?: string;
  pricingTiers?: string;
  variants?: string;
}

/**
 * Validates the fields the backend create endpoint actually requires
 * (name, category_id, unit, base_price) before the wizard submits, so a
 * missing value surfaces as an inline field error instead of a 400 from
 * the API. Cost Price is validated too since the UI already marks it
 * required (step-1 pricing tab) even though the backend treats it as optional.
 * Warehouse Location is validated since the warehouse tab marks it required.
 * Pricing tiers and variants are validated per the backend's tiered/variant
 * requirements (see ProductCreateRequest description) since submitting either
 * empty/incomplete otherwise only surfaces as an unlabeled 400.
 */
export function validateProductDraft(draft: NewProductDraft): ProductDraftErrors {
  const errors: ProductDraftErrors = {};
  if (!draft.name.trim()) errors.name = 'Product name is required.';
  if (!draft.category) errors.category = 'Product category is required.';
  if (!draft.measuringUnit) errors.measuringUnit = 'Measuring unit is required.';
  if (!draft.costPrice.trim()) errors.costPrice = 'Cost price is required.';
  if (!draft.sellingPrice.trim()) {
    errors.sellingPrice = 'Selling price is required.';
  } else if (!(Number(draft.sellingPrice) > 0)) {
    errors.sellingPrice = 'Selling price must be greater than 0.';
  }
  if (!draft.warehouseAllocations.some((allocation) => allocation.warehouseId)) {
    errors.warehouseId = 'Warehouse location is required.';
  }
  if (draft.priceType === 'Tiered') {
    if (draft.pricingTiers.length === 0) {
      errors.pricingTiers = 'Add at least one pricing tier.';
    } else if (
      draft.pricingTiers.some(
        (tier) =>
          !tier.tier ||
          !tier.minQuantity.trim() ||
          !tier.maxQuantity.trim() ||
          !(Number(tier.unitPrice) > 0),
      )
    ) {
      errors.pricingTiers = 'Each pricing tier needs a tier, min/max quantity, and a unit price greater than 0.';
    }
  }
  if (draft.type === 'Product with Variant') {
    if (draft.variants.length === 0) {
      errors.variants = 'Add at least one variant.';
    } else if (
      draft.variants.some(
        (variant) =>
          !variant.name.trim() ||
          !variant.displayName.trim() ||
          !(Number(variant.costPrice) > 0) ||
          !(Number(variant.sellingPrice) > 0),
      )
    ) {
      errors.variants = 'Each variant needs a name, display name, and cost/selling prices greater than 0.';
    }
  }
  return errors;
}

/** Which Product Details sub-tab each validated field belongs to, so "Next" can gate one tab at a time. */
export const PRODUCT_DETAILS_TAB_FIELDS = {
  basic: ['name', 'category', 'measuringUnit', 'variants'],
  pricing: ['costPrice', 'sellingPrice', 'pricingTiers'],
  warehouse: ['warehouseId'],
} as const satisfies Record<string, (keyof ProductDraftErrors)[]>;

// ───────── Review & Activation (wizard step 3) ─────────

export const CURRENCY_SYMBOL: Record<string, string> = { NGN: '₦', USD: '$' };

const VISIBILITY_LABEL: Record<VisibilityOption, string> = {
  all: 'All Distributors',
  tier: 'Tier-Based Access',
  selected: 'Selected Distributors',
};

const APPROVAL_LABEL: Record<ApprovalWorkflowOption, string> = {
  auto: 'Auto-Approve',
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
 * Build the read-model shown on the Review & Activation step. This runs BEFORE
 * submission (previewing what create/update will send), so it's necessarily a
 * local projection of the draft rather than a server query — see
 * add-product-page.tsx's toUpsertRequest for the payload actually sent.
 * step-review.tsx overrides the category/unit/warehouse fields with live-resolved names.
 */
export function buildReviewSummary(draft: NewProductDraft): ReviewSummary {
  const name = draft.name || 'Untitled product';
  const currencySymbol = CURRENCY_SYMBOL[draft.currency] ?? '';
  const unitWord = draft.measuringUnit.split(' (')[0] || 'unit';
  const firstAllocation = draft.warehouseAllocations[0];

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
      { label: 'Warehouse Location', value: dash(firstAllocation?.warehouseId) },
      { label: 'Available Capacity', value: '—' },
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

// ───────── Units of Measure ─────────
// NOTE: category/unit *rows* now come from the real API (see
// hooks/use-product-categories.ts, hooks/use-product-units.ts). This list of
// type option labels is UI-only (no lookup endpoint for unit "type" exists).

export const UNIT_TYPE_OPTIONS = ['Volume', 'Count', 'Weight'] as const;

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
      { id: 'wa-1', warehouseId: '', allocatedQuantity: '', storageLocation: '' },
    ],
    visibility: 'all',
    approvalWorkflow: 'auto',
    automationOption: 'publish-now',
  };
}

/** Same "random suffix" id scheme used when a user manually adds a variant/tier/allocation row. */
function draftRowId(prefix: string, index: number): string {
  return `${prefix}-${index + 1}-${Math.random().toString(36).slice(2, 6)}`;
}

const APPROVAL_WORKFLOW_FROM_API: Record<string, ApprovalWorkflowOption> = {
  'scheduled': 'scheduled',
};

const VISIBILITY_FROM_API: Record<string, VisibilityOption> = {
  tier_based: 'tier',
  selected_distributors: 'selected',
};

/** Default automation choice for step 3, inferred from the product's current status. */
function automationOptionFromStatus(status: string | undefined): AutomationOption {
  if (status === 'draft') return 'save-draft';
  if (status === 'pending_review') return 'submit-review';
  return 'publish-now';
}

/**
 * Maps a fetched product (GET /products/:id response) onto the wizard's draft shape,
 * so editing an existing product starts pre-filled instead of blank.
 *
 * Known gap, intentionally not fabricated: the product response only exposes
 * `warehouse_ids` (no per-warehouse quantity/storage location), since
 * `warehouse_allocations` is a write-only field on the upsert request. Each
 * known warehouse is restored with an empty quantity/storage location for the
 * user to re-enter.
 */
export function productToDraft(product: productApi.Product): NewProductDraft {
  const warehouseIds = product.warehouse_ids?.length ? product.warehouse_ids : product.warehouse_id ? [product.warehouse_id] : [];

  return {
    name: product.name ?? '',
    category: product.category_id ?? '',
    type: product.product_type === 'product_with_variants' ? 'Product with Variant' : 'Single Product',
    measuringUnit: product.unit ?? '',
    packagingType: product.packaging_type ?? '',
    description: product.description ?? '',
    variants: (product.product_variants ?? []).map((variant, index) => ({
      id: draftRowId('var', index),
      name: variant.display_name,
      displayName: variant.display_name,
      costPrice: String(variant.cost_price),
      sellingPrice: String(variant.selling_price),
    })),
    priceType: product.price_type === 'tiered' ? 'Tiered' : 'Fixed',
    currency: product.currency ?? 'NGN',
    costPrice: product.cost_price != null ? String(product.cost_price) : '',
    sellingPrice: product.base_price != null ? String(product.base_price) : '',
    pricingTiers: (product.tier_pricing ?? []).map((tier, index) => ({
      id: draftRowId('tier', index),
      tier: tier.tier,
      minQuantity: tier.min_quantity != null ? String(tier.min_quantity) : '',
      maxQuantity: tier.max_quantity != null ? String(tier.max_quantity) : '',
      unitPrice: String(tier.unit_price),
    })),
    taxEnabled: Boolean(product.tax_configuration),
    taxType: product.tax_configuration && product.tax_configuration.tax_type !== 'None' ? product.tax_configuration.tax_type : '',
    taxRate: product.tax_configuration ? String(product.tax_configuration.tax_rate) : '',
    warehouseAllocations: warehouseIds.length
      ? warehouseIds.map((warehouseId, index) => ({
          id: draftRowId('wa', index),
          warehouseId,
          allocatedQuantity: '',
          storageLocation: '',
        }))
      : [{ id: 'wa-1', warehouseId: '', allocatedQuantity: '', storageLocation: '' }],
    visibility: VISIBILITY_FROM_API[product.distributor_visibility ?? ''] ?? 'all',
    approvalWorkflow: APPROVAL_WORKFLOW_FROM_API[product.approval_workflow ?? ''] ?? 'auto',
    automationOption: automationOptionFromStatus(product.status),
  };
}
