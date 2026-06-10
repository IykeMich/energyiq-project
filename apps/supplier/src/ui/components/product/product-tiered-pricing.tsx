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
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-x-4 gap-y-3 items-end">
          <span className="text-sm text-foreground">Tier:</span>
          <span className="text-sm text-foreground">Min. Quantity:</span>
          <span className="text-sm text-foreground">Max. Quantity:</span>
          <span className="text-sm text-foreground">Unit Price:</span>
          <span aria-hidden />

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

interface RowProps {
  tier: PricingTierDraft;
  onRemove: () => void;
  onChange: (patch: Partial<PricingTierDraft>) => void;
}

function Row({ tier, onRemove, onChange }: RowProps) {
  return (
    <>
      <SelectField
        value={tier.tier}
        onChange={(value) => onChange({ tier: value })}
        placeholder="Select tier"
        options={PRICING_TIER_OPTIONS}
      />
      <TextField
        type="number"
        value={tier.minQuantity}
        onChange={(value) => onChange({ minQuantity: value })}
        placeholder="0"
      />
      <TextField
        type="number"
        value={tier.maxQuantity}
        onChange={(value) => onChange({ maxQuantity: value })}
        placeholder="0"
      />
      <TextField
        type="number"
        value={tier.unitPrice}
        onChange={(value) => onChange({ unitPrice: value })}
        placeholder="0.00"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove pricing tier"
        className="tap-effect w-[52px] h-[52px] rounded-full bg-brand/20 text-brand flex items-center justify-center transition-colors hover:bg-brand/30"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}
