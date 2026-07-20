import type { LucideIcon } from 'lucide-react';

/**
 * Types shared across the KYC Documents feature, plus the pieces of UI copy/options
 * that aren't backed by an API at all (form select options, reject reasons) and the
 * one section still on mock data: the "Document Lists" table below is per-distributor
 * (name + tier), but no endpoint in the API returns a distributor's name or tier —
 * only `distributor_id`. Every other section reads live data via the generated
 * `@energyiq/api/generated` hooks (see kyc-documents-mappers.ts for the API -> UI
 * shape mapping).
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
  name: string;
  mandatory: boolean;
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
  daysLeft: number;
  expiresOn: string;
}

// ───────── Document Lists table ─────────

export type DistributorTier = 'Gold' | 'Silver' | 'Bronze';
export type DocumentStatus = 'Verified' | 'In Review' | 'Incomplete' | 'Expiring soon';

export interface DocumentListRow {
  id: string;
  distributor: string;
  tier: DistributorTier;
  documents: string;
  lastUpdated: string;
  status: DocumentStatus;
}

// TODO(orval): no endpoint returns a distributor's name/tier (only `distributor_id`
// on Document) or a per-distributor completeness rollup — this table stays mocked
// until a distributor-list/detail endpoint exists. Every other KYC documents section
// is wired to the real documents/document-types endpoints.
export const DOCUMENT_LIST_ROWS: DocumentListRow[] = [
  { id: 'dl-1', distributor: 'PetroMax Energy', tier: 'Gold', documents: '5/5 Complete', lastUpdated: 'Today', status: 'Verified' },
  { id: 'dl-2', distributor: 'GUO Energy', tier: 'Silver', documents: '4/5 Complete', lastUpdated: '2hr ago', status: 'In Review' },
  { id: 'dl-3', distributor: 'Delta Fuel Merchants', tier: 'Gold', documents: '4/5 Complete', lastUpdated: '3d ago', status: 'Verified' },
  { id: 'dl-4', distributor: 'Sunrise Energy PHC', tier: 'Gold', documents: '4/5 Complete', lastUpdated: '5d ago', status: 'Verified' },
  { id: 'dl-5', distributor: 'GUO Energy', tier: 'Bronze', documents: '3/5 Complete', lastUpdated: '21 May', status: 'Incomplete' },
  { id: 'dl-6', distributor: 'Delta Fuel Merchants', tier: 'Silver', documents: '4/5 Complete', lastUpdated: '18 May', status: 'Verified' },
  { id: 'dl-7', distributor: 'Sunrise Energy PHC', tier: 'Gold', documents: '5/5 Complete', lastUpdated: '15 May', status: 'Expiring soon' },
];

// ───────── "Filter By" chips above the Document Lists table ─────────

/** Map of filter id (a DocumentListRow key) -> selected option, or null when unset. */
export type KycDocumentFilterSelection = Record<string, string | null>;

export interface KycDocumentFilter {
  /** Matches a key on DocumentListRow so filtering stays generic. */
  id: 'distributor' | 'tier' | 'status';
  label: string;
  options: string[];
}

// Distributor options are derived from the rows so they stay in sync.
const DISTRIBUTOR_OPTIONS = [...new Set(DOCUMENT_LIST_ROWS.map((row) => row.distributor))];

export const KYC_DOCUMENT_FILTERS: KycDocumentFilter[] = [
  { id: 'distributor', label: 'All Distributors', options: DISTRIBUTOR_OPTIONS },
  { id: 'tier', label: 'All Tiers', options: ['Gold', 'Silver', 'Bronze'] },
  {
    id: 'status',
    label: 'All Status',
    options: ['Verified', 'In Review', 'Incomplete', 'Expiring soon'],
  },
];

// ───────── Review Queue (Compliance Centre) ─────────

export interface ReviewQueueItem {
  id: string;
  distributor: string;
  /** Undefined — no endpoint returns a distributor's tier (see note above). */
  tier?: DistributorTier;
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
  reminder: string;
}

// ───────── Add-new-document-type form select options ─────────

// These are the form's fixed choice lists (not API data) — see
// kyc-document-type-mappers.ts for how they translate to/from the document-type API.
export const DOCUMENT_CATEGORY_OPTIONS = [
  { value: 'Legal', label: 'Legal' },
  { value: 'Financial', label: 'Financial' },
  { value: 'Risks', label: 'Risks' },
  { value: 'Compliance', label: 'Compliance' },
  { value: 'Identity', label: 'Identity' },
];

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
