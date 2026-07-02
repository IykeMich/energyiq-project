export interface DistributorKpi {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  alert?: string;
}

export const DISTRIBUTOR_KPIS_MOCK: DistributorKpi[] = [
  { label: 'Total Distributors', value: '30', trend: { value: '+12 this month', direction: 'up' } },
  { label: 'Avg. Payment Discipline', value: '93.4%', trend: { value: '+3% vs last month', direction: 'up' } },
  { label: 'Monthly Order', value: '#1.2M', trend: { value: '+9.5% MoM', direction: 'up' } },
  {
    label: 'Suspended',
    value: '2',
    alert: 'Needs Review',
  },
];

export interface TierDistributionItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export const TIER_DISTRIBUTION_MOCK: TierDistributionItem[] = [
  { name: 'Gold', count: 18, percentage: 14, color: '#FBC02D' },
  { name: 'Silver', count: 42, percentage: 33, color: '#9E9E9E' },
  { name: 'Bronze', count: 60, percentage: 47, color: '#CD7F32' },
  { name: 'Pending', count: 6, percentage: 6, color: '#616161' },
];

export interface TopDistributorItem {
  name: string;
  value: number;
}

export const TOP_DISTRIBUTORS_MOCK: TopDistributorItem[] = [
  { name: 'Adaba Oil & Gas', value: 480000 },
  { name: 'MegaGas', value: 520000 },
  { name: 'Alpha Energy', value: 540000 },
  { name: 'Bright Flame', value: 920000 },
  { name: 'Emeka Gas', value: 1200000 },
];

export interface DistributorPerformanceRow {
  id: string;
  distributor_name: string;
  location: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  volume: string;
  risk_score: number;
  payment_discipline: number;
  sales_consistency: number;
}

export const DISTRIBUTOR_PERFORMANCE_MOCK: DistributorPerformanceRow[] = [
  {
    id: '1',
    distributor_name: 'Emeka Gas Supplies',
    location: 'Enugu',
    tier: 'Gold',
    volume: '#1.2M',
    risk_score: 18,
    payment_discipline: 98,
    sales_consistency: 96,
  },
  {
    id: '2',
    distributor_name: 'Apex Oil & Gas',
    location: 'Lagos',
    tier: 'Gold',
    volume: '#1.2M',
    risk_score: 35,
    payment_discipline: 70,
    sales_consistency: 88,
  },
  {
    id: '3',
    distributor_name: 'Prime Energy Ltd',
    location: 'Abuja',
    tier: 'Silver',
    volume: '#950K',
    risk_score: 28,
    payment_discipline: 85,
    sales_consistency: 82,
  },
  {
    id: '4',
    distributor_name: 'Alpha Energy Co.',
    location: 'Lagos',
    tier: 'Silver',
    volume: '#900K',
    risk_score: 15,
    payment_discipline: 88,
    sales_consistency: 78,
  },
  {
    id: '5',
    distributor_name: 'Mega Energy Ltd',
    location: 'Abuja',
    tier: 'Silver',
    volume: '#850K',
    risk_score: 45,
    payment_discipline: 65,
    sales_consistency: 95,
  },
  {
    id: '6',
    distributor_name: 'SafeGas Distributors',
    location: 'PH',
    tier: 'Bronze',
    volume: '#800K',
    risk_score: 86,
    payment_discipline: 25,
    sales_consistency: 30,
  },
];

export const DISTRIBUTOR_INSIGHTS_MOCK = [
  'Top performing distributor: Emeka Gas Supplies (#1.22M sales)',
  'Fastest growing tier: Silver tier (+12% growth)',
  'Most active region: Lagos',
];

export const DISTRIBUTOR_FILTERS_MOCK = [
  { id: 'tier', label: 'Tier', options: ['All Tiers', 'Gold', 'Silver', 'Bronze', 'Pending'] },
  { id: 'region', label: 'Region', options: ['All Regions', 'Lagos', 'Abuja', 'Enugu', 'Port Harcourt'] },
  { id: 'status', label: 'Status', options: ['All Status', 'Active', 'Suspended', 'Pending'] },
  { id: 'date-range', label: 'Last 30 Days', options: ['Last 7 Days', 'Last 30 Days', 'Last Quarter', 'Custom Range'] },
];
