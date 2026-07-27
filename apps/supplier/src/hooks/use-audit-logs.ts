import { useQuery } from '@tanstack/react-query';
import type { audit } from '@energyiq/domain';
import { auditUseCases } from '@/config/container';

const AUDIT_LOGS_QUERY_KEY = ['audit-logs'] as const;

export function useAuditLogsQuery(params?: audit.AuditListParams) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, 'list', params],
    queryFn: () => auditUseCases.listAuditLogs(params),
  });
}

export function useAuditTimelineQuery(
  entityType: string,
  entityId: string,
  params?: { limit?: number; offset?: number },
) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, 'timeline', entityType, entityId, params],
    queryFn: () => auditUseCases.readAuditTimeline(entityType, entityId, params),
    enabled: Boolean(entityType) && Boolean(entityId),
  });
}
