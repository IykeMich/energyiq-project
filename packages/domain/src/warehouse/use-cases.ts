import type { WarehouseApi } from './ports';
import type {
  Warehouse,
  WarehouseListParams,
  WarehouseStats,
  WarehouseCreateRequest,
  WarehouseUpdateRequest,
  WarehouseProductListParams,
  WarehouseProductListResult,
  WarehouseStock,
  StockTransfer,
  StockTransferListParams,
  StockTransferListResult,
  StockTransferCreateRequest,
  StockTransferCancelRequest,
} from './types';

// ════════════════════════════════════════════════════════════════
// Warehouse use cases — thin orchestration over the WarehouseApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class WarehouseUseCases {
  private api: WarehouseApi;

  constructor(api: WarehouseApi) {
    this.api = api;
  }

  async createWarehouse(req: WarehouseCreateRequest): Promise<Warehouse> {
    return this.api.createWarehouse(req);
  }

  async getWarehouse(id: string): Promise<Warehouse> {
    return this.api.getWarehouse(id);
  }

  async updateWarehouse(id: string, req: WarehouseUpdateRequest): Promise<Warehouse> {
    return this.api.updateWarehouse(id, req);
  }

  async deleteWarehouse(id: string): Promise<void> {
    return this.api.deleteWarehouse(id);
  }

  async listWarehouses(params?: WarehouseListParams): Promise<Warehouse[]> {
    return this.api.listWarehouses(params);
  }

  async getWarehouseStats(): Promise<WarehouseStats> {
    return this.api.getWarehouseStats();
  }

  async listWarehouseProducts(
    id: string,
    params?: WarehouseProductListParams,
  ): Promise<WarehouseProductListResult> {
    return this.api.listWarehouseProducts(id, params);
  }

  async getWarehouseStock(id: string): Promise<WarehouseStock> {
    return this.api.getWarehouseStock(id);
  }

  async listStockTransfers(params?: StockTransferListParams): Promise<StockTransferListResult> {
    return this.api.listStockTransfers(params);
  }

  async createStockTransfer(req: StockTransferCreateRequest): Promise<StockTransfer> {
    return this.api.createStockTransfer(req);
  }

  async cancelStockTransfer(id: string, req: StockTransferCancelRequest): Promise<StockTransfer> {
    return this.api.cancelStockTransfer(id, req);
  }

  async confirmStockTransfer(id: string): Promise<StockTransfer> {
    return this.api.confirmStockTransfer(id);
  }
}
