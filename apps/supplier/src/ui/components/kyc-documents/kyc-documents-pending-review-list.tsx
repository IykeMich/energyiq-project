import { ArrowUpRight } from 'lucide-react';
import { KycDocumentsDocumentRow } from './kyc-documents-document-row';
import { PENDING_REVIEW_ITEMS } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentsPendingReviewListProps {
  onViewAll: () => void;
  onReview: (itemId: string) => void;
}

/** Left dashboard column: distributor documents awaiting review, each with a Review action. */
export function KycDocumentsPendingReviewList({
  onViewAll,
  onReview,
}: KycDocumentsPendingReviewListProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Pending review</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="tap-effect inline-flex items-center gap-1 text-sm font-medium text-[#FBC02D] hover:underline"
        >
          View all
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {PENDING_REVIEW_ITEMS.map((item) => (
          <KycDocumentsDocumentRow
            key={item.id}
            distributor={item.distributor}
            fileName={item.fileName}
            topRight={<span className="text-xs text-gray-400">{item.submittedAgo}</span>}
            bottomRight={
              <button
                type="button"
                onClick={() => onReview(item.id)}
                className="tap-effect rounded-full border border-[#FBC02D] px-4 py-1 text-xs font-medium text-[#FBC02D]"
              >
                Review
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
}
