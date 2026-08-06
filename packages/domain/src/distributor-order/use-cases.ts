import type { DistributorOrderApi } from './ports';
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
// Distributor order use cases — thin orchestration over the
// DistributorOrderApi port. Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class DistributorOrderUseCases {
  private api: DistributorOrderApi;

  constructor(api: DistributorOrderApi) {
    this.api = api;
  }

  async createOrder(req: OrderCreateRequest): Promise<DistributorOrderDetail> {
    return this.api.createOrder(req);
  }

  async getOrder(id: string): Promise<DistributorOrderDetail> {
    return this.api.getOrder(id);
  }

  async updateOrder(id: string, req: OrderUpdateRequest): Promise<DistributorOrderDetail> {
    return this.api.updateOrder(id, req);
  }

  async cancelOrder(id: string): Promise<DistributorOrderDetail> {
    return this.api.cancelOrder(id);
  }

  async deliverOrder(id: string): Promise<DistributorOrderDetail> {
    return this.api.deliverOrder(id);
  }

  async listOrders(params?: DistributorOrderListParams): Promise<DistributorOrderListItem[]> {
    return this.api.listOrders(params);
  }

  async getOrderStats(): Promise<DistributorOrderDashboard> {
    return this.api.getOrderStats();
  }

  async listOrderProducts(): Promise<DistributorOrderProductOption[]> {
    return this.api.listOrderProducts();
  }
}
