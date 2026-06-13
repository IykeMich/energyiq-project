export type DistributorTier = 'Bronze' | 'Silver' | 'Gold';
export type DistributorStatus = 'active' | 'pending' | 'cold' | 'inactive';

export interface Distributor {
  id: string;
  name: string;
  tier: DistributorTier;
  totalOrders: number;
  totalValueNGN: number;
  lastOrder: string;
  location: string;
  status: DistributorStatus;
}

export interface DistributorSummary {
  total: number;
  activeThisMonth: number;
  coldTier: number;
  pendingApproval: number;
}

const sampleNames = [
  'Stardvile Oil',
  'PrimeFuel Distributors',
  'Apex Energy Ltd',
  'Bluewave Trading',
  'NorthStar Petroleum',
  'Zenith Logistics',
  'GreenLine Distribution',
];

const sampleLocations = [
  'Port Harcourt, Rivers',
  'Ibadan, Oyo',
  'Lagos Island, Lagos',
  'Wuse, Abuja',
  'Awka, Anambra',
  'Kano, Kano',
  'Lekki, Lagos',
];

const sampleDates = [
  '2 days ago',
  '12 Mar 2026',
  '28 Feb 2026',
  '04 Mar 2026',
  '17 Feb 2026',
  '21 Mar 2026',
  '08 Feb 2026',
];

const tierByIndex: DistributorTier[] = ['Gold', 'Silver', 'Gold', 'Bronze', 'Silver', 'Gold', 'Bronze'];
const statusByIndex: DistributorStatus[] = ['active', 'pending', 'active', 'cold', 'active', 'pending', 'inactive'];

export const DISTRIBUTORS_MOCK: Distributor[] = Array.from({ length: 10 }, (_, i) => ({
  id: `dist-${String(i + 1).padStart(3, '0')}`,
  name: sampleNames[i % sampleNames.length],
  tier: tierByIndex[i % tierByIndex.length],
  totalOrders: 12 + (i % 6) * 3,
  totalValueNGN: 14_500_000 + (i % 4) * 1_750_000,
  lastOrder: sampleDates[i % sampleDates.length],
  location: sampleLocations[i % sampleLocations.length],
  status: statusByIndex[i % statusByIndex.length],
}));

export function buildDistributorSummary(rows: Distributor[]): DistributorSummary {
  return {
    total: rows.length,
    activeThisMonth: rows.filter((r) => r.status === 'active').length,
    coldTier: rows.filter((r) => r.status === 'cold').length,
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

// TODO(orval): replace with the generated `useGetPendingDistributorApplications`
// query once the approval endpoint lands.
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

/**
 * Detail payload for a single distributor row. Mock for now — each block below
 * maps to one tab in the details sheet and will be replaced by its own lazily
 * fetched query, so the tabs never load all at once.
 */
export function buildDistributorDetail(_distributor: Distributor): DistributorDetail {
  return {
    headerJoined: 'Apr 2023',

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

    // TODO(orval): replace with getDistributorKyc(distributor.id).
    kyc: {
      kycScore: '82%',
      businessRisk: 'Low',
      documentUpload: '82%',
    },

    // TODO(orval): replace with getDistributorOverview(distributor.id).
    contact: {
      email: 'i.okafor@okaforenergy.ng',
      contact: 'Ifeoma Okereke',
      phone: '+234 805 119 3347',
      location: 'Enugu State',
      joined: 'Jan 2025',
    },
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
