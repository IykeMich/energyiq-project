import type { distributor } from '@energyiq/domain';
import { apiGet, apiPost, apiPut, apiDelete } from './client';

// ════════════════════════════════════════════════════════════════
// Distributor API adapter — implements DistributorApi port via HTTP.
// Used by the distributor use-cases in @energyiq/domain/distributor.
// ════════════════════════════════════════════════════════════════
export class DistributorApiAdapter implements distributor.DistributorApi {
  // ── Distributors ─────────────────────────────────────────────

  async createDistributor(
    req: distributor.DistributorUpsertRequest,
  ): Promise<distributor.Distributor> {
    return apiPost<distributor.Distributor>('v1/distributor/create', req);
  }

  async getDistributor(id: string): Promise<distributor.Distributor> {
    return apiGet<distributor.Distributor>(`v1/distributor/read/${id}`);
  }

  async updateDistributor(
    id: string,
    req: distributor.DistributorUpsertRequest,
  ): Promise<distributor.Distributor> {
    return apiPut<distributor.Distributor>(
      `v1/distributor/update/${id}`,
      req,
    );
  }

  async deleteDistributor(id: string): Promise<void> {
    await apiDelete(`v1/distributor/delete/${id}`);
  }

  async activateDistributor(id: string): Promise<distributor.Distributor> {
    return apiPost<distributor.Distributor>(`v1/distributor/activate/${id}`);
  }

  async listDistributors(
    params?: distributor.DistributorListParams,
  ): Promise<distributor.DistributorListResult> {
    return apiGet<distributor.DistributorListResult>(
      'v1/distributor/list',
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