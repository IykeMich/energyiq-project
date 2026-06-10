import { ComplaintSummaryItem } from './complaint-summary-item';
import {
  ISSUE_TYPE_OPTIONS,
  RELATED_ORDER_OPTIONS,
  type RaiseComplaintDraft,
} from './complaints-mocks';

interface RaiseComplaintReviewStepProps {
  draft: RaiseComplaintDraft;
}

/** Step 4 — read-only summary of the draft plus the submission notice. */
export function RaiseComplaintReviewStep({ draft }: RaiseComplaintReviewStepProps) {
  const issueTypeLabel =
    ISSUE_TYPE_OPTIONS.find((option) => option.value === draft.issueType)?.label ?? '';
  const relatedOrderLabel =
    RELATED_ORDER_OPTIONS.find((option) => option.value === draft.relatedOrder)?.label ?? '';
  const fileNames = draft.files.map((file) => file.name).join(', ');

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 rounded-2xl bg-[#FFFFFF1A] p-6">
        <h3 className="text-base font-bold text-[#FAFAFA]">Complaint Summary</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <ComplaintSummaryItem label="Type:" value={issueTypeLabel} />
          <ComplaintSummaryItem label="Order:" value={relatedOrderLabel} />
          <ComplaintSummaryItem label="Quantity affected:" value={draft.quantityAffected} />
          <ComplaintSummaryItem label="Estimate impact:" value={draft.estimate} />
          <ComplaintSummaryItem label="Title:" value={draft.complaintTitle} />
          <div className="col-span-2">
            <ComplaintSummaryItem
              label="Evidence:"
              value={`${draft.files.length} files attached - ${fileNames}`}
            />
          </div>
        </div>
      </div>

      <p className="rounded-2xl bg-[#FB8C1C1A] px-5 py-4 text-sm leading-relaxed text-[#FB8C1C]">
        Once submitted, your complaint will be assigned a reference ID. Apex Petroleum Ltd has a
        resolution time of 72 hours. You will receive SMS and email updates.
      </p>
    </div>
  );
}
