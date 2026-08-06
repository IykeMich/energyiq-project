import type { product } from '@energyiq/domain';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

// ════════════════════════════════════════════════════════════════
// Product API adapter — implements ProductApi port via HTTP.
// Used by the product use-cases in @energyiq/domain/product.
// ════════════════════════════════════════════════════════════════

export class ProductApiAdapter implements product.ProductApi {
  // ── Products ─────────────────────────────────────────────────

  async createProduct(req: product.ProductUpsertRequest): Promise<product.Product> {
    return apiPost<product.Product>('v1/product/create', req);
  }

  async getProduct(id: string): Promise<product.Product> {
    return apiGet<product.Product>(`v1/product/read/${id}`);
  }

  async updateProduct(id: string, req: product.ProductUpsertRequest): Promise<product.Product> {
    return apiPut<product.Product>(`v1/product/update/${id}`, req);
  }

  async deleteProduct(id: string): Promise<void> {
    await apiDelete(`v1/product/delete/${id}`);
  }

  async listProducts(params?: product.ProductListParams): Promise<product.Product[]> {
    return apiGet<product.Product[]>('v1/product/list', { searchParams: toSearchParams(params) });
  }

  async getProductStats(): Promise<product.ProductStats> {
    return apiGet<product.ProductStats>('v1/product/list/stats');
  }

  async cloneProduct(id: string, sku: string): Promise<product.Product> {
    return apiPost<product.Product>(`v1/product/clone/${id}`, { sku });
  }

  async updateProductStatus(
    id: string,
    req: product.ProductStatusUpdateRequest,
  ): Promise<product.Product> {
    return apiPut<product.Product>(`v1/product/status/${id}`, req);
  }

  async calculateProductPrice(id: string, tier?: string): Promise<product.ProductPriceCalculation> {
    return apiGet<product.ProductPriceCalculation>(`v1/product/price/${id}`, {
      searchParams: tier ? { tier } : undefined,
    });
  }

  async presignProductImage(
    req: product.ProductImagePresignRequest,
  ): Promise<product.ProductImagePresignResult> {
    return apiPost<product.ProductImagePresignResult>('v1/product/images/presign', req);
  }

  // ── Categories ───────────────────────────────────────────────

  async createCategory(req: product.ProductCategoryUpsertRequest): Promise<product.ProductCategory> {
    return apiPost<product.ProductCategory>('v1/product/categories', req);
  }

  async getCategory(id: string): Promise<product.ProductCategory> {
    return apiGet<product.ProductCategory>(`v1/product/categories/${id}`);
  }

  async updateCategory(
    id: string,
    req: product.ProductCategoryUpsertRequest,
  ): Promise<product.ProductCategory> {
    return apiPut<product.ProductCategory>(`v1/product/categories/${id}`, req);
  }

  async deleteCategory(id: string): Promise<void> {
    await apiDelete(`v1/product/categories/${id}`);
  }

  async listCategories(params?: product.ProductCategoryListParams): Promise<product.ProductCategory[]> {
    return apiGet<product.ProductCategory[]>('v1/product/categories', {
      searchParams: params?.status ? { status: params.status } : undefined,
    });
  }

  // ── Units ────────────────────────────────────────────────────

  async createUnit(req: product.ProductUnitUpsertRequest): Promise<product.ProductUnit> {
    return apiPost<product.ProductUnit>('v1/product/units', req);
  }

  async getUnit(id: string): Promise<product.ProductUnit> {
    return apiGet<product.ProductUnit>(`v1/product/units/${id}`);
  }

  async updateUnit(id: string, req: product.ProductUnitUpsertRequest): Promise<product.ProductUnit> {
    return apiPut<product.ProductUnit>(`v1/product/units/${id}`, req);
  }

  async deleteUnit(id: string): Promise<void> {
    await apiDelete(`v1/product/units/${id}`);
  }

  async listUnits(params?: product.ProductUnitListParams): Promise<product.ProductUnit[]> {
    return apiGet<product.ProductUnit[]>('v1/product/units', { searchParams: toSearchParams(params) });
  }
}

function toSearchParams(params?: object): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;
  const entries: [string, string | number | boolean][] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) entries.push([key, value as string | number | boolean]);
  }
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
