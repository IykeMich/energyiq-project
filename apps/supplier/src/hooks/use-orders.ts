import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { order } from '@energyiq/domain';
import { orderUseCases } from '@/config/container';

const ORDERS_QUERY_KEY = ['orders'] as const;

export function useOrdersQuery(params?: order.OrderListParams) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'list', params],
    queryFn: () => orderUseCases.listOrders(params),
  });
}

export function useOrderQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'detail', id],
    queryFn: () => orderUseCases.getOrder(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useOrderStatsQuery(params?: order.OrderStatsParams) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, 'stats', params],
    queryFn: () => orderUseCases.getOrderStats(params),
  });
}

export function useApproveOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderUseCases.approveOrder(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useRejectOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: order.OrderRejectRequest }) =>
      orderUseCases.rejectOrder(id, req),
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

export function useDispatchOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: order.OrderDispatchRequest }) =>
      orderUseCases.dispatchOrder(id, req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useReceiveOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderUseCases.receiveOrder(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: order.OrderUpdateRequest }) =>
      orderUseCases.updateOrder(id, req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: order.OrderCreateRequest) => orderUseCases.createOrder(req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY, refetchType: 'all' }),
  });
}
