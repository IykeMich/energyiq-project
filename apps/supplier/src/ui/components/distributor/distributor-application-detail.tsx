import { Info } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { DistributorApplication } from '@/ui/pages/distributor/mocks';
import { DistributorApplicationField } from './distributor-application-field';

const NGN = new Intl.NumberFormat('en-NG');

interface DistributorApplicationDetailProps {
  application: DistributorApplication;
  onApprove: () => void;
  onReject: () => void;
}

export function DistributorApplicationDetail({
  application,
  onApprove,
  onReject,
}: DistributorApplicationDetailProps) {
  const assurancePaid = application.assuranceStatus === 'paid';

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-brand-foreground">
            {application.businessName.charAt(0)}
          </span>
          <div>
            <h2 className="text-xl font-bold text-foreground">{application.businessName}</h2>
            <p className="text-sm text-muted-foreground">
              {application.headquarters} ·{application.appliedLabel}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onApprove}
            className="rounded-full bg-success/20 px-5 py-2 text-sm font-semibold text-success"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={onReject}
            className="rounded-full bg-danger/20 px-5 py-2 text-sm font-semibold text-danger"
          >
            Reject
          </button>
        </div>
      </header>

      <section className="rounded-[20px] bg-surface-card p-6">
        <h3 className="mb-4 text-base text-muted-foreground">Business Details:</h3>
        <dl className="flex flex-col gap-4 text-sm">
          <DistributorApplicationField label="Business Name:" value={application.businessName} />
          <DistributorApplicationField label="Contact:" value={application.contactName} />
          <DistributorApplicationField label="Email Address:" value={application.email} />
          <DistributorApplicationField label="Phone Number:" value={application.phone} />
          <DistributorApplicationField label="Location:" value={application.state} />
        </dl>
      </section>

      <section className="rounded-[20px] bg-surface-card p-6">
        <h3 className="mb-4 text-base text-muted-foreground">Documents</h3>
        <dl className="flex flex-col gap-4 text-sm">
          <DistributorApplicationField label="CAC Reg No:" value={application.cacRegNo} />
          <DistributorApplicationField label="Tax ID:" value={application.taxId} />
          <DistributorApplicationField
            label="Documents:"
            value={`${application.documentsSubmitted}/${application.documentsTotal} Submitted`}
            valueClassName="text-success"
          />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-6">
              <dt className="text-muted-foreground">Risk Score</dt>
              <dd className="text-right font-semibold text-foreground">
                {application.riskScore}/100
              </dd>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${application.riskScore}%` }}
              />
            </div>
          </div>
        </dl>
      </section>

      <div
        className={cn(
          'flex items-center justify-between gap-4 rounded-[16px] border px-5 py-4 text-sm',
          assurancePaid ? 'border-success/40 bg-success/10' : 'border-danger/40 bg-danger/10',
        )}
      >
        <span className="text-foreground">Assurance Fee:</span>
        <span className={cn('font-semibold', assurancePaid ? 'text-success' : 'text-danger')}>
          {assurancePaid ? 'Paid' : 'Pending'}— ₦{NGN.format(application.assuranceFeeNGN)}
        </span>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-warning/50 px-5 py-3 text-sm text-warning">
        <Info className="h-4 w-4 shrink-0" />
        All documents must be approved and fee paid before activation.
      </div>
    </div>
  );
}
