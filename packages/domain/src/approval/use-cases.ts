import type { ApprovalApi } from './ports';
import type { QueueListParams, QueueListResult, QueueSummary, ReviewDetail, ApprovalCategory } from './types';

// ════════════════════════════════════════════════════════════════
// Approval use cases — thin orchestration over the ApprovalApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class ApprovalUseCases {
  private api: ApprovalApi;

  constructor(api: ApprovalApi) {
    this.api = api;
  }

  async listQueue(params?: QueueListParams): Promise<QueueListResult> {
    return this.api.listQueue(params);
  }

  async getDashboard(category?: ApprovalCategory): Promise<QueueSummary> {
    return this.api.getDashboard(category);
  }

  async getRequest(id: string): Promise<ReviewDetail> {
    return this.api.getRequest(id);
  }

  async approveRequest(id: string): Promise<void> {
    return this.api.approveRequest(id);
  }

  async rejectRequest(id: string): Promise<void> {
    return this.api.rejectRequest(id);
  }

  async cancelRequest(id: string): Promise<void> {
    return this.api.cancelRequest(id);
  }
}
