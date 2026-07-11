import type {
  Product,
  ProductUpsertRequest,
  ProductListParams,
  ProductListResult,
  ProductStats,
  ProductStatusUpdateRequest,
  ProductPriceCalculation,
  ProductImagePresignRequest,
  ProductImagePresignResult,
  ProductCategory,
  ProductCategoryUpsertRequest,
  ProductCategoryListParams,
  ProductUnit,
  ProductUnitUpsertRequest,
  ProductUnitListParams,
} from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the product domain needs.
// Implemented by the ProductApiAdapter. Covers products, categories,
// and units in one port: all three are small CRUD sets over the same
// backend resource family, so splitting them into separate ports
// would just add files without adding clarity.
// ════════════════════════════════════════════════════════════════

export interface ProductApi {
  createProduct(req: ProductUpsertRequest): Promise<Product>;
  getProduct(id: string): Promise<Product>;
  updateProduct(id: string, req: ProductUpsertRequest): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  listProducts(params?: ProductListParams): Promise<ProductListResult>;
  getProductStats(): Promise<ProductStats>;
  cloneProduct(id: string, sku: string): Promise<Product>;
  updateProductStatus(id: string, req: ProductStatusUpdateRequest): Promise<Product>;
  calculateProductPrice(id: string, tier?: string): Promise<ProductPriceCalculation>;
  presignProductImage(req: ProductImagePresignRequest): Promise<ProductImagePresignResult>;

  createCategory(req: ProductCategoryUpsertRequest): Promise<ProductCategory>;
  getCategory(id: string): Promise<ProductCategory>;
  updateCategory(id: string, req: ProductCategoryUpsertRequest): Promise<ProductCategory>;
  deleteCategory(id: string): Promise<void>;
  listCategories(params?: ProductCategoryListParams): Promise<ProductCategory[]>;

  createUnit(req: ProductUnitUpsertRequest): Promise<ProductUnit>;
  getUnit(id: string): Promise<ProductUnit>;
  updateUnit(id: string, req: ProductUnitUpsertRequest): Promise<ProductUnit>;
  deleteUnit(id: string): Promise<void>;
  listUnits(params?: ProductUnitListParams): Promise<ProductUnit[]>;
}
