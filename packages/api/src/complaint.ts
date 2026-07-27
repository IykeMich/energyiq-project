import type { complaint } from '@energyiq/domain';
import { apiGet, apiPost } from './client';

// ════════════════════════════════════════════════════════════════
// Complaint API adapter — implements ComplaintApi port via HTTP.
// Used by the complaint use-cases in @energyiq/domain/complaint.
// ════════════════════════════════════════════════════════════════

export class ComplaintApiAdapter implements complaint.ComplaintApi {
  // ── Supplier actions ─────────────────────────────────────────
  async reviewComplaint(
    id: string,
    req?: complaint.ComplaintReviewRequest,
  ): Promise<complaint.Complaint> {
    return apiPost<complaint.Complaint>(`v1/complaint/review/${id}`, req);
  }

  async resolveComplaint(
    id: string,
    req: complaint.ComplaintResolveRequest,
  ): Promise<complaint.Complaint> {
    return apiPost<complaint.Complaint>(`v1/complaint/resolve/${id}`, req);
  }

  // ── Distributor actions ──────────────────────────────────────
  async listDistributorComplaints(
    params?: complaint.DistributorComplaintListParams,
  ): Promise<complaint.DistributorComplaintListResult> {
    return apiGet<complaint.DistributorComplaintListResult>(
      'v1/distributor/complaint/list',
      {
        searchParams: toSearchParams(params),
      },
    );
  }

  async getDistributorComplaintOverview(): Promise<complaint.DistributorComplaintOverview> {
    return apiGet<complaint.DistributorComplaintOverview>('v1/distributor/complaint/overview');
  }

  async getDistributorComplaint(id: string): Promise<complaint.Complaint> {
    return apiGet<complaint.Complaint>(`v1/distributor/complaint/read/${id}`);
  }

  async createDistributorComplaint(
    req: complaint.DistributorComplaintCreateRequest,
  ): Promise<complaint.Complaint> {
    return apiPost<complaint.Complaint>('v1/distributor/complaint/create', req);
  }

  async closeDistributorComplaint(id: string): Promise<complaint.Complaint> {
    return apiPost<complaint.Complaint>(`v1/distributor/complaint/close/${id}`);
  }

  async escalateDistributorComplaint(id: string): Promise<complaint.Complaint> {
    return apiPost<complaint.Complaint>(`v1/distributor/complaint/escalate/${id}`);
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
