import { Pencil } from 'lucide-react';
import { ComplaintSelectCard } from './complaint-select-card';
import { ComplaintTextField } from './complaint-text-field';
import { PREFERRED_RESOLUTION_OPTIONS, type RaiseComplaintDraft } from './complaints-mocks';

interface RaiseComplaintDetailsStepProps {
  draft: RaiseComplaintDraft;
  onChange: (patch: Partial<RaiseComplaintDraft>) => void;
}

/** Step 2 — description, quantities, amounts and the preferred resolution. */
export function RaiseComplaintDetailsStep({ draft, onChange }: RaiseComplaintDetailsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm text-[#FFFFFFCC]">Description:</span>
        <div className="flex flex-col gap-2 rounded-2xl border border-[#FFFFFF33] px-5 py-4">
          <textarea
            value={draft.description}
            onChange={(event) => onChange({ description: event.target.value })}
            rows={4}
            className="resize-none bg-transparent text-sm leading-relaxed text-[#FAFAFA] placeholder:text-[#FFFFFF80] focus:outline-none"
          />
          <div className="flex items-center gap-1.5 self-end text-xs text-[#FFFFFFCC]">
            <span>{draft.description.length}</span>
            <Pencil className="h-3 w-3" aria-hidden="true" />
          </div>
        </div>
      </label>

      <ComplaintTextField
        label="Quantity Affected:"
        value={draft.quantityAffected}
        onChange={(value) => onChange({ quantityAffected: value })}
      />
      <ComplaintTextField
        label="Estimate:"
        value={draft.estimate}
        onChange={(value) => onChange({ estimate: value })}
      />
      <ComplaintTextField
        label="Expected Resolution:"
        value={draft.expectedResolution}
        onChange={(value) => onChange({ expectedResolution: value })}
      />
      <ComplaintTextField
        label="Claim Amount:"
        value={draft.claimAmount}
        onChange={(value) => onChange({ claimAmount: value })}
      />

      <div className="flex flex-col gap-4">
        <span className="text-sm text-[#FFFFFFCC]">Preferred Resolution:</span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PREFERRED_RESOLUTION_OPTIONS.map((option) => (
            <ComplaintSelectCard
              key={option.value}
              option={option}
              selected={draft.preferredResolution === option.value}
              onSelect={(value) => onChange({ preferredResolution: value })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
