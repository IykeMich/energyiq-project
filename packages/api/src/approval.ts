import type { approval } from '@energyiq/domain';
import { apiGet, apiPost, toSearchParams } from './client';

// ════════════════════════════════════════════════════════════════
// Approval API adapter — implements ApprovalApi port via HTTP.
// Used by the approval use-cases in @energyiq/domain/approval.
// ════════════════════════════════════════════════════════════════

export class ApprovalApiAdapter implements approval.ApprovalApi {
  async listQueue(params?: approval.QueueListParams): Promise<approval.QueueListResult> {
    return apiGet<approval.QueueListResult>('v1/approval/list', { searchParams: toSearchParams(params) });
  }

  async getDashboard(category?: approval.ApprovalCategory): Promise<approval.QueueSummary> {
    return apiGet<approval.QueueSummary>('v1/approval/dashboard', {
      searchParams: category ? { category } : undefined,
    });
  }

  async getRequest(id: string): Promise<approval.ReviewDetail> {
    return apiGet<approval.ReviewDetail>(`v1/approval/read/${id}`);
  }

  async approveRequest(id: string): Promise<void> {
    await apiPost(`v1/approval/approve/${id}`);
  }

  async rejectRequest(id: string): Promise<void> {
    await apiPost(`v1/approval/reject/${id}`);
  }

  async cancelRequest(id: string): Promise<void> {
    await apiPost(`v1/approval/cancel/${id}`);
  }
}
