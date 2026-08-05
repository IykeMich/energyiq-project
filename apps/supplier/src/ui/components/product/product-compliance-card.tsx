import { cn } from '@energyiq/shared';
import { DateField, FormActionButton, TextAreaField, TextField, ToggleChip } from './wizard-fields';

export interface ProductComplianceDraft {
  certifications: string[];
  expiryDate: string;
  referenceCode: string;
  safetyInformation: string;
}

interface ProductComplianceCardProps {
  draft: ProductComplianceDraft;
  onChange: (patch: Partial<ProductComplianceDraft>) => void;
  onCancel: () => void;
  onNext: () => void;
}

const FIELD_CLASSNAME = 'h-[47px] rounded-[33px]';

const CERTIFICATION_OPTIONS = [
  'NUPRC License',
  'DPR Permit',
  'SON Certificate',
  'Fire Safety Certificate',
  'Material Data Safety Sheet',
];

/** Right-panel "Compliance" card for step 4 of the "Add New Product" wizard. */
export function ProductComplianceCard({ draft, onChange, onCancel, onNext }: ProductComplianceCardProps) {
  const toggleCertification = (certification: string) =>
    onChange({
      certifications: draft.certifications.includes(certification)
        ? draft.certifications.filter((entry) => entry !== certification)
        : [...draft.certifications, certification],
    });

  const isStepValid = Boolean(
    draft.certifications.length > 0 && draft.expiryDate && draft.referenceCode && draft.safetyInformation,
  );

  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 flex flex-1 min-w-0 flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-medium text-foreground">Compliance</h2>
        <p className="text-base text-foreground/80">
          Attach the certifications and regulatory information this product requires under NUPRC and DPR rules.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#616161B2] pt-7">
        <label className="text-sm text-foreground">
          Required Certifications <span className="text-danger">*</span>:
        </label>
        <div className="flex flex-wrap gap-2.5">
          {CERTIFICATION_OPTIONS.map((certification) => (
            <ToggleChip
              key={certification}
              label={certification}
              selected={draft.certifications.includes(certification)}
              onClick={() => toggleCertification(certification)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateField
          label="Certification expiry date:"
          required
          value={draft.expiryDate}
          onChange={(value) => onChange({ expiryDate: value })}
          className={FIELD_CLASSNAME}
        />
        <TextField
          label="Regulatory reference code:"
          required
          value={draft.referenceCode}
          onChange={(value) => onChange({ referenceCode: value })}
          placeholder="e.g NUPRC/DWN/2026/0417"
          className={FIELD_CLASSNAME}
        />
      </div>

      <TextAreaField
        label="Safety Information:"
        required
        value={draft.safetyInformation}
        onChange={(value) => onChange({ safetyInformation: value })}
        placeholder="Handling precautions, safety rules..."
        rows={3}
        className="rounded-[24px] min-h-[122px]"
      />

      <div className="flex justify-end gap-4 border-t border-[#616161B2] pt-7">
        <FormActionButton variant="cancel" onClick={onCancel}>
          Cancel
        </FormActionButton>
        <button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className={cn(
            'tap-effect h-10.5 rounded-[28px] px-12 font-semibold text-[#121212] hover:opacity-90 disabled:hover:opacity-100 disabled:cursor-not-allowed',
            isStepValid ? 'bg-brand' : 'bg-[#FBC02D33]',
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
