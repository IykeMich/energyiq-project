// Replica data for the supplier Complaint Details design.
// TODO(orval): replace `getComplaintDetail` with the generated complaint-by-id query hook.

import type { ComplaintSeverity } from '@/ui/components/complaints/complaints-mocks';

export type ComplaintThreadAuthor = 'distributor' | 'supplier';

export interface ComplaintThreadMessage {
  author: ComplaintThreadAuthor;
  /** Display name shown in the message meta (e.g. "EastFuel Ltd" or "You"). */
  name: string;
  /** Role + organisation/tier descriptors shown next to the name. */
  meta: string[];
  timestamp: string;
  body: string;
}

export interface ComplaintDistributorInfo {
  name: string;
  code: string;
  tier: string;
  trustScore: number;
}

export interface ComplaintSummaryInfo {
  issue: string;
  severity: ComplaintSeverity;
  /** Claim amount in Naira; formatted for display. */
  claimNGN: number;
  sla: string;
  assigned: string;
}

export interface ComplaintOrderSummaryInfo {
  product: string;
  ordered: string;
  delivered: string;
  shortfall: string;
}

export interface ComplaintTimelineEvent {
  timestamp: string;
  title: string;
  /** Optional quoted message preview shown beneath the title (truncated in the design). */
  quote?: string;
  /** Gold ring marker when true; muted dot otherwise. */
  highlight: boolean;
}

export interface ComplaintDocument {
  name: string;
  /** Short document kind shown first in the meta line (e.g. "waybill"). */
  kind: string;
  size: string;
  from: string;
  date: string;
}

export interface ComplaintDetail {
  id: string;
  title: string;
  statusLabel: string;
  slaBanner: string;
  distributor: ComplaintDistributorInfo;
  summary: ComplaintSummaryInfo;
  order: ComplaintOrderSummaryInfo;
  thread: ComplaintThreadMessage[];
  timeline: ComplaintTimelineEvent[];
  documents: ComplaintDocument[];
  /** Organisation the supplier responds as, shown in the resolution modal. */
  responder: string;
  /** Verbatim deadline reminder shown in the resolution modal. */
  responseDeadlineNote: string;
}

/** Resolution options offered in the Propose Resolution modal. TODO(orval): source from endpoint. */
export const RESOLUTION_TYPES = ['Full Refund', 'Replacement Delivery', 'Partial Credit'];

/** Reasons offered in the Reject Complaint modal. TODO(orval): source from endpoint. */
export const REJECTION_REASONS = [
  'All items delivered',
  'Insufficient evidence',
  'Outside SLA window',
  'Duplicate complaint',
  'Resolved directly with distributor',
];

/** Officer + timestamp shown on the Complaint Rejected summary. TODO(orval): from the reject mutation. */
export const REJECTION_AUDIT = {
  rejectedBy: 'Compliance Office (Amaka Ibe)',
  date: '25 Mar 2026, 11:20 AM',
};

const COMPLAINT_DETAIL: ComplaintDetail = {
  id: 'COMP-001',
  title: 'Short delivery on Order ORD-1001',
  statusLabel: 'Under Review',
  slaBanner: 'SLA Deadline: Mar 22, 2025- 12,000L missing',
  distributor: { name: 'EastFuel Ltd', code: 'DIST-002', tier: 'Gold Tier', trustScore: 96 },
  summary: {
    issue: 'Incomplete Delivery',
    severity: 'High',
    claimNGN: 4200000,
    sla: 'Mar 20, 2026',
    assigned: 'Compliance Team',
  },
  order: {
    product: 'Diesel (AGO)',
    ordered: '40,000L',
    delivered: '28,000L',
    shortfall: '12,000L',
  },
  thread: [
    {
      author: 'distributor',
      name: 'EastFuel Ltd',
      meta: ['Distributor', 'Gold'],
      timestamp: 'Mar 18 . 09:42AM',
      body:
        'We received only 28,000Litres out of the ordered 40,000Litres of AGO. The waybill signed by our store officer confirms 28,000 Litres. We are requesting an immediate replacement delivery or full refund of 12,000L shortfall valued at #4,200,000.',
    },
    {
      author: 'supplier',
      name: 'You',
      meta: ['Supplier', 'Starlink Oil'],
      timestamp: 'Mar 18 . 09:52AM',
      body:
        'Thank you for raising this. We have received your waybill and are cross-checking it against our dispatch records. Our Logistics team has been notified. We will revert within 24 hours.',
    },
  ],
  timeline: [
    {
      timestamp: '18 Mar · 09:41',
      title: 'Complaint filed by Kano Petroleum Co. · Assigned to Compliance Team',
      highlight: true,
    },
    {
      timestamp: '18 Mar · 09:42',
      title: 'EastFuel Ltd sent a message',
      quote:
        '"We received only 28,000 litres out of the ordered 40,000 litres of AGO. The waybill signed by our st…"',
      highlight: true,
    },
    {
      timestamp: '18 Mar · 10:15',
      title: 'Complaint auto-assigned to Aisha Yusuf (Compliance Lead)',
      highlight: false,
    },
    {
      timestamp: '19 Mar · 11:02',
      title: 'Aisha Yusuf replied',
      quote:
        '"Thank you for raising this, Kano Petroleum. We have received your waybill and are currently cross-re…"',
      highlight: true,
    },
    {
      timestamp: '19 Mar · 11:03',
      title: 'Status updated → In Progress',
      highlight: false,
    },
  ],
  documents: [
    { name: 'waybill_march 18.pdf', kind: 'waybill', size: '342kb', from: 'EastFuel Ltd', date: 'Mar 18' },
    { name: 'stock_receipt.jpg', kind: 'receipt', size: '142kb', from: 'EastFuel Ltd', date: 'Mar 18' },
  ],
  responder: 'MetaEnergy Ltd',
  responseDeadlineNote:
    'You have 1 business day remaining to submit your formal response to complaint #4821.',
};

/** Returns the single mocked complaint regardless of id. TODO(orval): fetch by id. */
export function getComplaintDetail(_id: string): ComplaintDetail | null {
  return COMPLAINT_DETAIL;
}
