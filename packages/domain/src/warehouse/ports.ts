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
// Outbound port — interface the warehouse domain needs.
// Implemented by the WarehouseApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface WarehouseApi {
  createWarehouse(req: WarehouseCreateRequest): Promise<Warehouse>;
  getWarehouse(id: string): Promise<Warehouse>;
  updateWarehouse(id: string, req: WarehouseUpdateRequest): Promise<Warehouse>;
  deleteWarehouse(id: string): Promise<void>;
  listWarehouses(params?: WarehouseListParams): Promise<Warehouse[]>;
  getWarehouseStats(): Promise<WarehouseStats>;
  listWarehouseProducts(
    id: string,
    params?: WarehouseProductListParams,
  ): Promise<WarehouseProductListResult>;
  getWarehouseStock(id: string): Promise<WarehouseStock>;
  listStockTransfers(params?: StockTransferListParams): Promise<StockTransferListResult>;
  createStockTransfer(req: StockTransferCreateRequest): Promise<StockTransfer>;
  cancelStockTransfer(id: string, req: StockTransferCancelRequest): Promise<StockTransfer>;
  confirmStockTransfer(id: string): Promise<StockTransfer>;
}
