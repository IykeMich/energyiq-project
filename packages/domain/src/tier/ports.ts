import type {
  TierHistoryParams,
  TierHistoryResult,
  TierUpdateRequest,
  TierUpdateResult,
} from './types';

// ════════════════════════════════════════════════════════════════
// Outbound port — interface the tier domain needs.
// Implemented by the TierApiAdapter.
// ════════════════════════════════════════════════════════════════

export interface TierApi {
  updateTierConfig(req: TierUpdateRequest): Promise<TierUpdateResult>;
  getTierHistory(distributorId: string, params?: TierHistoryParams): Promise<TierHistoryResult>;
}
