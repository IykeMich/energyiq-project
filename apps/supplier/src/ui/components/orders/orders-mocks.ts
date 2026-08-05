import type { order } from '@energyiq/domain';
import { formatDate } from '@energyiq/shared';
import { CheckCircle2, PackageCheck, Send, TrendingUp, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Supplier Orders page. Status/payment vocabulary matches GET /v1/order/list exactly
// (see order.OrderStatus/order.PaymentStatus in @energyiq/domain) so table/tab labels
// never drift from truth.

export type OrderStatus = order.OrderStatus;
export type PaymentStatus = order.PaymentStatus;

export interface OrderRow {
  id: string;
  /** Display date, formatted from `supplier_order_date`. */
  date: string;
  distributor: string;
  items: number;
  /** Raw amount in Naira; formatted for display in the table. */
  amount: number;
  status: OrderStatus;
  payment: PaymentStatus;
}

/** Badge text color per payment status; the badge background reuses the same hue at low opacity. */
export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  paid: '#388E3C',
  pending: '#FB8C1C',
  refunded: '#1B22AF',
  cancelled: '#6B7280',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: '#9CA3AF',
  awaiting_approval: '#FB8C1C',
  approved: '#388E3C',
  awaiting_payment: '#FB8C1C',
  paid: '#388E3C',
  processing: '#1B22AF',
  dispatched: '#1B22AF',
  delivered: '#008080',
  completed: '#16A34A',
  rejected: '#D30A0A',
  cancelled: '#6B7280',
  partially_returned: '#D97706',
  returned: '#D97706',
  refunded: '#D97706',
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  awaiting_approval: 'Pending',
  approved: 'Approved',
  awaiting_payment: 'Awaiting Payment',
  paid: 'Paid',
  processing: 'Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  partially_returned: 'Partially Returned',
  returned: 'Returned',
  refunded: 'Refunded',
};

/** Leading badge glyph per status — mirrors the design's icon-per-status pairing (checkmark/trend/send/box/close). */
export const ORDER_STATUS_ICON: Record<OrderStatus, LucideIcon> = {
  pending: TrendingUp,
  awaiting_approval: TrendingUp,
  approved: CheckCircle2,
  awaiting_payment: TrendingUp,
  paid: CheckCircle2,
  processing: Send,
  dispatched: Send,
  delivered: PackageCheck,
  completed: CheckCircle2,
  rejected: XCircle,
  cancelled: XCircle,
  partially_returned: XCircle,
  returned: XCircle,
  refunded: XCircle,
};

export const PAYMENT_STATUS_ICON: Record<PaymentStatus, LucideIcon> = {
  paid: CheckCircle2,
  pending: TrendingUp,
  refunded: XCircle,
  cancelled: XCircle,
};

export interface OrderStatusTab {
  label: string;
  /** Status this tab filters by; omitted for "All". */
  status?: OrderStatus;
  count: number;
}

/** The status tabs shown on the orders table, in display order — "All" first. */
export const ORDER_STATUS_TAB_DEFS: Omit<OrderStatusTab, 'count'>[] = [
  { label: 'All' },
  { label: 'Pending', status: 'pending' },
  { label: 'Approved', status: 'approved' },
  { label: 'Rejected', status: 'rejected' },
  { label: 'Delivered', status: 'delivered' },
  { label: 'Dispatched', status: 'dispatched' },
  { label: 'Cancelled', status: 'cancelled' },
];

/** Extra `OrderStats` keys folded into a tab's count beyond its own `status`. */
const TAB_COUNT_EXTRAS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ['awaiting_approval'],
  delivered: ['completed'],
};

export interface OrderFilter {
  id: string;
  label: string;
  options: string[];
}

// Presentational filter dropdowns above the table. The Distributor filter is rendered
// separately (its options come from the real distributor list, not this static array).
export const ORDER_FILTERS: OrderFilter[] = [
  { id: 'date', label: 'Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
  { id: 'payment', label: 'Payment Status', options: ['Paid', 'Pending', 'Refunded', 'Cancelled'] },
];

const KNOWN_ORDER_STATUSES = new Set<OrderStatus>([
  'pending',
  'awaiting_approval',
  'approved',
  'awaiting_payment',
  'paid',
  'processing',
  'dispatched',
  'delivered',
  'completed',
  'rejected',
  'cancelled',
  'partially_returned',
  'returned',
  'refunded',
]);

export function toOrderStatus(status: order.OrderStatus | string | undefined): OrderStatus {
  return status && KNOWN_ORDER_STATUSES.has(status as OrderStatus) ? (status as OrderStatus) : 'pending';
}

const KNOWN_PAYMENT_STATUSES = new Set<PaymentStatus>(['pending', 'paid', 'refunded', 'cancelled']);

function toPaymentStatus(status: order.PaymentStatus | string | undefined): PaymentStatus {
  return status && KNOWN_PAYMENT_STATUSES.has(status as PaymentStatus)
    ? (status as PaymentStatus)
    : 'pending';
}

/** `GET /v1/order/list` row -> the orders table row shape. */
export function mapOrderToRow(source: order.Order): OrderRow {
  return {
    id: source.supplier_order_id ?? source.supplier_order_reference ?? '',
    date: source.supplier_order_date ? formatDate(source.supplier_order_date) : '—',
    distributor: source.supplier_distributor_name ?? 'Unknown',
    items: source.supplier_order_items_count ?? 0,
    amount: source.supplier_order_amount ?? 0,
    status: toOrderStatus(source.supplier_order_status_code),
    payment: toPaymentStatus(source.supplier_payment_status_code),
  };
}

/** Builds the status tabs (with real counts) from `GET /v1/order/list/stats`. */
export function mapOrderStatsToTabs(stats: order.OrderStats | undefined): OrderStatusTab[] {
  return ORDER_STATUS_TAB_DEFS.map((def) => {
    if (!def.status) return { ...def, count: stats?.total ?? 0 };
    const extras = TAB_COUNT_EXTRAS[def.status] ?? [];
    const count = [def.status, ...extras].reduce((sum, status) => sum + (stats?.[status] ?? 0), 0);
    return { ...def, count };
  });
}

/** `Today` / `This Week` / `This Month` / `This Year` -> `{ date_from, date_to }` (YYYY-MM-DD). */
export function dateFilterToRange(option: string | null): { date_from?: string; date_to?: string } {
  if (!option) return {};
  const now = new Date();
  const toIso = (date: Date) => date.toISOString().slice(0, 10);
  const start = new Date(now);

  switch (option) {
    case 'Today':
      break;
    case 'This Week':
      start.setDate(now.getDate() - now.getDay());
      break;
    case 'This Month':
      start.setDate(1);
      break;
    case 'This Year':
      start.setMonth(0, 1);
      break;
    default:
      return {};
  }

  return { date_from: toIso(start), date_to: toIso(now) };
}
