export interface ComplianceKpi {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  alert?: string;
}

export const COMPLIANCE_KPIS_MOCK: ComplianceKpi[] = [
  { label: 'KYC completion rate', value: '94.7%', trend: { value: '+3.5% YoY', direction: 'up' } },
  {
    label: 'Docs expiring (30d)',
    value: '7',
    alert: 'Notifications sent',
  },
  { label: 'Verification queue', value: '12', alert: 'Avg wait: 18h' },
  {
    label: 'Suspended',
    value: '2',
    alert: 'Needs Review',
  },
];

export interface DocumentStatus {
  type: string;
  category: string;
  status: 'verified' | 'expiring-soon' | 'pending' | 'under-review';
  count?: number;
  note?: string;
}

export const DOCUMENT_STATUS_MOCK: DocumentStatus[] = [
  { type: 'CAC Certificate', category: 'Company Certificate', status: 'verified', count: 5, note: '5 Pending' },
  { type: 'Tax Clearance', category: 'Government - Annual', status: 'expiring-soon' },
  { type: 'Utility Bill', category: 'Proof of address - 3 months', status: 'verified', count: 14, note: '14 expiring soon' },
  { type: "Director's ID", category: 'Government-Issued ID', status: 'verified', count: 2, note: '2 under review' },
];

export interface ExpiringDocument {
  id: string;
  distributor: string;
  document: string;
  daysRemaining: number;
  status: 'expired' | 'expiring-soon' | 'safe';
}

export const EXPIRING_DOCUMENTS_MOCK: ExpiringDocument[] = [
  { id: '1', distributor: 'CityFuel Partners', document: 'Tax Clearance', daysRemaining: 0, status: 'expired' },
  { id: '2', distributor: 'Delta Petroleum', document: 'Utility Bill', daysRemaining: 0, status: 'expired' },
  { id: '3', distributor: 'Bright Flame Ltd', document: 'Tax Clearance', daysRemaining: 9, status: 'expiring-soon' },
  { id: '4', distributor: 'Savanna Gas Co.', document: "Director's ID", daysRemaining: 11, status: 'expiring-soon' },
  { id: '5', distributor: 'Emeka Gas Supplies', document: 'CAC Certificate', daysRemaining: 11, status: 'safe' },
  { id: '6', distributor: 'MegaEnergy Ltd', document: 'CAC Certificate', daysRemaining: 11, status: 'safe' },
];

export interface VerificationQueueRow {
  id: string;
  distributor: string;
  document_type: string;
  upload_date: string;
  expiry_date: string;
  verified_by: string;
  status: string;
}

export const VERIFICATION_QUEUE_MOCK: VerificationQueueRow[] = [
  {
    id: '1',
    distributor: 'Apex Oil & Gas',
    document_type: 'CAC certificate',
    upload_date: 'June 2, 2026',
    expiry_date: 'June 2, 2027',
    verified_by: 'Admin',
    status: 'Verified',
  },
  {
    id: '2',
    distributor: 'MegaEnergy Ltd',
    document_type: 'Tax Clearance',
    upload_date: 'July 17, 2025',
    expiry_date: 'July 17, 2026',
    verified_by: 'Admin',
    status: 'Expiring soon',
  },
  {
    id: '3',
    distributor: 'Apex Oil & Gas',
    document_type: 'CAC certificate',
    upload_date: 'June 2, 2026',
    expiry_date: 'June 2, 2027',
    verified_by: 'Admin',
    status: 'Verified',
  },
  {
    id: '4',
    distributor: 'MegaEnergy Ltd',
    document_type: 'Tax Clearance',
    upload_date: 'July 17, 2025',
    expiry_date: 'July 17, 2026',
    verified_by: 'Admin',
    status: 'Verified',
  },
  {
    id: '5',
    distributor: 'Apex Oil & Gas',
    document_type: 'CAC certificate',
    upload_date: 'June 2, 2026',
    expiry_date: 'June 2, 2027',
    verified_by: 'Admin',
    status: 'Verified',
  },
  {
    id: '6',
    distributor: 'Apex Oil & Gas',
    document_type: 'CAC certificate',
    upload_date: 'June 2, 2026',
    expiry_date: 'June 2, 2027',
    verified_by: 'Admin',
    status: 'Verified',
  },
  {
    id: '7',
    distributor: 'Apex Oil & Gas',
    document_type: 'CAC certificate',
    upload_date: 'June 2, 2026',
    expiry_date: 'June 2, 2027',
    verified_by: 'Admin',
    status: 'Verified',
  },
];

export const COMPLIANCE_FILTERS_MOCK = [
  { id: 'tier', label: 'Tier', options: ['All Tiers', 'Gold', 'Silver', 'Bronze'] },
  { id: 'region', label: 'Region', options: ['All Regions', 'Lagos', 'Abuja', 'Enugu', 'Port Harcourt'] },
  { id: 'status', label: 'Status', options: ['All Status', 'Verified', 'Expiring soon', 'Pending'] },
  { id: 'date-range', label: 'Last 30 Days', options: ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Custom Range'] },
];
