import type { distributor } from '@energyiq/domain';

export type DistributorTier = 'Bronze' | 'Silver' | 'Gold';
export type DistributorStatus = 'active' | 'pending' | 'suspended' | 'inactive';

export interface Distributor {
  id: string;
  name: string;
  tier: DistributorTier;
  /** Not returned by GET /v1/distributor/list or /read/{id} — render '—' until backend adds it. */
  totalOrders?: number;
  /** Not returned by the API — render '—' until backend adds it. */
  totalValueNGN?: number;
  /** Not returned by the API — render '—' until backend adds it. */
  lastOrder?: string;
  /** Derived from address.city/state when present; '—' otherwise. */
  location?: string;
  status: DistributorStatus;
}

const TIER_VALUES: readonly DistributorTier[] = ['Bronze', 'Silver', 'Gold'];
const STATUS_VALUES: readonly DistributorStatus[] = ['active', 'pending', 'suspended', 'inactive'];

/** Normalizes the API's freeform `tier` string (e.g. "gold") into the UI's display casing, falling back to Bronze for unrecognized values. */
export function normalizeTier(raw?: string): DistributorTier {
  const match = TIER_VALUES.find((tier) => tier.toLowerCase() === raw?.toLowerCase());
  return match ?? 'Bronze';
}

/** Normalizes the API's freeform `status` string into the UI's known set, falling back to inactive for unrecognized values. */
export function normalizeStatus(raw?: string): DistributorStatus {
  const match = STATUS_VALUES.find((status) => status === raw?.toLowerCase());
  return match ?? 'inactive';
}

function formatLocation(address?: distributor.DistributorAddress | Record<string, unknown>): string | undefined {
  if (!address || typeof address !== 'object') return undefined;
  const city = 'city' in address ? (address.city as string | undefined) : undefined;
  const state = 'state' in address ? (address.state as string | undefined) : undefined;
  const parts = [city, state].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : undefined;
}

/** Maps a distributor as returned by GET /v1/distributor/list or /read/{id} into the UI's table/detail row shape. */
export function toDistributorRow(item: distributor.Distributor): Distributor {
  return {
    id: item.id ?? '',
    name: item.name ?? '',
    tier: normalizeTier(item.tier),
    status: normalizeStatus(item.status),
    location: formatLocation(item.address),
  };
}

export interface DistributorSummary {
  total: number;
  activeThisMonth: number;
  goldTier: number;
  pendingApproval: number;
}

export function buildDistributorSummary(rows: Distributor[]): DistributorSummary {
  return {
    total: rows.length,
    activeThisMonth: rows.filter((r) => r.status === 'active').length,
    goldTier: rows.filter((r) => r.tier === 'Gold').length,
    pendingApproval: rows.filter((r) => r.status === 'pending').length,
  };
}

// --- Distributor approval (pending applications) ---------------------------

// Payload sent when inviting a new distributor.
// TODO(orval): replace with the generated send-invite mutation request body.
export interface DistributorInvitePayload {
  distributorName: string;
  email: string;
  phone: string;
  contactPerson: string;
  location: string;
  assuranceAmountNGN?: number;
}

export type ApplicationReviewStatus = 'awaiting';
export type ApplicationAssuranceStatus = 'paid' | 'pending';

export interface DistributorApplication {
  id: string;
  submittedLabel: string;
  businessName: string;
  contactName: string;
  state: string; // shown in the card subtitle and Business Details > Location
  headquarters: string; // shown in the detail header subtitle
  appliedLabel: string;
  reviewStatus: ApplicationReviewStatus;
  assuranceStatus: ApplicationAssuranceStatus;
  email: string;
  phone: string;
  cacRegNo: string;
  taxId: string;
  documentsSubmitted: number;
  documentsTotal: number;
  riskScore: number; // out of 100
  assuranceFeeNGN: number;
}

/**
 * Maps a pending distributor (GET /v1/distributor/list?status=pending) into the approval
 * review card/detail shape. Fields the backend doesn't return yet (cacRegNo, document
 * counts, assurance status/fee) stay placeholder values until the read endpoint grows them.
 */
