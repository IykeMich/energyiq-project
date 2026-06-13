// Replica data for the supplier Orders page design.
// TODO(orval): replace each block with the matching generated query hook once the API lands.

export type OrderStatus = 'Approved' | 'Dispatched' | 'Pending' | 'Delivered' | 'Rejected';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export interface OrderRow {
  id: string;
  /** Display date as shown in the design (e.g. "18-Nov-2025"). */
  date: string;
  supplier: string;
  items: number;
  /** Raw amount in Naira; formatted for display in the table. */
  amount: number;
  status: OrderStatus;
  payment: PaymentStatus;
}

export const ORDERS_MOCK: OrderRow[] = [
  { id: 'ORD-001', date: '18-Nov-2025', supplier: 'Zenith Traders (Silver)', items: 3, amount: 1250000, status: 'Approved', payment: 'Pending' },
  { id: 'ORD-002', date: '19-Nov-2025', supplier: 'Ideal Supplies (Bronze)', items: 6, amount: 1150000, status: 'Dispatched', payment: 'Paid' },
  { id: 'ORD-003', date: '20-Nov-2025', supplier: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Pending', payment: 'Failed' },
  { id: 'ORD-004', date: '20-Nov-2025', supplier: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Dispatched', payment: 'Paid' },
  { id: 'ORD-005', date: '20-Nov-2025', supplier: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Delivered', payment: 'Paid' },
  { id: 'ORD-006', date: '20-Nov-2025', supplier: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Pending', payment: 'Pending' },
  { id: 'ORD-007', date: '20-Nov-2025', supplier: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Dispatched', payment: 'Pending' },
  { id: 'ORD-008', date: '20-Nov-2025', supplier: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Rejected', payment: 'Paid' },
  { id: 'ORD-009', date: '20-Nov-2025', supplier: 'Rapid Logistics (Gold)', items: 6, amount: 1150000, status: 'Pending', payment: 'Failed' },
];

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
  { label: 'All', count: 150 },
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
    id: 'supplier',
    label: 'Supplier',
    options: ['Zenith Traders', 'Ideal Supplies', 'Rapid Logistics'],
  },
  {
    id: 'order-status',
    label: 'Order Status',
    options: ['Approved', 'Dispatched', 'Pending', 'Delivered', 'Rejected'],
  },
  { id: 'payment-status', label: 'Payment Status', options: ['Paid', 'Pending', 'Failed'] },
];

export interface OrderTrackerStep {
  label: string;
  timestamp: string;
}

export const ORDER_TRACKER_REFERENCE = '#ORD-003';

export const ORDER_TRACKER_STEPS: OrderTrackerStep[] = [
  { label: 'Pickup', timestamp: '10:38AM. 01-02' },
  { label: 'On Transit', timestamp: '10:38AM. 01-02' },
  { label: 'On Delivery', timestamp: '10:38AM. 01-02' },
  { label: 'Delivered', timestamp: '10:38AM. 01-02' },
];

/** Index of the currently active tracker step (0-based). */
export const ORDER_TRACKER_ACTIVE_INDEX = 0;
