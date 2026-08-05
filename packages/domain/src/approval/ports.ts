import type { QueueListParams, QueueListResult, QueueSummary, ReviewDetail, ApprovalCategory } from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the approval domain needs.
// Implemented by the ApprovalApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface ApprovalApi {
  listQueue(params?: QueueListParams): Promise<QueueListResult>;
  getDashboard(category?: ApprovalCategory): Promise<QueueSummary>;
  getRequest(id: string): Promise<ReviewDetail>;
  approveRequest(id: string): Promise<void>;
  rejectRequest(id: string): Promise<void>;
  cancelRequest(id: string): Promise<void>;
}
