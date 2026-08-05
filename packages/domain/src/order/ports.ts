import type {
  Order,
  OrderListParams,
  OrderListResult,
  OrderStats,
  OrderStatsParams,
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderRejectRequest,
  OrderDispatchRequest,
} from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the order domain needs.
// Implemented by the OrderApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface OrderApi {
  createOrder(req: OrderCreateRequest): Promise<Order>;
  getOrder(id: string): Promise<Order>;
  updateOrder(id: string, req: OrderUpdateRequest): Promise<Order>;
  approveOrder(id: string): Promise<Order>;
  rejectOrder(id: string, req: OrderRejectRequest): Promise<Order>;
  cancelOrder(id: string): Promise<Order>;
  dispatchOrder(id: string, req: OrderDispatchRequest): Promise<Order>;
  deliverOrder(id: string): Promise<Order>;
  listOrders(params?: OrderListParams): Promise<OrderListResult>;
  getOrderStats(params?: OrderStatsParams): Promise<OrderStats>;
}
