export interface InventoryKpi {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  alert?: string;
}

export const INVENTORY_KPIS_MOCK: InventoryKpi[] = [
  { label: 'Total Inventory Value', value: '#485,750,000', trend: { value: '-22% YoY', direction: 'down' } },
  { label: 'Total SKUs', value: '12,450', trend: { value: '+1%', direction: 'up' } },
  {
    label: 'Low Stock Alerts',
    value: '3',
    alert: 'Requires action immediately',
  },
  { label: 'Avg. Turnover Rate', value: '18.4%', trend: { value: '+2.3 improvement', direction: 'up' } },
];

export interface StockMovementRow {
  id: string;
  sku: string;
  product: string;
  category: string;
  type: string;
  quantity: string;
  distributor: string;
  date: string;
  status: string;
}

export const STOCK_MOVEMENT_MOCK: StockMovementRow[] = [
  {
    id: '1',
    sku: 'PMS-001',
    product: 'Premium Motor Spirit (PMS)',
    category: 'PMS',
    type: 'In',
    quantity: '200L',
    distributor: 'Emeka Gas Supplies',
    date: 'June 2, 2026',
    status: 'Delivered',
  },
  {
    id: '2',
    sku: 'LPG-004',
    product: 'LPG 12.5kg Cylinder',
    category: 'LPG',
    type: 'Out',
    quantity: '50L',
    distributor: 'Bright Flame Ltd',
    date: 'June 1, 2026',
    status: 'Dispatched',
  },
  {
    id: '3',
    sku: 'LPG-005',
    product: 'LPG 6kg Cylinder',
    category: 'LPG',
    type: 'Out',
    quantity: '32L',
    distributor: 'Alpha Energy Co.',
    date: 'May 31, 2026',
    status: 'Delivered',
  },
  {
    id: '4',
    sku: 'AGO-002',
    product: 'Automotive Gas Oil (Diesel)',
    category: 'AGO',
    type: 'Out',
    quantity: '500L',
    distributor: 'Bright Flame Ltd',
    date: 'May 30, 2026',
    status: 'Delivered',
  },
  {
    id: '5',
    sku: 'AGO-002',
    product: 'Automotive Gas Oil (Diesel)',
    category: 'AGO',
    type: 'Out',
    quantity: '500L',
    distributor: 'Emeka Gas Supplies',
    date: 'May 30, 2026',
    status: 'Pending',
  },
  {
    id: '6',
    sku: 'AGO-002',
    product: 'Automotive Gas Oil (Diesel)',
    category: 'AGO',
    type: 'Out',
    quantity: '500L',
    distributor: 'Emeka Gas Supplies',
    date: 'May 30, 2026',
    status: 'Pending',
  },
];

export interface StockLevelItem {
  product: string;
  value: number;
  color: string;
}

export const STOCK_LEVELS_MOCK: StockLevelItem[] = [
  { product: 'PMS', value: 450000, color: '#FBC02D' },
  { product: 'AGO', value: 320000, color: '#1E88E5' },
  { product: 'DPK', value: 180000, color: '#F57C00' },
  { product: 'LPG', value: 250000, color: '#616161' },
];

export interface StockMovementData {
  day: string;
  units: number;
}

export const STOCK_MOVEMENT_CHART_MOCK: StockMovementData[] = [
  { day: '1', units: 320 },
  { day: '5', units: 410 },
  { day: '9', units: 380 },
  { day: '13', units: 540 },
  { day: '17', units: 820 },
  { day: '21', units: 620 },
  { day: '25', units: 480 },
  { day: '29', units: 390 },
  { day: '31', units: 340 },
];

export interface InventoryAlert {
  type: 'warning' | 'critical';
  product: string;
  message: string;
}

export const INVENTORY_ALERTS_MOCK: InventoryAlert[] = [
  { type: 'warning', product: 'Kerosene (DPK)', message: 'Inventory is running low. Consider restocking soon.' },
  { type: 'critical', product: 'Engine Oil', message: 'Critical Stock level is detected. Consider restocking soon.' },
];

export const INVENTORY_FILTERS_MOCK = [
  { id: 'products', label: 'Products', options: ['All Products', 'PMS', 'AGO', 'DPK', 'LPG', 'Engine Oil'] },
  { id: 'type', label: 'Type', options: ['All Types', 'In', 'Out'] },
  { id: 'distributor', label: 'Distributor', options: ['All Distributors', 'Emeka Gas Supplies', 'Bright Flame Ltd', 'Alpha Energy Co.'] },
  { id: 'status', label: 'Status', options: ['All Status', 'Delivered', 'Dispatched', 'Pending'] },
  { id: 'from-date', label: 'From Date', options: ['Last 7 Days', 'Last 30 Days', 'This Month'] },
  { id: 'to-date', label: 'To Date', options: ['Today', 'Yesterday', 'This Week'] },
];
