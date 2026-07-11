import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { product } from '@energyiq/domain';
import { productUseCases } from '@/config/container';

const CATEGORIES_QUERY_KEY = ['product-categories'] as const;

export function useProductCategoriesQuery(params?: product.ProductCategoryListParams) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, params],
    queryFn: () => productUseCases.listCategories(params),
  });
}

export function useCreateProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: product.ProductCategoryUpsertRequest) => productUseCases.createCategory(req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
  });
}

export function useUpdateProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: product.ProductCategoryUpsertRequest }) =>
      productUseCases.updateCategory(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
  });
}

export function useDeleteProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productUseCases.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
  });
}
