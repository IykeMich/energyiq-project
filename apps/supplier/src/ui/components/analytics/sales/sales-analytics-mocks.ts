// TODO(orval): replace with useGetSalesAnalyticsQuery once the endpoint lands.
export interface RevenueVsCostsPoint {
  month: string;
  revenue: number;
  costs: number;
}

export const SALES_REVENUE_VS_COSTS_MOCK: RevenueVsCostsPoint[] = [
  { month: 'Jan', revenue: 400, costs: 350 },
  { month: 'Feb', revenue: 300, costs: 420 },
  { month: 'Mar', revenue: 500, costs: 380 },
  { month: 'Apr', revenue: 450, costs: 400 },
  { month: 'May', revenue: 600, costs: 450 },
  { month: 'Jun', revenue: 550, costs: 480 },
  { month: 'Jul', revenue: 700, costs: 500 },
  { month: 'Aug', revenue: 650, costs: 520 },
  { month: 'Sep', revenue: 800, costs: 550 },
  { month: 'Oct', revenue: 750, costs: 580 },
  { month: 'Nov', revenue: 900, costs: 600 },
  { month: 'Dec', revenue: 850, costs: 620 },
];

// TODO(orval): replace with useGetProductSalesOverviewQuery once the endpoint lands.
export interface ProductSalesOverviewItem {
  name: string;
  value: number;
  color: string;
}

export const PRODUCT_SALES_OVERVIEW_MOCK: ProductSalesOverviewItem[] = [
  { name: 'Petrol (PMS)', value: 45, color: '#FBC02D' },
  { name: 'Diesel (AGO)', value: 25, color: '#1E88E5' },
  { name: 'Kerosene (DPK)', value: 15, color: '#9E9E9E' },
  { name: 'Lubricant', value: 10, color: '#FB8C1C' },
  { name: 'Others', value: 5, color: '#2E7D32' },
];

// TODO(orval): replace with useGetProductPerformanceQuery once the endpoint lands.
export interface ProductPerformanceRow {
  id: string;
  product: string;
  category: string;
  units_sold: string;
  revenue: string;
  avg_price: string;
  top_region: string;
  growth: string;
}

export const PRODUCT_PERFORMANCE_MOCK: ProductPerformanceRow[] = [
  { id: '1', product: 'PMS', category: 'Fuel', units_sold: '50,000L', revenue: '₦50.0M', avg_price: '₦1,000/L', top_region: 'Lagos', growth: '+12%' },
  { id: '2', product: 'AGO', category: 'Fuel', units_sold: '38,000L', revenue: '₦38.0M', avg_price: '₦1,000/L', top_region: 'Abuja', growth: '+8%' },
  { id: '3', product: 'DPK', category: 'Fuel', units_sold: '25,000L', revenue: '₦25.0M', avg_price: '₦1,000/L', top_region: 'Port Harcourt', growth: '+5%' },
  { id: '4', product: 'Lubricant', category: 'Lubricant', units_sold: '1,500L', revenue: '₦12.5M', avg_price: '₦8,333/L', top_region: 'Lagos', growth: '+15%' },
];

// TODO(orval): replace with useGetTopDistributorsBySalesQuery once the endpoint lands.
export interface TopDistributorBySales {
  rank: number;
  name: string;
  location: string;
  sales: string;
  growth: string;
}

export const TOP_DISTRIBUTORS_BY_SALES_MOCK: TopDistributorBySales[] = [
  { rank: 1, name: 'Petromax Ltd', location: 'Lagos', sales: '₦80M', growth: '+12.5%' },
  { rank: 2, name: 'ABC Fuel', location: 'Abuja', sales: '₦51.5M', growth: '+11.2%' },
  { rank: 3, name: 'Pinnacle Ltd', location: 'Lagos', sales: '₦42.5M', growth: '+8.2%' },
];

// TODO(orval): replace with useGetSalesAnalyticsKpisQuery once the endpoint lands.
export const SALES_ANALYTICS_KPIS_MOCK = [
  { label: 'Total Revenue', value: '₦420M', trend: { value: '+15% vs last month', direction: 'up' as const } },
  { label: 'Units Sold', value: '124,500L', trend: { value: '+8% vs last month', direction: 'up' as const } },
  { label: 'Avg Order Value', value: '₦1.2M', trend: { value: '+5% vs last month', direction: 'up' as const } },
  { label: 'Active Distributors', value: '48', trend: { value: '+3% vs last month', direction: 'up' as const } },
];
