import type { audit } from '@energyiq/domain';
import type { AuditLogRow, AuditStatus } from './audit-logs-mocks';

/**
 * Maps a backend AuditTableRow to the AuditLogRow view model used by the table UI.
 */
export function toAuditLogRow(source: audit.AuditTableRow): AuditLogRow {
  const status = toAuditStatus(source.status_code);
  return {
    id: source.id,
    user: source.user_name || source.user_id || 'System',
    role: source.user_role || undefined,
    action: source.action_title,
    description: source.action_detail,
    status,
    timestamp: source.timestamp_label || source.timestamp,
  };
}

function toAuditStatus(statusCode?: string): AuditStatus {
  switch (statusCode?.toLowerCase()) {
    case 'success':
      return 'Success';
    case 'failed':
      return 'Failed';
    case 'auto':
    default:
      return 'Auto';
  }
}

/**
 * Extracts filter option values from the backend response, defaulting to the mock
 * options when the endpoint hasn't returned them yet.
 */
export function toFilterOptions(
  options?: audit.AuditFilterOption[],
  fallback?: string[],
): audit.AuditFilterOption[] {
  if (options && options.length > 0) return options;
  if (!fallback) return [];
  return fallback.map((value) => ({ value, label: value }));
}
