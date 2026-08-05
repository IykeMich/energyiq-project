import { cn } from '@energyiq/shared';
import { CURRENCY_OPTIONS } from '@/ui/pages/product/mocks';
import { DateField, FormActionButton, PrefixedTextField, SelectField, ToggleSwitchCard } from './wizard-fields';
import { ProductPricingTierRow } from './product-pricing-tier-row';

export interface ProductPricingDraft {
  basePrice: string;
  currency: string;
  tierDiscounts: { bronze: string; silver: string; gold: string };
  promoEnabled: boolean;
  promoPrice: string;
  validFrom: string;
  validTo: string;
}

interface ProductPricingCardProps {
  draft: ProductPricingDraft;
  onChange: (patch: Partial<ProductPricingDraft>) => void;
  onCancel: () => void;
  onNext: () => void;
}

const FIELD_CLASSNAME = 'h-[47px] rounded-[33px]';

const TIERS = [
  { key: 'bronze', name: 'Bronze', dotColor: '#CD7F32' },
  { key: 'silver', name: 'Silver', dotColor: '#C0C0C0' },
  { key: 'gold', name: 'Gold', dotColor: '#FFD700' },
] as const;

/** Right-panel "Pricing" card for step 2 of the "Add New Product" wizard. */
export function ProductPricingCard({ draft, onChange, onCancel, onNext }: ProductPricingCardProps) {
  const isStepValid = Boolean(
    draft.basePrice &&
      draft.currency &&
      (!draft.promoEnabled || (draft.promoPrice && draft.validFrom && draft.validTo)),
  );

  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 flex flex-1 min-w-0 flex-col gap-7">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-lg font-medium text-foreground">Pricing</h2>
        <p className="text-base text-foreground/80">Base Price, Tier Discounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PrefixedTextField
          label="Base Price:"
          required
          prefix="₦"
          value={draft.basePrice}
          onChange={(value) => onChange({ basePrice: value })}
          placeholder="0.00"
          className={FIELD_CLASSNAME}
        />
        <SelectField
          label="Currency:"
          required
          value={draft.currency}
          onChange={(value) => onChange({ currency: value })}
          placeholder="Select currency"
          options={CURRENCY_OPTIONS}
          className={FIELD_CLASSNAME}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-[#616161B2] pt-7">
        <p className="text-base text-foreground">Tier Discounts:</p>
        <div className="rounded-[10px] bg-[#61616175] px-4 py-2 flex items-center justify-between text-sm text-foreground/80">
          <span>Tier</span>
          <span>Discounts</span>
          <span>Distributor Price</span>
        </div>
        <div className="flex flex-col">
          {TIERS.map((tier) => (
            <ProductPricingTierRow
              key={tier.key}
              dotColor={tier.dotColor}
              tierName={tier.name}
              basePrice={draft.basePrice}
              discountValue={draft.tierDiscounts[tier.key]}
              onDiscountChange={(value) =>
                onChange({ tierDiscounts: { ...draft.tierDiscounts, [tier.key]: value } })
              }
            />
          ))}
        </div>
      </div>

      <ToggleSwitchCard
        title="Promotional Pricing"
        subtitle="Run a limited-time price for this product"
        checked={draft.promoEnabled}
        onChange={(next) => onChange({ promoEnabled: next })}
      />

      {draft.promoEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PrefixedTextField
            label="Promo Price:"
            required
            prefix="₦"
            value={draft.promoPrice}
            onChange={(value) => onChange({ promoPrice: value })}
            placeholder="0.00"
            className={FIELD_CLASSNAME}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground">
              Valid from-to <span className="text-danger">*</span>:
            </label>
            <div className="flex items-center gap-2">
              <DateField
                value={draft.validFrom}
                onChange={(value) => onChange({ validFrom: value })}
                className={cn(FIELD_CLASSNAME, 'flex-1')}
              />
              <DateField
                value={draft.validTo}
                onChange={(value) => onChange({ validTo: value })}
                className={cn(FIELD_CLASSNAME, 'flex-1')}
              />
            </div>
          </div>
        </div>
      )}

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
