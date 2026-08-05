import { ShieldCheck } from 'lucide-react';
import type { approval } from '@energyiq/domain';
import { ProductAuthorizationStatusBadge } from './product-authorization-status-badge';

interface ProductAuthorizationRequestRowProps {
  request: approval.QueueItem;
  onClick: () => void;
}

export function ProductAuthorizationRequestRow({ request, onClick }: ProductAuthorizationRequestRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap-effect flex w-full items-center justify-between gap-4 rounded-[10px] bg-[#6161611A] px-6 py-[15px] text-left hover:bg-[#61616133]"
    >
      <div className="flex items-center gap-[7px]">
        <span className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-brand">
          <ShieldCheck className="h-6 w-6 text-[#121212]" />
        </span>
        <div className="flex w-[291px] flex-col gap-0.5">
          <span className="text-sm text-[#FAFAFA]">
            {request.title} . {request.reference}
          </span>
          <span className="text-xs text-[#FFFFFFCC]">
            {request.organization} . Requested by {request.requested_by}
          </span>
        </div>
      </div>

      <div className="flex flex-row items-center gap-[19px]">
        <span className="text-sm text-[#9E9E9E]">{request.approval_level}</span>
        <ProductAuthorizationStatusBadge status={request.status} label={request.status_label} />
      </div>
    </button>
  );
}
