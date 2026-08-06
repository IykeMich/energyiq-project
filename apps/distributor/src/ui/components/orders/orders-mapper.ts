import type { distributorOrder } from '@energyiq/domain';
import type { OrderRow, OrderStatus, PaymentStatus } from './orders-mocks';

/**
 * Maps a backend DistributorOrderListItem to the OrderRow view model used by the Orders list UI.
 */
export function toOrderRow(source: distributorOrder.DistributorOrderListItem): OrderRow {
  return {
    id: source.distributor_order_id ?? source.distributor_order_number ?? '',
    orderNumber: source.distributor_order_number ?? source.distributor_order_id ?? '',
    date: formatDate(source.distributor_order_date),
    supplier: source.distributor_order_supplier_name ?? 'Supplier',
    items: source.distributor_order_items_count ?? 0,
    amount: source.distributor_order_amount ?? 0,
    status: toOrderStatus(source.distributor_order_status_code),
    payment: toPaymentStatus(source.distributor_payment_status_code),
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

export function toBackendStatus(label: string): string | undefined {
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

export function toPaymentStatus(status?: string): PaymentStatus {
  switch (status) {
    case 'paid':
      return 'Paid';
    case 'cancelled':
    case 'refunded':
      return 'Failed';
    case 'pending':
    default:
      return 'Pending';
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
