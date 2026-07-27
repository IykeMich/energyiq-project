import type { ComplaintApi } from './ports';
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
// Complaint use cases — thin orchestration over the ComplaintApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class ComplaintUseCases {
  private api: ComplaintApi;

  constructor(api: ComplaintApi) {
    this.api = api;
  }

  // ── Supplier actions ─────────────────────────────────────────
  async reviewComplaint(id: string, req?: ComplaintReviewRequest): Promise<Complaint> {
    return this.api.reviewComplaint(id, req);
  }

  async resolveComplaint(id: string, req: ComplaintResolveRequest): Promise<Complaint> {
    return this.api.resolveComplaint(id, req);
  }

  // ── Distributor actions ──────────────────────────────────────
  async listDistributorComplaints(
    params?: DistributorComplaintListParams,
  ): Promise<DistributorComplaintListResult> {
    return this.api.listDistributorComplaints(params);
  }

  async getDistributorComplaintOverview(): Promise<DistributorComplaintOverview> {
    return this.api.getDistributorComplaintOverview();
  }

  async getDistributorComplaint(id: string): Promise<Complaint> {
    return this.api.getDistributorComplaint(id);
  }

  async createDistributorComplaint(req: DistributorComplaintCreateRequest): Promise<Complaint> {
    return this.api.createDistributorComplaint(req);
  }

  async closeDistributorComplaint(id: string): Promise<Complaint> {
    return this.api.closeDistributorComplaint(id);
  }

  async escalateDistributorComplaint(id: string): Promise<Complaint> {
    return this.api.escalateDistributorComplaint(id);
  }
}
