import type { DistributorDetail } from '@/ui/pages/distributor/mocks';
import { DistributorDetailsKycKpis } from './distributor-details-kyc-kpis';
import { DistributorDetailsRow } from './distributor-details-row';
import { DistributorTrustScoreBar } from './distributor-trust-score-bar';

/** Overview tab — compliance KPIs, contact details and performance metrics. */
export function DistributorOverviewTab({ detail }: { detail: DistributorDetail }) {
  const { kyc, contact, performance } = detail;
  return (
    <div className="flex flex-col gap-6">
      <DistributorDetailsKycKpis kyc={kyc} />

      <section className="flex flex-col gap-4">
        <p className="text-sm text-[#FFFFFFCC]">Contact Details:</p>
        <div className="flex flex-col gap-4 px-3">
          <DistributorDetailsRow label="Email Address:" value={contact.email} />
          <DistributorDetailsRow label="Contact:" value={contact.contact} />
          <DistributorDetailsRow label="Phone Number:" value={contact.phone} />
          <DistributorDetailsRow label="Location:" value={contact.location} />
          <DistributorDetailsRow label="Joined:" value={contact.joined} />
        </div>
      </section>

      <hr className="border-[#FFFFFF1A]" />

      <section className="flex flex-col gap-4">
        <p className="text-sm text-[#FFFFFFCC]">Performance:</p>
        <div className="flex flex-col gap-4 px-3">
          <DistributorTrustScoreBar score={performance.trustScore} />
          <DistributorDetailsRow label="Payment Discipline:" value={performance.paymentDiscipline} />
          <DistributorDetailsRow label="Active Months:" value={performance.activeMonths} />
          <DistributorDetailsRow label="Complaints:" value={String(performance.complaints)} />
        </div>
      </section>
    </div>
  );
}
