export interface MetricOption {
  id: string;
  label: string;
}

export const METRIC_OPTIONS_MOCK: MetricOption[] = [
  { id: 'sales-volume', label: 'Sales Volume (₦)' },
  { id: 'units-dispatched', label: 'Units Dispatched' },
  { id: 'active-distributors', label: 'Active Distributors' },
  { id: 'payment-discipline', label: 'Payment Discipline' },
  { id: 'all-tiers', label: 'All Tiers' },
  { id: 'group-regions', label: 'Group Regions' },
  { id: 'complaint-resolution-rate', label: 'Complaint Resolution Rate' },
  { id: 'kyc-compliance-rate', label: 'KYC Compliance Rate' },
];

export interface DimensionOption {
  id: string;
  label: string;
}

export const DIMENSION_OPTIONS_MOCK: DimensionOption[] = [
  { id: 'by-distributor', label: 'By Distributor' },
  { id: 'by-tier', label: 'By Tier' },
  { id: 'by-product', label: 'By Product' },
  { id: 'by-region', label: 'By Region' },
];

export interface DateRangeOption {
  id: string;
  label: string;
}

export const DATE_RANGE_OPTIONS_MOCK: DateRangeOption[] = [
  { id: 'last-7-days', label: 'Last 7 Days' },
  { id: 'last-30-days', label: 'Last 30 Days' },
  { id: 'last-quarter', label: 'Last Quarter' },
  { id: 'custom-range', label: 'Custom Range' },
];

export interface SavedReport {
  id: string;
  name: string;
  metrics: string;
  schedule: string;
  last_run: string;
}

export const SAVED_REPORTS_MOCK: SavedReport[] = [
  {
    id: '1',
    name: 'Monthly Sales Summary',
    metrics: 'Sales, Volume, Distributors',
    schedule: 'Monthly(1st)',
    last_run: 'June 01, 2026',
  },
  {
    id: '2',
    name: 'Inventory Health Dashboards',
    metrics: 'Units Dispatched, Active Distributors',
    schedule: 'Weekly (Mon)',
    last_run: 'June 27, 2026',
  },
  {
    id: '3',
    name: 'Compliance Audit Trail',
    metrics: 'KYC Status, Expiry Dates',
    schedule: 'Daily',
    last_run: 'June 31, 2026',
  },
  {
    id: '4',
    name: 'Distributor Tier Analysis',
    metrics: 'Tier Distribution, Upgrades',
    schedule: 'Quarterly',
    last_run: 'Dec 31, 2025',
  },
];
