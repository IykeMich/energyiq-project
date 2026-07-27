// ════════════════════════════════════════════════════════════════
// Tier domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export interface TierConfig {
  tier: string;
  rank?: number;
  min_months: number;
  min_payment_discipline: number;
  min_volume: number;
  benefits: string[];
  active_distributors?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TierUpdateRequest {
  tiers: TierConfig[];
}

export interface TierUpdateResult {
  tiers: TierConfig[];
}

export interface TierHistoryItem {
  id: string;
  distributor_id: string;
  calculated_by: string;
  previous_tier: string;
  new_tier: string;
  reason: string;
  metrics: {
    account_age_months: number;
    eligible_orders: number;
    paid_orders: number;
    payment_discipline: number;
    purchase_volume: number;
  };
  created_at: string;
}

export interface TierHistoryParams {
  limit?: number;
  offset?: number;
}

export interface TierHistoryResult {
  items: TierHistoryItem[];
  limit: number;
  offset: number;
  total: number;
}
