// ───────── Warehouse Inventory ─────────

import type { warehouse } from '@energyiq/domain';

export type WarehouseStatus = 'active' | 'inactive';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  /** Full location label shown in the edit form / transfer cards. */
  fullLocation: string;
  /** Fill level as a percentage (0–100) used for the Stock Level bar. */
  stockLevelPercent: number;
  /** Current stock on hand, in litres (transferable). */
  usedL: number;
  /** Total capacity, in litres. */
  capacityL: number;
  lastUpdated: string;
  status: WarehouseStatus;

  /** Real UUID from the API. */
  managerId: string;

  /** Per-product stock rows returned by GET /warehouses/{id}. */
  productPreview: {
    productId: string;
    name: string;
    quantity: number;
    sku: string;
    unit: string;
    /** From the additive `products` field — 0/'' when the backend hasn't sent it yet. */
    maxStock: number;
    reorderPoint: number;
    storageLocation: string;
  }[];
}

// TODO(orval): replace with the generated list-warehouses query.
// export const WAREHOUSES_MOCK: Warehouse[] = [
//   { id: 'wh-awka',    name: 'Awka Central Depot', location: 'Awka',          fullLocation: 'Awka, Anambra State.',   stockLevelPercent: 62, usedL: 37_200, capacityL: 60_000,  lastUpdated: '29 Oct 2025', status: 'active' },
//   { id: 'wh-onitsha', name: 'Onitsha Main Depot',  location: 'Onitsha',       fullLocation: 'Onitsha, Anambra State.', stockLevelPercent: 78, usedL: 93_600, capacityL: 120_000, lastUpdated: '30 Oct 2025', status: 'active' },
//   { id: 'wh-nnewi',   name: 'Nnewi Depot',         location: 'Nnewi',         fullLocation: 'Nnewi, Anambra State.',   stockLevelPercent: 48, usedL: 24_000, capacityL: 50_000,  lastUpdated: '25 Oct 2025', status: 'active' },
//   { id: 'wh-lagos',   name: 'Main Depot',          location: 'Lagos',         fullLocation: 'Ajah, Lagos State.',      stockLevelPercent: 58, usedL: 29_000, capacityL: 50_000,  lastUpdated: '31 Oct 2025', status: 'active' },
//   { id: 'wh-lekki',   name: 'Lekki Depot',         location: 'Lekki',         fullLocation: 'Lekki, Lagos State.',     stockLevelPercent: 80, usedL: 32_000, capacityL: 40_000,  lastUpdated: '31 Oct 2025', status: 'inactive' },
//   { id: 'wh-abuja',   name: 'Abuja Depot',         location: 'Abuja',         fullLocation: 'Wuse, Abuja.',            stockLevelPercent: 92, usedL: 92_000, capacityL: 100_000, lastUpdated: '31 Oct 2025', status: 'active' },
//   { id: 'wh-ph',      name: 'PH Depot',            location: 'Port Harcourt', fullLocation: 'Port Harcourt, Rivers State.', stockLevelPercent: 28, usedL: 14_000, capacityL: 50_000, lastUpdated: '31 Oct 2025', status: 'active' },
// ];

export interface StockSegment {
  label: string;
  percent: number;
}

/** Composition of total stock across product lines, shown in the Total Stock bar + legend. */
// TODO(orval): replace with the aggregate stock-composition query.
export const STOCK_COMPOSITION: StockSegment[] = [
  { label: 'PMS', percent: 85 },
  { label: 'AGO', percent: 10 },
  { label: 'LPG', percent: 5 },
];

export interface WarehouseSummary {
  totalWarehouses: number;
}

export function buildWarehouseSummary(rows: Warehouse[], totalFromStats?: number): WarehouseSummary {
  return { totalWarehouses: totalFromStats ?? rows.length };
}

export type StockTone = 'success' | 'warning' | 'danger';

/** Colour tone for a stock-level bar: full (red) → warning (amber) → healthy (green). */
export function stockLevelTone(percent: number): StockTone {
  if (percent >= 90) return 'danger';
  if (percent >= 80) return 'warning';
  return 'success';
}

// ───────── Edit Warehouse + Stock Transfer ─────────

// TODO(orval): these option lists come from reference endpoints (managers, locations, products).
export const WAREHOUSE_MANAGER_OPTIONS = [
  'Mr Johnson Ekanem',
  'Mrs Grace Obi',
  'Mr Tunde Bakare',
  'Ms Amaka Eze',
] as const;

export const WAREHOUSE_LOCATION_OPTIONS = [
  'Awka, Anambra State.',
  'Onitsha, Anambra State.',
  'Nnewi, Anambra State.',
  'Ajah, Lagos State.',
  'Lekki, Lagos State.',
  'Wuse, Abuja.',
  'Port Harcourt, Rivers State.',
] as const;

export const WAREHOUSE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;

// Suggested names for the Create Warehouse "Warehouse Name" select.
export const WAREHOUSE_NAME_OPTIONS = [
  'Magodo Central',
  'Ikeja Hub',
  'Apapa Terminal',
  'Ikorodu Depot',
  'Yaba Depot',
] as const;

