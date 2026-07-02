// TODO(orval): replace with useGetCompanyProfileQuery once the endpoint lands.
export interface CompanyProfileMock {
  id: string;
  company_name: string;
  registration_number: string;
  tax_identification_number: string;
  business_type: string;
  primary_email: string;
  phone_number: string;
  business_address: string;
  logo_initials: string;
  is_profile_complete: boolean;
  badges: string[];
}

export const COMPANY_PROFILE_MOCK: CompanyProfileMock = {
  id: 'comp-001',
  company_name: 'MRS InterOil',
  registration_number: 'RC.1234567',
  tax_identification_number: 'TIN-3234544',
  business_type: 'Supplier',
  primary_email: 'mrsinteroil@gmail.com',
  phone_number: '+234 804 657 3456',
  business_address: '14 Energy Way, Victoria Island, Lagos.',
  logo_initials: 'MI',
  is_profile_complete: true,
  badges: ['CAC Verified', 'PRC Approved', 'Tier 2 Supplier', 'Lagos HQ'],
};

export const BUSINESS_TYPES_MOCK = ['Supplier', 'Distributor', 'Retailer'] as const;

// TODO(orval): replace with useGetUserProfileQuery once the endpoint lands.
export interface UserProfileMock {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: string;
  avatar_initials: string;
  sub_role: string;
}

export const USER_PROFILE_MOCK: UserProfileMock = {
  id: 'user-001',
  full_name: 'Thomas Okeke',
  email: 'thomasokekemrsinteroil@gmail.com',
  phone_number: '+23466557784',
  role: 'Supplier Admin',
  avatar_initials: 'TO',
  sub_role: 'Operations Manager',
};

export interface ComplianceDocumentMock {
  id: string;
  name: string;
  expiry_date?: string;
  status: 'verified' | 'upload';
}

// TODO(orval): replace with useGetComplianceDocumentsQuery once the endpoint lands.
export const COMPLIANCE_DOCUMENTS_MOCK: ComplianceDocumentMock[] = [
  {
    id: 'doc-001',
    name: 'CAC Certificate',
    expiry_date: 'Expires Dec 2026',
    status: 'verified',
  },
  {
    id: 'doc-002',
    name: 'DPR License',
    expiry_date: 'Expires Aug 2025',
    status: 'verified',
  },
  {
    id: 'doc-003',
    name: 'Tax Clearance Certificate',
    expiry_date: 'Expires Aug 2026',
    status: 'verified',
  },
  {
    id: 'doc-004',
    name: 'Bank Verification Letter',
    expiry_date: 'Required for Tier 3',
    status: 'upload',
  },
];

export interface NotificationChannel {
  in_app: boolean;
  email: boolean;
  sms: boolean;
}

export interface NotificationEventMock {
  id: string;
  label: string;
  channels: NotificationChannel;
}

// TODO(orval): replace with useGetNotificationPreferencesQuery once the endpoint lands.
export const NOTIFICATION_EVENTS_MOCK: NotificationEventMock[] = [
  { id: 'event-001', label: 'New order placement', channels: { in_app: true, email: true, sms: false } },
  { id: 'event-002', label: 'Payment Alerts', channels: { in_app: true, email: false, sms: true } },
  { id: 'event-003', label: 'Dispute Issues', channels: { in_app: true, email: true, sms: false } },
  { id: 'event-004', label: 'KYC document expiring', channels: { in_app: true, email: true, sms: false } },
  { id: 'event-005', label: 'Tier change', channels: { in_app: true, email: true, sms: false } },
  { id: 'event-006', label: 'Low inventory alert', channels: { in_app: true, email: true, sms: true } },
];

export interface ChannelMock {
  id: string;
  label: string;
  value: string;
  subtext: string;
  active: boolean;
}

// TODO(orval): replace with useGetNotificationChannelsQuery once the endpoint lands.
export const NOTIFICATION_CHANNELS_MOCK: ChannelMock[] = [
  {
    id: 'channel-email',
    label: 'Email Address:',
    value: 'mrsinteroil@gmail.com',
    subtext: '',
    active: true,
  },
  {
    id: 'channel-sms',
    label: 'SMS:',
    value: '+234 804 657 3456',
    subtext: '',
    active: true,
  },
  {
    id: 'channel-in-app',
    label: 'In-app:',
    value: 'Push notifications in EnergyIQ',
    subtext: '',
    active: true,
  },
];

export const DIGEST_FREQUENCY_OPTIONS_MOCK = [
  'Realtime',
  'Daily Digest',
  'Weekly',
  'Monthly',
] as const;

export interface DigestFrequencyMock {
  id: string;
  label: string;
  value: string;
}

// TODO(orval): replace with useGetDigestFrequencyQuery once the endpoint lands.
export const DIGEST_FREQUENCY_MOCK: DigestFrequencyMock[] = [
  { id: 'digest-001', label: 'Transaction Summary:', value: 'Daily Digest' },
  { id: 'digest-002', label: 'KYC/Compliance Alerts:', value: 'Realtime' },
  { id: 'digest-003', label: 'Analytic Report:', value: 'Weekly' },
];
