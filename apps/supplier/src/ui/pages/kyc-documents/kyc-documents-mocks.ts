import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Placeholder data for the KYC Documents feature. Every block is marked with a
 * TODO(orval) note showing the generated query that will replace it once the
 * compliance/KYC endpoints land.
 */

// ───────── KPI strip ─────────

export type KpiEmphasis = 'default' | 'destructive';

export interface KycKpi {
  title: string;
  value: string;
  Icon: LucideIcon;
  badge?: { label: string; emphasis: 'success' | 'destructive' };
}

// TODO(orval): replace with the KYC document-summary query (counts + completion rate).
export const KYC_KPIS: KycKpi[] = [
  { title: 'Total Documents:', value: '1,248', Icon: FileText },
  {
    title: 'Verified:',
    value: '1,084',
    Icon: CheckCircle2,
    badge: { label: '87% Completion Rate', emphasis: 'success' },
  },
  { title: 'Pending  Review:', value: '126', Icon: Clock },
  {
    title: 'Expired:',
    value: '12',
    Icon: AlertTriangle,
    badge: { label: '3 Due for Renewal', emphasis: 'destructive' },
  },
];

// ───────── Document-type summary cards (dashboard panel) ─────────

export interface DocumentTypeSummary {
  name: string;
  category: string;
  mandatory: boolean;
}

// TODO(orval): replace with the document-types query (mandatory flag + category).
export const DOCUMENT_TYPE_SUMMARIES: DocumentTypeSummary[] = [
  { name: 'Business License', category: 'Legal', mandatory: true },
  { name: 'Tax Certificate', category: 'Financial', mandatory: true },
  { name: 'Insurance Policy', category: 'Risks', mandatory: true },
];

// ───────── Pending review / Expiring soon lists ─────────

export interface PendingReviewItem {
  id: string;
  distributor: string;
  fileName: string;
  submittedAgo: string;
}

// TODO(orval): replace with the pending-review documents query.
export const PENDING_REVIEW_ITEMS: PendingReviewItem[] = [
  {
    id: 'pr-1',
    distributor: 'Adewale Oil & Gas',
    fileName: 'Tax Clearance_certificate_2025.pdf',
    submittedAgo: '2hr ago',
  },
  {
    id: 'pr-2',
    distributor: 'Kano Trade Supplies',
    fileName: 'CAC_certificate_2025.pdf',
    submittedAgo: '5hr ago',
  },
  {
    id: 'pr-3',
    distributor: 'Emeka Gas Supplies',
    fileName: 'Business License_2025.pdf',
    submittedAgo: '1 day ago',
  },
];

export interface ExpiringSoonItem {
  id: string;
  distributor: string;
  fileName: string;
  daysLeft: number;
  expiresOn: string;
}

// TODO(orval): replace with the expiring-documents query.
export const EXPIRING_SOON_ITEMS: ExpiringSoonItem[] = [
  {
    id: 'ex-1',
    distributor: 'Adewale Oil & Gas',
    fileName: 'Tax Clearance_certificate_2025.pdf',
    daysLeft: 7,
    expiresOn: '14 June 2026',
  },
  {
    id: 'ex-2',
    distributor: 'Sunrise Energy PHC',
    fileName: 'Business Reg_certificate_2025.pdf',
    daysLeft: 12,
    expiresOn: '19 June 2026',
  },
  {
    id: 'ex-3',
    distributor: 'Delta Fuel Merchants',
    fileName: 'Business License_2025.pdf',
    daysLeft: 18,
    expiresOn: '25 June 2026',
  },
];

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

// TODO(orval): replace with the distributor-documents list query (paginated).
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

// TODO(orval): drive these options from the documents endpoint's facets.
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
  tier: DistributorTier;
  fileName: string;
  submittedAgo: string;
  /** Document image/stream URL — undefined until the real source is wired. */
  documentUrl?: string;
  /** Demo-only: approving a restricted item surfaces the "No Access" error. */
  restricted?: boolean;
}

