import type { audit } from '@energyiq/domain';
import { apiGet } from './client';

// ════════════════════════════════════════════════════════════════
// Audit API adapter — implements AuditApi port via HTTP.
// Used by the audit use-cases in @energyiq/domain/audit.
// ════════════════════════════════════════════════════════════════

export class AuditApiAdapter implements audit.AuditApi {
  async listAuditLogs(
    params?: audit.AuditListParams,
  ): Promise<audit.AuditListResult> {
    return apiGet<audit.AuditListResult>('v1/audit/list', {
      searchParams: toSearchParams(params),
    });
  }

  async readAuditTimeline(
    entityType: string,
    entityId: string,
    params?: { limit?: number; offset?: number },
  ): Promise<audit.AuditEntityTimelineResult> {
    return apiGet<audit.AuditEntityTimelineResult>(
      `v1/audit/read/${entityType}/${entityId}`,
      {
        searchParams: toSearchParams(params),
      },
    );
  }
}

function toSearchParams(
  params?: object,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;

  const entries: [string, string | number | boolean][] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      entries.push([key, value as string | number | boolean]);
    }
  }

  return entries.length > 0
    ? Object.fromEntries(entries)
    : undefined;
}
