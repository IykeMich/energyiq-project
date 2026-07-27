// ════════════════════════════════════════════════════════════════
// Complaint domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type ComplaintStatus =
  | 'open'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'closed'
  | 'escalated';

export interface ComplaintEvidence {
  distributor_complaint_evidence_id?: string;
  distributor_complaint_evidence_url?: string;
  distributor_complaint_evidence_name?: string;
  distributor_complaint_evidence_kind?: string;
  distributor_complaint_evidence_size?: string;
  distributor_complaint_evidence_uploaded_at?: string;
}

export interface ComplaintTimelineEvent {
  distributor_complaint_activity_id?: string;
  distributor_complaint_activity_title?: string;
  distributor_complaint_activity_description?: string;
  distributor_complaint_activity_actor?: string;
  distributor_complaint_activity_actor_role?: string;
  distributor_complaint_activity_timestamp?: string;
  distributor_complaint_activity_metadata?: Record<string, unknown>;
}

export interface Complaint {
  distributor_complaint_id: string;
  distributor_complaint_code?: string;
  distributor_complaint_title?: string;
  distributor_complaint_description?: string;
  distributor_complaint_status?: string;
  distributor_complaint_status_code?: ComplaintStatus | string;
  distributor_complaint_category?: string;
  distributor_complaint_order_ref?: string;
  distributor_complaint_product?: string;
  distributor_complaint_quantity_affected?: number;
  distributor_complaint_estimated_amount?: number;
  distributor_complaint_date_raised?: string;
  distributor_complaint_supplier?: string;
  distributor_complaint_distributor?: string;
  distributor_complaint_evidence?: ComplaintEvidence[];
  distributor_complaint_activity_timeline?: ComplaintTimelineEvent[];
  distributor_complaint_can_close?: boolean;
  distributor_complaint_can_escalate?: boolean;
  distributor_complaint_can_review?: boolean;
  distributor_complaint_can_resolve?: boolean;
  distributor_complaint_review_started_at?: string;
  distributor_complaint_resolved_at?: string;
  distributor_complaint_resolution_notes?: string;
  distributor_complaint_resolution_type?: string;
  distributor_complaint_resolution_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ComplaintResolveRequest {
  resolution_notes: string;
  resolution_type: string;
  resolution_amount?: number;
}

export interface ComplaintReviewRequest {
  notes?: string;
}

// ════════════════════════════════════════════════════════════════
// Distributor complaint types
// ════════════════════════════════════════════════════════════════

export interface DistributorComplaintListParams {
  status?: string;
  limit?: number;
  offset?: number;
}

export interface DistributorComplaintListResult {
  items: Complaint[];
  limit: number;
  offset: number;
  total: number;
}

export interface DistributorComplaintOverview {
  total_complaints?: number;
  open_in_review?: number;
  resolved?: number;
  avg_resolution_time?: string;
}

export interface DistributorComplaintCreateEvidence {
  file_name: string;
  file_size_bytes: number;
  file_url: string;
  mime_type: string;
}

export interface DistributorComplaintCreateRequest {
  order_id: string;
  complaint_title: string;
  complaint_category: string;
  description: string;
  quantity_affected: string;
  estimated_amount: number;
  product_name?: string;
  expected_resolution?: string;
  claim_amount?: string;
  preferred_resolution?: string;
  evidence?: DistributorComplaintCreateEvidence[];
}
