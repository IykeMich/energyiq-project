// ════════════════════════════════════════════════════════════════
// Distributor domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export type DistributorStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface DistributorAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface Distributor {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  tax_id?: string;
  tier?: string;
  status?: DistributorStatus | string;
  kyc_status?: string;
  risk_score?: number;
  supplier_id?: string;
  owner_user_id?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email_verified?: boolean;
  address?: DistributorAddress | Record<string, unknown>;
  activated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DistributorUpsertRequest {
  name: string;
  email: string;
  phone?: string;
  tax_id?: string;
  tier?: string;
  status?: DistributorStatus;
  address?: DistributorAddress | Record<string, unknown>;
}

export interface DistributorListParams {
  search?: string;
  status?: DistributorStatus;
  tier?: string;
  limit?: number;
  offset?: number;
}

