// TODO(orval): replace with useGetSalesAnalyticsQuery once the endpoint lands.
export interface RevenueVsCostsPoint {
  month: string;
  revenue: number;
  costs: number;
}

export const SALES_REVENUE_VS_COSTS_MOCK: RevenueVsCostsPoint[] = [
  { month: 'Jan', revenue: 160, costs: 130 },
  { month: 'Feb', revenue: 210, costs: 170 },
  { month: 'Mar', revenue: 120, costs: 150 },
  { month: 'Apr', revenue: 240, costs: 180 },
  { month: 'May', revenue: 90, costs: 120 },
  { month: 'Jun', revenue: 200, costs: 190 },
  { month: 'Jul', revenue: 190, costs: 210 },
  { month: 'Aug', revenue: 130, costs: 110 },
  { month: 'Sep', revenue: 270, costs: 140 },
  { month: 'Oct', revenue: 200, costs: 150 },
  { month: 'Nov', revenue: 290, costs: 210 },
  { month: 'Dec', revenue: 220, costs: 220 },
];

// TODO(orval): replace with useGetProductSalesOverviewQuery once the endpoint lands.
export interface ProductSalesOverviewItem {
  name: string;
  value: number;
  color: string;
}

export const PRODUCT_SALES_OVERVIEW_MOCK: ProductSalesOverviewItem[] = [
  { name: 'Petrol (PMS)', value: 80, color: '#FBC02D' },
  { name: 'Diesel (AGO)', value: 75, color: '#1E88E5' },
  { name: 'Kerosene (DPK)', value: 60, color: '#FAFAFA' },
  { name: 'Lubricant', value: 80, color: '#616161' },
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
  { id: '1', product: 'Petrol (PMS)', category: 'Fuel', units_sold: '60,000L', revenue: '₦12.5M', avg_price: '₦800/L', top_region: 'Lagos', growth: '+12.5%' },
  { id: '2', product: 'Diesel (AGO)', category: 'Fuel', units_sold: '45,000L', revenue: '₦9.0M', avg_price: '₦800/L', top_region: 'Abuja', growth: '+8%' },
  { id: '3', product: 'Kerosene (DPK)', category: 'Fuel', units_sold: '30,000L', revenue: '₦6.0M', avg_price: '₦800/L', top_region: 'Port Harcourt', growth: '+5%' },
  { id: '4', product: 'Lubricant', category: 'Lubricant', units_sold: '2,000L', revenue: '₦16.0M', avg_price: '₦8,000/L', top_region: 'Lagos', growth: '+15%' },
];

// TODO(orval): replace with useGetTopDistributorsBySalesQuery once the endpoint lands.
export interface TopDistributorBySales {
  rank: number;
  name: string;
  sales: string;
  growth: string;
}

export const TOP_DISTRIBUTORS_BY_SALES_MOCK: TopDistributorBySales[] = [
  { rank: 1, name: 'Petromax Ltd', sales: '₦2.5M', growth: '+12.6%' },
  { rank: 2, name: 'ABC Fuel', sales: '₦1.5M', growth: '+12.5%' },
  { rank: 3, name: 'PortCity Distributors', sales: '₦850k', growth: '+12.5%' },
];

export interface SalesTierCardData {
  tier: string;
  sales: string;
  color: string;
}

export const SALES_TIER_CARDS_MOCK: SalesTierCardData[] = [
  { tier: 'Gold', sales: '₦4.8M Sales', color: '#FBC02D' },
  { tier: 'Silver', sales: '₦3.7M Sales', color: '#C0C0C0' },
  { tier: 'Bronze', sales: '₦2.6M Sales', color: '#CD7F32' },
];
