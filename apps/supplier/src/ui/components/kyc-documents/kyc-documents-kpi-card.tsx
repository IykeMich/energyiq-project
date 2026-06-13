import { cn } from '@energyiq/shared';
import type { KycKpi } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentsKpiCardProps {
  kpi: KycKpi;
  /** Renders a shimmer placeholder instead of the values (loading/empty states). */
  placeholder?: boolean;
}

/** One KPI tile on the KYC dashboard: title, large value, optional corner badge. */
export function KycDocumentsKpiCard({ kpi, placeholder }: KycDocumentsKpiCardProps) {
  if (placeholder) {
    return (
      <div className="rounded-2xl bg-[#FFFFFF0F] p-6 shadow-sm">
        <div className="h-3.5 w-28 animate-pulse rounded bg-[#6161611A]" />
        <div className="mt-4 h-8 w-20 animate-pulse rounded bg-[#6161611A]" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-[#FFFFFF0F] p-6 shadow-sm">
      {kpi.badge && (
        <span
          className={cn(
            'absolute right-5 top-4 text-[11px] font-medium',
            kpi.badge.emphasis === 'success' ? 'text-[#2E7D32]' : 'text-[#D30A0A]',
          )}
        >
          {kpi.badge.label}
        </span>
      )}
      <p className="text-sm font-medium text-gray-300">{kpi.title}</p>
      <p className="mt-3 text-3xl font-bold text-white">{kpi.value}</p>
    </div>
  );
}
