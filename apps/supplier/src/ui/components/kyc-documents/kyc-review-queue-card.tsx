import { Avatar, AvatarFallback } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { KycDocumentsTierBadge } from './kyc-documents-tier-badge';
import { ApproveButton, PreviewButton, RejectButton } from './kyc-review-action-buttons';
import type { ReviewQueueItem } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycReviewQueueCardProps {
  item: ReviewQueueItem;
  onPreview: () => void;
  onApprove: () => void;
  onReject: () => void;
}

/** One distributor document awaiting review, with Preview / Reject / Approve actions. */
export function KycReviewQueueCard({ item, onPreview, onApprove, onReject }: KycReviewQueueCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#FFFFFF0A] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
              {getInitials(item.distributor)}
            </AvatarFallback>
          </Avatar>
          <span className="text-lg font-medium text-white">{item.distributor}</span>
          <KycDocumentsTierBadge tier={item.tier} />
        </div>
        <div className="flex flex-wrap items-center gap-2 pl-10 text-sm text-gray-400">
          <span>{item.fileName}</span>
          <span className="h-1 w-1 rounded-full bg-[#FBC02D]" aria-hidden="true" />
          <span>{item.submittedAgo}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-10 sm:pl-0">
        <PreviewButton onClick={onPreview} />
        <RejectButton onClick={onReject} />
        <ApproveButton onClick={onApprove} />
      </div>
    </div>
  );
}
