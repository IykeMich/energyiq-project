// TODO(orval): replace with useGetDistributorAnalyticsKpisQuery once the endpoint lands.
export const DISTRIBUTOR_ANALYTICS_KPIS_MOCK = [
  { label: 'Total Distributors', value: '142', trend: { value: '+12% vs last month', direction: 'up' as const } },
  { label: 'Active This Month', value: '132', trend: { value: '+8% vs last month', direction: 'up' as const } },
  { label: 'Average Order Value', value: '₦420M', trend: { value: '+5% vs last month', direction: 'up' as const } },
  { label: 'Avg Trust Score', value: '84.5', trend: { value: '+2.5% vs last month', direction: 'up' as const } },
];

// TODO(orval): replace with useGetDistributorTierDistributionQuery once the endpoint lands.
export interface DistributorTier {
  name: string;
  count: number;
  averageMonthlyVolume: string;
  paymentDiscipline: string;
  trustScore: number;
  topDistributor: string;
  highlightColor: string;
}

export const DISTRIBUTOR_TIER_DISTRIBUTION_MOCK: DistributorTier[] = [
  {
    name: 'Gold Tier',
    count: 35,
    averageMonthlyVolume: '₦4.2M',
    paymentDiscipline: '98.5%',
    trustScore: 92.3,
    topDistributor: 'PetroMax Limited, Lagos',
    highlightColor: '#FBC02D',
  },
  {
    name: 'Silver Tier',
    count: 58,
    averageMonthlyVolume: '₦1.8M',
    paymentDiscipline: '92.7%',
    trustScore: 78.4,
    topDistributor: 'ABC Fuels, Abuja',
    highlightColor: '#9E9E9E',
  },
  {
    name: 'Bronze Tier',
    count: 49,
    averageMonthlyVolume: '₦1.8M',
    paymentDiscipline: '86.7%',
    trustScore: 65.2,
    topDistributor: 'Nile Distributors, Port Harcourt',
    highlightColor: '#FB8C1C',
  },
];

// TODO(orval): replace with useGetDistributorMetricsQuery once the endpoint lands.
export interface DistributorMetricGroup {
  title: string;
  metrics: { label: string; value: string; subtext?: string }[];
}

export const DISTRIBUTOR_METRICS_MOCK: DistributorMetricGroup[] = [
  {
    title: 'Sales Performance',
    metrics: [
      { label: 'Total Volume', value: '45,200L', subtext: '+12% vs last month' },
      { label: 'Avg Order Value', value: '₦320K', subtext: '+5% vs last month' },
      { label: 'Order Frequency', value: '3/ Week', subtext: 'per active distributor' },
    ],
  },
  {
    title: 'Financial Health',
    metrics: [
      { label: 'Payment Discipline', value: '94.2%', subtext: 'on-time payments' },
      { label: 'Avg Days To Pay', value: '3.2', subtext: 'days' },
      { label: 'Credit Utilization', value: '68%', subtext: 'of available credit' },
    ],
  },
  {
    title: 'Operational Metrics',
    metrics: [
      { label: 'Order Accuracy', value: '97.5%', subtext: 'fulfillment rate' },
      { label: 'Complaint Rate', value: '2.3%', subtext: 'per 100 orders' },
      { label: 'Resolution Time', value: '48h', subtext: 'Avg resolution time' },
    ],
  },
  {
    title: 'Trust & Compliance',
    metrics: [
      { label: 'Avg Trust Score', value: '85.4', subtext: '/100' },
      { label: 'Document Compliance', value: '96.8%', subtext: 'Up to date' },
      { label: 'KYC Expiry Risk', value: '8', subtext: 'distributors' },
    ],
  },
];

// TODO(orval): replace with useGetDistributorPerformanceQuery once the endpoint lands.
export interface DistributorPerformanceRow {
  id: string;
  distributor: string;
  location: string;
  tier: string;
  sales_volume: string;
  order_frequency: string;
  payment_discipline: string;
  complaint_rate: string;
}

export const DISTRIBUTOR_PERFORMANCE_MOCK: DistributorPerformanceRow[] = [
  { id: '1', distributor: 'PetroMax Limited', location: 'Lagos', tier: 'Gold', sales_volume: '₦4.5M', order_frequency: '4.2/Week', payment_discipline: '98%', complaint_rate: '2.1% (2 Complaints)' },
  { id: '2', distributor: 'ABC Fuels', location: 'Lagos', tier: 'Silver', sales_volume: '₦3.2M', order_frequency: '3.5/Week', payment_discipline: '94%', complaint_rate: '5.2% (5 Complaints)' },
  { id: '3', distributor: 'Port City Oil & Gas', location: 'Lagos', tier: 'Bronze', sales_volume: '₦2.1M', order_frequency: '2.8/Week', payment_discipline: '72%', complaint_rate: '16.3% (8 Complaints)' },
];
