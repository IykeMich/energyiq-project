import type { order } from '@energyiq/domain';
import { formatDate } from '@energyiq/shared';

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'modified'
  | 'disputed'
  | 'cancelled';

/** Fulfillment stage shown on the Order Details page, driving the header pill + actions. */
export type OrderDetailStage = 'awaiting_approval' | 'awaiting_delivery' | 'rejected';

export type PaymentStatus = 'paid' | 'unpaid' | 'pending' | 'failed';

export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered';

export interface Order {
  id: string;
  date: string;
  distributor: string;
  items: number;
  amountNGN: number;
  status: OrderStatus;
  payment: PaymentStatus;
}

// ───────── Order Detail ─────────

export interface OrderLineItem {
  id: string;
  productId: string;
  name: string; // "Diesel (AGO)"
  quantityLabel: string; // "10,000 Litres"
  quantity: number;
  unit: string; // "L" | "Units"
  unitPriceNGN: number;
  totalNGN: number;
}

export interface OrderTimelineEvent {
  status: 'completed' | 'pending' | 'rejected';
  label: string;
  timestamp?: string;
}

export interface OrderDistributorInfo {
  name: string;
  email: string;
  phone: string;
  orderNote: string;
}

export interface OrderShippingInfo {
  email: string;
  phone: string;
}

export interface OrderPaymentBreakdown {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  method: string;
}

export interface OrderDelivery {
  status: DeliveryStatus;
  estimatedDate: string;
}

export interface OrderDetail {
  summary: Order;
  lineItems: OrderLineItem[];
  timeline: OrderTimelineEvent[];
  distributor: OrderDistributorInfo;
  shipping: OrderShippingInfo;
  payment: OrderPaymentBreakdown;
  delivery: OrderDelivery;
  tierLabel: string;
  requestedDeliveryDate: string;
}

export const REJECT_REASONS = [
  'Insufficient Stock',
  'Out of stock',
  'Pricing mismatch',
  'Distributor on hold',
  'Quantity exceeds limit',
  'Other',
] as const;

// TODO(orval): replace with a real "add product to order" catalog endpoint once one exists.
export const ADDABLE_PRODUCTS = [
  { id: 'prod-pms', name: 'Premium Motor Spirit (PMS)', unit: 'L', unitPriceNGN: 630 },
  { id: 'prod-ago', name: 'Automotive Gas Oil (Diesel)', unit: 'L', unitPriceNGN: 730 },
  { id: 'prod-dpk', name: 'Dual Purpose Kerosene', unit: 'L', unitPriceNGN: 550 },
  { id: 'prod-lub', name: 'Lubricant Oil (20L Kegs)', unit: 'Units', unitPriceNGN: 5_000 },
] as const;

// ───────── Order Dispatch (Approve Order flow) ─────────

export interface OrderDispatchSummary {
  orderTotalNGN: number;
  totalItems: number;
  paymentLabel: string;
  inventoryLabel: string;
}

export interface OrderDispatchDelivery {
  recipient: string;
  address: string;
  phone: string;
}

