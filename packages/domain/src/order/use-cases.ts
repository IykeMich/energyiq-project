import type { OrderApi } from './ports';
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
// Order use cases — thin orchestration over the OrderApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class OrderUseCases {
  private api: OrderApi;

  constructor(api: OrderApi) {
    this.api = api;
  }

  async createOrder(req: OrderCreateRequest): Promise<Order> {
    return this.api.createOrder(req);
  }

  async getOrder(id: string): Promise<Order> {
    return this.api.getOrder(id);
  }

  async updateOrder(id: string, req: OrderUpdateRequest): Promise<Order> {
    return this.api.updateOrder(id, req);
  }

  async approveOrder(id: string): Promise<Order> {
    return this.api.approveOrder(id);
  }

  async rejectOrder(id: string, req: OrderRejectRequest): Promise<Order> {
    return this.api.rejectOrder(id, req);
  }

  async cancelOrder(id: string): Promise<Order> {
    return this.api.cancelOrder(id);
  }

  async dispatchOrder(id: string, req: OrderDispatchRequest): Promise<Order> {
    return this.api.dispatchOrder(id, req);
  }

  async deliverOrder(id: string): Promise<Order> {
    return this.api.deliverOrder(id);
  }

  async listOrders(params?: OrderListParams): Promise<OrderListResult> {
    return this.api.listOrders(params);
  }

  async getOrderStats(params?: OrderStatsParams): Promise<OrderStats> {
    return this.api.getOrderStats(params);
  }
}
