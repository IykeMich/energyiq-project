import type { DistributorKyc } from '@/ui/pages/distributor/mocks';
import { DistributorDetailsStatBox } from './distributor-details-stat-box';

/** Compliance KPI strip shown above the Overview/Orders/Complaints/Tier History tabs. */
export function DistributorDetailsKycKpis({ kyc }: { kyc: DistributorKyc }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      <DistributorDetailsStatBox label="KYC Score:" value={kyc.kycScore} valueClassName="text-success" />
      <DistributorDetailsStatBox label="Business Risk:" value={kyc.businessRisk} valueClassName="text-success" />
      <DistributorDetailsStatBox label="Document Upload:" value={kyc.documentUpload} valueClassName="text-success" />
    </div>
  );
}
