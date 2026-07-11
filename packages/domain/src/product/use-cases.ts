import type { ProductApi } from './ports';
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
// Product use cases — thin orchestration over the ProductApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class ProductUseCases {
  private api: ProductApi;

  constructor(api: ProductApi) {
    this.api = api;
  }

  // ── Products ─────────────────────────────────────────────────

  async createProduct(req: ProductUpsertRequest): Promise<Product> {
    return this.api.createProduct(req);
  }

  async getProduct(id: string): Promise<Product> {
    return this.api.getProduct(id);
  }

  async updateProduct(id: string, req: ProductUpsertRequest): Promise<Product> {
    return this.api.updateProduct(id, req);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.api.deleteProduct(id);
  }

  async listProducts(params?: ProductListParams): Promise<ProductListResult> {
    return this.api.listProducts(params);
  }

  async getProductStats(): Promise<ProductStats> {
    return this.api.getProductStats();
  }

  async cloneProduct(id: string, sku: string): Promise<Product> {
    return this.api.cloneProduct(id, sku);
  }

  async updateProductStatus(id: string, req: ProductStatusUpdateRequest): Promise<Product> {
    return this.api.updateProductStatus(id, req);
  }

  async calculateProductPrice(id: string, tier?: string): Promise<ProductPriceCalculation> {
    return this.api.calculateProductPrice(id, tier);
  }

  async presignProductImage(req: ProductImagePresignRequest): Promise<ProductImagePresignResult> {
    return this.api.presignProductImage(req);
  }

  // ── Categories ───────────────────────────────────────────────

  async createCategory(req: ProductCategoryUpsertRequest): Promise<ProductCategory> {
    return this.api.createCategory(req);
  }

  async getCategory(id: string): Promise<ProductCategory> {
    return this.api.getCategory(id);
  }

  async updateCategory(id: string, req: ProductCategoryUpsertRequest): Promise<ProductCategory> {
    return this.api.updateCategory(id, req);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.api.deleteCategory(id);
  }

  async listCategories(params?: ProductCategoryListParams): Promise<ProductCategory[]> {
    return this.api.listCategories(params);
  }

  // ── Units ────────────────────────────────────────────────────

  async createUnit(req: ProductUnitUpsertRequest): Promise<ProductUnit> {
    return this.api.createUnit(req);
  }

  async getUnit(id: string): Promise<ProductUnit> {
    return this.api.getUnit(id);
  }

  async updateUnit(id: string, req: ProductUnitUpsertRequest): Promise<ProductUnit> {
    return this.api.updateUnit(id, req);
  }

  async deleteUnit(id: string): Promise<void> {
    return this.api.deleteUnit(id);
  }

  async listUnits(params?: ProductUnitListParams): Promise<ProductUnit[]> {
    return this.api.listUnits(params);
  }
}
