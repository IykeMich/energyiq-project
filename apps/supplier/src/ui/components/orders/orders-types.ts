export type OrderStatus = 'Approved' | 'Cancelled' | 'Dispatched' | 'Delivered' | 'Pending' | 'Rejected';
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

export interface OrderStatusTab {
  label: OrderStatus | 'All';
  count: number;
}
