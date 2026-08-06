import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { tier } from '@energyiq/domain';
import { tierUseCases } from '@/config/container';

const TIERS_QUERY_KEY = ['tiers'] as const;

export function useTierListQuery() {
  return useQuery({
    queryKey: TIERS_QUERY_KEY,
    queryFn: () => tierUseCases.listTierConfig(),
  });
}

export function useUpdateTierConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: tier.TierUpdateRequest) => tierUseCases.updateTierConfig(req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: TIERS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useTierHistoryQuery(
  distributorId: string,
  params?: tier.TierHistoryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...TIERS_QUERY_KEY, 'history', distributorId, params],
    queryFn: () => tierUseCases.getTierHistory(distributorId, params),
    enabled: options?.enabled ?? Boolean(distributorId),
  });
}
