// ════════════════════════════════════════════════════════════════
// Order domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type OrderStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'dispatched'
  | 'received'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface Order {
  id?: string;
  order_number?: string;
  status?: OrderStatus | string;
  subtotal?: number;
  discount?: number;
  total?: number;
  items?: Record<string, unknown>;
  notes?: string;
  shipping_address?: Record<string, unknown>;
  distributor_id?: string;
  supplier_id?: string;
  approved_at?: string;
  dispatched_at?: string;
  received_at?: string;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderListParams {
  status?: OrderStatus;
  distributor_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface OrderListResult {
  items?: Order[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface OrderStats {
  total?: number;
  draft?: number;
  submitted?: number;
  approved?: number;
  rejected?: number;
  dispatched?: number;
  received?: number;
  completed?: number;
  cancelled?: number;
  disputed?: number;
}

export interface OrderStatsParams {
  distributor_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface OrderCreateRequest {
  distributor_id?: string;
  items: OrderItem[];
  notes?: string;
  shipping_address?: Record<string, unknown>;
}

export interface OrderUpdateRequest {
  items: OrderItem[];
  reason: string;
}

export interface OrderRejectRequest {
  reason: string;
  note?: string;
}

export interface OrderDispatchRequest {
  driver_name: string;
  estimated_delivery: string;
  tracking_number: string;
  vehicle_plate: string;
  note?: string;
}
