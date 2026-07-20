import type { order } from '@energyiq/domain';
import { apiGet, apiPost, apiPut } from './client';

// ════════════════════════════════════════════════════════════════
// Order API adapter — implements OrderApi port via HTTP.
// Used by the order use-cases in @energyiq/domain/order.
// ════════════════════════════════════════════════════════════════

export class OrderApiAdapter implements order.OrderApi {
  async createOrder(req: order.OrderCreateRequest): Promise<order.Order> {
    return apiPost<order.Order>('v1/order/create', req);
  }

  async getOrder(id: string): Promise<order.Order> {
    return apiGet<order.Order>(`v1/order/read/${id}`);
  }

  async updateOrder(id: string, req: order.OrderUpdateRequest): Promise<order.Order> {
    return apiPut<order.Order>(`v1/order/update/${id}`, req);
  }

  async approveOrder(id: string): Promise<order.Order> {
    return apiPost<order.Order>(`v1/order/approve/${id}`);
  }

  async rejectOrder(id: string, req: order.OrderRejectRequest): Promise<order.Order> {
    return apiPost<order.Order>(`v1/order/reject/${id}`, req);
  }

  async cancelOrder(id: string): Promise<order.Order> {
    return apiPost<order.Order>(`v1/order/cancel/${id}`);
  }

  async dispatchOrder(id: string, req: order.OrderDispatchRequest): Promise<order.Order> {
    return apiPost<order.Order>(`v1/order/dispatch/${id}`, req);
  }

  async receiveOrder(id: string): Promise<order.Order> {
    return apiPost<order.Order>(`v1/order/receive/${id}`);
  }

  async listOrders(params?: order.OrderListParams): Promise<order.OrderListResult> {
    return apiGet<order.OrderListResult>('v1/order/list', { searchParams: toSearchParams(params) });
  }

  async getOrderStats(params?: order.OrderStatsParams): Promise<order.OrderStats> {
    return apiGet<order.OrderStats>('v1/order/list/stats', {
      searchParams: toSearchParams(params),
    });
  }
}

function toSearchParams(
  params?: object,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;
  const entries: [string, string | number | boolean][] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) entries.push([key, value as string | number | boolean]);
  }
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
