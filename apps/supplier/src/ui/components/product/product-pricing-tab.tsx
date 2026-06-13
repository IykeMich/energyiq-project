import { cn } from '@energyiq/shared';
import {
  CURRENCY_OPTIONS,
  PRICE_TYPE_OPTIONS,
  TAX_TYPE_OPTIONS,
  computeGrossMargin,
  type NewProductDraft,
  type PricingTierDraft,
} from '@/ui/pages/product/mocks';
import { CheckboxField, Field, SelectField, TextField } from './wizard-fields';
import { ProductTieredPricing } from './product-tiered-pricing';

interface ProductPricingTabProps {
  draft: NewProductDraft;
  onChange: (patch: Partial<NewProductDraft>) => void;
}

export function ProductPricingTab({ draft, onChange }: ProductPricingTabProps) {
  const grossMargin = computeGrossMargin(draft.costPrice, draft.sellingPrice);

  const addTier = () =>
    onChange({
      pricingTiers: [
        ...draft.pricingTiers,
        {
          id: `tier-${draft.pricingTiers.length + 1}-${Math.random().toString(36).slice(2, 6)}`,
          tier: '',
          minQuantity: '',
          maxQuantity: '',
          unitPrice: '',
        },
      ],
    });

  const removeTier = (id: string) =>
    onChange({ pricingTiers: draft.pricingTiers.filter((tier) => tier.id !== id) });

  const updateTier = (id: string, patch: Partial<PricingTierDraft>) =>
    onChange({
      pricingTiers: draft.pricingTiers.map((tier) =>
        tier.id === id ? { ...tier, ...patch } : tier,
      ),
    });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-foreground/80">
          Specify the unit cost and unit selling price; the system automatically computes the margin value.
        </p>
        <p className="shrink-0 text-sm text-foreground">
          Gross Information:{' '}
          <span className={cn('font-semibold', grossMargin < 0 ? 'text-danger' : 'text-brand')}>
            {grossMargin}%
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Price Type:">
          <SelectField
            value={draft.priceType}
            onChange={(value) => onChange({ priceType: value })}
            placeholder="Select price type"
            options={PRICE_TYPE_OPTIONS}
          />
        </Field>
        <Field label="Currency:">
          <SelectField
            value={draft.currency}
            onChange={(value) => onChange({ currency: value })}
            placeholder="Select currency"
            options={CURRENCY_OPTIONS}
          />
        </Field>
        <Field label="Cost Price:" required>
          <TextField
            type="number"
            value={draft.costPrice}
            onChange={(value) => onChange({ costPrice: value })}
            placeholder="0.00"
          />
        </Field>
        <Field label="Selling Price:" required>
          <TextField
            type="number"
            value={draft.sellingPrice}
            onChange={(value) => onChange({ sellingPrice: value })}
            placeholder="0.00"
          />
        </Field>
      </div>

      <ProductTieredPricing
        tiers={draft.pricingTiers}
        onAdd={addTier}
        onRemove={removeTier}
        onChange={updateTier}
      />

      <div className="border-t border-dashed border-border-subtle pt-5 flex flex-col gap-4">
        <CheckboxField
          checked={draft.taxEnabled}
          onChange={(checked) => onChange({ taxEnabled: checked })}
          label="Tax Configuration"
        />
        {draft.taxEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tax Type:">
              <SelectField
                value={draft.taxType}
                onChange={(value) => onChange({ taxType: value })}
                placeholder="Select tax type"
                options={TAX_TYPE_OPTIONS}
              />
            </Field>
            <Field label="Tax Rate (%):">
              <TextField
                type="number"
                value={draft.taxRate}
                onChange={(value) => onChange({ taxRate: value })}
                placeholder="0"
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
