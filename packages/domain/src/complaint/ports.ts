import type {
  Complaint,
  ComplaintResolveRequest,
  ComplaintReviewRequest,
  DistributorComplaintCreateRequest,
  DistributorComplaintListParams,
  DistributorComplaintListResult,
  DistributorComplaintOverview,
} from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the complaint domain needs.
// Implemented by the ComplaintApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface ComplaintApi {
  // ── Supplier actions ─────────────────────────────────────────
  reviewComplaint(id: string, req?: ComplaintReviewRequest): Promise<Complaint>;
  resolveComplaint(id: string, req: ComplaintResolveRequest): Promise<Complaint>;

  // ── Distributor actions ──────────────────────────────────────
  listDistributorComplaints(
    params?: DistributorComplaintListParams,
  ): Promise<DistributorComplaintListResult>;
  getDistributorComplaintOverview(): Promise<DistributorComplaintOverview>;
  getDistributorComplaint(id: string): Promise<Complaint>;
  createDistributorComplaint(req: DistributorComplaintCreateRequest): Promise<Complaint>;
  closeDistributorComplaint(id: string): Promise<Complaint>;
  escalateDistributorComplaint(id: string): Promise<Complaint>;
}
