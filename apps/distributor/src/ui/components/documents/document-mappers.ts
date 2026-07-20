import type { DomainDocument } from '@energyiq/api/generated/schemas';

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

/** No audit-log endpoint exists among the 12 — derive a minimal timeline from the
 * document's own submitted/reviewed timestamps instead of leaving it empty. */
export function buildActivity(document: DomainDocument): DocumentActivityEntry[] {
  const entries: DocumentActivityEntry[] = [];

  if (document.created_at) {
    entries.push({
      title: 'Submitted',
      description: `${document.file_name ?? 'Document'} was submitted for review.`,
      date: formatDate(document.created_at),
    });
  }

  if (document.status === 'approved' && document.reviewed_at) {
    entries.push({
      title: 'Approved',
      description: 'This document was reviewed and approved.',
      date: formatDate(document.reviewed_at),
    });
  }

  if (document.status === 'rejected' && document.reviewed_at) {
    entries.push({
      title: 'Rejected',
      description: document.rejection_reason ?? 'This document was rejected.',
      date: formatDate(document.reviewed_at),
    });
  }

  return entries;
}
