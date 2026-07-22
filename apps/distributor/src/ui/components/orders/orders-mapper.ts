import type { order } from '@energyiq/domain';
import type { OrderRow, OrderStatus } from './orders-mocks';

/**
 * Maps a backend DomainOrder to the OrderRow view model used by the Orders list UI.
 */
export function toOrderRow(source: order.Order): OrderRow {
  return {
    id: source.id ?? source.order_number ?? '',
    orderNumber: source.order_number ?? source.id ?? '',
    date: formatDate(source.created_at),
    supplier: 'Supplier', // Backend does not expose supplier name on the list item yet.
    items: countItems(source.items),
    amount: source.total ?? 0,
    status: toOrderStatus(source.status),
    payment: 'Pending', // Payment status not exposed by backend order endpoints yet.
  };
}

export function toOrderStatus(status?: string): OrderStatus {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'Approved';
    case 'dispatched':
      return 'Dispatched';
    case 'submitted':
    case 'draft':
      return 'Pending';
    case 'received':
    case 'completed':
      return 'Delivered';
    case 'rejected':
      return 'Rejected';
    case 'cancelled':
    default:
      // Cancelled is not in the original OrderStatus union, so fall back to Pending.
      return 'Pending';
  }
}

export function toBackendStatus(label: string): order.OrderStatus | undefined {
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
    default:
      return undefined;
  }
}

function countItems(items?: order.Order['items']): number {
  if (!items || typeof items !== 'object') return 0;
  if (Array.isArray(items)) return items.length;
  return Object.keys(items).length;
}

function formatDate(value?: string): string {
  if (!value) return '-';
  try {
    const date = new Date(value);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, '-');
  } catch {
    return value;
  }
}
