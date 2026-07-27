import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { complaint } from '@energyiq/domain';
import { complaintUseCases } from '@/config/container';

const COMPLAINTS_QUERY_KEY = ['complaints'] as const;

export function useReviewComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req?: complaint.ComplaintReviewRequest }) =>
      complaintUseCases.reviewComplaint(id, req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: COMPLAINTS_QUERY_KEY, refetchType: 'all' }),
  });
}

export function useResolveComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: complaint.ComplaintResolveRequest }) =>
      complaintUseCases.resolveComplaint(id, req),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: COMPLAINTS_QUERY_KEY, refetchType: 'all' }),
  });
}
