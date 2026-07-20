import { CheckCircle2, Clock, FileText, AlertTriangle } from 'lucide-react';
import type { DomainDocument, DomainComplianceSummary, DomainDocumentType } from '@energyiq/api/generated/schemas';
import type {
  KycKpi,
  PendingReviewItem,
  ExpiringSoonItem,
  ReviewQueueItem,
  DocumentTypeSummary,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/**
 * `DomainDocument` only carries `distributor_id` — there is no endpoint that resolves
 * it to a distributor's name (same gap as the still-mocked Document Lists table, see
 * kyc-documents-mocks.ts). Every place the design shows a distributor name reads this
 * placeholder instead of fabricating one.
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

function daysUntil(dateString: string | undefined): number {
  if (!dateString) return 0;
  const diffMs = new Date(dateString).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** `GET /v1/document/compliance` -> the 4 KPI tiles at the top of the dashboard. */
export function mapComplianceSummaryToKpis(summary: DomainComplianceSummary): KycKpi[] {
  const totalDocuments = summary.total_documents ?? 0;
  const verified = summary.verified ?? 0;
  const completionRate = totalDocuments > 0 ? Math.round((verified / totalDocuments) * 100) : 0;

  return [
    { title: 'Total Documents:', value: totalDocuments.toLocaleString(), Icon: FileText },
    {
      title: 'Verified:',
      value: verified.toLocaleString(),
      Icon: CheckCircle2,
      badge: { label: `${completionRate}% Completion Rate`, emphasis: 'success' },
    },
    { title: 'Pending  Review:', value: (summary.pending_review ?? 0).toLocaleString(), Icon: Clock },
    {
      title: 'Expired:',
      value: (summary.expired ?? 0).toLocaleString(),
      Icon: AlertTriangle,
      badge: { label: `${summary.expiring_soon ?? 0} Due for Renewal`, emphasis: 'destructive' },
    },
  ];
}

/** `GET /v1/document/list?status=pending` -> the dashboard's "Pending review" column. */
export function mapDocumentsToPendingReviewItems(documents: DomainDocument[]): PendingReviewItem[] {
  return documents.map((document) => ({
    id: document.id ?? '',
    distributor: distributorLabel(document.distributor_id),
    fileName: document.file_name ?? document.document_type ?? 'Document',
    submittedAgo: relativeTimeFrom(document.created_at),
  }));
}

/** `GET /v1/document/list` filtered to approved docs expiring within 30 days -> "Expiring Soon" column. */
export function mapDocumentsToExpiringSoonItems(documents: DomainDocument[]): ExpiringSoonItem[] {
  return documents
    .filter((document) => document.status === 'approved' && document.expires_at)
    .map((document) => ({
      id: document.id ?? '',
      distributor: distributorLabel(document.distributor_id),
      fileName: document.file_name ?? document.document_type ?? 'Document',
      daysLeft: daysUntil(document.expires_at),
      expiresOn: formatDate(document.expires_at),
    }))
    .filter((item) => item.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

/** `GET /v1/document/list?status=pending` -> the Review Queue cards. */
export function mapDocumentsToReviewQueueItems(documents: DomainDocument[]): ReviewQueueItem[] {
  return documents.map((document) => ({
    id: document.id ?? '',
    distributor: distributorLabel(document.distributor_id),
    fileName: document.file_name ?? document.document_type ?? 'Document',
    submittedAgo: `Submitted ${relativeTimeFrom(document.created_at)}.`,
  }));
}

/** `GET /v1/doctype/list` -> the dashboard's "Document Types" panel tiles (first 3). */
export function mapDocumentTypeToSummary(documentType: DomainDocumentType): DocumentTypeSummary {
  return {
    name: documentType.label ?? documentType.name ?? '',
    mandatory: documentType.required ?? false,
  };
}
