import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { distributor } from '@energyiq/domain';
import { distributorUseCases } from '@/config/container';

const DISTRIBUTORS_QUERY_KEY = ['distributors'] as const;

export function useDistributorsQuery(
  params?: distributor.DistributorListParams,
) {
  return useQuery({
    queryKey: [...DISTRIBUTORS_QUERY_KEY, params],
    queryFn: () => distributorUseCases.listDistributors(params),
  });
}

export function useDistributorQuery(
  id: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...DISTRIBUTORS_QUERY_KEY, id],
    queryFn: () => distributorUseCases.getDistributor(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useActivateDistributorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => distributorUseCases.activateDistributor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DISTRIBUTORS_QUERY_KEY }),
  });
}