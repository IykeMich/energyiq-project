import { Avatar, AvatarFallback, AvatarImage } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { ComplaintInfoCard } from './complaint-info-card';
import { ComplaintsStatusBadge } from '@/ui/components/complaints/complaints-status-badge';
import { SEVERITY_COLOR } from '@/ui/components/complaints/complaints-mocks';
import type { ComplaintDetail } from '@/ui/pages/complaint/mocks';

const NGN = new Intl.NumberFormat('en-NG');

interface ComplaintDetailSidebarProps {
  detail: ComplaintDetail;
  onResolve: () => void;
  onReject: () => void;
}

/** Right column of the details view: distributor, summary and order cards plus the actions. */
export function ComplaintDetailSidebar({ detail, onResolve, onReject }: ComplaintDetailSidebarProps) {
  const { distributor, summary, order } = detail;

  return (
    <div className="flex flex-col gap-5">
      <ComplaintInfoCard
        title="Distributor:"
        header={
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8">
                <AvatarImage src={undefined} alt={distributor.name} />
                <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
                  {getInitials(distributor.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#FAFAFA]">{distributor.name}</span>
                <span className="text-xs text-[#FFFFFFCC]">{distributor.code}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FBC02D]/20 px-3 py-1 text-xs font-medium text-[#FBC02D]">
                {distributor.tier}
              </span>
              <span className="rounded-full border border-[#388E3C]/40 bg-[#388E3C]/15 px-3 py-1 text-xs font-medium text-[#388E3C]">
                Trust Scores: {distributor.trustScore}
              </span>
            </div>
          </div>
        }
        rows={[]}
      />

      <ComplaintInfoCard
        title="Complaint Summary"
        rows={[
          { label: 'Issue:', value: summary.issue },
          {
            label: 'Severity:',
            value: <ComplaintsStatusBadge label={summary.severity} color={SEVERITY_COLOR[summary.severity]} />,
          },
          { label: 'Claim:', value: `#${NGN.format(summary.claimNGN)}` },
          { label: 'SLA:', value: summary.sla },
          { label: 'Assigned:', value: summary.assigned },
        ]}
      />

      <ComplaintInfoCard
        title="Order Summary"
        rows={[
          { label: 'Product:', value: order.product },
          { label: 'Ordered:', value: order.ordered },
          { label: 'Delivered:', value: order.delivered },
          { label: 'Shortfall:', value: order.shortfall },
        ]}
      />

      <button
        type="button"
        onClick={onResolve}
        className="tap-effect h-12 rounded-2xl bg-[#FBC02D] text-sm font-semibold text-[#121212]"
      >
        Resolve Complaint
      </button>
      <button
        type="button"
        onClick={onReject}
        className="tap-effect h-12 rounded-2xl border border-[#D30A0A] text-sm font-semibold text-[#D30A0A]"
      >
        Reject Complaint
      </button>
    </div>
  );
}
