import type { tier } from '@energyiq/domain';
import { apiGet, apiPut } from './client';

// ════════════════════════════════════════════════════════════════
// Tier API adapter — implements TierApi port via HTTP.
// Used by the tier use-cases in @energyiq/domain/tier.
// ════════════════════════════════════════════════════════════════

export class TierApiAdapter implements tier.TierApi {
  async updateTierConfig(
    req: tier.TierUpdateRequest,
  ): Promise<tier.TierUpdateResult> {
    const data = await apiPut<tier.TierConfig[]>('v1/tier/update', req);
    return { tiers: data };
  }

  async getTierHistory(
    distributorId: string,
    params?: tier.TierHistoryParams,
  ): Promise<tier.TierHistoryResult> {
    return apiGet<tier.TierHistoryResult>(`v1/tier/history/${distributorId}`, {
      searchParams: toSearchParams(params),
    });
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
