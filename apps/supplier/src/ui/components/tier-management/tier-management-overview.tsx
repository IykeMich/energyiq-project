import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@energyiq/ui';
import type { tier } from '@energyiq/domain';
import { useTierListQuery, useUpdateTierConfigMutation } from '@/hooks/use-tier-management';
import { TIER_MANAGEMENT_MOCK, type TierConfig } from './tier-management-mocks';

/** The design shows "-" for a threshold that hasn't been configured yet, rather than "0". */
function formatNumberInput(value: number): string {
  return value === 0 ? '' : value.toString();
}

function parseNumberInput(value: string): number {
  const parsed = Number(value.replace(/,/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function splitBenefits(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function toBackendTier(source: TierConfig): tier.TierConfig {
  return {
    tier: source.id,
    min_months: source.thresholds.minMonths,
    min_payment_discipline: source.thresholds.paymentDiscipline,
    min_volume: source.thresholds.minVolume,
    benefits: splitBenefits(source.benefits),
    active_distributors: source.activeCount,
  };
}

function toUiTier(source: tier.TierConfig, fallback?: TierConfig): TierConfig {
  const name = source.tier ? `${source.tier.charAt(0).toUpperCase()}${source.tier.slice(1)} Tier` : fallback?.name ?? 'Tier';
  const tierColor = fallback?.color ?? '#FBC02D';
  const border = fallback?.borderColor ?? tierColor;
  const badgeTextColor = fallback?.badgeTextColor ?? tierColor;

  return {
    id: source.tier,
    name,
    activeCount: source.active_distributors ?? fallback?.activeCount ?? 0,
    color: tierColor,
    borderColor: border,
    badgeTextColor,
    thresholds: {
      minMonths: source.min_months ?? 0,
      paymentDiscipline: source.min_payment_discipline ?? 0,
      minVolume: source.min_volume ?? 0,
    },
    benefits: (source.benefits ?? []).join(', '),
  };
}

interface TierCardProps {
  tier: TierConfig;
  onChange: (updated: TierConfig) => void;
}

function TierCard({ tier, onChange }: TierCardProps) {
  const updateThreshold = (key: keyof TierConfig['thresholds'], value: string) => {
    onChange({
      ...tier,
      thresholds: {
        ...tier.thresholds,
        [key]: parseNumberInput(value),
      },
    });
  };

  return (
    <div
      className="flex flex-col gap-5 rounded-[28px] p-6"
      style={{ border: `1px solid ${tier.borderColor}`, backgroundColor: `${tier.color}1A` }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold" style={{ color: tier.color }}>
          {tier.name}
        </h3>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-normal"
          style={{ color: tier.badgeTextColor, backgroundColor: `${tier.color}33` }}
        >
          {tier.activeCount} Active
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs text-[#FAFAFA]">THRESHOLDS</p>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[#FAFAFA]">Min. Months:</span>
          <div className="rounded-full bg-[#6161611A] px-4 py-2.5">
            <input
              type="number"
              min={0}
              placeholder="-"
              value={formatNumberInput(tier.thresholds.minMonths)}
              onChange={(event) => updateThreshold('minMonths', event.target.value)}
              className="w-full bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA] focus:outline-none"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[#FAFAFA]">Min. Volume (#):</span>
          <div className="rounded-full bg-[#6161611A] px-4 py-2.5">
            <input
              type="number"
              min={0}
              placeholder="-"
              value={formatNumberInput(tier.thresholds.minVolume)}
              onChange={(event) => updateThreshold('minVolume', event.target.value)}
              className="w-full bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA] focus:outline-none"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-[#FAFAFA]">Payment Discipline (%):</span>
          <div className="rounded-full bg-[#6161611A] px-4 py-2.5">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="-"
              value={formatNumberInput(tier.thresholds.paymentDiscipline)}
              onChange={(event) => updateThreshold('paymentDiscipline', event.target.value)}
              className="w-full bg-transparent text-sm text-[#FAFAFA] placeholder:text-[#FAFAFA] focus:outline-none"
            />
          </div>
        </label>

        <div className="flex flex-col gap-1 rounded-[9px] bg-[#6161611A] p-3">
          <span className="text-xs font-semibold text-[#FFFFFF]">Benefits:</span>
          <input
            type="text"
            placeholder="-"
            value={tier.benefits}
            onChange={(event) => onChange({ ...tier, benefits: event.target.value })}
            className="w-full bg-transparent text-[10px] text-[#FFFFFF] placeholder:text-[#FFFFFF] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export function TierManagementOverview() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [tiers, setTiers] = useState<TierConfig[]>(TIER_MANAGEMENT_MOCK);
  const tierListQuery = useTierListQuery();
  const updateMutation = useUpdateTierConfigMutation();
  const isSaving = updateMutation.isPending;

  const fallbackById = useMemo(
    () => Object.fromEntries(TIER_MANAGEMENT_MOCK.map((tier) => [tier.id, tier])),
    [],
  );

  // Seed the local edit buffer once real config data arrives; TIER_MANAGEMENT_MOCK
  // supplies the cosmetic fields (name/color/order) the API doesn't return.
  useEffect(() => {
    if (!tierListQuery.data) return;
    const uiById = Object.fromEntries(
      tierListQuery.data.map((backendTier) => [backendTier.tier, toUiTier(backendTier, fallbackById[backendTier.tier])]),
    );
    setTiers((previous) => previous.map((tier) => uiById[tier.id] ?? tier));
  }, [tierListQuery.data, fallbackById]);

  const handleTierChange = (updated: TierConfig) => {
    setTiers((previous) => previous.map((tier) => (tier.id === updated.id ? updated : tier)));
  };

  const handleSave = () => {
    const payload: tier.TierUpdateRequest = {
      tiers: tiers.map(toBackendTier),
    };

    updateMutation.mutate(payload, {
      onSuccess: (result) => {
        const updatedTiers = result.tiers.map((backendTier) =>
          toUiTier(backendTier, fallbackById[backendTier.tier]),
        );
        // Preserve the order of the mock tiers (Bronze, Silver, Gold).
        const byId = Object.fromEntries(updatedTiers.map((tier) => [tier.id, tier]));
        setTiers((previous) => previous.map((tier) => byId[tier.id] ?? tier));
        toast.success('Changes saved', {
          description: 'Tier configuration has been updated.',
        });
      },
      onError: (error) => {
        toast.error('Save failed', {
          description: (error as Error).message,
        });
      },
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`/${slug}/dashboard`)}
            aria-label="Back to dashboard"
            className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02DB2] text-[#121212] hover:bg-[#FBC02D]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-[#FAFAFA]">Tier Management</h1>
            <p className="text-base text-[#FAFAFA]">Configure thresholds and benefits per tier.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="tap-effect rounded-full bg-[#616161B2] px-6 py-3 text-sm font-semibold text-[#121212] hover:bg-[#616161] disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : 'Save & Add Another'}
        </button>
      </header>

      {tierListQuery.isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Couldn't load tier configuration. Please try again.
        </div>
      )}

      <div className="flex flex-col gap-5 rounded-[48px] border border-[#616161B2] py-12 px-12 p-6 lg:ml-12">
        <h2 className="text-base font-semibold text-[#FAFAFA]">Tier Distribution</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} onChange={handleTierChange} />
          ))}
        </div>
      </div>
    </section>
  );
}
