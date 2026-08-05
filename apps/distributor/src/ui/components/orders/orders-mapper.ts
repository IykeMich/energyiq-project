import type { order } from '@energyiq/domain';
import type { OrderRow, OrderStatus } from './orders-mocks';

/**
 * Maps a backend DomainOrder to the OrderRow view model used by the Orders list UI.
 */
export function toOrderRow(source: order.Order): OrderRow {
  return {
    id: source.supplier_order_id ?? source.supplier_order_reference ?? '',
    orderNumber: source.supplier_order_reference ?? source.supplier_order_id ?? '',
    date: formatDate(source.supplier_order_date),
    supplier: 'Supplier', // Backend does not expose supplier name on the list item yet.
    items: source.supplier_order_items_count ?? 0,
    amount: source.supplier_order_amount ?? 0,
    status: toOrderStatus(source.supplier_order_status_code),
    payment: 'Pending', // Payment status not exposed by backend order endpoints yet.
  };
}

export function toOrderStatus(status?: string): OrderStatus {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'dispatched':
      return 'Dispatched';
    case 'pending':
    case 'awaiting_approval':
      return 'Pending';
    case 'delivered':
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
      return 'pending';
    case 'Approved':
      return 'approved';
    case 'Rejected':
      return 'rejected';
    case 'Dispatched':
      return 'dispatched';
    case 'Delivered':
      return 'delivered';
    default:
      return undefined;
  }
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
