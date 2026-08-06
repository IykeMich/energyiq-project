import type { RaiseRequestComplaintCategory as HttpRaiseRequestComplaintCategory } from '@energyiq/api/generated/schemas';
import { ComplaintSelectCard } from './complaint-select-card';
import { ComplaintOrderSelect } from './complaint-order-select';
import { ComplaintTextField } from './complaint-text-field';
import { ISSUE_TYPE_OPTIONS, type ComplaintOption, type RaiseComplaintDraft } from './complaints-mocks';

interface RaiseComplaintIssueTypeStepProps {
  draft: RaiseComplaintDraft;
  onChange: (patch: Partial<RaiseComplaintDraft>) => void;
  orderOptions: ComplaintOption[];
  isLoadingOrders?: boolean;
}

/** Step 1 — pick a complaint type, the related order, and a title. */
export function RaiseComplaintIssueTypeStep({
  draft,
  onChange,
  orderOptions,
  isLoadingOrders,
}: RaiseComplaintIssueTypeStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-[#FAFAFA]">Complaint Type</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ISSUE_TYPE_OPTIONS.map((option) => (
            <ComplaintSelectCard
              key={option.value}
              option={option}
              selected={draft.issueType === option.value}
              onSelect={(value) => onChange({ issueType: value as HttpRaiseRequestComplaintCategory })}
            />
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-[#FFFFFFCC]">Related Order:</span>
        <ComplaintOrderSelect
          options={orderOptions}
          value={draft.relatedOrder}
          onChange={(value) => onChange({ relatedOrder: value })}
          isLoading={isLoadingOrders}
        />
      </label>
      <ComplaintTextField
        label="Complaint Title:"
        value={draft.complaintTitle}
        onChange={(value) => onChange({ complaintTitle: value })}
      />
    </div>
  );
}
