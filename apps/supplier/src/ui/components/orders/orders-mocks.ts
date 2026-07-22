import type { order } from '@energyiq/domain';
import { formatDate } from '@energyiq/shared';

// Supplier Orders page. Status vocabulary matches GET /v1/order/list exactly (see
// order.OrderStatus in @energyiq/domain) so table/tab labels never drift from truth.
// "Payment" and a resolved distributor *name* have no backing field on domain.Order
// (only a raw distributor_id — there's no supplier-facing distributor-lookup endpoint
// yet either) — TODO(orval): add a distributor name once that endpoint exists.

export type OrderStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'dispatched'
  | 'received'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface OrderRow {
  id: string;
  /** Display date, formatted from `submitted_at`/`created_at`. */
  date: string;
  /** Raw `distributor_id` — no supplier-facing distributor-name lookup exists yet. */
  distributor: string;
  items: number;
  /** Raw amount in Naira; formatted for display in the table. */
  amount: number;
  status: OrderStatus;
}

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  draft: '#9CA3AF',
  submitted: '#FB8C1C',
  approved: '#388E3C',
  rejected: '#D30A0A',
  dispatched: '#1B22AF',
  received: '#008080',
  completed: '#16A34A',
  cancelled: '#6B7280',
  disputed: '#D97706',
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Approved',
  rejected: 'Rejected',
  dispatched: 'Dispatched',
  received: 'Received',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
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
  { label: 'Submitted', status: 'submitted' },
  { label: 'Approved', status: 'approved' },
  { label: 'Rejected', status: 'rejected' },
  { label: 'Dispatched', status: 'dispatched' },
  { label: 'Received', status: 'received' },
  { label: 'Cancelled', status: 'cancelled' },
];

export interface OrderFilter {
  id: string;
  label: string;
  options: string[];
}

// Presentational filter dropdown above the table. Distributor/payment filters were
// dropped: there's no data to back a distributor-name picker or payment status.
export const ORDER_FILTERS: OrderFilter[] = [
  { id: 'date', label: 'Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
];

const KNOWN_ORDER_STATUSES = new Set<OrderStatus>([
  'draft',
  'submitted',
  'approved',
  'rejected',
  'dispatched',
  'received',
  'completed',
  'cancelled',
  'disputed',
]);

function toOrderStatus(status: order.OrderStatus | string | undefined): OrderStatus {
  return status && KNOWN_ORDER_STATUSES.has(status as OrderStatus) ? (status as OrderStatus) : 'draft';
}

/** `items` has no schema on the API (typed as a bare `object`) — count defensively. */
function countItems(items: order.Order['items']): number {
  if (!items) return 0;
  if (Array.isArray(items)) return items.length;
  return Object.keys(items).length;
}

/** `GET /v1/order/list` row -> the orders table row shape. */
export function mapOrderToRow(source: order.Order): OrderRow {
  const timestamp = source.submitted_at ?? source.created_at;
  return {
    id: source.order_number ?? source.id ?? '',
    date: timestamp ? formatDate(timestamp) : '—',
    distributor: source.distributor_id ?? 'Unknown',
    items: countItems(source.items),
    amount: source.total ?? 0,
    status: toOrderStatus(source.status),
  };
}

/** Builds the status tabs (with real counts) from `GET /v1/order/list/stats`. */
export function mapOrderStatsToTabs(stats: order.OrderStats | undefined): OrderStatusTab[] {
  return ORDER_STATUS_TAB_DEFS.map((def) => ({
    ...def,
    count: def.status ? (stats?.[def.status] ?? 0) : (stats?.total ?? 0),
  }));
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
