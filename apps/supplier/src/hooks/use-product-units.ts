import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { product } from '@energyiq/domain';
import { productUseCases } from '@/config/container';

const UNITS_QUERY_KEY = ['product-units'] as const;

export function useProductUnitsQuery(params?: product.ProductUnitListParams) {
  return useQuery({
    queryKey: [...UNITS_QUERY_KEY, params],
    queryFn: () => productUseCases.listUnits(params),
  });
}

export function useCreateProductUnitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: product.ProductUnitUpsertRequest) => productUseCases.createUnit(req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY }),
  });
}

export function useUpdateProductUnitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: product.ProductUnitUpsertRequest }) =>
      productUseCases.updateUnit(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY }),
  });
}

export function useDeleteProductUnitMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productUseCases.deleteUnit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: UNITS_QUERY_KEY }),
  });
}
