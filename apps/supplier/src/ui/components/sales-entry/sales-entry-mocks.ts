// Replica data for the supplier Sales Entry page design.
// TODO(orval): replace each block with the matching generated query hook once the API lands.

export type SalesStatus = 'Cleared' | 'Pending' | 'Failed';

export interface SalesRow {
  id: string;
  /** Distributor company name shown on the first line of the Distributor cell. */
  distributor: string;
  /** Distributor reference shown as "ID: …" on the second line. */
  distributorId: string;
  /** Display date as shown in the design (e.g. "Jan 28"). */
  date: string;
  /** Sold product code (PMS, AGO, LPG 12.5kg, …). */
  product: string;
  /** Quantity carries its own unit suffix in the design (e.g. "22,000L", "240 units"). */
  quantity: string;
  /** Raw amount in Naira; formatted to the design's compact "₦214.8M" in the table. */
  amount: number;
  payment: string;
  status: SalesStatus;
}

// The first rows mirror the design exactly; the remainder repeat the sample so the
// footer reads "of 70 Entries". TODO(orval): replace with the sales query hook.
const SALES_SAMPLE: Omit<SalesRow, 'id'>[] = [
  { distributor: 'Apex Energy Ltd', distributorId: 'DIST-0021', date: 'Jan 28', product: 'LPG 12.5kg', quantity: '240 units', amount: 214_800_000, payment: 'Bank Transfer', status: 'Cleared' },
  { distributor: 'NorthFlow Gas', distributorId: 'DIST-005', date: 'Jan 28', product: 'PMS', quantity: '15,000L', amount: 172_200_000, payment: 'Bank Transfer', status: 'Cleared' },
  { distributor: 'Delta Petroleum', distributorId: 'DIST-0025', date: 'Jan 28', product: 'AGO', quantity: '8,000L', amount: 128_700_000, payment: 'Bank Transfer', status: 'Cleared' },
  { distributor: 'East Coast Fuel', distributorId: 'DIST-0021', date: 'Jan 28', product: 'PMS', quantity: '22,000L', amount: 101_000_000, payment: 'Bank Transfer', status: 'Cleared' },
  { distributor: 'East Coast Fuel', distributorId: 'DIST-0021', date: 'Jan 28', product: 'PMS', quantity: '22,000L', amount: 101_000_000, payment: 'Bank Transfer', status: 'Cleared' },
  { distributor: 'East Coast Fuel', distributorId: 'DIST-0021', date: 'Jan 28', product: 'PMS', quantity: '22,000L', amount: 101_000_000, payment: 'Bank Transfer', status: 'Cleared' },
];

export const SALES_MOCK: SalesRow[] = Array.from({ length: 70 }, (_, index) => ({
  id: `SALE-${String(index + 1).padStart(3, '0')}`,
  ...SALES_SAMPLE[index % SALES_SAMPLE.length],
}));

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const SALES_STATUS_COLOR: Record<SalesStatus, string> = {
  Cleared: '#388E3C',
  Pending: '#FB8C1C',
  Failed: '#D30A0A',
};

export type SalesKpiTrend = 'up' | 'stable';

export interface SalesKpi {
  label: string;
  value: string;
  /** Optional change indicator shown beside the value. */
  delta?: { label: string; trend: SalesKpiTrend };
}

// TODO(orval): source these figures from the sales summary endpoint.
export const SALES_KPIS: SalesKpi[] = [
  { label: 'Total Sales:', value: '₦847M', delta: { label: '22% YoY', trend: 'up' } },
  { label: 'Total Volume Sold:', value: '78,250 L', delta: { label: '11%', trend: 'up' } },
  { label: 'Top Product:', value: 'PMS' },
  { label: 'Voided Transactions:', value: '-', delta: { label: 'Stable', trend: 'stable' } },
];

export interface SalesFilter {
  id: string;
  label: string;
  options: string[];
}

