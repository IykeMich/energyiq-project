// Replica data for the supplier Complaints page design.
// TODO(orval): replace each block with the matching generated query hook once the API lands.

export type ComplaintStatus = 'Submitted' | 'In Review' | 'Resolved' | 'Closed';

export interface ComplaintRow {
  id: string;
  /** Headline of the complaint, e.g. "Incomplete Product-200L". */
  type: string;
  /** Product + order reference shown under the type, e.g. "AGO (Diesel)- ORD-004". */
  reference: string;
  /** Display timestamp, e.g. "20 Nov 2025, 10:32 AM". */
  dateRaised: string;
  status: ComplaintStatus;
  /** SLA remaining, e.g. "34h left"; resolved/closed rows show "-". */
  sla: string;
}

export const COMPLAINTS_MOCK: ComplaintRow[] = [
  { id: 'COMP-001', type: 'Incomplete Product-200L', reference: 'AGO (Diesel)- ORD-004', dateRaised: '20 Nov 2025, 10:32 AM', status: 'In Review', sla: '34h left' },
  { id: 'COMP-002', type: 'Fuel Quality Degradation', reference: 'PMS (Premium)- ORD-005', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Submitted', sla: '62h left' },
  { id: 'COMP-003', type: 'Wrong Product delivered', reference: 'DPK (Kerosene)- ORD-005', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
  { id: 'COMP-004', type: 'Short Delivery', reference: 'AGO (Diesel)- ORD-006', dateRaised: '20 Nov 2025, 10:32 AM', status: 'In Review', sla: '18h left' },
  { id: 'COMP-005', type: 'Delayed Delivery', reference: 'PMS (Premium)- ORD-007', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
  { id: 'COMP-006', type: 'Wrong Product delivered', reference: 'DPK (Kerosene)- ORD-005', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
  { id: 'COMP-007', type: 'Damaged Seal', reference: 'AGO (Diesel)- ORD-008', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Closed', sla: '-' },
  { id: 'COMP-008', type: 'Billing Discrepancy', reference: 'PMS (Premium)- ORD-009', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
  { id: 'COMP-009', type: 'Wrong Product delivered', reference: 'DPK (Kerosene)- ORD-010', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
  { id: 'COMP-010', type: 'Incomplete Product-150L', reference: 'AGO (Diesel)- ORD-011', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
  { id: 'COMP-011', type: 'Fuel Quality Degradation', reference: 'PMS (Premium)- ORD-012', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
  { id: 'COMP-012', type: 'Late Dispatch', reference: 'DPK (Kerosene)- ORD-013', dateRaised: '20 Nov 2025, 10:32 AM', status: 'Resolved', sla: '-' },
];

/** Badge text color per status; the badge background reuses the same hue at low opacity. */
export const COMPLAINT_STATUS_COLOR: Record<ComplaintStatus, string> = {
  Submitted: '#2563EB',
  'In Review': '#FB8C1C',
  Resolved: '#388E3C',
  Closed: '#9CA3AF',
};

/** "Filter By: Status" options shown above the table. */
export const COMPLAINT_STATUS_FILTERS: (ComplaintStatus | 'All')[] = [
  'All',
  'Submitted',
  'In Review',
  'Resolved',
  'Closed',
];

export interface ComplaintStat {
  label: string;
  value: string;
  /** Small note under the value. */
  note: string;
  /** Optional colored prefix on the note, e.g. "+2". */
  noteHighlight?: string;
  noteHighlightColor?: string;
}

// TODO(orval): replace with the complaints summary query.
export const COMPLAINT_STATS: ComplaintStat[] = [
  { label: 'Total Complaints', value: '12', noteHighlight: '+2', noteHighlightColor: '#D30A0A', note: ' this month' },
  { label: 'Open/In Review', value: '3', note: 'Awaiting Resolution' },
  { label: 'Resolved', value: '8', noteHighlight: '+1', noteHighlightColor: '#388E3C', note: ' this week' },
  { label: 'Avg. Resolution Time', value: '41h', note: 'Target: < 72h' },
];

/** Count shown in the review banner. */
export const COMPLAINTS_UNDER_REVIEW = 2;

// ---------------------------------------------------------------------------
// Complaint detail (slide-in panel)
// ---------------------------------------------------------------------------

export interface ComplaintEvidenceFile {
  name: string;
  /** Display size, e.g. "1.4MB". */
  size: string;
}

export interface ComplaintTimelineEntry {
  title: string;
  /** Secondary line under the title, e.g. "Submitted by Emeka Okafor". */
  detail: string;
  timestamp: string;
  /** "done" renders a green check; "current" renders an amber clock. */
  state: 'done' | 'current';
}

export interface ComplaintDetail {
  id: string;
  status: ComplaintStatus;
  title: string;
  orderRef: string;
  product: string;
  dateRaised: string;
  quantityAffected: string;
  estimatedAmount: string;
  supplier: string;
  description: string;
  evidence: ComplaintEvidenceFile[];
  timeline: ComplaintTimelineEntry[];
}

// TODO(orval): replace with the single-complaint detail query (by id).
export const COMPLAINT_DETAIL_MOCK: ComplaintDetail = {
  id: 'COMP-004',
  status: 'In Review',
  title: 'Incomplete delivery — 200L short',
  orderRef: 'ORD-003',
  product: 'AGO Diesel',
  dateRaised: '20 Nov 2025, 10:32 AM',
  quantityAffected: '200 litres short',
  estimatedAmount: '₦84,000',
  supplier: 'Apex Petroleum Ltd',
  description:
    'We received a delivery on February 23rd for order PO-4421 (AGO Diesel, 1000L). However upon measurement at the tank farm, only 800L was confirmed — a shortfall of 200L. The truck driver could not provide any explanation.',
  evidence: [
    { name: 'tank_measurement.jpg', size: '1.4MB' },
    { name: 'delivery_waybill.jpg', size: '0.8MB' },
  ],
  timeline: [
    {
      title: 'Complaint submitted.',
      detail: 'Submitted by Emeka Okafor',
      timestamp: '20 Nov 2025, 10:32 AM',
      state: 'done',
    },
    {
      title: 'Complaint acknowledged.',
      detail: 'by Apex Petroleum Ltd — assigned to Operations team',
      timestamp: '21 Nov 2025, 11:05 AM',
      state: 'done',
    },
    {
      title: 'Under Review.',
      detail: 'supplier reviewing waybill records and truck GPS data',
      timestamp: '28 Nov 2025, 11:05 AM',
      state: 'current',
    },
  ],
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

/** Step 1 — "Complaint Type" selectable cards. */
export const ISSUE_TYPE_OPTIONS: ComplaintOption[] = [
  { value: 'faulty-goods', label: 'Faulty Goods' },
  { value: 'incomplete-delivery', label: 'Incomplete Delivery' },
  { value: 'wrong-goods', label: 'Wrong Goods' },
  { value: 'quality-issues', label: 'Quality Issues' },
];

/** Step 1 — "Related Order" options. */
export const RELATED_ORDER_OPTIONS: ComplaintOption[] = [
  { value: 'ORD-003', label: 'ORD-003-AGO Diesel' },
  { value: 'ORD-004', label: 'ORD-004-AGO Diesel' },
  { value: 'ORD-005', label: 'ORD-005-PMS Premium' },
];

/** Step 2 — "Preferred Resolution" selectable cards. */
export const PREFERRED_RESOLUTION_OPTIONS: ComplaintOption[] = [
  { value: 'monetary-refund', label: 'Monetary Refund', description: 'Credited to trading account' },
  { value: 'replacement-delivery', label: 'Replacement Delivery', description: 'Reship the shortfall' },
];

/** Local wizard draft; mirrors what the create-complaint mutation will eventually accept. */
export interface RaiseComplaintDraft {
  issueType: string;
  relatedOrder: string;
  complaintTitle: string;
  description: string;
  quantityAffected: string;
  estimate: string;
  expectedResolution: string;
  claimAmount: string;
  preferredResolution: string;
  files: ComplaintEvidenceFile[];
}

// TODO(orval): the real reference id comes from the create-complaint mutation response.
export const NEW_COMPLAINT_REFERENCE = 'COMP-003';

/** A fresh draft, pre-filled to mirror the design's example content. */
export const EMPTY_RAISE_COMPLAINT_DRAFT: RaiseComplaintDraft = {
  issueType: 'incomplete-delivery',
  relatedOrder: 'ORD-003',
  complaintTitle: 'Incomplete delivery — 200L short',
  description:
    'We received a delivery on February 23rd for ORD-003 (AGO Diesel, 1000L). However upon measurement at the tank farm, only 800L was confirmed — a shortfall of 200L. The truck driver could not provide any explanation and left before the discrepancy was formally documented.',
  quantityAffected: '200L',
  estimate: '₦84,000',
  expectedResolution: 'Incomplete delivery — 200L short',
  claimAmount: 'Incomplete delivery — 200L short',
  preferredResolution: 'monetary-refund',
  files: [
    { name: 'tank_measurement.jpg', size: '1.4MB' },
    { name: 'delivery_waybill.jpg', size: '0.8MB' },
  ],
};
