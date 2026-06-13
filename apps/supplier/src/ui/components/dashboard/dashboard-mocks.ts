import type { ComponentType, SVGProps } from 'react';
import { Users, Package, AlertCircle, BarChart3, Plus, FileText, Truck, ShoppingCart } from 'lucide-react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface KpiMock {
  title: string;
  value: number | string;
  badge?: { label: string; value?: string };
  Icon: IconComponent;
  emphasis?: 'default' | 'destructive';
}

export interface RecentActivityMock {
  description: string;
  timestamp: string;
}

export interface AccountMock {
  label: string;
  value: string;
}

export interface SalesPointMock {
  day: string;
  sales: number;
}

export interface TopProductMock {
  name: string;
  value: number;
  color: string;
}

export interface LowStockAlertMock {
  name: string;
  quantity: string;
  level: 'critical' | 'warning';
}

export interface QuickActionMock {
  title: string;
  Icon: IconComponent;
}

// TODO(orval): replace with useGet…KpisQuery from @energyiq/api/generated
export const KPI_MOCKS: KpiMock[] = [
  { title: 'Total Distributors', value: 250, badge: { label: 'Active', value: '180' }, Icon: Users },
  { title: 'Pending Orders', value: 25, badge: { label: 'Active', value: '10' }, Icon: Package },
  { title: 'Open Complaints', value: 4, badge: { label: 'Active', value: '180' }, Icon: AlertCircle, emphasis: 'destructive' },
  { title: 'Metric', value: 250, badge: { label: 'Status' }, Icon: BarChart3 },
];

// TODO(orval): replace with useGet…RecentActivityQuery
export const RECENT_ACTIVITY_MOCKS: RecentActivityMock[] = [
  { description: 'PetroMax Energy placed new order — PO 234# for 25,000L.', timestamp: '2 hours ago' },
  { description: 'GasLink Distributor Tier upgraded to Gold — Distributor Tier upgraded to Gold…', timestamp: '5 hours ago' },
  { description: 'Complaint #C-2847 raised…', timestamp: '1 day ago' },
  { description: 'New Distributor completed onboarding', timestamp: '2 days ago' },
  { description: 'PetroMax Energy placed new order…', timestamp: '2 hours ago' },
  { description: 'GasLink Distributor Tier upgraded to Gold…', timestamp: '5 hours ago' },
  { description: 'Complaint #C-2847 raised…', timestamp: '1 day ago' },
  { description: 'New Distributor completed onboarding', timestamp: '2 days ago' },
];

// TODO(orval): replace with useGet…FinancialSnapshotQuery
export const FINANCIAL_ACCOUNT_MOCKS: AccountMock[] = [
  { label: 'Trading Account', value: '₦58.9M' },
  { label: 'Sales Account', value: '₦125.9M' },
  { label: 'Expense Account', value: '₦18.7M' },
  { label: 'Assurance Account', value: '₦12.4M' },
];

// TODO(orval): replace with useGet…SalesTrendQuery
export const SALES_TREND_MOCK: SalesPointMock[] = [
  { day: 'Mon', sales: 10 },
  { day: 'Tues', sales: 5 },
  { day: 'Wed', sales: 15 },
  { day: 'Thurs', sales: 6 },
  { day: 'Fri', sales: 19 },
  { day: 'Sat', sales: 12 },
  { day: 'Sun', sales: 9 },
];

export const SALES_TREND_REGIONS = ['All Regions', 'North', 'South', 'East', 'West'];
export const SALES_TREND_TIMES = ['This Week', 'This Month', 'This Quarter', 'This Year'];
export const SALES_TREND_PRODUCTS = ['All Products', 'Product A', 'Product B', 'Product C'];

// TODO(orval): replace with useGet…TopProductsQuery
export const TOP_PRODUCTS_MOCK: TopProductMock[] = [
  { name: 'Cooking Gas (LPG)', value: 80, color: '#FBC02D' },
  { name: 'Petrol (PMS)', value: 75, color: '#3B82F6' },
  { name: 'Diesel (AGO)', value: 60, color: '#9CA3AF' },
  { name: 'Kerosene (DPK)', value: 60, color: '#4B5563' },
];

// TODO(orval): replace with useGet…LowStockAlertsQuery
export const LOW_STOCK_MOCKS: LowStockAlertMock[] = [
  { name: 'Premium Gasoline (PMS)', quantity: '45,000L', level: 'critical' },
  { name: 'Automobile Gas Oil (AGO)', quantity: '28,000L', level: 'critical' },
  { name: 'Liquified Petroleum Gas (LPG)', quantity: '62,000L', level: 'warning' },
];

export const QUICK_ACTION_MOCKS: QuickActionMock[] = [
  { title: 'New Product', Icon: Plus },
  { title: 'Add Distributor', Icon: Truck },
  { title: 'View Orders', Icon: ShoppingCart },
  { title: 'Add Expense', Icon: FileText },
  { title: 'Generate Report', Icon: BarChart3 },
  { title: 'View Orders', Icon: ShoppingCart },
];