// Presentational filter dropdowns above the report card.
// TODO(orval): source these option lists from their reference endpoints.
export const SALES_FILTERS: SalesFilter[] = [
  { id: 'distributor', label: 'Distributor', options: ['Apex Energy Ltd', 'NorthFlow Gas', 'Delta Petroleum', 'East Coast Fuel'] },
  { id: 'products', label: 'Products', options: ['PMS', 'AGO', 'LPG 12.5kg'] },
  { id: 'status', label: 'Status', options: ['Cleared', 'Pending', 'Failed'] },
  { id: 'from-date', label: 'From Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
  { id: 'to-date', label: 'To Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
];

/** Heading shown above the table; static for the mock. TODO(orval): derive from the active period. */
export const SALES_REPORT_TITLE = 'Sales by Distributor - Q1 2026';

/**
 * Compact Naira formatter matching the design ("₦214.8M", "₦847M").
 * Trims a trailing ".0" so whole millions read "₦847M" not "₦847.0M".
 */
export function formatNairaCompact(amount: number): string {
  const millions = amount / 1_000_000;
  const rounded = millions.toFixed(1).replace(/\.0$/, '');
  return `₦${rounded}M`;
}

/** Full Naira formatter with thousands separators ("₦4,200,000", "₦650"). */
const NAIRA = new Intl.NumberFormat('en-NG');

export function formatNaira(amount: number): string {
  return `₦${NAIRA.format(amount)}`;
}

/** Distributor profile shown in the upper card of the Transaction Detail modal. */
export interface SalesTransactionDistributor {
  name: string;
  /** e.g. "Enugu · Gold tier". */
  location: string;
  /** Pre-formatted lifetime stats shown verbatim from the design. */
  accountValue: string;
  purchases: string;
  activeSince: string;
  /** KYC clearance label; rendered as a green badge when "Verified". */
  kycStatus: string;
}

/** Transaction breakdown shown in the lower card of the Transaction Detail modal. */
export interface SalesTransactionSummary {
  transactionId: string;
  dateTime: string;
  product: string;
  /** Raw unit price in Naira; formatted for display. */
  unitPrice: number;
  /** Raw total amount in Naira; formatted for display. */
  totalAmount: number;
  paymentMethod: string;
  status: SalesStatus;
}

export interface SalesTransactionDetail {
  distributor: SalesTransactionDistributor;
  summary: SalesTransactionSummary;
}

/** KYC "Verified" badge hue (green, matching the design). */
export const SALES_KYC_VERIFIED_COLOR = '#2E7D32';

// TODO(orval): fetch the transaction detail by id. For now every row resolves to the
// single design-accurate record so the detail modal can be built and reviewed.
const SALES_TRANSACTION_DETAIL: SalesTransactionDetail = {
  distributor: {
    name: 'Apex Energy Ltd',
    location: 'Enugu · Gold tier',
    accountValue: '₦2.1M',
    purchases: '₦550K',
    activeSince: 'Apr 2025',
    kycStatus: 'Verified',
  },
  summary: {
    transactionId: 'TXN-20260128-00412',
    dateTime: 'Jan 28, 2026 · 09:12 AM',
    product: 'PMS × 200L',
    unitPrice: 650,
    totalAmount: 4_200_000,
    paymentMethod: 'Bank transfer',
    status: 'Cleared',
  },
};

/** Returns the single mocked transaction detail regardless of id. TODO(orval): fetch by id. */
export function getSalesTransactionDetail(_id: string): SalesTransactionDetail {
  return SALES_TRANSACTION_DETAIL;
}

export interface SalesSelectOption {
  value: string;
  label: string;
}

export interface SalesExportColumn {
  id: string;
  label: string;
}

/** Chosen settings emitted when the user submits the Configure Export form. */
export interface SalesExportConfig {
  format: string;
  columns: string[];
  groupBy: string;
}

// TODO(orval): source the supported export formats from the reports endpoint.
export const EXPORT_FORMATS: SalesSelectOption[] = [
  { value: 'csv', label: 'CSV (.csv)' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
];

// TODO(orval): source the exportable columns from the reports schema.
export const EXPORT_COLUMNS: SalesExportColumn[] = [
  { id: 'date-time', label: 'Date & time' },
  { id: 'distributor', label: 'Distributor name & ID' },
  { id: 'product', label: 'Product, quantity & unit price' },
  { id: 'amount', label: 'Amount & payment status' },
  { id: 'bank-reference', label: 'Bank Reference' },
];

// TODO(orval): source the grouping options from the reports endpoint.
export const EXPORT_GROUP_BY: SalesSelectOption[] = [
  { value: 'none', label: 'None' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'product', label: 'Product' },
  { value: 'date', label: 'Date' },
];

export interface SalesExportProgressMeta {
  dateRange: string;
  transactionsProcessed: number;
}

// TODO(orval): derive from the active filters and the export job response.
export const EXPORT_PROGRESS_META: SalesExportProgressMeta = {
  dateRange: 'Jan 1-31, 2026',
  transactionsProcessed: 1384,
};