export function toDistributorApplication(item: distributor.Distributor): DistributorApplication {
  const appliedMonth = formatMonthYear(item.created_at);
  const address = item.address && typeof item.address === 'object' ? item.address : undefined;
  const state = (address && 'state' in address ? (address.state as string | undefined) : undefined) ?? '—';

  return {
    id: item.id ?? '',
    submittedLabel: appliedMonth ? `Submitted ${appliedMonth}` : 'Submitted —',
    businessName: item.name ?? '',
    contactName: item.owner_name ?? '—',
    state,
    headquarters: formatLocation(item.address) ?? '—',
    appliedLabel: appliedMonth ? `Applied ${appliedMonth}` : 'Applied —',
    reviewStatus: 'awaiting',
    // TODO(orval): no assurance-fee-status field exists on Distributor yet.
    assuranceStatus: 'pending',
    email: item.email ?? '',
    phone: item.phone ?? '',
    // TODO(orval): no CAC registration number field exists on Distributor yet.
    cacRegNo: '—',
    taxId: item.tax_id ?? '—',
    // TODO(orval): no per-document submission counts exist on Distributor yet.
    documentsSubmitted: 0,
    documentsTotal: 0,
    riskScore: item.risk_score ?? 0,
    // TODO(orval): no assurance fee field exists on Distributor yet.
    assuranceFeeNGN: 0,
  };
}

// TODO(orval): remove once every consumer reads from toDistributorApplication(real data).
export const DISTRIBUTOR_APPLICATIONS_MOCK: DistributorApplication[] = [
  {
    id: 'app-001',
    submittedLabel: 'Submitted Feb 2026',
    businessName: 'Okafor Energy Solutions',
    contactName: 'Ifeoma Okereke',
    state: 'Enugu State',
    headquarters: 'Port Harcourt, Rivers',
    appliedLabel: 'Applied Jan 2026',
    reviewStatus: 'awaiting',
    assuranceStatus: 'paid',
    email: 'i.okafor@okaforenergy.ng',
    phone: '+234 805 119 3347',
    cacRegNo: 'RC-5573021',
    taxId: '31220456-0002',
    documentsSubmitted: 4,
    documentsTotal: 4,
    riskScore: 94,
    assuranceFeeNGN: 100_000,
  },
  {
    id: 'app-002',
    submittedLabel: 'Submitted Feb 2026',
    businessName: 'Bayo Petroleum Ltd.',
    contactName: 'Bayo Adeyinka',
    state: 'Ondo State',
    headquarters: 'Akure, Ondo',
    appliedLabel: 'Applied Feb 2026',
    reviewStatus: 'awaiting',
    assuranceStatus: 'pending',
    email: 'b.adeyinka@bayopetroleum.ng',
    phone: '+234 803 442 1180',
    cacRegNo: 'RC-6611204',
    taxId: '44910872-0001',
    documentsSubmitted: 3,
    documentsTotal: 4,
    riskScore: 72,
    assuranceFeeNGN: 100_000,
  },
];

// --- Distributor details sheet ---------------------------------------------

export type DistributorOrderStatus = 'Pending' | 'Delivered';

/** Invite still awaiting acceptance (pending / cold / inactive distributors). */
export interface DistributorPendingInvite {
  invitedOn: string;
  inviteExpired: string;
  daysRemaining: string;
  invitedBy: string;
  email: string;
  subject: string;
  /** Recipient business name, referenced in the revoke confirmation banner. */
  recipientName: string;
}

/** Invite that has been accepted (active distributors). */
export interface DistributorAcceptedInvite {
  joined: string;
  contactPerson: string;
  ordersReceived: number;
  lastActivity: string;
  originalInvite: string;
  invitedBy: string;
  inviteSent: string;
}

/** Compliance KPI strip shown above the active-flow tabs. */
export interface DistributorKyc {
  kycScore: string;
  businessRisk: string;
  documentUpload: string;
}

export interface DistributorContact {
  email: string;
  contact: string;
  phone: string;
  location: string;
  joined: string;
}

export interface DistributorPerformance {
  /** Trust score out of 100, also used as the progress-bar fill percent. */
  trustScore: number;
  paymentDiscipline: string;
  activeMonths: string;
  complaints: number;
}

export interface DistributorOrderItem {
  product: string;
  ref: string;
  when: string;
  amount: string;
  status: DistributorOrderStatus;
}

export interface DistributorComplaintSummary {
  openCount: number;
  message: string;
}

export interface DistributorTierHistoryItem {
  tier: DistributorTier;
  label: string;
  date: string;
}

export interface DistributorDetail {
  /** "Joined {value}" shown in the sheet header subline. */
  headerJoined: string;
  pendingInvite: DistributorPendingInvite;
  acceptedInvite: DistributorAcceptedInvite;
  kyc: DistributorKyc;
  contact: DistributorContact;
  performance: DistributorPerformance;
  orders: DistributorOrderItem[];
  complaints: DistributorComplaintSummary;
  tierHistory: DistributorTierHistoryItem[];
}