export interface EditWarehouseProduct {
  id: string;
  name: string;
  stockQuantity: string;
  pricePerUnit: string;
  maxStock: string;
  reorderPoint: string;
  storageLocation: string;
}

// TODO(orval): replace with the warehouse's product stock query.
export function defaultWarehouseProducts(): EditWarehouseProduct[] {
  return [
    { id: 'ewp-petrol',   name: 'Petrol',   stockQuantity: '3,000L', pricePerUnit: '700', maxStock: '5000', reorderPoint: '500', storageLocation: '' },
    { id: 'ewp-diesel',   name: 'Diesel',   stockQuantity: '3,000L', pricePerUnit: '700', maxStock: '5000', reorderPoint: '500', storageLocation: '' },
    { id: 'ewp-kerosene', name: 'Kerosene', stockQuantity: '3,000L', pricePerUnit: '700', maxStock: '5000', reorderPoint: '500', storageLocation: '' },
  ];
}

export const TRANSFER_PRODUCT_OPTIONS = [
  'Premium Motor Spirit (PMS)',
  'Automotive Gas Oil (AGO)',
  'Kerosene (DPK)',
  'Liquefied Petroleum Gas (LPG)',
] as const;

/**
 * Mocked warehouse mutation (update / transfer) used to drive the loading overlay.
 */
// TODO(orval): replace with the generated update-warehouse / transfer-stock mutations.
export function mockWarehouseAction(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1_200));
}

// ───────── Transfer History ─────────

export type TransferStatus = 'completed' | 'pending' | 'failed';

export interface TransferRecord {
  id: string;
  productCode: string;
  productName: string;
  fromName: string;
  toName: string;
  quantity: string;
  date: string;
  /** ISO `YYYY-MM-DD` used for the From/To date-range filter. */
  dateValue: string;
  status: TransferStatus;
  initiatedBy: string;
}

// TODO(orval): replace with the generated list-transfers query.
export const TRANSFERS_MOCK: TransferRecord[] = [
  { id: 'TRF-001', productCode: 'AGO', productName: 'Automotive Gas Oil (AGO)',  fromName: 'Lekki Depot', toName: 'Awka Warehouse', quantity: '50,000L', date: 'Mar 22, 2026 · 2:45 PM', dateValue: '2026-03-22', status: 'completed', initiatedBy: 'Ifeoma Eze' },
  { id: 'TRF-002', productCode: 'LPG', productName: 'Liquefied Petroleum Gas (LPG)', fromName: 'Lekki Depot', toName: 'Awka Warehouse', quantity: '50,000L', date: 'Mar 21, 2026 · 2:45 PM', dateValue: '2026-03-21', status: 'pending',   initiatedBy: 'Ifeoma Eze' },
  { id: 'TRF-003', productCode: 'PMS', productName: 'Premium Motor Spirit (PMS)', fromName: 'Lekki Depot', toName: 'Awka Warehouse', quantity: '50,000L', date: 'Mar 20, 2026 · 2:45 PM', dateValue: '2026-03-20', status: 'pending',   initiatedBy: 'Ifeoma Eze' },
  { id: 'TRF-004', productCode: 'PMS', productName: 'Premium Motor Spirit (PMS)', fromName: 'Lekki Depot', toName: 'Awka Warehouse', quantity: '50,000L', date: 'Mar 19, 2026 · 2:45 PM', dateValue: '2026-03-19', status: 'failed',    initiatedBy: 'Ifeoma Eze' },
  { id: 'TRF-005', productCode: 'PMS', productName: 'Premium Motor Spirit (PMS)', fromName: 'Lekki Depot', toName: 'Awka Warehouse', quantity: '50,000L', date: 'Mar 18, 2026 · 2:45 PM', dateValue: '2026-03-18', status: 'failed',    initiatedBy: 'Ifeoma Eze' },
  { id: 'TRF-006', productCode: 'AGO', productName: 'Automotive Gas Oil (AGO)',  fromName: 'Lekki Depot', toName: 'Awka Warehouse', quantity: '50,000L', date: 'Mar 17, 2026 · 2:45 PM', dateValue: '2026-03-17', status: 'completed', initiatedBy: 'Ifeoma Eze' },
  { id: 'TRF-007', productCode: 'LPG', productName: 'Liquefied Petroleum Gas (LPG)', fromName: 'Lekki Depot', toName: 'Awka Warehouse', quantity: '50,000L', date: 'Mar 16, 2026 · 2:45 PM', dateValue: '2026-03-16', status: 'completed', initiatedBy: 'Ifeoma Eze' },
];

export function transferStatusTone(status: TransferStatus): StockTone {
  if (status === 'completed') return 'success';
  if (status === 'failed') return 'danger';
  return 'warning';
}

export const TRANSFER_TIMELINE_STEPS = ['Initiated', 'Processing', 'Completed'] as const;

/** Active step index in the transfer timeline stepper for a given status. */
export function transferTimelineStep(status: TransferStatus): number {
  if (status === 'completed') return 2;
  if (status === 'pending') return 1;
  return 0;
}

