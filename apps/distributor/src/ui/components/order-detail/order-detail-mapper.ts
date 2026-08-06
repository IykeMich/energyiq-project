import { Check, RefreshCcw, Boxes, Home, type LucideIcon } from 'lucide-react';
import type { distributorOrder } from '@energyiq/domain';
import type { OrderDetailData, OrderDetailBadge, OrderLineItem, OrderTimelineStep } from './order-detail-mocks';

const SUCCESS = '#388E3C';
const WARNING = '#FB8C1C';
const DANGER = '#D30A0A';
const INFO = '#1B22AF';
const TEAL = '#008080';

/**
 * Maps a backend DistributorOrderDetail to the OrderDetailData view model used by the
 * order detail UI. Fields not yet exposed by the backend are defaulted.
 */
export function toOrderDetailData(source: distributorOrder.DistributorOrderDetail): OrderDetailData {
  const statusBadge = toStatusBadge(source.distributor_order_status_code);
  const items = toLineItems(source.distributor_order_items);
  const timeline = buildTimeline(source);

  return {
    orderId: source.distributor_order_number ?? source.distributor_order_id ?? '',
    status: statusBadge,
    info: {
      orderId: source.distributor_order_id ?? source.distributor_order_number ?? '',
      purchaseDate: formatDateTime(source.distributor_order_date),
      paymentStatus: toPaymentBadge(source.distributor_payment_status_code),
      amount: formatCurrency(source.distributor_order_amount ?? 0),
      paymentMethod: source.distributor_payment_method || 'Card',
      deliveryStatus: statusBadge,
      estimatedDeliveryDate: source.distributor_estimated_delivery
        ? formatDateTime(source.distributor_estimated_delivery)
        : 'N/A',
    },
    items,
    timeline,
    supplier: [
      { label: 'Name:', value: source.distributor_order_supplier_name || 'Supplier' },
      { label: 'Email Address:', value: source.distributor_contact_email || '-' },
      { label: 'Phone Number:', value: source.distributor_contact_phone || '-' },
      { label: 'Order Note:', value: source.distributor_order_notes || 'N/A' },
      { label: 'Depot Location:', value: source.distributor_delivery_address || '-' },
    ],
    payment: [
      { label: 'Subtotal:', value: formatCurrency(source.distributor_order_subtotal ?? 0) },
      { label: 'Discount:', value: formatCurrency(source.distributor_order_discount ?? 0) },
      { label: 'Shipping Fee:', value: '₦0' },
      { label: 'Tax:', value: '₦0' },
    ],
    total: { label: 'Total:', value: formatCurrency(source.distributor_order_amount ?? 0) },
    help: { supportEmail: 'support@energyiq.com', emergencyLine: '+2348001234567' },
  };
}

function toStatusBadge(status?: string): OrderDetailBadge {
  switch (status) {
    case 'approved':
      return { label: 'Approved', color: SUCCESS };
    case 'rejected':
      return { label: 'Rejected', color: DANGER };
    case 'dispatched':
      return { label: 'Dispatched', color: INFO };
    case 'delivered':
    case 'completed':
      return { label: 'Delivered', color: TEAL };
    case 'cancelled':
      return { label: 'Cancelled', color: DANGER };
    case 'pending':
    case 'awaiting_approval':
    default:
      return { label: 'Awaiting Approval', color: WARNING };
  }
}

function toPaymentBadge(status?: string): OrderDetailBadge {
  switch (status) {
    case 'paid':
      return { label: 'Paid', color: SUCCESS };
    case 'cancelled':
    case 'refunded':
      return { label: 'Failed', color: DANGER };
    case 'pending':
    default:
      return { label: 'Pending', color: WARNING };
  }
}

function toLineItems(items?: distributorOrder.DistributorOrderLineItem[]): OrderLineItem[] {
  if (!items) return [];
  return items.map((item, index) => ({
    name: item.distributor_product_name || `Product ${index + 1}`,
    unitPrice: formatCurrency(item.distributor_unit_price ?? 0),
    amount: formatCurrency(item.distributor_sub_total ?? 0),
  }));
}

function buildTimeline(source: distributorOrder.DistributorOrderDetail): OrderTimelineStep[] {
  const iconForStep = (code?: string): LucideIcon => {
    switch (code) {
      case 'dispatched':
        return Boxes;
      case 'delivered':
      case 'completed':
        return Home;
      case 'awaiting_payment':
      case 'paid':
        return RefreshCcw;
      default:
        return Check;
    }
  };

  return (source.distributor_order_timeline ?? []).map((step) => ({
    label: step.distributor_order_timeline_step_label ?? '',
    detail: step.distributor_order_timeline_step_state === 'complete' ? 'Completed' : 'Pending',
    done: step.distributor_order_timeline_step_state === 'complete',
    Icon: iconForStep(step.distributor_order_timeline_step_code),
  }));
}

function formatDateTime(value?: string): string {
  if (!value) return 'N/A';
  try {
    const date = new Date(value);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ' | ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return value;
  }
}

function formatCurrency(value: number): string {
  return `₦${value.toLocaleString('en-NG')}`;
}

export function getAvailableActions(status?: string): {
  canCancel: boolean;
  canReceive: boolean;
  canModify: boolean;
} {
  return {
    canCancel: status !== 'cancelled' && status !== 'completed' && status !== 'delivered',
    canReceive: status === 'dispatched',
    canModify: status === 'pending' || status === 'awaiting_approval',
  };
}
