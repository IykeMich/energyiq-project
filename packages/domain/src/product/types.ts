// ════════════════════════════════════════════════════════════════
// Product domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

/** Matches the literal status enum on ProductResponse/ProductStats/StatusUpdateRequest in swagger. */
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'scheduled';
/** Values PATCH /v1/product/status/{id} accepts — same set as ProductStatus above. */
export type ProductStatusUpdateValue = ProductStatus;
export type ProductType = 'single_product' | 'product_with_variants';
export type PriceType = 'tiered' | 'untiered';
export type ApprovalWorkflow = 'auto-approve' | 'scheduled';
export type DistributorVisibility = 'all_distributors' | 'tier_based' | 'selected_distributors';
export type TaxType = 'VAT' | 'GST' | 'SalesTax' | 'None';
export type Currency = 'NGN' | 'USD';

export interface ProductImage {
  key: string;
  url: string;
  alt_text?: string;
  is_primary?: boolean;
  sort_order?: number;
}

export interface ProductVariant {
  sku: string;
  display_name: string;
  cost_price: number;
  selling_price: number;
}

export interface TierPricing {
  tier: string;
  unit_price: number;
  min_quantity?: number;
  max_quantity?: number;
}

export interface TaxConfiguration {
  tax_type: TaxType;
  tax_rate: number;
}

export interface WarehouseAllocation {
  warehouse_id: string;
  quantity?: number;
  reorder_point?: number;
  max_stock?: number;
  storage_location?: string;
}

export interface Product {
  id?: string;
  sku?: string;
  name?: string;
  description?: string;
  category_id?: string;
  category_name?: string;
  unit?: string;
  currency?: Currency | string;
  base_price?: number | string;
  cost_price?: number;
  packaging_type?: string;
  status?: ProductStatus | string;
  status_label?: string;
  product_type?: ProductType | string;
  price_type?: PriceType | string;
  approval_workflow?: ApprovalWorkflow | string;
  distributor_visibility?: DistributorVisibility | string;
  activation_at?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  tier_pricing?: TierPricing[];
  tax_configuration?: TaxConfiguration;
  supplier_id?: string;
  warehouse_allocations?: WarehouseAllocation[];
  /** Available actions the caller may take on this product, e.g. ["edit", "delete"]. */
  available_actions?: string[];
  stock_level_label?: string;
  stock_level_percentage?: number;
  total_max_stock?: number;
  total_stock_quantity?: number;
  /** Untyped on the read response in swagger (`type: object`, no nested schema) — see the write-side `*Request` schemas if this ever needs real fields. */
  access_rules?: Record<string, unknown>;
  compliance?: Record<string, unknown>;
  pricing_config?: Record<string, unknown>;
  trading_rules?: Record<string, unknown>;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductUpsertRequest {
  name: string;
  sku: string;
  category_id: string;
  unit: string;
  currency: string;
  base_price: number;
  cost_price?: number;
  description?: string;
  packaging_type?: string;
  status?: 'draft' | 'active';
  product_type: ProductType;
  price_type: PriceType;
  approval_workflow: ApprovalWorkflow;
  distributor_visibility: DistributorVisibility;
  activation_at?: string;
  images?: ProductImage[];
  product_variants?: ProductVariant[];
  tier_pricing?: TierPricing[];
  tax_configuration?: TaxConfiguration;
  warehouse_allocations?: WarehouseAllocation[];
}

export interface ProductListParams {
  status?: ProductStatus;
  category_id?: string;
  search?: string;
  currency?: Currency;
  unit?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface ProductStats {
  total?: number;
  draft?: number;
  active?: number;
  inactive?: number;
  scheduled?: number;
}

export interface ProductStatusUpdateRequest {
  status: ProductStatusUpdateValue;
}

export interface ProductPriceCalculation {
  applied_tier?: string;
  base_price?: number;
  discount?: number;
  discount_percentage?: number;
  final_price?: number;
}

export interface ProductImagePresignRequest {
  file_name: string;
  content_type: 'image/jpeg' | 'image/png' | 'image/webp';
  size: number;
}

export interface ProductImagePresignResult {
  key?: string;
  upload_url?: string;
  public_url?: string;
  method?: string;
  headers?: Record<string, string>;
  expires_at?: string;
}

// ── Product categories ──────────────────────────────────────────

export type CategoryStatus = 'active' | 'inactive';

export interface ProductCategory {
  id?: string;
  name?: string;
  description?: string;
  status?: CategoryStatus | string;
  supplier_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategoryUpsertRequest {
  name: string;
  description?: string;
  status?: CategoryStatus;
}

export interface ProductCategoryListParams {
  status?: CategoryStatus;
}

// ── Product units ────────────────────────────────────────────────

export type UnitStatus = 'active' | 'inactive';

export interface ProductUnit {
  id?: string;
  unit_name?: string;
  short_code?: string;
  type?: string;
  description?: string;
  status?: UnitStatus | string;
  supplier_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductUnitUpsertRequest {
  unit_name: string;
  short_code: string;
  type: string;
  description?: string;
  status?: UnitStatus;
}

export interface ProductUnitListParams {
  status?: UnitStatus;
  type?: string;
  search?: string;
}
