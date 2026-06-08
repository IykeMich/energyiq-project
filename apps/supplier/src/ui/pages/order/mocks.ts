export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'modified'
  | 'disputed'
  | 'cancelled';

export type PaymentStatus = 'paid' | 'unpaid' | 'pending' | 'failed';

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
