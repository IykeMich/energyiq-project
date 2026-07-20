// ════════════════════════════════════════════════════════════════
// Warehouse domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type WarehouseStatus = 'active' | 'inactive';

export interface Warehouse {
  id?: string;
  name?: string;
  location?: string;
  manager_id?: string;
  capacity?: number;
  status?: WarehouseStatus | string;
  supplier_id?: string;
  stock_level_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WarehouseListParams {
  status?: WarehouseStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface WarehouseListResult {
  items?: Warehouse[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface WarehouseStats {
  total_warehouses?: number;
  active?: number;
  inactive?: number;
  total_stock?: WarehouseStock;
  chart?: WarehouseStockPoint[];
}

export interface WarehouseStock {
  warehouse_id?: string;
  product_count?: number;
  total_quantity?: number;
  total_max_stock?: number;
  stock_level_percentage?: number;
  low_stock_product_count?: number;
  overstock_product_count?: number;
}

export interface WarehouseStockPoint {
  warehouse_id?: string;
  warehouse_name?: string;
  total_quantity?: number;
  total_max_stock?: number;
  stock_level_percentage?: number;
}

export interface WarehouseCreateRequest {
  name: string;
  location: string;
  manager_id?: string;
  capacity?: number;
  status: WarehouseStatus;
}

export interface WarehouseUpdateRequest {
  name: string;
  location: string;
  manager_id?: string;
  capacity?: number;
  status: WarehouseStatus;
  products?: WarehouseProductAssignment[];
}

export interface WarehouseProduct {
  product_id?: string;
  name?: string;
  sku?: string;
  unit?: string;
  quantity?: number;
  max_stock?: number;
  reorder_point?: number;
  storage_location?: string;
  stock_level_percentage?: number;
  inventory_last_updated_at?: string;
}

export interface WarehouseProductListParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface WarehouseProductListResult {
  items?: WarehouseProduct[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface WarehouseProductAssignment {
  product_id: string;
  quantity?: number;
  max_stock?: number;
  reorder_point?: number;
  storage_location?: string;
  remove?: boolean;
}

export type StockTransferStatus = 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'failed';

export interface StockTransfer {
  id?: string;
  product_id?: string;
  from_warehouse_id?: string;
  to_warehouse_id?: string;
  quantity?: number;
  notes?: string;
  status?: StockTransferStatus | string;
  requested_by?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  failure_reason?: string;
  supplier_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StockTransferListParams {
  status?: StockTransferStatus;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface StockTransferListResult {
  items?: StockTransfer[];
  limit?: number;
  offset?: number;
  total?: number;
}

export interface StockTransferCreateRequest {
  product_id: string;
  from_warehouse_id: string;
  to_warehouse_id: string;
  quantity: number;
  notes?: string;
}

export interface StockTransferCancelRequest {
  reason?: string;
}

export interface ProductPreview {
  product_id?: string;
  name?: string;
  sku?: string;
  quantity?: number;
  unit?: string;
}
