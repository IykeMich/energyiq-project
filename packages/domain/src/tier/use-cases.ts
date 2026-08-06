import type { TierApi } from './ports';
import type {
  TierConfig,
  TierHistoryParams,
  TierHistoryResult,
  TierUpdateRequest,
  TierUpdateResult,
} from './types';

// ════════════════════════════════════════════════════════════════
// Tier use cases — thin orchestration over the TierApi port.
// Pure TypeScript. No React. No HTTP.
// ════════════════════════════════════════════════════════════════

export class TierUseCases {
  private api: TierApi;

  constructor(api: TierApi) {
    this.api = api;
  }

  async listTierConfig(): Promise<TierConfig[]> {
    return this.api.listTierConfig();
  }

  async updateTierConfig(req: TierUpdateRequest): Promise<TierUpdateResult> {
    return this.api.updateTierConfig(req);
  }

  async getTierHistory(
    distributorId: string,
    params?: TierHistoryParams,
  ): Promise<TierHistoryResult> {
    return this.api.getTierHistory(distributorId, params);
  }
}
