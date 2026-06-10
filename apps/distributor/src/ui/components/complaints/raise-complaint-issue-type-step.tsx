import { ComplaintSelectCard } from './complaint-select-card';
import { ComplaintTextField } from './complaint-text-field';
import {
  ISSUE_TYPE_OPTIONS,
  RELATED_ORDER_OPTIONS,
  type RaiseComplaintDraft,
} from './complaints-mocks';

interface RaiseComplaintIssueTypeStepProps {
  draft: RaiseComplaintDraft;
  onChange: (patch: Partial<RaiseComplaintDraft>) => void;
}

/** Step 1 — pick a complaint type, the related order, and a title. */
export function RaiseComplaintIssueTypeStep({ draft, onChange }: RaiseComplaintIssueTypeStepProps) {
  const relatedOrderLabel =
    RELATED_ORDER_OPTIONS.find((option) => option.value === draft.relatedOrder)?.label ?? '';

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
              onSelect={(value) => onChange({ issueType: value })}
            />
          ))}
        </div>
      </div>

      {/* TODO(orval): replace with a Select bound to the distributor's orders query. */}
      <ComplaintTextField label="Related Order:" value={relatedOrderLabel} readOnly />
      <ComplaintTextField
        label="Complaint Title:"
        value={draft.complaintTitle}
        onChange={(value) => onChange({ complaintTitle: value })}
      />
    </div>
  );
}
