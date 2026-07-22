import type { DomainDocument, DomainDocumentDetail } from '@energyiq/api/generated/schemas';

/** Display status shown in the UI — `expiring` is derived, not an API status value. */
export type DisplayDocumentStatus = 'approved' | 'rejected' | 'pending' | 'expired' | 'expiring';

const EXPIRING_SOON_DAYS = 30;

function daysUntil(dateString: string | undefined): number | null {
  if (!dateString) return null;
  const diffMs = new Date(dateString).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** `approved` documents within 30 days of `expires_at` are shown as "expiring" instead. */
export function toDisplayStatus(document: DomainDocument): DisplayDocumentStatus {
  if (document.status === 'approved') {
    const daysLeft = daysUntil(document.expires_at);
    if (daysLeft !== null && daysLeft <= EXPIRING_SOON_DAYS) return 'expiring';
    return 'approved';
  }
  return (document.status as DisplayDocumentStatus | undefined) ?? 'pending';
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysRemaining(dateString: string | undefined): number {
  return Math.max(0, daysUntil(dateString) ?? 0);
}

export interface DocumentActivityEntry {
  title: string;
  description: string;
  date: string;
}

/**
 * `GET /v1/document/read/{id}` now returns `DomainDocumentDetail` — a "Figma-facing"
 * payload of pre-formatted display strings (no raw `reviewed_at`/`reviewed_by` fields
 * anymore, only `submitted_at_label` and a generic `status_note`). Build the same
 * minimal timeline from what's actually available rather than the old raw timestamps.
 */
export function buildDetailActivity(document: DomainDocumentDetail): DocumentActivityEntry[] {
  const entries: DocumentActivityEntry[] = [];

  if (document.submitted_at_label) {
    entries.push({
      title: 'Submitted',
      description: `${document.file_name ?? 'Document'} was submitted for review.`,
      date: document.submitted_at_label,
    });
  }

  if (document.status === 'rejected') {
    entries.push({
      title: 'Rejected',
      description: document.rejection_reason ?? document.status_note ?? 'This document was rejected.',
      date: document.status_label ?? '',
    });
  } else if (document.status_note) {
    entries.push({
      title: document.status_label ?? 'Status update',
      description: document.status_note,
      date: document.status_label ?? '',
    });
  }

  return entries;
}
