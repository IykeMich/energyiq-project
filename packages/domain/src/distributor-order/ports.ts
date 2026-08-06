import type {
  DistributorOrderDetail,
  DistributorOrderListItem,
  DistributorOrderListParams,
  DistributorOrderDashboard,
  DistributorOrderProductOption,
  OrderCreateRequest,
  OrderUpdateRequest,
} from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the distributor-order domain needs.
// Implemented by the DistributorOrderApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface DistributorOrderApi {
  createOrder(req: OrderCreateRequest): Promise<DistributorOrderDetail>;
  getOrder(id: string): Promise<DistributorOrderDetail>;
  updateOrder(id: string, req: OrderUpdateRequest): Promise<DistributorOrderDetail>;
  cancelOrder(id: string): Promise<DistributorOrderDetail>;
  deliverOrder(id: string): Promise<DistributorOrderDetail>;
  listOrders(params?: DistributorOrderListParams): Promise<DistributorOrderListItem[]>;
  getOrderStats(): Promise<DistributorOrderDashboard>;
  listOrderProducts(): Promise<DistributorOrderProductOption[]>;
}
