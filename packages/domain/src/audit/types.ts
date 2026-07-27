// ════════════════════════════════════════════════════════════════
// Audit domain entities — pure TypeScript, zero framework imports
// ════════════════════════════════════════════════════════════════

export interface AuditListParams {
  search?: string;
  event?: string;
  status?: string;
  user_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface AuditFilterOption {
  value: string;
  label: string;
}

export interface AuditListFilters {
  event_options?: AuditFilterOption[];
  status_options?: AuditFilterOption[];
  user_options?: AuditFilterOption[];
  selected_event?: string;
  selected_status?: string;
  selected_user_id?: string;
  selected_date_from?: string;
  selected_date_to?: string;
}

export interface AuditPagination {
  limit?: number;
  offset?: number;
  total_items?: number;
  total_pages?: number;
  summary?: string;
}

export interface AuditTableRow {
  id: string;
  action_title: string;
  action_detail: string;
  entity_type: string;
  entity_id: string;
  status_code: string;
  status_label: string;
  status_tone: string;
  timestamp: string;
  timestamp_label: string;
  user_id: string;
  user_name: string;
  user_role: string;
}

export interface AuditTable {
  headers?: string[];
  rows?: AuditTableRow[];
}

export interface AuditEmptyState {
  title?: string;
  description?: string;
}

export interface AuditExportConfig {
  title?: string;
  description?: string;
  primary_action_label?: string;
  secondary_action_label?: string;
  default_date_range?: string;
  event_options?: AuditFilterOption[];
  file_format_options?: AuditFilterOption[];
  column_options?: AuditFilterOption[];
}

export interface AuditListResult {
  title?: string;
  search_placeholder?: string;
  filters?: AuditListFilters;
  table?: AuditTable;
  pagination?: AuditPagination;
  empty_state?: AuditEmptyState;
  export_action_label?: string;
  export?: AuditExportConfig;
}

export interface AuditEntityTimelineResult {
  entity_type?: string;
  entity_id?: string;
  items?: AuditTableRow[];
  pagination?: AuditPagination;
}
