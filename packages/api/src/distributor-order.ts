import type { distributorOrder } from '@energyiq/domain';
import { apiGet, apiPost, apiPut } from './client';

// ════════════════════════════════════════════════════════════════
// Distributor order API adapter — implements DistributorOrderApi port
// via HTTP, against the distributor-facing /v1/distributor/order/*
// endpoints (a distinct response shape from the supplier-facing
// /v1/order/* endpoints used by @energyiq/api's OrderApiAdapter).
// ════════════════════════════════════════════════════════════════

interface PaginatedList<T> {
  items?: T[];
  limit?: number;
  offset?: number;
  total?: number;
}

/**
 * The backend's list envelope is inconsistent with its own published swagger:
 * docs describe `data: { items, limit, offset, total }`, but list endpoints
 * have been observed returning `data` as the array directly (with pagination
 * moved to a sibling `meta` field the generic `apiGet` envelope doesn't
 * surface). Accept either shape so a doc/behavior drift on either side
 * doesn't silently empty the list.
 */
function unwrapList<T>(data: T[] | PaginatedList<T>): T[] {
  return Array.isArray(data) ? data : (data.items ?? []);
}

export class DistributorOrderApiAdapter implements distributorOrder.DistributorOrderApi {
  async createOrder(
    req: distributorOrder.OrderCreateRequest,
  ): Promise<distributorOrder.DistributorOrderDetail> {
    return apiPost<distributorOrder.DistributorOrderDetail>('v1/distributor/order/create', req);
  }

  async getOrder(id: string): Promise<distributorOrder.DistributorOrderDetail> {
    return apiGet<distributorOrder.DistributorOrderDetail>(`v1/distributor/order/read/${id}`);
  }

  async updateOrder(
    id: string,
    req: distributorOrder.OrderUpdateRequest,
  ): Promise<distributorOrder.DistributorOrderDetail> {
    return apiPut<distributorOrder.DistributorOrderDetail>(
      `v1/distributor/order/update/${id}`,
      req,
    );
  }

  async cancelOrder(id: string): Promise<distributorOrder.DistributorOrderDetail> {
    return apiPost<distributorOrder.DistributorOrderDetail>(`v1/distributor/order/cancel/${id}`);
  }

  async deliverOrder(id: string): Promise<distributorOrder.DistributorOrderDetail> {
    return apiPost<distributorOrder.DistributorOrderDetail>(`v1/distributor/order/deliver/${id}`);
  }

  async listOrders(
    params?: distributorOrder.DistributorOrderListParams,
  ): Promise<distributorOrder.DistributorOrderListItem[]> {
    const data = await apiGet<
      distributorOrder.DistributorOrderListItem[] | PaginatedList<distributorOrder.DistributorOrderListItem>
    >('v1/distributor/order/list', { searchParams: toSearchParams(params) });
    return unwrapList(data);
  }

  async getOrderStats(): Promise<distributorOrder.DistributorOrderDashboard> {
    return apiGet<distributorOrder.DistributorOrderDashboard>('v1/distributor/order/list/stats');
  }

  async listOrderProducts(): Promise<distributorOrder.DistributorOrderProductOption[]> {
    const data = await apiGet<
      distributorOrder.DistributorOrderProductOption[] | PaginatedList<distributorOrder.DistributorOrderProductOption>
    >('v1/distributor/order/products');
    return unwrapList(data);
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
