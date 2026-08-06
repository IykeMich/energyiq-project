import type { ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PRICING_TIER_OPTIONS, type PricingTierDraft } from '@/ui/pages/product/mocks';
import { SelectField, TextField } from './wizard-fields';

interface ProductTieredPricingProps {
  tiers: PricingTierDraft[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, patch: Partial<PricingTierDraft>) => void;
}

/** Volume-based pricing rows (Tier · Min/Max quantity · Unit price) for the Pricing tab. */
export function ProductTieredPricing({ tiers, onAdd, onRemove, onChange }: ProductTieredPricingProps) {
  return (
    <div className="border-t border-dashed border-border-subtle pt-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Tiered Pricing</p>
        <button
          type="button"
          onClick={onAdd}
          className="tap-effect flex items-center gap-1 text-sm font-semibold text-brand transition-opacity hover:opacity-80"
        >
          <Plus className="w-4 h-4" /> Add Tier
        </button>
      </div>

      {tiers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tiers yet. Use “Add Tier” to define volume-based pricing.
        </p>
      ) : (
        // Single column below `lg` — four fields side by side has no room to shrink
        // (grid items default to min-width:auto), so it stays stacked until there's
        // real width for it, both in the full-page wizard and the narrower edit sheet.
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-3 lg:items-end">
          <span className="hidden text-sm text-foreground lg:block">Tier:</span>
          <span className="hidden text-sm text-foreground lg:block">Min. Quantity:</span>
          <span className="hidden text-sm text-foreground lg:block">Max. Quantity:</span>
          <span className="hidden text-sm text-foreground lg:block">Unit Price:</span>
          <span aria-hidden className="hidden lg:block" />

          {tiers.map((tier) => (
            <Row
              key={tier.id}
              tier={tier}
              onRemove={() => onRemove(tier.id)}
              onChange={(patch) => onChange(tier.id, patch)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Mobile-only label above the field (the header row above is hidden below `lg`), plus a min-w-0 floor so the field can shrink inside its grid track. */
function LabeledField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-xs text-muted-foreground lg:hidden">{label}</span>
      {children}
    </div>
  );
}

interface RowProps {
  tier: PricingTierDraft;
  onRemove: () => void;
  onChange: (patch: Partial<PricingTierDraft>) => void;
}

function Row({ tier, onRemove, onChange }: RowProps) {
  return (
    <>
      <LabeledField label="Tier">
        <SelectField
          value={tier.tier}
          onChange={(value) => onChange({ tier: value })}
          placeholder="Select tier"
          options={PRICING_TIER_OPTIONS}
        />
      </LabeledField>
      <LabeledField label="Min. Quantity">
        <TextField
          type="number"
          value={tier.minQuantity}
          onChange={(value) => onChange({ minQuantity: value })}
          placeholder="0"
          className="w-full"
        />
      </LabeledField>
      <LabeledField label="Max. Quantity">
        <TextField
          type="number"
          value={tier.maxQuantity}
          onChange={(value) => onChange({ maxQuantity: value })}
          placeholder="0"
          className="w-full"
        />
      </LabeledField>
      <LabeledField label="Unit Price">
        <TextField
          type="number"
          value={tier.unitPrice}
          onChange={(value) => onChange({ unitPrice: value })}
          placeholder="0.00"
          className="w-full"
        />
      </LabeledField>
      <div className="flex justify-end lg:block">
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove pricing tier"
          className="tap-effect w-[52px] h-[52px] rounded-full bg-brand/20 text-brand flex items-center justify-center transition-colors hover:bg-brand/30"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