// ════════════════════════════════════════════════════════════════
// Domain → view-model mappers (used once real endpoints are wired)
// ════════════════════════════════════════════════════════════════

/** Static manager-name → manager_id mapping until employee list is wired. */
export const MANAGER_ID_MAP: Record<string, string> = {
  'Mr Johnson Ekanem': 'mgr-johnson',
  'Mrs Grace Obi': 'mgr-grace',
  'Mr Tunde Bakare': 'mgr-tunde',
  'Ms Amaka Eze': 'mgr-amaka',
};

export function managerNameToId(name: string): string | undefined {
  return MANAGER_ID_MAP[name];
}

export function managerIdToName(id?: string): string {
  const entry = Object.entries(MANAGER_ID_MAP).find(([, value]) => value === id);
  return entry?.[0] ?? 'Unknown';
}

/** Static product-name → product_id mapping until product catalog is wired. */
export const PRODUCT_ID_MAP: Record<string, string> = {
  'Premium Motor Spirit (PMS)': 'prod-pms',
  'Automotive Gas Oil (AGO)': 'prod-ago',
  'Kerosene (DPK)': 'prod-dpk',
  'Liquefied Petroleum Gas (LPG)': 'prod-lpg',
};

export function productNameToId(name: string): string | undefined {
  return PRODUCT_ID_MAP[name];
}

export function productIdToName(id?: string): string {
  const entry = Object.entries(PRODUCT_ID_MAP).find(([, value]) => value === id);
  return entry?.[0] ?? id ?? 'Unknown';
}

export function productIdToCode(id?: string): string {
  switch (id) {
    case 'prod-pms':
      return 'PMS';
    case 'prod-ago':
      return 'AGO';
    case 'prod-dpk':
      return 'DPK';
    case 'prod-lpg':
      return 'LPG';
    default:
      return id?.toUpperCase() ?? 'N/A';
  }
}

export function toWarehouseViewModel(source: warehouse.Warehouse): Warehouse {
  const capacity = source.capacity ?? 0;
  const percent = source.stock_level_percentage ?? 0;

  // `products` is an additive field on GET /v1/warehouses/{id} — older responses
  // simply omit it, so this map is empty and every product falls back to 0/''.
  const productDetailsById = new Map(
    (source.products ?? [])
      .filter((product) => product.product_id)
      .map((product) => [product.product_id, product]),
  );

  return {
    id: source.warehouse_id ?? '',
    name: source.warehouse_name ?? '',
    location: source.location ?? '',
    fullLocation: source.location ?? '',

    stockLevelPercent: percent,

    usedL:
      capacity > 0
        ? Math.round((capacity * percent) / 100)
        : 0,

    capacityL: capacity,

    lastUpdated: formatDate(
      source.last_updated_at ?? source.updated_at ?? source.created_at,
    ),

    status:
      (source.status as WarehouseStatus) ?? 'inactive',

    managerId: source.manager_id ?? '',

    productPreview:
      source.product_preview?.map((product) => {
        const detail = product.product_id ? productDetailsById.get(product.product_id) : undefined;
        return {
          productId: product.product_id ?? '',
          name: product.name ?? '',
          quantity: product.quantity ?? 0,
          sku: product.sku ?? '',
          unit: product.unit ?? '',
          maxStock: detail?.max_stock ?? 0,
          reorderPoint: detail?.reorder_point ?? 0,
          storageLocation: detail?.storage_location ?? '',
        };
      }) ?? [],
  };
}

export function toTransferRecordViewModel(
  source: warehouse.StockTransfer,
  warehouses: warehouse.Warehouse[] = [],
): TransferRecord {
  const fromWarehouse = warehouses.find((w) => w.warehouse_id === source.from_warehouse_id);
  const toWarehouse = warehouses.find((w) => w.warehouse_id === source.to_warehouse_id);
  const productName = productIdToName(source.product_id);
  const productCode = productIdToCode(source.product_id);
  const quantity = source.quantity ?? 0;
  const date = source.created_at ?? '';

  return {
    id: source.id ?? '',
    productCode,
    productName,
    fromName: fromWarehouse?.warehouse_name ?? source.from_warehouse_id ?? 'Unknown',
    toName: toWarehouse?.warehouse_name ?? source.to_warehouse_id ?? 'Unknown',
    quantity: `${quantity.toLocaleString()}L`,
    date: formatDateTime(date),
    dateValue: date.slice(0, 10),
    status: mapTransferStatus(source.status),
    initiatedBy: source.requested_by ?? 'Unknown',
  };
}

function mapTransferStatus(
  status?: warehouse.StockTransferStatus | string,
): TransferStatus {
  switch (status) {
    case 'confirmed':
      return 'completed';
    case 'failed':
    case 'cancelled':
      return 'failed';
    case 'pending':
    case 'processing':
    default:
      return 'pending';
  }
}

function formatDate(value?: string): string {
  if (!value) return '–';
  try {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}


function formatDateTime(value?: string): string {
  if (!value) return '–';
  try {
    const date = new Date(value);
    return `${date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })} · ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return value;
  }
}
