import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';
import { ComplaintSelectCard } from './complaint-select-card';
import { ComplaintTextField } from './complaint-text-field';
import { ISSUE_TYPE_OPTIONS, type RaiseComplaintDraft } from './complaints-mocks';

interface OrderOption {
  value: string;
  label: string;
}

interface RaiseComplaintIssueTypeStepProps {
  draft: RaiseComplaintDraft;
  orderOptions: OrderOption[];
  onChange: (patch: Partial<RaiseComplaintDraft>) => void;
}

/** Step 1 — pick a complaint type, the related order, and a title. */
export function RaiseComplaintIssueTypeStep({
  draft,
  orderOptions,
  onChange,
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
              onSelect={(value) => onChange({ issueType: value })}
            />
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-[#FFFFFFCC]">Related Order:</span>
        <Select
          value={draft.relatedOrder ?? ''}
          onValueChange={(value) => onChange({ relatedOrder: value || undefined })}
        >
          <SelectTrigger className="w-full rounded-full border-[#FFFFFF33] bg-transparent px-5 py-3.5 text-sm text-[#FAFAFA]">
            <SelectValue placeholder="Select an order" />
          </SelectTrigger>
          <SelectContent>
            {orderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <ComplaintTextField
        label="Complaint Title:"
        value={draft.complaintTitle}
        onChange={(value) => onChange({ complaintTitle: value })}
      />
    </div>
  );
}
