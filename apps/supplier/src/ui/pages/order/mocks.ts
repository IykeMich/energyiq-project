// This page (Order Detail / Reject / Modify / Dispatch) still runs on mock data.
// `domain.Order.items` and `.shipping_address` are untyped `object` fields in the
// swagger (no schema at all), so line items, distributor identity, and shipping
// details can't be faithfully rendered from the real GET /v1/order/read/{id}
// response without knowing their actual runtime shape — wiring this page from a
// guess would risk silently showing wrong amounts. The Orders *list* (orders-overview.tsx)
// is wired to the real endpoint; this page is next once that shape is confirmed.

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'modified'
  | 'disputed'
  | 'cancelled';

/** Fulfillment stage shown on the Order Details page, driving the header pill + actions. */
export type OrderDetailStage = 'awaiting_approval' | 'awaiting_delivery' | 'rejected';

/**
 * Derive the detail stage from this (still-mocked) page's own order status.
 * Already-rejected orders load in the disabled state.
 * TODO(orval): source the stage from GET /v1/order/read/{id} once this page is wired
 * — see the note atop this file about the still-unknown `items`/`shipping_address` shape.
 */
export function getOrderStage(id: string): OrderDetailStage {
  const listOrder = ORDERS_MOCK.find((order) => order.id === id);
  return listOrder?.status === 'rejected' ? 'rejected' : 'awaiting_approval';
}

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

const distributors = [
  'Zenith Petroleum',
  'Ideal Supplies (Bonny)',
  'Rapid Logistics (Gold)',
  'Apex Fuel Co.',
  'NorthStar Trading',
  'Bluewave Distribution',
];

const statuses: OrderStatus[] = [
  'pending',
  'approved',
  'rejected',
  'modified',
  'disputed',
  'cancelled',
];

const payments: PaymentStatus[] = ['paid', 'unpaid', 'pending', 'failed'];

