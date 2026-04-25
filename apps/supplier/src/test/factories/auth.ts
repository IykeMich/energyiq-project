import type {
  AuthUser,
  InitiateRequest,
  InitiateResult,
  CompleteResult,
  LoginResult,
  SupplierSummary,
} from '@energyiq/domain/auth';

// ════════════════════════════════════════════════════════════════
// Test factories — generate typed test data with sensible defaults.
// Override only what your test cares about.
//
// Usage: buildUser({ role: 'finance' })
// ════════════════════════════════════════════════════════════════

let counter = 0;
function nextId() {
  counter++;
  return `test-${counter}`;
}

export function buildUser(overrides: Partial<AuthUser> = {}): AuthUser {
  const id = nextId();
  return {
    id,
    name: 'Chioma Okonkwo',
    email: 'chioma@megaenergy.com',
    role: 'owner',
    entity_type: 'supplier',
    entity_id: id,
    account_number: '4829173650',
    slug: 'megaenergy',
    ...overrides,
  };
}

export function buildStaffUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return buildUser({
    name: 'Emeka Nwosu',
    email: 'emeka@megaenergy.com',
    role: 'manager',
    ...overrides,
  });
}

export function buildSupplierSummary(overrides: Partial<SupplierSummary> = {}): SupplierSummary {
  return {
    id: nextId(),
    account_number: '4829173650',
    slug: 'megaenergy',
    company_name: 'MegaEnergy Ltd',
    status: 'active',
    kyc_status: 'pending',
    ...overrides,
  };
}

export function buildInitiateRequest(overrides: Partial<InitiateRequest> = {}): InitiateRequest {
  return {
    company: {
      name: 'MegaEnergy Ltd',
      email: 'info@megaenergy.com',
      business_type: 'LPG Distribution',
      registration_number: 'RC123456',
    },
    account: {
      name: 'Chioma Okonkwo',
      email: 'chioma@megaenergy.com',
      password: 'SecurePass123!',
    },
    ...overrides,
  };
}

export function buildInitiateResult(overrides: Partial<InitiateResult> = {}): InitiateResult {
  return {
    registration_token: `reg_${nextId()}`,
    account_number: '4829173650',
    slug: 'megaenergy',
    ...overrides,
  };
}

export function buildCompleteResult(overrides: Partial<CompleteResult> = {}): CompleteResult {
  return {
    access_token: `acc_${nextId()}`,
    refresh_token: `ref_${nextId()}`,
    expires_in: 3600,
    supplier: buildSupplierSummary(),
    ...overrides,
  };
}

export function buildLoginResult(overrides: Partial<LoginResult> = {}): LoginResult {
  const user = buildUser();
  return {
    access_token: `acc_${nextId()}`,
    refresh_token: `ref_${nextId()}`,
    expires_in: 3600,
    login_type: 'account',
    user,
    ...overrides,
  };
}

export function buildStaffLoginResult(overrides: Partial<LoginResult> = {}): LoginResult {
  return buildLoginResult({
    login_type: 'staff',
    user: buildStaffUser(),
    ...overrides,
  });
}
