// ════════════════════════════════════════════════════════════════
// Approval domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type ApprovalCategory = 'product' | 'order' | 'payment';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';

export interface FilterOption {
  label?: string;
  value?: string;
}

export interface QueueItem {
  id?: string;
  category?: ApprovalCategory | string;
  status?: ApprovalStatus | string;
  status_label?: string;
  title?: string;
  subtitle?: string;
  reference?: string;
  organization?: string;
  requested_by?: string;
  approval_level?: string;
  maker_comment?: string;
  checker_comment?: string;
  created_at?: string;
  resolved_at?: string;
}

export interface ReviewChange {
  field?: string;
  current?: string;
  proposed?: string;
}

export interface ReviewDetail extends QueueItem {
  current_vs_proposed?: ReviewChange[];
  require_reject_comment?: boolean;
}

export interface QueueSummary {
  pending_review?: number;
  approved?: number;
  rejected?: number;
}

export interface QueueListParams {
  category?: ApprovalCategory;
  status?: ApprovalStatus;
  limit?: number;
  offset?: number;
}

export interface QueueListResult {
  items: QueueItem[];
  limit: number;
  offset: number;
  total: number;
  categories: FilterOption[];
  statuses: FilterOption[];
  summary: QueueSummary;
}
