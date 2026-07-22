import type { LucideIcon } from 'lucide-react';

/**
 * Types shared across the KYC Documents feature. Everything on this dashboard —
 * KPIs, the Document Types panel, Pending Review, Expiring Soon, the Document Lists
 * table, and its filters — now reads from the single `GET /v1/document/overview`
 * "dashboard" endpoint (see kyc-documents-mappers.ts for the API -> UI shape mapping).
 * The remaining static UI copy below (form select options) has no API backing.
 */

// ───────── KPI strip ─────────

export type KpiEmphasis = 'default' | 'destructive';

export interface KycKpi {
  title: string;
  value: string;
  Icon: LucideIcon;
  badge?: { label: string; emphasis: 'success' | 'destructive' };
}

// ───────── Document-type summary cards (dashboard panel) ─────────

export interface DocumentTypeSummary {
  id: string;
  name: string;
  requiredLabel: string;
  categoryLabel: string;
}

// ───────── Pending review / Expiring soon lists ─────────

export interface PendingReviewItem {
  id: string;
  distributor: string;
  fileName: string;
  submittedAgo: string;
}

export interface ExpiringSoonItem {
  id: string;
  distributor: string;
  fileName: string;
  daysLeftLabel: string;
  expiresOnLabel: string;
}

// ───────── Document Lists table ─────────

/** Matches the dashboard's `status` enum exactly — `statuses` filter dropdown works exclusively (`status`, in query params). */
export type DocumentStatus = 'verified' | 'in_review' | 'incomplete' | 'expiring_soon';

export interface DocumentListRow {
  id: string;
  distributor: string;
  initials: string;
  tier: string;
  documents: string;
  lastUpdated: string;
  status: DocumentStatus;
  statusLabel: string;
  /** Row action from the API (e.g. 'review' | 'view') — drives the row-click destination. */
  action: string;
}

// ───────── "Filter By" chips above the Document Lists table ─────────

/** Map of filter id -> selected option *value* (not label), or null when unset. */
export type KycDocumentFilterSelection = Record<string, string | null>;

export interface KycDocumentFilterOption {
  value: string;
  label: string;
}

export interface KycDocumentFilter {
  id: string;
  label: string;
  options: KycDocumentFilterOption[];
}

// ───────── Review Queue (Compliance Centre) ─────────

export interface ReviewQueueItem {
  id: string;
  distributor: string;
  /** Undefined — `GET /v1/document/list` (still used by the Review Queue page) has no tier field. */
  tier?: string;
  fileName: string;
  submittedAgo: string;
  /** Document image/stream URL — no endpoint among the 12 serves document bytes, so
   * this stays undefined and the preview shows its placeholder. */
  documentUrl?: string;
}

// Reasons offered when rejecting a document submission (free-text UI copy, not API data).
export const KYC_REJECT_REASONS = [
  'Invalid Document',
  'Expired Document',
  'Illegible / Poor Quality',
  'Wrong Document Type',
  'Other',
];

// ───────── Document Types configuration list ("see all" page) ─────────

export interface DocumentTypeConfig {
  id: string;
  name: string;
  required: boolean;
  allowedFileTypes: string;
  renewal: string;
  /** Resolved document category label (`document_category` from the API) — replaces the old reminder text. */
  category: string;
}

// ───────── Add-new-document-type form select options ─────────

// These are the form's fixed choice lists (not API data) — see
// kyc-document-type-mappers.ts for how they translate to/from the document-type API.
// Category options come from a real endpoint now (GET /v1/document-category/list),
// fetched directly in kyc-document-type-form.tsx — no static list here anymore.

export const REQUIRED_OPTIONS = [
  { value: 'Required', label: 'Required (Mandatory)' },
  { value: 'Optional', label: 'Optional' },
];

export const EXPIRY_REQUIRED_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export const VALIDITY_PERIOD_OPTIONS = [
  { value: '3 months', label: 'Renew every 3 months' },
  { value: '6 months', label: 'Renew every 6 months' },
  { value: '12 months', label: 'Renew every 12 months' },
  { value: '24 months', label: 'Renew every 24 months' },
  { value: 'No Expiry', label: 'No Expiry' },
];

export const ALLOWED_FILE_TYPE_OPTIONS = [
  { value: 'PDF', label: 'PDF' },
  { value: 'PDF, JPG', label: 'PDF, JPG' },
  { value: 'PDF, JPG, PNG', label: 'PDF, JPG, PNG' },
];

export const MAX_FILE_SIZE_OPTIONS = [
  { value: '1 MB', label: '1 MB' },
  { value: '5 MB', label: '5 MB' },
  { value: '10 MB', label: '10 MB' },
  { value: '20 MB', label: '20 MB' },
];
