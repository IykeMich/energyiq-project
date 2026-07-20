import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { warehouse } from '@energyiq/domain';
import { warehouseUseCases } from '@/config/container';

const WAREHOUSES_QUERY_KEY = ['warehouses'] as const;

export function useWarehousesQuery(params?: warehouse.WarehouseListParams) {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, 'list', params],
    queryFn: () => warehouseUseCases.listWarehouses(params),
  });
}

export function useWarehouseQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, 'detail', id],
    queryFn: () => warehouseUseCases.getWarehouse(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useWarehouseStatsQuery() {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, 'stats'],
    queryFn: () => warehouseUseCases.getWarehouseStats(),
  });
}

export function useWarehouseProductsQuery(
  id: string,
  params?: warehouse.WarehouseProductListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, 'products', id, params],
    queryFn: () => warehouseUseCases.listWarehouseProducts(id, params),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useWarehouseStockQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, 'stock', id],
    queryFn: () => warehouseUseCases.getWarehouseStock(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useStockTransfersQuery(params?: warehouse.StockTransferListParams) {
  return useQuery({
    queryKey: [...WAREHOUSES_QUERY_KEY, 'transfers', params],
    queryFn: () => warehouseUseCases.listStockTransfers(params),
  });
}

export function useCreateWarehouseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: warehouse.WarehouseCreateRequest) => warehouseUseCases.createWarehouse(req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}

export function useUpdateWarehouseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: warehouse.WarehouseUpdateRequest }) =>
      warehouseUseCases.updateWarehouse(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}

export function useDeleteWarehouseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warehouseUseCases.deleteWarehouse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}

export function useCreateStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: warehouse.StockTransferCreateRequest) =>
      warehouseUseCases.createStockTransfer(req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}

export function useCancelStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: warehouse.StockTransferCancelRequest }) =>
      warehouseUseCases.cancelStockTransfer(id, req),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}

export function useConfirmStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warehouseUseCases.confirmStockTransfer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAREHOUSES_QUERY_KEY }),
  });
}
