import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { distributorOrder } from '@energyiq/domain';
import { orderUseCases } from '@/config/container';

const ORDERS_QUERY_KEY = ['orders'] as const;

export function useOrdersQuery(params?: distributorOrder.DistributorOrderListParams) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'list', params],
    queryFn: () => orderUseCases.listOrders(params),
  });
}

export function useOrderQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => orderUseCases.getOrder(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useOrderStatsQuery() {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'stats'],
    queryFn: () => orderUseCases.getOrderStats(),
  });
}

export function useOrderProductsQuery() {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'products'],
    queryFn: () => orderUseCases.listOrderProducts(),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: distributorOrder.OrderCreateRequest) => orderUseCases.createOrder(req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: distributorOrder.OrderUpdateRequest }) =>
      orderUseCases.updateOrder(id, req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderUseCases.cancelOrder(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useDeliverOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderUseCases.deliverOrder(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}
