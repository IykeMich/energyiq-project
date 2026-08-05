import { cn } from '@energyiq/shared';
import { NumericTextField } from '@energyiq/ui';
import { CREDIT_TERM_OPTIONS, RETURN_REASON_OPTIONS } from '@/ui/pages/product/mocks';
import { Field, FormActionButton, SelectField, TextAreaField, TextField, ToggleChip, ToggleSwitchCard } from './wizard-fields';

export interface ProductTradingRulesDraft {
  creditTerms: string;
  moq: string;
  maxOrderQuantity: string;
  returnsAllowed: boolean;
  returnWindowDays: string;
  restockingFeePercent: string;
  eligibleReturnReasons: string[];
  returnInstructions: string;
}

interface ProductTradingRulesCardProps {
  draft: ProductTradingRulesDraft;
  onChange: (patch: Partial<ProductTradingRulesDraft>) => void;
  onCancel: () => void;
  onNext: () => void;
}

const FIELD_CLASSNAME = 'h-[47px] rounded-[33px]';

/** Right-panel "Trading Rules" card for step 5 of the "Add New Product" wizard. */
export function ProductTradingRulesCard({ draft, onChange, onCancel, onNext }: ProductTradingRulesCardProps) {
  const toggleReturnReason = (reason: string) =>
    onChange({
      eligibleReturnReasons: draft.eligibleReturnReasons.includes(reason)
        ? draft.eligibleReturnReasons.filter((entry) => entry !== reason)
        : [...draft.eligibleReturnReasons, reason],
    });

  const isStepValid = Boolean(
    draft.creditTerms &&
      draft.moq &&
      draft.maxOrderQuantity &&
      draft.returnWindowDays &&
      draft.eligibleReturnReasons.length > 0,
  );

  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 flex flex-1 min-w-0 flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-medium text-foreground">Trading Rules</h2>
        <p className="text-base text-foreground/80">
          Define order limits and terms distributors must follow when trading this product.
        </p>
      </div>

      <div className="border-t border-[#616161B2] pt-7">
        <SelectField
          label="Credit Terms:"
          required
          value={draft.creditTerms}
          onChange={(value) => onChange({ creditTerms: value })}
          placeholder="Select credit terms"
          options={CREDIT_TERM_OPTIONS}
          className={FIELD_CLASSNAME}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Minimum Order Quantity (MOQ):" required>
          <NumericTextField
            value={draft.moq}
            onChange={(value) => onChange({ moq: value })}
            placeholder="0"
            suffix="L"
            className={FIELD_CLASSNAME}
          />
        </Field>
        <Field label="Maximum Order Quantity:" required>
          <NumericTextField
            value={draft.maxOrderQuantity}
            onChange={(value) => onChange({ maxOrderQuantity: value })}
            placeholder="0"
            suffix="L"
            className={FIELD_CLASSNAME}
          />
        </Field>
      </div>

      <ToggleSwitchCard
        title="Returns allowed"
        subtitle="Configurable per product"
        checked={draft.returnsAllowed}
        onChange={(next) => onChange({ returnsAllowed: next })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Return window (days):"
          required
          type="number"
          value={draft.returnWindowDays}
          onChange={(value) => onChange({ returnWindowDays: value })}
          placeholder="0"
          className={FIELD_CLASSNAME}
        />
        <TextField
          label="Restocking fee (%) (optional):"
          type="number"
          value={draft.restockingFeePercent}
          onChange={(value) => onChange({ restockingFeePercent: value })}
          placeholder="0"
          className={FIELD_CLASSNAME}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-foreground">
          Eligible return reasons <span className="text-danger">*</span>:
        </label>
        <div className="flex flex-wrap gap-2.5">
          {RETURN_REASON_OPTIONS.map((reason) => (
            <ToggleChip
              key={reason}
              label={reason}
              selected={draft.eligibleReturnReasons.includes(reason)}
              onClick={() => toggleReturnReason(reason)}
            />
          ))}
        </div>
      </div>

      <TextAreaField
        label="Return instructions (optional):"
        value={draft.returnInstructions}
        onChange={(value) => onChange({ returnInstructions: value })}
        placeholder="e.g Return unopened bags in original packaging within the window above"
        rows={2}
        className="rounded-[24px]"
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