// TODO(orval): replace with the pending-review queue query; `documentUrl` comes
// from the document storage/stream endpoint (the preview shows a placeholder until then).
// `restricted` is a temporary stand-in until the real permission check / 403 lands.
export const REVIEW_QUEUE_ITEMS: ReviewQueueItem[] = [
  { id: 'rq-1', distributor: 'Adewale Oil & Gas', tier: 'Gold', fileName: 'Tax Clearance_certificate_2025.pdf', submittedAgo: 'Submitted 2 hours ago.' },
  { id: 'rq-2', distributor: 'Kano Trade Supplies', tier: 'Gold', fileName: 'CAC Certificate (Renewal)_2025.pdf', submittedAgo: 'Submitted 5 hours ago.' },
  { id: 'rq-3', distributor: 'Emeka Gas Supplies', tier: 'Gold', fileName: 'Business License_2025.pdf', submittedAgo: 'Submitted 1 day ago.' },
  { id: 'rq-4', distributor: 'Sunrise Energy PHC', tier: 'Gold', fileName: 'Utility Bill (Onboarding)', submittedAgo: 'Submitted 2 day ago.' },
  { id: 'rq-5', distributor: 'Delta Fuel Merchants', tier: 'Gold', fileName: 'Business Reg. Certificate (Renewal)', submittedAgo: 'Submitted 2 day ago.', restricted: true },
];

// Reasons offered when rejecting a document submission.
export const KYC_REJECT_REASONS = [
  'Invalid Document',
  'Expired Document',
  'Illegible / Poor Quality',
  'Wrong Document Type',
  'Other',
];

/** Mocked approve/reject call used to drive the "Confirming…" loading state. */
// TODO(orval): replace with the generated approve/reject-document mutations.
export function mockReviewAction(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

// ───────── Document Types configuration list ("see all" page) ─────────

export interface DocumentTypeConfig {
  id: string;
  name: string;
  required: boolean;
  allowedFileTypes: string;
  renewal: string;
  reminder: string;
}

// TODO(orval): replace with the document-types configuration query.
export const DOCUMENT_TYPE_CONFIGS: DocumentTypeConfig[] = [
  {
    id: 'dt-1',
    name: 'Business Registration Certificate',
    required: true,
    allowedFileTypes: 'PDF, JPG, PNG',
    renewal: 'Renew every 24 months',
    reminder: 'Reminder: 60 days before',
  },
  {
    id: 'dt-2',
    name: 'CAC Certificate',
    required: true,
    allowedFileTypes: 'PDF, JPG, PNG',
    renewal: 'Renew every 12 months',
    reminder: 'Reminder: 30 days before',
  },
  {
    id: 'dt-3',
    name: 'Tax Clearance Certificate',
    required: true,
    allowedFileTypes: 'PDF, JPG, PNG',
    renewal: 'Renew every 12 months',
    reminder: 'Reminder: 30 days before',
  },
  {
    id: 'dt-4',
    name: 'Director NIN Slip',
    required: true,
    allowedFileTypes: 'PDF, JPG, PNG',
    renewal: 'No Expiry',
    reminder: 'Reminder: Never',
  },
  {
    id: 'dt-5',
    name: 'Utility Bill',
    required: false,
    allowedFileTypes: 'PDF, JPG, PNG',
    renewal: 'Renew every 3 months',
    reminder: 'Reminder: Never',
  },
];

// ───────── Add-new-document-type form select options ─────────

// TODO(orval): these option lists come from reference/lookup endpoints — replace
// with the generated queries (categories, validity periods, file types, sizes).
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

/**
 * Mocked create call used to drive the form's loading state before the success
 * toast fires. Resolves after a short delay.
 */
// TODO(orval): replace with the generated create-document-type mutation.
export function mockCreateDocumentType(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 900));
}
