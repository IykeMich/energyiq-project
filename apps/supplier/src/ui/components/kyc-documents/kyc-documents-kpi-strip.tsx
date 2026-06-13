import { KycDocumentsKpiCard } from './kyc-documents-kpi-card';
import { KYC_KPIS } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/** The four KPI tiles across the top of the KYC dashboard. */
export function KycDocumentsKpiStrip({ placeholder }: { placeholder?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KYC_KPIS.map((kpi) => (
        <KycDocumentsKpiCard key={kpi.title} kpi={kpi} placeholder={placeholder} />
      ))}
    </div>
  );
}
