import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { complaint } from '@energyiq/domain';
import { complaintUseCases } from '@/config/container';

const COMPLAINTS_QUERY_KEY = ['complaints'] as const;

export function useDistributorComplaintsQuery(params?: complaint.DistributorComplaintListParams) {
  return useQuery({
    queryKey: [...COMPLAINTS_QUERY_KEY, 'list', params],
    queryFn: () => complaintUseCases.listDistributorComplaints(params),
  });
}

export function useDistributorComplaintOverviewQuery() {
  return useQuery({
    queryKey: [...COMPLAINTS_QUERY_KEY, 'overview'],
    queryFn: () => complaintUseCases.getDistributorComplaintOverview(),
  });
}

export function useDistributorComplaintQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...COMPLAINTS_QUERY_KEY, 'detail', id],
    queryFn: () => complaintUseCases.getDistributorComplaint(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useCreateDistributorComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: complaint.DistributorComplaintCreateRequest) =>
      complaintUseCases.createDistributorComplaint(req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: COMPLAINTS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useCloseDistributorComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complaintUseCases.closeDistributorComplaint(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: COMPLAINTS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useEscalateDistributorComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complaintUseCases.escalateDistributorComplaint(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: COMPLAINTS_QUERY_KEY, refetchType: 'all' }),
  });
}
