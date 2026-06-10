// Replica data for the supplier Orders page design.
// TODO(orval): replace each block with the matching generated query hook once the API lands.

export type OrderStatus = 'Approved' | 'Dispatched' | 'Pending' | 'Delivered' | 'Rejected';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export interface OrderRow {
  id: string;
  /** Display date as shown in the design (e.g. "18-Nov-2025"). */
  date: string;
  /** Counterparty distributor for this supplier order. */
  distributor: string;
  items: number;
  /** Raw amount in Naira; formatted for display in the table. */
  amount: number;
  status: OrderStatus;
  payment: PaymentStatus;
}

// The first rows mirror the design exactly; the remainder repeat the sample so the
// footer reads "of 100 Entries". TODO(orval): replace with the orders query hook.
const ORDERS_SAMPLE: Omit<OrderRow, 'id'>[] = [
  { date: '18-Nov-2025', distributor: 'Zenith Traders (Silver)', items: 3, amount: 1250000, status: 'Approved', payment: 'Pending' },
  { date: '19-Nov-2025', distributor: 'Ideal Supplies (Bronze)', items: 6, amount: 1150000, status: 'Dispatched', payment: 'Paid' },
  { date: '20-Nov-2025', distributor: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Pending', payment: 'Failed' },
  { date: '20-Nov-2025', distributor: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Dispatched', payment: 'Paid' },
  { date: '20-Nov-2025', distributor: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Delivered', payment: 'Paid' },
  { date: '20-Nov-2025', distributor: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Pending', payment: 'Pending' },
  { date: '20-Nov-2025', distributor: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Dispatched', payment: 'Pending' },
  { date: '20-Nov-2025', distributor: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Rejected', payment: 'Paid' },
  { date: '20-Nov-2025', distributor: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Pending', payment: 'Failed' },
];

export const ORDERS_MOCK: OrderRow[] = Array.from({ length: 100 }, (_, index) => ({
  id: `ORD-${String(index + 1).padStart(3, '0')}`,
  ...ORDERS_SAMPLE[index % ORDERS_SAMPLE.length],
}));

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  Approved: '#388E3C',
  Dispatched: '#1B22AF',
  Pending: '#FB8C1C',
  Delivered: '#008080',
  Rejected: '#D30A0A',
};

export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  Paid: '#388E3C',
  Pending: '#FB8C1C',
  Failed: '#D30A0A',
};

export interface OrderStatusTab {
  label: string;
  count: number;
}

// The "All" tab is selected by default in the design.
export const ORDER_STATUS_TABS: OrderStatusTab[] = [
  { label: 'All', count: 100 },
  { label: 'Pending', count: 20 },
  { label: 'Approved', count: 10 },
  { label: 'Rejected', count: 10 },
  { label: 'Delivered', count: 100 },
  { label: 'Dispatched', count: 100 },
  { label: 'Cancelled', count: 20 },
];

export interface OrderFilter {
  id: string;
  label: string;
  options: string[];
}

// Presentational filter dropdowns above the table.
// TODO(orval): source these option lists from their reference endpoints.
export const ORDER_FILTERS: OrderFilter[] = [
  { id: 'date', label: 'Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
  {
    id: 'distributor',
    label: 'Distributor',
    options: ['Zenith Traders', 'Ideal Supplies', 'Rapid Logistics'],
  },
  { id: 'payment-status', label: 'Payment Status', options: ['Paid', 'Pending', 'Failed'] },
];
