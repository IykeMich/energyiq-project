// ════════════════════════════════════════════════════════════════
// Order domain entities — pure TypeScript, zero framework imports.
// Field names/vocabulary mirror the backend's supplier-facing Order
// endpoints exactly (GET/POST/PUT /v1/order/*) so no mapping drift.
// ════════════════════════════════════════════════════════════════

export type OrderStatus =
  | 'pending'
  | 'awaiting_approval'
  | 'approved'
  | 'awaiting_payment'
  | 'paid'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'partially_returned'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'cancelled';

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface OrderLineItem {
  product_id?: string;
  supplier_order_item_id?: string;
  supplier_order_item_summary?: string;
  supplier_product_code?: string;
  supplier_product_name?: string;
  supplier_quantity?: number;
  supplier_unit_label?: string;
  supplier_unit_price?: number;
  supplier_sub_total?: number;
  supplier_availability?: string;
}

export interface OrderTimelineStep {
  supplier_order_timeline_step_code?: string;
  supplier_order_timeline_step_label?: string;
  supplier_order_timeline_step_state?: string;
}

/**
 * Flat, `supplier_*`-prefixed shape returned by both `GET /v1/order/list`
 * (list-item fields only) and `GET /v1/order/read/{id}` (adds the detail-only
 * fields below). Optional fields not present on a list row simply come back
 * `undefined` when read off a list-sourced Order.
 */
export interface Order {
  supplier_order_id?: string;
  supplier_order_reference?: string;
  supplier_order_date?: string;
  supplier_order_amount?: number;
  supplier_order_items_count?: number;
  supplier_order_status?: string;
  supplier_order_status_code?: OrderStatus | string;
  supplier_payment_status?: string;
  supplier_payment_status_code?: PaymentStatus | string;
  supplier_distributor_id?: string;
  supplier_distributor_name?: string;
  supplier_distributor_display_name?: string;
  supplier_distributor_tier?: string;
  supplier_can_approve?: boolean;
  supplier_can_reject?: boolean;
  supplier_can_cancel?: boolean;
  supplier_can_modify?: boolean;
  supplier_can_dispatch?: boolean;
  supplier_can_deliver?: boolean;

  // Detail-only fields — present on GET /v1/order/read/{id}, absent on list rows.
  supplier_order_subtotal?: number;
  supplier_order_discount?: number;
  supplier_order_notes?: string;
  supplier_order_placed_at?: string;
  supplier_order_requested_on?: string;
  supplier_order_items?: OrderLineItem[];
  supplier_order_timeline?: OrderTimelineStep[];
  supplier_contact_person?: string;
  supplier_contact_email?: string;
  supplier_contact_phone?: string;
  supplier_delivery_address?: string;
  supplier_selected_delivery_method?: string;
  supplier_trading_account_balance?: number;
  supplier_trading_account_status?: string;
}

export interface OrderListParams {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  distributor_id?: string;
  date_from?: string;
  date_to?: string;
  sort?: 'asc' | 'desc';
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
  pending?: number;
  awaiting_approval?: number;
  approved?: number;
  awaiting_payment?: number;
  paid?: number;
  processing?: number;
  dispatched?: number;
  delivered?: number;
  completed?: number;
  rejected?: number;
  cancelled?: number;
  partially_returned?: number;
  returned?: number;
  refunded?: number;
}

export interface OrderStatsParams {
  distributor_id?: string;
  payment_status?: PaymentStatus;
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
