import { CheckCircle2, Clock, FileText, AlertTriangle } from 'lucide-react';
import type {
  DomainDocument,
  DomainDashboardSummary,
  DomainDocumentTypePreview,
  DomainReviewQueueItem,
  DomainExpiringSoonItem,
  DomainDashboardRow,
  DomainDashboardFilterOption,
} from '@energyiq/api/generated/schemas';
import type {
  KycKpi,
  PendingReviewItem,
  ExpiringSoonItem,
  ReviewQueueItem,
  DocumentTypeSummary,
  DocumentListRow,
  DocumentStatus,
  KycDocumentFilter,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/**
 * `DomainDocument` (used by the Review Queue page, `GET /v1/document/list`) only carries
 * `distributor_id` — that endpoint has no distributor-name resolution. The dashboard
 * endpoint below (`GET /v1/document/overview`) already resolves it server-side, so this
 * placeholder is only needed for the still-`distributor_id`-only Review Queue page.
 */
export function distributorLabel(distributorId: string | undefined): string {
  if (!distributorId) return 'Unknown distributor';
  return `Distributor #${distributorId.slice(0, 8)}`;
}

function relativeTimeFrom(dateString: string | undefined): string {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}hr ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

/** `GET /v1/document/list?status=pending` -> the Review Queue cards (Review Queue page only). */
export function mapDocumentsToReviewQueueItems(documents: DomainDocument[]): ReviewQueueItem[] {
  return documents.map((document) => ({
    id: document.id ?? '',
    distributor: distributorLabel(document.distributor_id),
    fileName: document.file_name ?? document.document_type ?? 'Document',
    submittedAgo: `Submitted ${relativeTimeFrom(document.created_at)}.`,
  }));
}

// ════════════════════════════════════════════════════════════════
// GET /v1/document/overview — the dashboard "BFF" endpoint. It returns display
// strings pre-formatted to match the Figma design exactly, so these mappers are
// thin renames rather than real formatting logic.
// ════════════════════════════════════════════════════════════════

const KPI_ICONS = {
  totalDistributors: FileText,
  verified: CheckCircle2,
  reviewQueue: Clock,
  expired: AlertTriangle,
} as const;

function cardBadge(
  card: { sub_label?: string; sub_value?: number } | undefined,
  emphasis: 'success' | 'destructive',
): KycKpi['badge'] {
  if (!card?.sub_label) return undefined;
  const label = card.sub_value !== undefined ? `${card.sub_value}${card.sub_label}` : card.sub_label;
  return { label, emphasis };
}

/** `dashboard.summary` -> the 4 KPI tiles at the top of the dashboard. */
export function mapDashboardSummaryToKpis(summary: DomainDashboardSummary | undefined): KycKpi[] {
  return [
    {
      title: 'Total Distributors:',
      value: (summary?.total_distributors?.value ?? 0).toLocaleString(),
      Icon: KPI_ICONS.totalDistributors,
    },
    {
      title: 'Verified:',
      value: (summary?.verified?.value ?? 0).toLocaleString(),
      Icon: KPI_ICONS.verified,
      badge: cardBadge(summary?.verified, 'success'),
    },
    {
      title: 'Review Queue:',
      value: (summary?.review_queue?.value ?? 0).toLocaleString(),
      Icon: KPI_ICONS.reviewQueue,
    },
    {
      title: 'Expired:',
      value: (summary?.expired?.value ?? 0).toLocaleString(),
      Icon: KPI_ICONS.expired,
      badge: cardBadge(summary?.expired, 'destructive'),
    },
  ];
}

/** `dashboard.document_types` -> the dashboard's "Document Types" panel tiles. */
export function mapDocumentTypePreviewToSummary(preview: DomainDocumentTypePreview): DocumentTypeSummary {
  return {
    id: preview.id ?? '',
    name: preview.label ?? '',
    requiredLabel: preview.required_label ?? '',
    categoryLabel: preview.category_label ?? '',
  };
}

/** `dashboard.review_queue.items` -> the dashboard's "Pending review" column. */
export function mapReviewQueueItemToPendingReview(item: DomainReviewQueueItem): PendingReviewItem {
  return {
    id: item.document_id ?? '',
    distributor: item.distributor_name ?? 'Unknown distributor',
    fileName: item.file_name ?? 'Document',
    submittedAgo: item.submitted_label ?? '',
  };
}

/** `dashboard.expiring_soon.items` -> the dashboard's "Expiring Soon" column. */
export function mapExpiringSoonItemToUi(item: DomainExpiringSoonItem): ExpiringSoonItem {
  return {
    id: item.document_id ?? '',
    distributor: item.distributor_name ?? 'Unknown distributor',
    fileName: item.file_name ?? 'Document',
    daysLeftLabel: item.days_until_expiry_label ?? '',
    expiresOnLabel: item.expires_at_label ?? '',
  };
}

const KNOWN_DOCUMENT_STATUSES = new Set<DocumentStatus>([
  'verified',
  'in_review',
  'incomplete',
  'expiring_soon',
]);

function toDocumentStatus(status: string | undefined): DocumentStatus {
  return status && KNOWN_DOCUMENT_STATUSES.has(status as DocumentStatus)
    ? (status as DocumentStatus)
    : 'incomplete';
}

/** `dashboard.table.items` -> the "Document Lists" table rows (the previously-mocked table). */
export function mapDashboardRowToDocumentListRow(row: DomainDashboardRow): DocumentListRow {
  return {
    id: row.distributor_id ?? '',
    distributor: row.distributor_name ?? 'Unknown distributor',
    initials: row.distributor_initials ?? '',
    tier: row.tier_label ?? '',
    documents: row.documents_progress_label ?? '',
    lastUpdated: row.last_updated_label ?? '',
    status: toDocumentStatus(row.status),
    statusLabel: row.status_label ?? '',
    action: row.action ?? 'view',
  };
}

/** `dashboard.filters.*` -> a "Filter By" chip's option list. */
export function mapDashboardFilterOptions(
  id: string,
  label: string,
  options: DomainDashboardFilterOption[] | undefined,
): KycDocumentFilter {
  return {
    id,
    label,
    options: (options ?? []).map((option) => ({ value: option.value ?? '', label: option.label ?? '' })),
  };
}
