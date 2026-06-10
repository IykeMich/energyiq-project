import { cn } from '@energyiq/shared';
import type { DistributorApplication } from '@/ui/pages/distributor/mocks';
import { DistributorApplicationPill } from './distributor-application-pill';

interface DistributorApplicationCardProps {
  application: DistributorApplication;
  selected: boolean;
  onSelect: () => void;
}

export function DistributorApplicationCard({
  application,
  selected,
  onSelect,
}: DistributorApplicationCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full flex-col gap-3 rounded-[20px] border p-5 text-left transition-colors',
        selected
          ? 'border-brand bg-brand/10'
          : 'border-transparent bg-foreground/5 hover:border-brand hover:bg-brand/10',
      )}
    >
      <p className="text-sm text-muted-foreground">{application.submittedLabel}</p>

      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
          {application.businessName.charAt(0)}
        </span>
        <span className="text-lg font-bold text-foreground">{application.businessName}</span>
      </div>

      <p className="text-sm text-muted-foreground">
        {application.contactName}. {application.state}.
      </p>

      <div className="flex flex-wrap gap-2">
        <DistributorApplicationPill label="Awaiting Review" tone="warning" />
        {application.assuranceStatus === 'paid' ? (
          <DistributorApplicationPill label="Assurance Paid" tone="success" />
        ) : (
          <DistributorApplicationPill label="Assurance Pending" tone="danger" />
        )}
      </div>
    </button>
  );
}
