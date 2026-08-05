import { Check, RefreshCcw, Boxes, Home, type LucideIcon } from 'lucide-react';
import type { order } from '@energyiq/domain';
import type { OrderDetailData, OrderDetailBadge, OrderLineItem, OrderTimelineStep } from './order-detail-mocks';

const SUCCESS = '#388E3C';
const WARNING = '#FB8C1C';
const DANGER = '#D30A0A';
const INFO = '#1B22AF';
const TEAL = '#008080';

/**
 * Maps a backend DomainOrder to the OrderDetailData view model used by the
 * order detail UI. Fields not yet exposed by the backend are defaulted.
 */
export function toOrderDetailData(source: order.Order): OrderDetailData {
  const statusBadge = toStatusBadge(source.supplier_order_status_code);
  const items = toLineItems(source.supplier_order_items);
  const timeline = buildTimeline(source);

  return {
    orderId: source.supplier_order_reference ?? source.supplier_order_id ?? '',
    status: statusBadge,
    info: {
      orderId: source.supplier_order_id ?? source.supplier_order_reference ?? '',
      purchaseDate: formatDateTime(source.supplier_order_date),
      paymentStatus: { label: 'Pending', color: WARNING },
      amount: formatCurrency(source.supplier_order_amount ?? 0),
      paymentMethod: 'Card',
      deliveryStatus: statusBadge,
      estimatedDeliveryDate: 'N/A',
    },
    items,
    timeline,
    supplier: [
      { label: 'Name:', value: 'Supplier' },
      { label: 'Email Address:', value: '-' },
      { label: 'Phone Number:', value: '-' },
      { label: 'Order Note:', value: source.supplier_order_notes || 'N/A' },
      { label: 'Depot Location:', value: '-' },
    ],
    payment: [
      { label: 'Subtotal:', value: formatCurrency(source.supplier_order_subtotal ?? 0) },
      { label: 'Discount:', value: formatCurrency(source.supplier_order_discount ?? 0) },
      { label: 'Shipping Fee:', value: '₦0' },
      { label: 'Tax:', value: '₦0' },
    ],
    total: { label: 'Total:', value: formatCurrency(source.supplier_order_amount ?? 0) },
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

function toLineItems(items?: order.OrderLineItem[]): OrderLineItem[] {
  if (!items) return [];
  return items.map((item, index) => ({
    name: item.supplier_product_name || `Product ${index + 1}`,
    unitPrice: formatCurrency(item.supplier_unit_price ?? 0),
    amount: formatCurrency(item.supplier_sub_total ?? 0),
  }));
}

function buildTimeline(source: order.Order): OrderTimelineStep[] {
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

  return (source.supplier_order_timeline ?? []).map((step) => ({
    label: step.supplier_order_timeline_step_label ?? '',
    detail: step.supplier_order_timeline_step_state === 'completed' ? 'Completed' : 'Pending',
    done: step.supplier_order_timeline_step_state === 'completed',
    Icon: iconForStep(step.supplier_order_timeline_step_code),
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
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  canDispatch: boolean;
  canReceive: boolean;
  canModify: boolean;
} {
  return {
    canApprove: status === 'pending' || status === 'awaiting_approval',
    canReject: status === 'pending' || status === 'awaiting_approval',
    canCancel: status !== 'cancelled' && status !== 'completed' && status !== 'delivered',
    canDispatch: status === 'approved',
    canReceive: status === 'dispatched',
    canModify: status === 'pending' || status === 'awaiting_approval',
  };
}