/** Pre-filled dispatch assignment values shown in the design. */
export interface OrderDispatchAssignment {
  driverName: string;
  vehiclePlate: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

/** A dispatched quantity line (e.g. "Diesel (AGO) – 10,000 Litres"). */
export interface DispatchedQuantity {
  id: string;
  label: string;
}

export interface OrderDispatchSuccess {
  recipient: string;
  contactName: string;
  orderTotalNGN: number;
  phone: string;
  requestedOn: string;
  orderPlaced: string;
  address: string;
}

export interface OrderDispatch {
  summary: OrderDispatchSummary;
  delivery: OrderDispatchDelivery;
  assignment: OrderDispatchAssignment;
  dispatchedQuantities: DispatchedQuantity[];
  success: OrderDispatchSuccess;
  timeline: OrderTimelineEvent[];
}

// ═════════════════════════════════════════════════════════════════
// Backend order -> view-model mappers.
// ═════════════════════════════════════════════════════════════════

/** Collapses the backend's fine-grained status codes into this page's coarser display vocabulary. */
function toSummaryStatus(status?: string): OrderStatus {
  switch (status) {
    case 'rejected':
      return 'rejected';
    case 'cancelled':
      return 'cancelled';
    case 'returned':
    case 'partially_returned':
    case 'refunded':
      return 'disputed';
    case 'approved':
    case 'awaiting_payment':
    case 'paid':
    case 'processing':
    case 'dispatched':
    case 'delivered':
    case 'completed':
      return 'approved';
    default:
      return 'pending';
  }
}

function toSummaryPayment(status?: string): PaymentStatus {
  switch (status) {
    case 'paid':
      return 'paid';
    case 'refunded':
      return 'unpaid';
    case 'cancelled':
      return 'failed';
    default:
      return 'pending';
  }
}

export function toOrderDetailStage(status?: string): OrderDetailStage {
  switch (status) {
    case 'rejected':
    case 'cancelled':
      return 'rejected';
    case 'dispatched':
    case 'delivered':
    case 'completed':
      return 'awaiting_delivery';
    default:
      return 'awaiting_approval';
  }
}

function toDeliveryStatus(status?: string): DeliveryStatus {
  switch (status) {
    case 'delivered':
    case 'completed':
      return 'delivered';
    case 'dispatched':
      return 'in_transit';
    default:
      return 'pending';
  }
}

function toTimelineEventStatus(state?: string): OrderTimelineEvent['status'] {
  // "current" renders with the same checked style as "completed".
  if (state === 'completed' || state === 'current') return 'completed';
  if (state === 'rejected') return 'rejected';
  return 'pending';
}

function toTimelineEventTimestamp(state?: string): string | undefined {
  if (!state) return undefined;
  return state.charAt(0).toUpperCase() + state.slice(1);
}

function toTimeline(steps?: order.OrderTimelineStep[]): OrderTimelineEvent[] {
  // TODO(orval): SupplierOrderTimelineStep has no per-step date/time field yet —
  // only code/label/state — so `timestamp` shows the step's real state, not a real date.
  return (steps ?? []).map((step) => ({
    status: toTimelineEventStatus(step.supplier_order_timeline_step_state),
    label: step.supplier_order_timeline_step_label ?? '',
    timestamp: toTimelineEventTimestamp(step.supplier_order_timeline_step_state),
  }));
}

function toLineItems(items?: order.OrderLineItem[]): OrderLineItem[] {
  return (items ?? []).map((item, index) => ({
    id: item.supplier_order_item_id ?? `li-${index}`,
    productId: item.product_id ?? '',
    name: item.supplier_product_name ?? 'Product',
    quantityLabel: `${(item.supplier_quantity ?? 0).toLocaleString()} ${item.supplier_unit_label ?? ''}`.trim(),
    quantity: item.supplier_quantity ?? 0,
    unit: item.supplier_unit_label ?? '',
    unitPriceNGN: item.supplier_unit_price ?? 0,
    totalNGN: item.supplier_sub_total ?? 0,
  }));
}

export function toOrderDetail(source: order.Order): OrderDetail {
  const orderDate = source.supplier_order_date ? formatDate(source.supplier_order_date) : '—';
  const total = source.supplier_order_amount ?? 0;
  const subtotal = source.supplier_order_subtotal ?? total;
  const discount = source.supplier_order_discount ?? 0;
  const shipping = 0;
  const tax = 0;

  const summary: Order = {
    id: source.supplier_order_id ?? source.supplier_order_reference ?? '',
    date: orderDate,
    distributor: source.supplier_distributor_name ?? 'Distributor',
    items: source.supplier_order_items_count ?? 0,
    amountNGN: total,
    status: toSummaryStatus(source.supplier_order_status_code),
    payment: toSummaryPayment(source.supplier_payment_status_code),
  };

  return {
    summary,
    lineItems: toLineItems(source.supplier_order_items),
    timeline: toTimeline(source.supplier_order_timeline),
    distributor: {
      name: source.supplier_distributor_name ?? 'Distributor',
      email: source.supplier_contact_email ?? 'N/A',
      phone: source.supplier_contact_phone ?? 'N/A',
      orderNote: source.supplier_order_notes || 'N/A',
    },
    shipping: {
      email: source.supplier_contact_email ?? 'N/A',
      phone: source.supplier_contact_phone ?? 'N/A',
    },
    payment: {
      subtotal,
      discount,
      shipping,
      tax,
      total: subtotal - discount + shipping + tax || total,
      // TODO(orval): no payment-method field on SupplierOrderDetail yet.
      method: 'Card',
    },
    delivery: {
      status: toDeliveryStatus(source.supplier_order_status_code),
      // TODO(orval): no delivery-ETA field on SupplierOrderDetail yet.
      estimatedDate: 'N/A',
    },
    tierLabel: source.supplier_distributor_tier ?? 'N/A',
    requestedDeliveryDate: source.supplier_order_requested_on
      ? formatDate(source.supplier_order_requested_on)
      : '—',
  };
}

export function toOrderDispatch(source: order.Order): OrderDispatch {
  const total = source.supplier_order_amount ?? 0;
  const items = source.supplier_order_items_count ?? 0;
  const orderDate = source.supplier_order_requested_on
    ? formatDate(source.supplier_order_requested_on)
    : '—';
  const distributor = source.supplier_distributor_name ?? 'Distributor';
  const address = source.supplier_delivery_address ?? 'N/A';
  const phone = source.supplier_contact_phone ?? 'N/A';

  return {
    summary: {
      orderTotalNGN: total,
      totalItems: items,
      paymentLabel: source.supplier_payment_status ?? 'Confirmed',
      // TODO(orval): no inventory/reservation-status field on SupplierOrderDetail yet.
      inventoryLabel: 'Allocated',
    },
    delivery: {
      recipient: distributor,
      address,
      phone,
    },
    assignment: {
      driverName: '',
      vehiclePlate: '',
      trackingNumber: '',
      estimatedDelivery: '',
    },
    dispatchedQuantities: (source.supplier_order_items ?? []).map((item, index) => ({
      id: item.supplier_order_item_id ?? `dq-${index}`,
      label: `${item.supplier_product_name ?? 'Product'} – ${(item.supplier_quantity ?? 0).toLocaleString()} ${item.supplier_unit_label ?? ''}`.trim(),
    })),
    success: {
      recipient: distributor,
      contactName: `${source.supplier_order_id ?? source.supplier_order_reference ?? ''}: ${distributor}`,
      orderTotalNGN: total,
      phone,
      requestedOn: orderDate,
      orderPlaced: 'Today',
      address,
    },
    timeline: toTimeline(source.supplier_order_timeline),
  };
}
