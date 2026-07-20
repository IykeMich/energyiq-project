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
  const statusBadge = toStatusBadge(source.status);
  const items = toLineItems(source.items);
  const timeline = buildTimeline(source);

  return {
    orderId: source.order_number ?? source.id ?? '',
    status: statusBadge,
    info: {
      orderId: source.order_number ?? source.id ?? '',
      purchaseDate: formatDateTime(source.created_at),
      paymentStatus: { label: 'Pending', color: WARNING },
      amount: formatCurrency(source.total ?? 0),
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
      { label: 'Order Note:', value: source.notes || 'N/A' },
      { label: 'Depot Location:', value: '-' },
    ],
    payment: [
      { label: 'Subtotal:', value: formatCurrency(source.subtotal ?? 0) },
      { label: 'Discount:', value: formatCurrency(source.discount ?? 0) },
      { label: 'Shipping Fee:', value: '₦0' },
      { label: 'Tax:', value: '₦0' },
    ],
    total: { label: 'Total:', value: formatCurrency(source.total ?? 0) },
    help: { supportEmail: 'support@energyiq.com', emergencyLine: '+2348001234567' },
  };
}

function toStatusBadge(status?: string): OrderDetailBadge {
  switch (status?.toLowerCase()) {
    case 'approved':
      return { label: 'Approved', color: SUCCESS };
    case 'rejected':
      return { label: 'Rejected', color: DANGER };
    case 'dispatched':
      return { label: 'Dispatched', color: INFO };
    case 'received':
    case 'completed':
      return { label: 'Delivered', color: TEAL };
    case 'cancelled':
      return { label: 'Cancelled', color: DANGER };
    case 'submitted':
    default:
      return { label: 'Awaiting Approval', color: WARNING };
  }
}

function toLineItems(items?: order.Order['items']): OrderLineItem[] {
  if (!items) return [];
  if (Array.isArray(items)) {
    return items.map((item, index) => {
      const product = item as Record<string, unknown>;
      return {
        name: (product.name as string) || `Product ${index + 1}`,
        unitPrice: formatCurrency((product.unit_price as number) ?? 0),
        amount: formatCurrency((product.amount as number) ?? 0),
      };
    });
  }
  return Object.entries(items).map(([key, value]) => ({
    name: key,
    unitPrice: '-',
    amount: String(value),
  }));
}

function buildTimeline(source: order.Order): OrderTimelineStep[] {
  const steps: { label: string; date?: string; Icon: LucideIcon }[] = [
    { label: 'Order submitted by distributor', date: source.submitted_at ?? source.created_at, Icon: Check },
    { label: 'Supplier approval', date: source.approved_at, Icon: Check },
    { label: 'Payment Verification', Icon: RefreshCcw },
    { label: 'Dispatch', date: source.dispatched_at, Icon: Boxes },
    { label: 'Delivery', date: source.received_at, Icon: Home },
  ];

  return steps.map((step) => ({
    label: step.label,
    detail: step.date ? formatDateTime(step.date) : 'Pending',
    done: Boolean(step.date),
    Icon: step.Icon,
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
  const normalized = status?.toLowerCase();
  return {
    canApprove: normalized === 'submitted',
    canReject: normalized === 'submitted',
    canCancel: normalized !== 'cancelled' && normalized !== 'completed' && normalized !== 'received',
    canDispatch: normalized === 'approved',
    canReceive: normalized === 'dispatched',
    canModify: normalized === 'submitted' || normalized === 'draft',
  };
}
