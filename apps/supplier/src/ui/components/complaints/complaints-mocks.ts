// Replica data for the supplier Complaints page design.
// TODO(orval): replace each block with the matching generated query hook once the API lands.

export type ComplaintSeverity = 'High' | 'Medium' | 'Low';
export type ComplaintStatus = 'In Review' | 'Resolved';

export interface ComplaintRow {
  id: string;
  distributor: string;
  /** Order the complaint was raised against. */
  orderNo: string;
  product: string;
  issueType: string;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  /** Display submission timestamp as shown in the design (e.g. "20 Nov 2025, 10:32 AM"). */
  submitted: string;
}

// The first rows mirror the design exactly; the remainder repeat the sample so the
// footer reads "of 100 Entries". TODO(orval): replace with the complaints query hook.
const COMPLAINTS_SAMPLE: Omit<ComplaintRow, 'id'>[] = [
  { distributor: 'EastFuelLtd', orderNo: 'ORD-002', product: 'Diesel', issueType: 'Wrong Product', severity: 'High', status: 'In Review', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-005', product: 'Diesel', issueType: 'Fuel Quality', severity: 'Medium', status: 'In Review', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-006', product: 'Petrol', issueType: 'Product Damage', severity: 'Low', status: 'In Review', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-022', product: 'Kerosene', issueType: 'Product Shortage', severity: 'Low', status: 'In Review', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-025', product: 'Diesel', issueType: 'Wrong Product', severity: 'Low', status: 'Resolved', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-028', product: 'Petrol', issueType: 'Incomplete Order', severity: 'Medium', status: 'Resolved', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-034', product: 'Petrol', issueType: 'Product Damage', severity: 'Medium', status: 'Resolved', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-039', product: 'Kerosene', issueType: 'Wrong Product', severity: 'High', status: 'Resolved', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-041', product: 'Diesel', issueType: 'Wrong Product', severity: 'High', status: 'Resolved', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-048', product: 'Diesel', issueType: 'Incorrect Order', severity: 'High', status: 'Resolved', submitted: '20 Nov 2025, 10:32 AM' },
  { distributor: 'EastFuelLtd', orderNo: 'ORD-052', product: 'Diesel', issueType: 'Wrong Product', severity: 'High', status: 'Resolved', submitted: '20 Nov 2025, 10:32 AM' },
];

export const COMPLAINTS_MOCK: ComplaintRow[] = Array.from({ length: 100 }, (_, index) => ({
  id: 'COMP-001',
  ...COMPLAINTS_SAMPLE[index % COMPLAINTS_SAMPLE.length],
}));

/** Badge text color per severity; the badge background reuses the same hue at low opacity. */
export const SEVERITY_COLOR: Record<ComplaintSeverity, string> = {
  High: '#D30A0A',
  Medium: '#FB8C1C',
  Low: '#388E3C',
};

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const COMPLAINT_STATUS_COLOR: Record<ComplaintStatus, string> = {
  'In Review': '#FBC02D',
  Resolved: '#388E3C',
};

export type ComplaintStatTrend = 'positive' | 'negative';

export interface ComplaintStat {
  title: string;
  value: string;
  /** Delta pill shown at the bottom of the card (e.g. "+2 vs last week"). */
  delta?: { label: string; trend: ComplaintStatTrend };
  /** Plain emphasised subtitle used instead of a delta pill (e.g. critical priority). */
  subtitle?: string;
}

// The "Today" stat strip above the complaints table.
// TODO(orval): source these figures from the complaints summary endpoint.
export const COMPLAINT_STATS: ComplaintStat[] = [
  { title: 'Open Complaints', value: '8', delta: { label: '+2 vs last week', trend: 'positive' } },
  { title: 'Avg. Resolution Time', value: '42 hrs', delta: { label: '-4 hrs vs target', trend: 'negative' } },
  { title: 'Critical Priority', value: '8', subtitle: 'Requires immediate attention' },
  { title: 'Resolution Rate:', value: '94%', delta: { label: '+2% this month', trend: 'positive' } },
];

export interface ComplaintFilter {
  id: string;
  label: string;
  options: string[];
}

// Presentational filter dropdowns above the table.
// TODO(orval): source these option lists from their reference endpoints.
export const COMPLAINT_FILTERS: ComplaintFilter[] = [
  { id: 'from-date', label: 'From Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
  { id: 'to-date', label: 'To Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
  { id: 'type', label: 'Type', options: ['Wrong Product', 'Fuel Quality', 'Product Damage', 'Product Shortage', 'Incomplete Order'] },
  { id: 'product', label: 'Product', options: ['Diesel', 'Petrol', 'Kerosene'] },
  { id: 'status', label: 'Status', options: ['In Review', 'Resolved'] },
  { id: 'severity', label: 'Severity', options: ['High', 'Medium', 'Low'] },
];
