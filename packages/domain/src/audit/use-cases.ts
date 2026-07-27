import type { AuditApi } from './ports';
import type {
  AuditEntityTimelineResult,
  AuditListParams,
  AuditListResult,
} from './types';

// ════════════════════════════════════════════════════════════════
// Audit use cases — thin orchestration over the AuditApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class AuditUseCases {
  private api: AuditApi;

  constructor(api: AuditApi) {
    this.api = api;
  }

  async listAuditLogs(params?: AuditListParams): Promise<AuditListResult> {
    return this.api.listAuditLogs(params);
  }

  async readAuditTimeline(
    entityType: string,
    entityId: string,
    params?: { limit?: number; offset?: number },
  ): Promise<AuditEntityTimelineResult> {
    return this.api.readAuditTimeline(entityType, entityId, params);
  }
}
