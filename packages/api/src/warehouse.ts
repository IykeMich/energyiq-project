import type { warehouse } from '@energyiq/domain';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

// ════════════════════════════════════════════════════════════════
// Warehouse API adapter — implements WarehouseApi port via HTTP.
// Used by the warehouse use-cases in @energyiq/domain/warehouse.
// ════════════════════════════════════════════════════════════════

export class WarehouseApiAdapter implements warehouse.WarehouseApi {
  async createWarehouse(req: warehouse.WarehouseCreateRequest): Promise<warehouse.Warehouse> {
    return apiPost<warehouse.Warehouse>('v1/warehouses', req);
  }

  async getWarehouse(id: string): Promise<warehouse.Warehouse> {
    return apiGet<warehouse.Warehouse>(`v1/warehouses/${id}`);
  }

  async updateWarehouse(
    id: string,
    req: warehouse.WarehouseUpdateRequest,
  ): Promise<warehouse.Warehouse> {
    return apiPut<warehouse.Warehouse>(`v1/warehouses/${id}`, req);
  }

  async deleteWarehouse(id: string): Promise<void> {
    await apiDelete(`v1/warehouses/${id}`);
  }

  async listWarehouses(
    params?: warehouse.WarehouseListParams,
  ): Promise<warehouse.WarehouseListResult> {
    return apiGet<warehouse.WarehouseListResult>('v1/warehouses', {
      searchParams: toSearchParams(params),
    });
  }

  async getWarehouseStats(): Promise<warehouse.WarehouseStats> {
    return apiGet<warehouse.WarehouseStats>('v1/warehouses/stats');
  }

  async listWarehouseProducts(
    id: string,
    params?: warehouse.WarehouseProductListParams,
  ): Promise<warehouse.WarehouseProductListResult> {
    return apiGet<warehouse.WarehouseProductListResult>(`v1/warehouses/${id}/products`, {
      searchParams: toSearchParams(params),
    });
  }

  async getWarehouseStock(id: string): Promise<warehouse.WarehouseStock> {
    return apiGet<warehouse.WarehouseStock>(`v1/warehouses/${id}/stock`);
  }

  async listStockTransfers(
    params?: warehouse.StockTransferListParams,
  ): Promise<warehouse.StockTransferListResult> {
    return apiGet<warehouse.StockTransferListResult>('v1/warehouses/transfers', {
      searchParams: toSearchParams(params),
    });
  }

  async createStockTransfer(
    req: warehouse.StockTransferCreateRequest,
  ): Promise<warehouse.StockTransfer> {
    return apiPost<warehouse.StockTransfer>('v1/warehouses/transfers', req);
  }

  async cancelStockTransfer(
    id: string,
    req: warehouse.StockTransferCancelRequest,
  ): Promise<warehouse.StockTransfer> {
    return apiPost<warehouse.StockTransfer>(`v1/warehouses/transfers/${id}/cancel`, req);
  }

  async confirmStockTransfer(id: string): Promise<warehouse.StockTransfer> {
    return apiPost<warehouse.StockTransfer>(`v1/warehouses/transfers/${id}/confirm`);
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
