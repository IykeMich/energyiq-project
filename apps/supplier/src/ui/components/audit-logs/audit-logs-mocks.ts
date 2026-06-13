// Replica data for the supplier Audit Logs page design.
// TODO(orval): replace each block with the matching generated query hook once the API lands.

export type AuditStatus = 'Success' | 'Auto' | 'Failed';

export interface AuditLogRow {
  id: string;
  /** Actor name, or "System" for automated entries. */
  user: string;
  /** Actor role (e.g. "Executive"); omitted for System entries. */
  role?: string;
  /** Bold action title (e.g. "Report Export"). */
  action: string;
  /** Grey description line beneath the action. */
  description: string;
  status: AuditStatus;
  /** Display timestamp as shown in the design (e.g. "2025-09-22 08:12:45"). */
  timestamp: string;
}

// The first rows mirror the design exactly; the remainder repeat the sample so the
// footer reads "of 70 Entries". TODO(orval): replace with the audit-logs query hook.
const AUDIT_LOGS_SAMPLE: Omit<AuditLogRow, 'id'>[] = [
  { user: 'Andrew Franklin', role: 'Executive', action: 'Login', description: 'Successful login via MFA (OTP verified)', status: 'Success', timestamp: '2025-09-22 08:12:45' },
  { user: 'Andrew Franklin', role: 'Executive', action: 'Report Export', description: 'Exported "Q3 National Sales Forecast.pdf" with filters: Region=South East', status: 'Success', timestamp: '2025-09-22 08:20:33' },
  { user: 'System', action: 'Alert Trigger', description: 'Low Stock Alert – Station B AGO stock at 9%', status: 'Auto', timestamp: '2025-09-22 08:40:59' },
  { user: 'Andrew Franklin', role: 'Executive', action: 'Dashboard Access', description: 'Viewed Predictive Insights → Price Surge Report', status: 'Success', timestamp: '2025-09-22 08:48:21' },
  { user: 'Admin User', role: 'Admin', action: 'User Management', description: 'Deactivated user account: tola.okafor@flowsight.com', status: 'Success', timestamp: '2025-09-22 09:05:12' },
  { user: 'MaryJane James', role: 'Manager', action: 'Data Change', description: 'Updated Inventory Threshold for Station X PMS from 15,000 → 20,000 L', status: 'Success', timestamp: '2025-09-22 09:12:46' },
  { user: 'MaryJane James', role: 'Manager', action: 'Report Export', description: 'Exported "Station X Inventory Trend.xlsx" with Date Range: Aug–Sep 2025', status: 'Success', timestamp: '2025-09-22 09:12:46' },
  { user: 'Andrew Franklin', role: 'Executive', action: 'Login Attempt', description: 'Failed login – incorrect password entered', status: 'Failed', timestamp: '2025-09-22 09:20:09' },
  { user: 'MaryJane James', role: 'Manager', action: 'Data Access', description: 'Filtered dashboard by Region: South West, Product: PMS', status: 'Success', timestamp: '2025-09-22 09:35:17' },
  { user: 'Admin User', role: 'Admin', action: 'Permission Change', description: 'Granted Analyst role to user emeka.nwosu@flowsight.com', status: 'Success', timestamp: '2025-09-22 09:50:27' },
  { user: 'Andrew Franklin', role: 'Executive', action: 'Report Export', description: 'Exported "Executive Downtime Risk Report.csv" with Forecast=Next 30 Days', status: 'Success', timestamp: '2025-09-22 10:05:44' },
];

export const AUDIT_LOGS_MOCK: AuditLogRow[] = Array.from({ length: 70 }, (_, index) => ({
  id: `LOG-${String(index + 1).padStart(3, '0')}`,
  ...AUDIT_LOGS_SAMPLE[index % AUDIT_LOGS_SAMPLE.length],
}));

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const AUDIT_STATUS_COLOR: Record<AuditStatus, string> = {
  Success: '#388E3C',
  Auto: '#9E9E9E',
  Failed: '#D30A0A',
};

export interface AuditFilter {
  id: string;
  label: string;
  options: string[];
}

// Presentational filter dropdowns above the table; the "All …" labels are the default
// (no-filter) state. TODO(orval): source these option lists from their reference endpoints.
export const AUDIT_FILTERS: AuditFilter[] = [
  {
    id: 'event',
    label: 'All Events',
    options: [
      'Login',
      'Login Attempt',
      'Report Export',
      'Alert Trigger',
      'Dashboard Access',
      'User Management',
      'Data Change',
      'Data Access',
      'Permission Change',
    ],
  },
  {
    id: 'user',
    label: 'All Users',
    options: ['Andrew Franklin', 'Admin User', 'MaryJane James', 'System'],
  },
  { id: 'from-date', label: 'From Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
  { id: 'to-date', label: 'To Date', options: ['Today', 'This Week', 'This Month', 'This Year'] },
];

export interface AuditSelectOption {
  value: string;
  label: string;
}

export interface AuditEventToggle {
  id: string;
  label: string;
}

/** Chosen settings emitted when the user submits the Configure Export form. */
export interface AuditExportConfig {
  dateRange: string;
  events: string[];
  fileFormat: string;
  columns: string;
}

// TODO(orval): source these option lists + ranges from the reports endpoint.
export const EXPORT_DATE_RANGES: AuditSelectOption[] = [
  { value: 'jan-2026', label: 'Jan 1 – Jan 31, 2026' },
  { value: 'q4-2025', label: 'Oct 1 – Dec 31, 2025' },
  { value: 'ytd-2026', label: 'Year to date' },
];

export const EXPORT_EVENT_TOGGLES: AuditEventToggle[] = [
  { id: 'all-events', label: 'All event types' },
  { id: 'user-actions', label: 'User actions' },
  { id: 'system-status', label: 'System Status' },
];

export const EXPORT_FILE_FORMATS: AuditSelectOption[] = [
  { value: 'csv', label: 'CSV (.csv)' },
  { value: 'xlsx', label: 'Excel (.xlsx)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
];

export const EXPORT_COLUMN_OPTIONS: AuditSelectOption[] = [
  { value: 'all', label: 'All Columns' },
  { value: 'user-action', label: 'User & Action only' },
  { value: 'status-time', label: 'Status & Timestamp only' },
];

export interface AuditExportFile {
  name: string;
  entries: number;
  dateRange: string;
  rows: number;
  size: string;
  generatedAt: string;
}

// TODO(orval): populate from the export job response.
export const AUDIT_EXPORT_FILE: AuditExportFile = {
  name: 'audit_log_jan2026.csv',
  entries: 2841,
  dateRange: 'Jan 1 – Jan 31, 2026',
  rows: 2841,
  size: '1.4 MB',
  generatedAt: 'Jan 28, 2026 at 15:02',
};

/** Total record count shown in the export progress panel. TODO(orval): from the job. */
export const AUDIT_EXPORT_RECORD_TOTAL = 2841;
