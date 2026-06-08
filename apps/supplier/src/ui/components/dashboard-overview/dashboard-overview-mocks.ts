import type { ComponentType, SVGProps } from 'react';
import {
  DollarSign,
  Package,
  MessageSquare,
  Plus,
  Eye,
  CreditCard,
  Upload,
} from 'lucide-react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// Replica data for the Flowsight Distributor Dashboard design.
// TODO(orval): replace each block with the matching generated query hook.

export interface AssuranceSummary {
  balance: string;
  tier: string;
  discount: string;
  compliance: string;
}

export const ASSURANCE_SUMMARY: AssuranceSummary = {
  balance: '₦2,000,000',
  tier: 'Silver',
  discount: '5%',
  compliance: 'All documents valid',
};

export interface KpiStatus {
  label: string;
  value?: string;
  dotColor: string;
  valueColor?: string;
}

export interface DashboardOverviewKpi {
  title: string;
  value: string;
  /** Value shown in the empty/loading state, before any trading has happened. */
  emptyValue: string;
  Icon: IconComponent;
  trend?: string;
  dueTag?: string;
  payButton?: boolean;
  statuses?: KpiStatus[];
}

export const DASHBOARD_KPIS: DashboardOverviewKpi[] = [
  {
    title: 'Trading Balance:',
    value: '₦12,450,000',
    emptyValue: '₦0',
    Icon: DollarSign,
    trend: '+12% vs last period',
  },
  {
    title: 'Outstanding Payment:',
    value: '₦1,200,000',
    emptyValue: '₦0',
    Icon: DollarSign,
    dueTag: 'Due in 3 days',
    payButton: true,
  },
  {
    title: 'Active Orders:',
    value: '4',
    emptyValue: '0',
    Icon: Package,
    statuses: [
      { label: 'Pending:', value: '8', dotColor: '#FB8C1C', valueColor: '#FB8C1C' },
      { label: 'Rejected', value: '2', dotColor: '#D30A0A', valueColor: '#D30A0A' },
    ],
  },
  {
    title: 'Open Complaints:',
    value: '1',
    emptyValue: '-',
    Icon: MessageSquare,
    statuses: [{ label: 'Under Review', dotColor: '#388E3C' }],
  },
];

// Empty-state copy shown when the account has no data yet (the design's loading state).
export const RECENT_ACTIVITY_EMPTY_MESSAGE = 'No Recent Activity';
export const ALERTS_EMPTY_MESSAGE = 'No Pending Alerts';
export const CHART_EMPTY_MESSAGE =
  'No data yet.\nYour order and payment trends will appear once you start trading.\nCreate your first order';

export interface RecentActivityItem {
  description: string;
  timestamp: string;
}

export const DASHBOARD_RECENT_ACTIVITY: RecentActivityItem[] = [
  { description: 'Order #OR-241 approved by supplier.', timestamp: '2 hours ago.' },
  { description: '₦3,500,000 credited to Trading Account.', timestamp: '4 hours ago.' },
  { description: 'Document Tax Clearance approved.', timestamp: 'Yesterday' },
  { description: 'Complaint #CP-091 resolved (Refund issued).', timestamp: 'Yesterday' },
];

export interface AlertItem {
  description: string;
  timestamp: string;
  level: 'critical' | 'warning';
}

export const DASHBOARD_ALERTS: AlertItem[] = [
  {
    description: 'Business License expires in 7 days. Upload Now',
    timestamp: '2 hours ago.',
    level: 'critical',
  },
  {
    description: 'Payment of ₦1,200,000 due in 3 days. Pay Now',
    timestamp: '4 hours ago.',
    level: 'warning',
  },
];

export interface OrderVolumePoint {
  day: string;
  orders: number;
}

export const ORDER_VOLUME_MOCK: OrderVolumePoint[] = [
  { day: 'Mon', orders: 2 },
  { day: 'Tues', orders: 3 },
  { day: 'Wed', orders: 5 },
  { day: 'Thurs', orders: 2 },
  { day: 'Fri', orders: 4 },
  { day: 'Sat', orders: 3 },
  { day: 'Sun', orders: 1 },
];

export interface MonthlySpendPoint {
  month: string;
  spend: number;
}

export const MONTHLY_SPEND_MOCK: MonthlySpendPoint[] = [
  { month: 'Aug', spend: 12 },
  { month: 'Sep', spend: 20 },
  { month: 'Oct', spend: 13 },
  { month: 'Nov', spend: 23 },
  { month: 'Dec', spend: 5 },
  { month: 'Jan', spend: 30 },
];

export interface TierProgress {
  label: string;
  percent: number;
  /** Italic note above the label (populated state only). */
  footnote?: string;
  /** Hint shown to the right of the label, on the same row (empty state). */
  inlineHint?: string;
  /** Hint shown right-aligned below the progress bar (populated state). */
  nextHint?: string;
  benefits: string[];
}

export const TIER_PROGRESS: TierProgress = {
  label: 'Silver Tier (72% filled):',
  percent: 72,
  nextHint: 'Order Naira 3.2M more to Gold',
  footnote: 'Based on last 90 days activity',
  benefits: ['10% discount', 'Credit Terms', 'Priority Support'],
};

export const TIER_PROGRESS_EMPTY: TierProgress = {
  label: 'Silver Tier',
  percent: 12,
  inlineHint: '88% to Silver',
  benefits: ['10% discount', 'Credit Terms', 'Priority Support'],
};

export interface DashboardFilter {
  label: string;
  options: string[];
}

// Simulated filter/sort options for the chart panel dropdowns.
// TODO(orval): source option lists (regions, products) from their reference endpoints.
export const DASHBOARD_FILTERS = {
  region: { label: 'Region', options: ['All Regions', 'North', 'South', 'East', 'West'] },
  time: {
    label: 'Time',
    options: ['Today', 'This Week', 'This Month', 'This Quarter', 'This Year'],
  },
  product: {
    label: 'Product',
    options: ['All Products', 'Cooking Gas (LPG)', 'Petrol (PMS)', 'Diesel (AGO)', 'Kerosene (DPK)'],
  },
} satisfies Record<string, DashboardFilter>;

export type DashboardFilterKey = keyof typeof DASHBOARD_FILTERS;

export interface QuickAction {
  title: string;
  Icon: IconComponent;
}

export const DASHBOARD_QUICK_ACTIONS: QuickAction[] = [
  { title: 'Create Order', Icon: Plus },
  { title: 'View Product', Icon: Eye },
  { title: 'Make Payments', Icon: CreditCard },
  { title: 'Upload Document', Icon: Upload },
];
