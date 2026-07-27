import type { complaint } from '@energyiq/domain';
import type {
  ComplaintDetail,
  ComplaintEvidenceFile,
  ComplaintRow,
  ComplaintStat,
  ComplaintStatus,
  ComplaintTimelineEntry,
} from './complaints-mocks';

/**
 * Maps a backend Complaint to the ComplaintRow view model used by the complaints table.
 */
export function toComplaintRow(source: complaint.Complaint): ComplaintRow {
  const orderRef = source.distributor_complaint_order_ref ?? '-';
  const product = source.distributor_complaint_product ?? '-';
  return {
    id: source.distributor_complaint_code ?? source.distributor_complaint_id ?? '-',
    rawId: source.distributor_complaint_id,
    type: source.distributor_complaint_title ?? source.distributor_complaint_category ?? '-',
    reference: `${product} - ${orderRef}`,
    dateRaised: formatDateTime(source.distributor_complaint_date_raised),
    status: toComplaintStatus(source.distributor_complaint_status_code),
    sla: '-',
  };
}

/**
 * Maps a backend Complaint to the ComplaintDetail view model used by the slide-in sheet.
 */
export function toComplaintDetail(source: complaint.Complaint): ComplaintDetail {
  return {
    id: source.distributor_complaint_code ?? source.distributor_complaint_id ?? '-',
    rawId: source.distributor_complaint_id,
    status: toComplaintStatus(source.distributor_complaint_status_code),
    title: source.distributor_complaint_title ?? '-',
    orderRef: source.distributor_complaint_order_ref ?? '-',
    product: source.distributor_complaint_product ?? '-',
    dateRaised: formatDateTime(source.distributor_complaint_date_raised),
    quantityAffected: String(source.distributor_complaint_quantity_affected ?? '-'),
    estimatedAmount: formatCurrency(source.distributor_complaint_estimated_amount),
    supplier: source.distributor_complaint_supplier ?? '-',
    description: source.distributor_complaint_description ?? '-',
    evidence: (source.distributor_complaint_evidence ?? []).map(toEvidenceFile),
    timeline: (source.distributor_complaint_activity_timeline ?? []).map(toTimelineEntry),
    canClose: source.distributor_complaint_can_close ?? false,
    canEscalate: source.distributor_complaint_can_escalate ?? false,
  };
}

/**
 * Maps the backend overview response to the four stat cards shown in ComplaintsStats.
 */
export function toComplaintStats(
  overview?: complaint.DistributorComplaintOverview,
): ComplaintStat[] {
  return [
    {
      label: 'Total Complaints',
      value: String(overview?.total_complaints ?? 0),
      note: ' total complaints',
    },
    {
      label: 'Open/In Review',
      value: String(overview?.open_in_review ?? 0),
      note: 'Awaiting Resolution',
    },
    {
      label: 'Resolved',
      value: String(overview?.resolved ?? 0),
      note: ' resolved',
    },
    {
      label: 'Avg. Resolution Time',
      value: overview?.avg_resolution_time ?? '-',
      note: 'Target: < 72h',
    },
  ];
}

export function toComplaintStatus(status?: string | complaint.ComplaintStatus): ComplaintStatus {
  switch (status?.toLowerCase()) {
    case 'submitted':
      return 'Submitted';
    case 'under_review':
    case 'in_progress':
    case 'open':
    case 'escalated':
      return 'In Review';
    case 'resolved':
      return 'Resolved';
    case 'closed':
    case 'rejected':
    default:
      return 'Closed';
  }
}

function toEvidenceFile(source: complaint.ComplaintEvidence): ComplaintEvidenceFile {
  return {
    name: source.distributor_complaint_evidence_name ?? 'unknown',
    size: source.distributor_complaint_evidence_size ?? '-',
  };
}

function toTimelineEntry(source: complaint.ComplaintTimelineEvent): ComplaintTimelineEntry {
  const title = source.distributor_complaint_activity_title ?? '-';
  const actor = source.distributor_complaint_activity_actor ?? '';
  const description = source.distributor_complaint_activity_description ?? '';
  return {
    title,
    detail: actor ? `${description} — ${actor}`.trim() : description,
    timestamp: formatDateTime(source.distributor_complaint_activity_timestamp),
    state: 'done',
  };
}

function formatDateTime(value?: string): string {
  if (!value) return '-';
  try {
    const date = new Date(value);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, ' ') + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return '-';
  return `₦${value.toLocaleString('en-NG')}`;
}