export const ORDERS_MOCK: Order[] = Array.from({ length: 100 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(3, '0')}`,
  date: `${String((i % 28) + 1).padStart(2, '0')} Nov 2025`,
  distributor: distributors[i % distributors.length],
  items: 1 + (i % 9),
  amountNGN: 1_250_000 + (i % 12) * 175_000,
  status: statuses[i % statuses.length],
  payment: payments[(i + 1) % payments.length],
}));

export interface OrderStatusCount {
  status: OrderStatus | 'all';
  label: string;
  count: number;
}

export function buildStatusCounts(orders: Order[]): OrderStatusCount[] {
  const tally: Record<OrderStatus, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    modified: 0,
    disputed: 0,
    cancelled: 0,
  };
  for (const o of orders) tally[o.status] += 1;
  return [
    { status: 'all', label: 'All Orders', count: orders.length },
    { status: 'pending', label: 'Pending', count: tally.pending },
    { status: 'approved', label: 'Approved', count: tally.approved },
    { status: 'rejected', label: 'Rejected', count: tally.rejected },
    { status: 'modified', label: 'Modified', count: tally.modified },
    { status: 'disputed', label: 'Disputed', count: tally.disputed },
    { status: 'cancelled', label: 'Cancelled', count: tally.cancelled },
  ];
}

// ───────── Order Detail ─────────

export interface OrderLineItem {
  id: string;
  productId: string;
  name: string;        // "Diesel (AGO)"
  quantityLabel: string; // "10,000 Litres"
  quantity: number;
  unit: string;        // "L" | "Units"
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

const SAMPLE_LINE_ITEMS: OrderLineItem[] = [
  {
    id: 'li-diesel',
    productId: 'prod-ago',
    name: 'Diesel (AGO)',
    quantityLabel: '10,000 Litres',
    quantity: 10_000,
    unit: 'L',
    unitPriceNGN: 730,
    totalNGN: 2_000_000,
  },
  {
    id: 'li-fuel',
    productId: 'prod-pms',
    name: 'Fuel (PMS)',
    quantityLabel: '1,500 Litres',
    quantity: 1_500,
    unit: 'L',
    unitPriceNGN: 630,
    totalNGN: 100_000,
  },
  {
    id: 'li-lubricant',
    productId: 'prod-lub',
    name: 'Lubricant Oil (20L Kegs)',
    quantityLabel: '10 Units',
    quantity: 10,
    unit: 'Units',
    unitPriceNGN: 5_000,
    totalNGN: 50_000,
  },
];

export function getOrderDetail(id: string): OrderDetail | null {
  const matched = ORDERS_MOCK.find((o) => o.id === id);
  if (!matched) return null;

  // This page is the "Awaiting Approval" detail view. Pin the displayed summary
  // to the design example so any opened order renders pixel-perfect; only the
  // order id varies. TODO(orval): drop the override once the endpoint provides
  // real per-order detail data.
  const summary: Order = {
    ...matched,
    date: '20 Nov 2025',
    amountNGN: 1_150_000,
    status: 'pending',
    payment: 'paid',
  };

  const submittedTimestamp = `${summary.date}; 10:23 AM`;
  const timeline: OrderTimelineEvent[] =
    summary.status === 'approved'
      ? [
          { status: 'completed', label: 'Order submitted by distributor', timestamp: submittedTimestamp },
          { status: 'completed', label: 'Supplier approval', timestamp: 'Today' },
        ]
      : summary.status === 'rejected'
      ? [
          { status: 'completed', label: 'Order submitted by distributor', timestamp: submittedTimestamp },
          { status: 'rejected', label: 'Order rejected', timestamp: 'Today' },
        ]
      : [
          { status: 'completed', label: 'Order submitted by distributor', timestamp: submittedTimestamp },
          { status: 'pending', label: 'Supplier approval', timestamp: 'Pending' },
        ];

  return {
    summary,
    lineItems: SAMPLE_LINE_ITEMS,
    timeline,
    distributor: {
      name: 'Rapid Logistics',
      email: 'rapidlogistics12@yahoo.com',
      phone: '(+234) 70 8974 6721',
      orderNote: 'N/A',
    },
    shipping: {
      email: 'rapidlogistics12@yahoo.com',
      phone: '(+234) 70 8974 6721',
    },
    payment: {
      subtotal: 2_150_000,
      discount: 0,
      shipping: 1_000,
      tax: 0,
      total: 2_151_000,
      method: 'Card',
    },
    delivery: {
      status: 'pending',
      estimatedDate: 'N/A',
    },
    tierLabel: 'Silver',
    requestedDeliveryDate: '16 Nov 2025',
  };
}

export const REJECT_REASONS = [
  'Insufficient Stock',
  'Out of stock',
  'Pricing mismatch',
  'Distributor on hold',
  'Quantity exceeds limit',
  'Other',
] as const;

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
  city: string;
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
}

// TODO(orval): replace with the dispatch detail query hook once the endpoint lands.
export function getOrderDispatch(id: string): OrderDispatch {
  return {
    summary: {
      orderTotalNGN: 2_000_000,
      totalItems: 3,
      paymentLabel: 'Confirmed',
      inventoryLabel: 'Allocated',
    },
    delivery: {
      recipient: 'Rapid Logistics',
      address: '15 Ikorodu Road',
      city: 'Lagos State',
      phone: '(+234) 70 8974 6721',
    },
    assignment: {
      driverName: 'Emmanuel Ojukwu',
      vehiclePlate: 'KAM-76A-88',
      trackingNumber: 'TRK-2026211-003',
      estimatedDelivery: '26-02-2026',
    },
    dispatchedQuantities: [
      { id: 'dq-diesel', label: 'Diesel (AGO) – 10,000 Litres' },
      { id: 'dq-fuel', label: 'Fuel(PMS) – 1,500 Litres' },
      { id: 'dq-lubricant', label: 'Lubricant Oil (20L Kegs) - 10 Units' },
    ],
    success: {
      recipient: 'Rapid Logistics',
      contactName: `${id}: Ifeoma Okeke`,
      orderTotalNGN: 2_000_000,
      phone: '(+234) 70 8974 6721',
      requestedOn: 'Mar 20, 2025',
      orderPlaced: 'Today, 08:22AM',
      address: '15 Ikorodu Road, Lagos State.',
    },
  };
}

// ═════════════════════════════════════════════════════════════════
// Backend order -> view-model mappers (replaces the mock helpers above).
// ═════════════════════════════════════════════════════════════════

interface RawOrderItem {
  product_id?: string;
  id?: string;
  quantity?: number;
  name?: string;
  product_name?: string;
  unit?: string;
  unit_price?: number;
  price?: number;
  total?: number;
  line_total?: number;
  amount?: number;
}

function parseOrderItems(items?: order.Order['items']): RawOrderItem[] {
  if (!items) return [];
  if (Array.isArray(items)) return items as RawOrderItem[];
  return Object.entries(items).map(([key, value]) => {
    if (value && typeof value === 'object') {
      return { ...(value as RawOrderItem), product_id: key };
    }
    return { product_id: key };
  });
}

function productNameFor(productId: string): string {
  const match = ADDABLE_PRODUCTS.find((product) => product.id === productId);
  return match?.name ?? 'Product';
}

function unitFor(productId: string): string {
  const match = ADDABLE_PRODUCTS.find((product) => product.id === productId);
  return match?.unit ?? 'Unit';
}

function unitPriceFor(productId: string): number {
  const match = ADDABLE_PRODUCTS.find((product) => product.id === productId);
  return match?.unitPriceNGN ?? 0;
}

function toOrderLineItems(items?: order.Order['items']): OrderLineItem[] {
  const raw = parseOrderItems(items);
  if (raw.length === 0) {
    return [
      {
        id: 'li-default',
        productId: 'unknown',
        name: 'Product',
        quantityLabel: '1 Unit',
        quantity: 1,
        unit: 'Unit',
        unitPriceNGN: 0,
        totalNGN: 0,
      },
    ];
  }
  return raw.map((item, index) => {
    const productId = item.product_id || item.id || `item-${index}`;
    const quantity = Number(item.quantity ?? 0);
    const unit = item.unit || unitFor(productId);
    const unitPrice = Number(item.unit_price ?? item.price ?? unitPriceFor(productId));
    const total = Number(item.total ?? item.line_total ?? item.amount ?? quantity * unitPrice);
    const name = item.name || item.product_name || productNameFor(productId);
    return {
      id: `li-${productId}-${index}`,
      productId,
      name,
      quantity,
      quantityLabel: `${quantity.toLocaleString()} ${unit}`,
      unit,
      unitPriceNGN: unitPrice,
      totalNGN: total,
    };
  });
}

function toDispatchedQuantities(items?: order.Order['items']): DispatchedQuantity[] {
  const raw = parseOrderItems(items);
  if (raw.length === 0) {
    return [{ id: 'dq-default', label: 'Product – 1 Unit' }];
  }
  return raw.map((item, index) => {
    const productId = item.product_id || item.id || `item-${index}`;
    const quantity = Number(item.quantity ?? 0);
    const unit = item.unit || unitFor(productId);
    const name = item.name || item.product_name || productNameFor(productId);
    return {
      id: `dq-${productId}-${index}`,
      label: `${name} – ${quantity.toLocaleString()} ${unit}`,
    };
  });
}

function toDetailOrderStatus(status?: string): OrderStatus {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'cancelled':
      return 'cancelled';
    case 'disputed':
      return 'disputed';
    case 'dispatched':
    case 'received':
    case 'completed':
      return 'approved';
    default:
      return 'pending';
  }
}

export function toOrderDetailStage(status?: string): OrderDetailStage {
  switch (status?.toLowerCase()) {
    case 'rejected':
      return 'rejected';
    case 'cancelled':
      return 'rejected';
    case 'dispatched':
    case 'received':
    case 'completed':
      return 'awaiting_delivery';
    default:
      return 'awaiting_approval';
  }
}

function toDeliveryStatus(status?: string): DeliveryStatus {
  switch (status?.toLowerCase()) {
    case 'received':
    case 'completed':
      return 'delivered';
    case 'dispatched':
      return 'in_transit';
    default:
      return 'pending';
  }
}

function buildTimeline(submittedDate: string, status?: string): OrderTimelineEvent[] {
  const submittedTimestamp = `${submittedDate}; 10:23 AM`;
  const normalized = status?.toLowerCase() ?? '';
  if (normalized === 'rejected') {
    return [
      { status: 'completed', label: 'Order submitted by distributor', timestamp: submittedTimestamp },
      { status: 'rejected', label: 'Order rejected', timestamp: 'Today' },
    ];
  }
  if (['approved', 'dispatched', 'received', 'completed'].includes(normalized)) {
    return [
      { status: 'completed', label: 'Order submitted by distributor', timestamp: submittedTimestamp },
      { status: 'completed', label: 'Supplier approval', timestamp: 'Today' },
    ];
  }
  return [
    { status: 'completed', label: 'Order submitted by distributor', timestamp: submittedTimestamp },
    { status: 'pending', label: 'Supplier approval', timestamp: 'Pending' },
  ];
}

export function toOrderDetail(source: order.Order): OrderDetail {
  const orderDate = toDisplayDate(source.created_at || source.submitted_at);
  const shippingAddress = (source.shipping_address ?? {}) as Record<string, string | undefined>;
  const email = shippingAddress.email || 'distributor@example.com';
  const phone = shippingAddress.phone || 'N/A';
  const lineItems = toOrderLineItems(source.items);
  const total = source.total ?? 0;
  const subtotal = source.subtotal ?? total;
  const discount = source.discount ?? 0;
  const shipping = 0;
  const tax = 0;
  const computedTotal = subtotal - discount + shipping + tax;

  const summary: Order = {
    id: source.id || source.order_number || '',
    date: orderDate,
    distributor: 'Distributor',
    items: countItems(source.items),
    amountNGN: total,
    status: toDetailOrderStatus(source.status),
    payment: 'paid',
  };

  return {
    summary,
    lineItems,
    timeline: buildTimeline(orderDate, source.status),
    distributor: {
      name: 'Distributor',
      email,
      phone,
      orderNote: source.notes || 'N/A',
    },
    shipping: { email, phone },
    payment: {
      subtotal,
      discount,
      shipping,
      tax,
      total: computedTotal || total,
      method: 'Card',
    },
    delivery: {
      status: toDeliveryStatus(source.status),
      estimatedDate: source.dispatched_at ? toDisplayDate(source.dispatched_at) : 'N/A',
    },
    tierLabel: 'Silver',
    requestedDeliveryDate: toDisplayDate(source.submitted_at || source.created_at),
  };
}

export function toOrderDispatch(source: order.Order): OrderDispatch {
  const shippingAddress = (source.shipping_address ?? {}) as Record<string, string | undefined>;
  const total = source.total ?? 0;
  const items = countItems(source.items);
  const orderDate = toDisplayDate(source.submitted_at || source.created_at);
  const address = shippingAddress.address || 'N/A';
  const city = shippingAddress.city || 'N/A';
  const phone = shippingAddress.phone || 'N/A';

  return {
    summary: {
      orderTotalNGN: total,
      totalItems: items,
      paymentLabel: 'Confirmed',
      inventoryLabel: 'Allocated',
    },
    delivery: {
      recipient: 'Distributor',
      address,
      city,
      phone,
    },
    assignment: {
      driverName: '',
      vehiclePlate: '',
      trackingNumber: '',
      estimatedDelivery: '',
    },
    dispatchedQuantities: toDispatchedQuantities(source.items),
    success: {
      recipient: 'Distributor',
      contactName: `${source.id || source.order_number || ''}: Distributor`,
      orderTotalNGN: total,
      phone,
      requestedOn: orderDate,
      orderPlaced: 'Today',
      address: `${address}, ${city}`.replace(/, $/, '').replace(/^, /, '') || 'N/A',
    },
  };
}
