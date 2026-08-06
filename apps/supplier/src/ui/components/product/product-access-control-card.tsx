import { useState } from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from '@energyiq/shared';
import { useDistributorsQuery } from '@/hooks/use-distributor';
import { FormActionButton, ToggleChip, ToggleSwitchCard } from './wizard-fields';
import { ProductDistributorWhitelistRow } from './product-distributor-whitelist-row';

export interface ProductAccessControlDraft {
  visibleTiers: string[];
  geographicAvailability: string[];
  restrictToSpecificDistributors: boolean;
  whitelistedDistributorIds: string[];
}

interface ProductAccessControlCardProps {
  draft: ProductAccessControlDraft;
  onChange: (patch: Partial<ProductAccessControlDraft>) => void;
  onCancel: () => void;
  onNext: () => void;
}

const TIER_OPTIONS = ['Bronze', 'Silver', 'Gold'];

const NIGERIA_STATE_OPTIONS = [
  'Lagos',
  'Ogun',
  'Kano',
  'Rivers',
  'Kaduna',
  'Delta',
  'Enugu',
  'Edo',
  'Abuja',
  'Anambra',
  'Oyo',
  'Cross-Rivers',
];

/** Rectangular checkbox-style chip used only for the geographic-availability grid (visually distinct from the pill `ToggleChip`). */
function GeoChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium transition-colors',
        selected ? 'border-brand bg-brand/20 text-brand' : 'border-foreground/60 text-foreground hover:border-brand/50',
      )}
    >
      <span
        className={cn(
          'flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] border',
          selected ? 'border-brand bg-brand' : 'border-foreground/60',
        )}
      >
        {selected && <Check className="h-2.5 w-2.5 text-[#121212]" strokeWidth={4} />}
      </span>
      {label}
    </button>
  );
}

/** Right-panel "Access Control" card for step 6 of the "Add New Product" wizard. */
export function ProductAccessControlCard({ draft, onChange, onCancel, onNext }: ProductAccessControlCardProps) {
  const [distributorSearchQuery, setDistributorSearchQuery] = useState('');
  const distributorsQuery = useDistributorsQuery({ search: distributorSearchQuery || undefined });
  const distributors = distributorsQuery.data ?? [];

  const toggleTier = (tier: string) =>
    onChange({
      visibleTiers: draft.visibleTiers.includes(tier)
        ? draft.visibleTiers.filter((entry) => entry !== tier)
        : [...draft.visibleTiers, tier],
    });

  const toggleRegion = (region: string) =>
    onChange({
      geographicAvailability: draft.geographicAvailability.includes(region)
        ? draft.geographicAvailability.filter((entry) => entry !== region)
        : [...draft.geographicAvailability, region],
    });

  const toggleWhitelistedDistributor = (id: string) =>
    onChange({
      whitelistedDistributorIds: draft.whitelistedDistributorIds.includes(id)
        ? draft.whitelistedDistributorIds.filter((entry) => entry !== id)
        : [...draft.whitelistedDistributorIds, id],
    });

  const isStepValid = Boolean(
    draft.visibleTiers.length > 0 &&
      draft.geographicAvailability.length > 0 &&
      (!draft.restrictToSpecificDistributors || draft.whitelistedDistributorIds.length > 0),
  );

  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 flex flex-1 min-w-0 flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-lg font-medium text-foreground">Access Rules</h2>
        <p className="text-base text-foreground/80">
          Decide which distributor tiers, regions, or specific accounts can see and order this product.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#616161B2] pt-7">
        <label className="text-sm text-foreground">
          Visible Tiers <span className="text-danger">*</span>:
        </label>
        <div className="flex flex-wrap gap-2.5">
          {TIER_OPTIONS.map((tier) => (
            <ToggleChip key={tier} label={tier} selected={draft.visibleTiers.includes(tier)} onClick={() => toggleTier(tier)} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-foreground">
          Geographic availability <span className="text-danger">*</span>:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {NIGERIA_STATE_OPTIONS.map((region) => (
            <GeoChip
              key={region}
              label={region}
              selected={draft.geographicAvailability.includes(region)}
              onClick={() => toggleRegion(region)}
            />
          ))}
        </div>
      </div>

      <ToggleSwitchCard
        title="Restrict to specific distributors"
        subtitle="Only whitelisted accounts can order, even within allowed tiers/regions."
        checked={draft.restrictToSpecificDistributors}
        onChange={(next) => onChange({ restrictToSpecificDistributors: next })}
      />

      {draft.restrictToSpecificDistributors && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-full border border-foreground/40 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={distributorSearchQuery}
              onChange={(e) => setDistributorSearchQuery(e.target.value)}
              placeholder="Search distributors to add"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            {distributors.map((distributor) => (
              <ProductDistributorWhitelistRow
                key={distributor.id}
                distributor={{ id: distributor.id ?? '', name: distributor.name ?? 'Unnamed distributor', tier: distributor.tier }}
                checked={draft.whitelistedDistributorIds.includes(distributor.id ?? '')}
                onToggle={toggleWhitelistedDistributor}
              />
            ))}
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