function formatMonthYear(iso?: string): string | undefined {
  const date = iso ? new Date(iso) : undefined;
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
}

/** Coarse Low/Medium/High bucketing of the API's 0-100 `risk_score` — no equivalent label exists on the backend. */
function riskLabel(score?: number): string | undefined {
  if (typeof score !== 'number') return undefined;
  if (score < 30) return 'Low';
  if (score < 70) return 'Medium';
  return 'High';
}

/**
 * Detail payload for a single distributor row. `full` (from GET /v1/distributor/read/{id})
 * supplies the fields it actually has — email, phone, location, owner name, joined date,
 * risk bucket. Everything else below has no backend source yet and stays mocked; each
 * block maps to one tab in the details sheet and will be replaced by its own lazily
 * fetched query, so the tabs never load all at once.
 */
export function buildDistributorDetail(_distributor: Distributor, full?: distributor.Distributor): DistributorDetail {
  return {
    headerJoined: formatMonthYear(full?.activated_at ?? full?.created_at) ?? 'Apr 2023',

    // TODO(orval): replace with getDistributorInvite(distributor.id) — pending flow.
    pendingInvite: {
      invitedOn: 'Apr 19, 2026',
      inviteExpired: 'Apr 26, 2026',
      daysRemaining: 'Apr 19, 2026',
      invitedBy: 'You',
      email: 'abcfuels@gmail.com',
      subject: "You've been invited to join as a distributor",
      recipientName: 'ABC Fuels',
    },

    // TODO(orval): replace with getDistributorInvite(distributor.id) — accepted flow.
    acceptedInvite: {
      joined: 'Mar 22, 2026',
      contactPerson: 'Ada Chukwu',
      ordersReceived: 12,
      lastActivity: 'Today',
      originalInvite: 'Accepted March 22, 2026',
      invitedBy: 'You',
      inviteSent: 'March 18, 2026',
    },

    // TODO(orval): replace with getDistributorKyc(distributor.id) — kycScore and
    // documentUpload have no backend field yet; businessRisk is bucketed from
    // the real risk_score.
    kyc: {
      kycScore: '82%',
      businessRisk: riskLabel(full?.risk_score) ?? 'Low',
      documentUpload: '82%',
    },

    // Email/phone/location/joined come from GET /v1/distributor/read/{id}; contact person
    // has no backend field yet (owner_name is the account owner, not necessarily the
    // day-to-day contact) so it stays mocked.
    contact: {
      email: full?.email ?? 'i.okafor@okaforenergy.ng',
      contact: full?.owner_name ?? 'Ifeoma Okereke',
      phone: full?.phone ?? '+234 805 119 3347',
      location: formatLocation(full?.address) ?? 'Enugu State',
      joined: formatMonthYear(full?.created_at) ?? 'Jan 2025',
    },
    // TODO(orval): replace with getDistributorPerformance(distributor.id) — only
    // businessRisk above is sourced from the real risk_score; the rest has no
    // backend field yet.
    performance: {
      trustScore: 94,
      paymentDiscipline: '97%',
      activeMonths: '14 months',
      complaints: 1,
    },

    // TODO(orval): replace with getDistributorOrders(distributor.id).
    orders: [
      {
        product: 'Premium Motor Spirit',
        ref: 'ORD-2025-0841',
        when: 'Today, 9:14 AM',
        amount: '₦450,000',
        status: 'Pending',
      },
      {
        product: 'Premium Motor Spirit',
        ref: 'ORD-2025-0836',
        when: '3 days ago',
        amount: '₦700,000',
        status: 'Delivered',
      },
    ],

    // TODO(orval): replace with getDistributorComplaints(distributor.id).
    complaints: {
      openCount: 1,
      message: 'Requires resolution within 72 hours per SLA.',
    },

    // TODO(orval): replace with getDistributorTierHistory(distributor.id).
    tierHistory: [
      { tier: 'Gold', label: 'Promoted — 12+ months, 95%+ discipline', date: 'Mar 2026' },
      { tier: 'Silver', label: 'Promoted — 6 months, 90%+ discipline', date: 'Jul 2025' },
      { tier: 'Bronze', label: 'Joined Network', date: 'Jan 2025' },
    ],
  };
}
