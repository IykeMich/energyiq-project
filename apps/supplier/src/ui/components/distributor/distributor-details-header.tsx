import { ArrowLeft } from 'lucide-react';
import { SheetTitle } from '@energyiq/ui';
import type { Distributor, DistributorDetail } from '@/ui/pages/distributor/mocks';
import { DistributorTierBadge } from './distributor-tier-badge';
import { DistributorStatusBadge } from './distributor-status-badge';

interface DistributorDetailsHeaderProps {
  distributor: Distributor;
  detail: DistributorDetail;
  isActive: boolean;
  onClose: () => void;
  onSuspend: () => void;
}

/** Fixed sheet header: back button, name, tier, status pill, location and (active) suspend. */
export function DistributorDetailsHeader({
  distributor,
  detail,
  isActive,
  onClose,
  onSuspend,
}: DistributorDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="tap-effect flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <SheetTitle className="text-2xl font-bold text-[#FAFAFA]">{distributor.name}</SheetTitle>
          <DistributorTierBadge value={distributor.tier} />
        </div>
        <DistributorStatusBadge value={distributor.status} withDot />
      </div>

      <p className="pl-11 text-sm text-[#FFFFFFCC]">
        {distributor.location} · Joined {detail.headerJoined}
      </p>

      {isActive && (
        <button
          type="button"
          onClick={onSuspend}
          className="tap-effect w-fit pl-11 text-left text-xs font-medium text-danger"
        >
          Suspend Distributor
        </button>
      )}
    </div>
  );
}
