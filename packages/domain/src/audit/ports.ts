import type { AuditEntityTimelineResult, AuditListParams, AuditListResult } from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the audit domain needs.
// Implemented by the AuditApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface AuditApi {
  listAuditLogs(params?: AuditListParams): Promise<AuditListResult>;
  readAuditTimeline(
    entityType: string,
    entityId: string,
    params?: { limit?: number; offset?: number },
  ): Promise<AuditEntityTimelineResult>;
}
