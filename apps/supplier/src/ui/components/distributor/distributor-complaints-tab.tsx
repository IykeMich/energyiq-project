import type { DistributorDetail } from '@/ui/pages/distributor/mocks';
import { DistributorDetailsKycKpis } from './distributor-details-kyc-kpis';

/** Complaints tab — compliance KPIs and an open-complaint SLA alert. */
export function DistributorComplaintsTab({ detail }: { detail: DistributorDetail }) {
  const { kyc, complaints } = detail;
  return (
    <div className="flex flex-col gap-6">
      <DistributorDetailsKycKpis kyc={kyc} />
      <div className="flex items-center justify-between gap-4 rounded-xl border border-danger/60 bg-danger/10 px-4 py-3">
        <p className="text-sm text-danger">
          {complaints.openCount} open complaint — {complaints.message}
        </p>
        <button
          type="button"
          className="tap-effect shrink-0 text-sm font-semibold text-[#FAFAFA] underline"
        >
          See Complaint
        </button>
      </div>
    </div>
  );
}
