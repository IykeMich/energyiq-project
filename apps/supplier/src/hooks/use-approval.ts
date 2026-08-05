import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { approval } from '@energyiq/domain';
import { approvalUseCases } from '@/config/container';

const APPROVAL_QUERY_KEY = ['approval'] as const;

export function useApprovalListQuery(params?: approval.QueueListParams) {
  return useQuery({
    queryKey: [...APPROVAL_QUERY_KEY, 'list', params],
    queryFn: () => approvalUseCases.listQueue(params),
  });
}

export function useApprovalDashboardQuery(category?: approval.ApprovalCategory) {
  return useQuery({
    queryKey: [...APPROVAL_QUERY_KEY, 'dashboard', category],
    queryFn: () => approvalUseCases.getDashboard(category),
  });
}

export function useApprovalDetailQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...APPROVAL_QUERY_KEY, 'detail', id],
    queryFn: () => approvalUseCases.getRequest(id),
    enabled: options?.enabled ?? Boolean(id),
  });
}

export function useApproveRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approvalUseCases.approveRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPROVAL_QUERY_KEY }),
  });
}

export function useRejectRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approvalUseCases.rejectRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPROVAL_QUERY_KEY }),
  });
}

export function useCancelRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approvalUseCases.cancelRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPROVAL_QUERY_KEY }),
  });
}
