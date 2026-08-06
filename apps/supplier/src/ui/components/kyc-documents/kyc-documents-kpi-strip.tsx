import { KycDocumentsKpiCard } from './kyc-documents-kpi-card';
import type { KycKpi } from './kyc-documents-types';

interface KycDocumentsKpiStripProps {
  kpis: KycKpi[];
  placeholder?: boolean;
}

/** The four KPI tiles across the top of the KYC dashboard. */
export function KycDocumentsKpiStrip({ kpis, placeholder }: KycDocumentsKpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpis.map((kpi) => (
        <KycDocumentsKpiCard key={kpi.title} kpi={kpi} placeholder={placeholder} />
      ))}
    </div>
  );
}
