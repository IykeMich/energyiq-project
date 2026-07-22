import type { order } from '@energyiq/domain';
import type { OrderRow, OrderStatus, OrderStatusTab } from './orders-types';

/** Maps backend order status values to the display labels used by the supplier table. */
export function toOrderStatus(status?: string): OrderStatus {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'Approved';
    case 'dispatched':
      return 'Dispatched';
    case 'received':
    case 'completed':
      return 'Delivered';
    case 'rejected':
      return 'Rejected';
    case 'cancelled':
      return 'Cancelled';
    case 'draft':
    case 'submitted':
    default:
      return 'Pending';
  }
}

export function toDisplayDate(value?: string): string {
  if (!value) return '-';
  try {
    const date = new Date(value);
    return date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(/ /g, '-');
  } catch {
    return value;
  }
}

export function countItems(items?: order.Order['items']): number {
  if (!items || typeof items !== 'object') return 0;
  if (Array.isArray(items)) return items.length;
  return Object.keys(items).length;
}

/** Maps a backend DomainOrder to the supplier OrderRow view model. */
export function toOrderRow(source: order.Order): OrderRow {
  return {
    id: source.id ?? source.order_number ?? '',
    date: toDisplayDate(source.created_at),
    distributor: 'Distributor', // Backend does not expose distributor name on the list item yet.
    items: countItems(source.items),
    amount: source.total ?? 0,
    status: toOrderStatus(source.status),
    payment: 'Pending', // Payment status not exposed by backend order endpoints yet.
  };
}

/**
 * Builds the status tab list from the backend stats payload.
 * Order matches the design: All, Pending, Approved, Rejected, Delivered, Dispatched, Cancelled.
 */
export function buildStatusTabs(stats?: order.OrderStats): OrderStatusTab[] {
  const safe = (value?: number) => value ?? 0;
  const byStatus = {
    Pending: safe(stats?.draft) + safe(stats?.submitted),
    Approved: safe(stats?.approved),
    Rejected: safe(stats?.rejected),
    Delivered: safe(stats?.received) + safe(stats?.completed),
    Dispatched: safe(stats?.dispatched),
    Cancelled: safe(stats?.cancelled),
  };
  const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
  return [
    { label: 'All', count: total },
    { label: 'Pending', count: byStatus.Pending },
    { label: 'Approved', count: byStatus.Approved },
    { label: 'Rejected', count: byStatus.Rejected },
    { label: 'Delivered', count: byStatus.Delivered },
    { label: 'Dispatched', count: byStatus.Dispatched },
    { label: 'Cancelled', count: byStatus.Cancelled },
  ];
}

/** Maps a display tab label to the backend status filter value. */
export function toBackendStatus(label: OrderStatus | 'All'): order.OrderStatus | undefined {
  switch (label) {
    case 'Pending':
      return 'submitted';
    case 'Approved':
      return 'approved';
    case 'Rejected':
      return 'rejected';
    case 'Dispatched':
      return 'dispatched';
    case 'Delivered':
      return 'received';
    case 'Cancelled':
      return 'cancelled';
    default:
      return undefined;
  }
}
