// ════════════════════════════════════════════════════════════════
// Distributor order entities — pure TypeScript, zero framework imports.
// Field names/vocabulary mirror the backend's distributor-facing Order
// endpoints exactly (GET/POST/PUT /v1/distributor/order/*), which are a
// distinct response shape from the supplier-facing `order` module.
// ════════════════════════════════════════════════════════════════

export type { OrderItem, OrderCreateRequest, OrderUpdateRequest } from '../order/types';

export interface DistributorOrderListItem {
  distributor_order_id?: string;
  distributor_order_number?: string;
  distributor_order_date?: string;
  distributor_order_amount?: number;
  distributor_order_items_count?: number;
  distributor_order_status?: string;
  distributor_order_status_code?: string;
  distributor_order_supplier_name?: string;
  distributor_payment_status?: string;
  distributor_payment_status_code?: string;
}

export interface DistributorOrderLineItem {
  product_id?: string;
  distributor_product_code?: string;
  distributor_product_name?: string;
  distributor_quantity?: number;
  distributor_unit_label?: string;
  distributor_unit_price?: number;
  distributor_sub_total?: number;
  distributor_availability?: string;
}

export interface DistributorOrderTimelineStep {
  distributor_order_timeline_step_code?: string;
  distributor_order_timeline_step_label?: string;
  distributor_order_timeline_step_state?: string;
}

export interface DistributorOrderDeliveryMethod {
  distributor_delivery_method_code?: string;
  distributor_delivery_method_name?: string;
  distributor_delivery_method_description?: string;
  distributor_delivery_method_fee_amount?: number;
  distributor_delivery_method_fee_label?: string;
}

export interface DistributorOrderDetail {
  distributor_order_id?: string;
  distributor_order_number?: string;
  distributor_order_date?: string;
  distributor_order_amount?: number;
  distributor_order_subtotal?: number;
  distributor_order_discount?: number;
  distributor_order_items_count?: number;
  distributor_order_status?: string;
  distributor_order_status_code?: string;
  distributor_order_supplier_name?: string;
  distributor_order_notes?: string;
  distributor_order_placed_at?: string;
  distributor_order_requested_on?: string;
  distributor_order_items?: DistributorOrderLineItem[];
  distributor_order_timeline?: DistributorOrderTimelineStep[];
  distributor_payment_method?: string;
  distributor_payment_status?: string;
  distributor_payment_status_code?: string;
  distributor_contact_person?: string;
  distributor_contact_email?: string;
  distributor_contact_phone?: string;
  distributor_delivery_address?: string;
  distributor_delivery_methods?: DistributorOrderDeliveryMethod[];
  distributor_selected_delivery_method?: string;
  distributor_estimated_delivery?: string;
  distributor_inventory_status?: string;
  distributor_inventory_status_code?: string;
  distributor_can_edit?: boolean;
  distributor_edit_notice?: string;
  distributor_trading_account_balance?: number;
  distributor_trading_account_status?: string;
}

export interface DistributorOrderProductOption {
  product_id?: string;
  distributor_product_code?: string;
  distributor_product_name?: string;
  distributor_unit_label?: string;
  distributor_unit_price?: number;
  distributor_availability?: number;
  distributor_price_display_note?: string;
}

export interface DistributorOrderDashboard {
  distributor_order_stats?: DistributorOrderStats;
  distributor_trading_account_balance?: number;
  distributor_trading_account_status?: string;
}

export interface DistributorOrderStats {
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

export interface DistributorOrderListParams {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  sort?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}
