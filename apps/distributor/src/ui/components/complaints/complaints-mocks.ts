import {
  GetV1DistributorComplaintListStatus,
  RaiseRequestComplaintCategory as HttpRaiseRequestComplaintCategory,
} from '@energyiq/api/generated/schemas';

// ---------------------------------------------------------------------------
// Status filter — "All" plus whatever the dashboard endpoint returns.
// ---------------------------------------------------------------------------

/** Local sentinel for "no status filter applied"; every other value comes from the API. */
export const ALL_STATUSES = 'All' as const;

/** Badge text color per `distributor_complaint_status_code`; background reuses the same hue at low opacity. */
export const COMPLAINT_STATUS_COLOR: Record<GetV1DistributorComplaintListStatus, string> = {
  open: '#2563EB',
  under_review: '#FB8C1C',
  resolved: '#388E3C',
  closed: '#9CA3AF',
  escalated: '#D30A0A',
};

// ---------------------------------------------------------------------------
// Raise-a-complaint wizard
// ---------------------------------------------------------------------------

export interface ComplaintOption {
  value: string;
  label: string;
  /** Optional secondary line shown under the label (used by resolution cards). */
  description?: string;
}

/** Step 1 — "Complaint Type" selectable cards, one per `HttpRaiseRequestComplaintCategory` value. */
export const ISSUE_TYPE_OPTIONS: ComplaintOption[] = [
  { value: HttpRaiseRequestComplaintCategory.quality, label: 'Quality Issues' },
  { value: HttpRaiseRequestComplaintCategory.quantity, label: 'Incomplete Delivery' },
  { value: HttpRaiseRequestComplaintCategory.wrong_product, label: 'Wrong Product' },
  { value: HttpRaiseRequestComplaintCategory.delivery, label: 'Delivery Issue' },
  { value: HttpRaiseRequestComplaintCategory.pricing, label: 'Pricing Discrepancy' },
  { value: HttpRaiseRequestComplaintCategory.documentation, label: 'Documentation Issue' },
];

/**
 * Step 2 — "Preferred Resolution" selectable cards. `HttpRaiseRequest` has no
 * matching field, so this stays local-only and is not sent by the create mutation.
 */
export const PREFERRED_RESOLUTION_OPTIONS: ComplaintOption[] = [
  { value: 'monetary-refund', label: 'Monetary Refund', description: 'Credited to trading account' },
  { value: 'replacement-delivery', label: 'Replacement Delivery', description: 'Reship the shortfall' },
];

export interface ComplaintDraftEvidenceFile {
  name: string;
  /** Display size, e.g. "1.4MB". */
  size: string;
}

/** Local wizard draft; mirrors what the create-complaint mutation accepts. */
export interface RaiseComplaintDraft {
  issueType: HttpRaiseRequestComplaintCategory;
  relatedOrder: string;
  complaintTitle: string;
  description: string;
  quantityAffected: string;
  estimate: string;
  /** Local-only, not sent to the API — see `PREFERRED_RESOLUTION_OPTIONS`. */
  expectedResolution: string;
  /** Local-only, not sent to the API — see `PREFERRED_RESOLUTION_OPTIONS`. */
  claimAmount: string;
  preferredResolution: string;
  // TODO(orval): evidence stays presentational until a presign/upload endpoint
  // exists for complaint evidence (same gap as document uploads — see
  // docs/api-integration-status.md §2). Files picked here are not sent by the
  // create mutation; do not fabricate `file_url` values for them.
  files: ComplaintDraftEvidenceFile[];
}

/** A fresh, empty draft. */
export const EMPTY_RAISE_COMPLAINT_DRAFT: RaiseComplaintDraft = {
  issueType: HttpRaiseRequestComplaintCategory.quantity,
  // No default — populated once the distributor picks a real order from
  // ComplaintOrderSelect (see raise-complaint-modal.tsx).
  relatedOrder: '',
  complaintTitle: '',
  description: '',
  quantityAffected: '',
  estimate: '',
  expectedResolution: '',
  claimAmount: '',
  preferredResolution: 'monetary-refund',
  files: [],
};
