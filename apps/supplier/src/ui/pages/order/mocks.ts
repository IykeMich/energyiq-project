export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'modified'
  | 'disputed'
  | 'cancelled';

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
    name: 'Diesel (AGO)',
    quantityLabel: '10,000 Litres',
    quantity: 10_000,
    unit: 'L',
    unitPriceNGN: 730,
    totalNGN: 2_000_000,
  },
  {
    id: 'li-fuel',
    name: 'Fuel (PMS)',
    quantityLabel: '1,500 Litres',
    quantity: 1_500,
    unit: 'L',
    unitPriceNGN: 630,
    totalNGN: 100_000,
  },
  {
    id: 'li-lubricant',
    name: 'Lubricant Oil (20L Kegs)',
    quantityLabel: '10 Units',
    quantity: 10,
    unit: 'Units',
    unitPriceNGN: 5_000,
    totalNGN: 50_000,
  },
];

export function getOrderDetail(id: string): OrderDetail | null {
  const summary = ORDERS_MOCK.find((o) => o.id === id);
  if (!summary) return null;

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
      name: summary.distributor,
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
