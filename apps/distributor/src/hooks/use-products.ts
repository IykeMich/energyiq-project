import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { product } from '@energyiq/domain';
import { productUseCases} from '@/config/container';

const PRODUCTS_QUERY_KEY = ['products'] as const;

export function useProductsQuery(params?: product.ProductListParams) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: () => productUseCases.listProducts(params),
  });
}

export function useProductQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => productUseCases.getProduct(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useProductStatsQuery() {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'stats'],
    queryFn: () => productUseCases.getProductStats(),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: product.ProductUpsertRequest) => productUseCases.createProduct(req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: product.ProductUpsertRequest }) =>
      productUseCases.updateProduct(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productUseCases.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}

export function useUpdateProductStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: product.ProductStatus }) =>
      productUseCases.updateProductStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY }),
  });
}
