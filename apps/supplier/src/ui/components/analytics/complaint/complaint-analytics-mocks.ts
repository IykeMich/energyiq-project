// TODO(orval): replace with useGetComplaintAnalyticsKpisQuery once the endpoint lands.
export const COMPLAINT_ANALYTICS_KPIS_MOCK = [
  { label: 'Total Complaints', value: '48', trend: { value: '+5% vs last week', direction: 'up' as const } },
  { label: 'Avg Resolution Time', value: '42h', trend: { value: '-8% vs last week', direction: 'down' as const } },
  { label: 'Resolution Rate', value: '94%', trend: { value: '+3% vs last week', direction: 'up' as const } },
  { label: 'Satisfaction Score', value: '4.2/5', trend: { value: '+0.2 vs last week', direction: 'up' as const } },
];

// TODO(orval): replace with useGetComplaintsOverTimeQuery once the endpoint lands.
export interface ComplaintsOverTimePoint {
  day: string;
  complaints: number;
}

export const COMPLAINTS_OVER_TIME_MOCK: ComplaintsOverTimePoint[] = [
  { day: 'Mon', complaints: 5 },
  { day: 'Tue', complaints: 8 },
  { day: 'Wed', complaints: 6 },
  { day: 'Thu', complaints: 12 },
  { day: 'Fri', complaints: 9 },
  { day: 'Sat', complaints: 7 },
  { day: 'Sun', complaints: 4 },
];

// TODO(orval): replace with useGetComplaintTypeBreakdownQuery once the endpoint lands.
export interface ComplaintTypeItem {
  name: string;
  value: number;
  color: string;
}

export const COMPLAINT_TYPE_MOCK: ComplaintTypeItem[] = [
  { name: 'Incomplete Delivery', value: 70, color: '#FBC02D' },
  { name: 'Wrong Products', value: 15, color: '#1E88E5' },
  { name: 'Faulty Goods', value: 10, color: '#9E9E9E' },
  { name: 'Damaged', value: 5, color: '#FB8C1C' },
];

// TODO(orval): replace with useGetComplaintsByProductQuery once the endpoint lands.
export interface ComplaintByProductItem {
  product: string;
  count: number;
}

export const COMPLAINTS_BY_PRODUCT_MOCK: ComplaintByProductItem[] = [
  { product: 'PMS', count: 42 },
  { product: 'AGO', count: 31 },
  { product: 'DPK', count: 24 },
  { product: 'Engine Oil', count: 11 },
];

// TODO(orval): replace with useGetComplaintResolutionEffectivenessQuery once the endpoint lands.
export const COMPLAINT_RESOLUTION_EFFECTIVENESS_MOCK = [
  { label: 'Replacement Success', value: '85%', subtext: 'Replacement resolved issue' },
  { label: 'Refund Satisfaction', value: '90%', subtext: 'Users satisfied with refund' },
  { label: 'Repeat Complaints', value: '8%', subtext: 'Same issue within 30 days' },
];

// TODO(orval): replace with useGetComplaintResolutionSlaQuery once the endpoint lands.
export const COMPLAINT_RESOLUTION_SLA_MOCK = [
  { tier: 'Gold Tier', time: '<24h', percentage: 95, color: '#FBC02D' },
  { tier: 'Silver Tier', time: '24-48h', percentage: 78, color: '#9E9E9E' },
  { tier: 'Bronze Tier', time: '>48h', percentage: 62, color: '#FB8C1C' },
];

// TODO(orval): replace with useGetComplaintResolutionTypeAnalysisQuery once the endpoint lands.
export const COMPLAINT_RESOLUTION_TYPE_ANALYSIS_MOCK = [
  { type: 'Replacement (Inventory auto-adjustment)', percentage: 75, color: '#FBC02D' },
  { type: 'Monetary Refund', percentage: 25, color: '#1E88E5' },
];

// TODO(orval): replace with useGetTopComplaintsQuery once the endpoint lands.
export interface TopComplaintRow {
  id: string;
  complaint_id: string;
  product: string;
  severity: string;
  time_to_sla: string;
}

export const TOP_COMPLAINTS_MOCK: TopComplaintRow[] = [
  { id: '1', complaint_id: 'CCMP-002', product: 'Diesel 20L x 10', severity: 'High', time_to_sla: '6 Hrs Left' },
  { id: '2', complaint_id: 'CCMP-007', product: 'Base Oil x 10', severity: 'Medium', time_to_sla: '12 Hrs Left' },
  { id: '3', complaint_id: 'CCMP-012', product: 'Diesel 20L x 10', severity: 'Low', time_to_sla: '4 Hrs Left' },
];
