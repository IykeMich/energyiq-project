import type { ReactNode } from 'react';
import { FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';

interface KycDocumentsDocumentRowProps {
  distributor: string;
  fileName: string;
  /** Meta shown at the top-right (e.g. "2hr ago" or a days-left pill). */
  topRight: ReactNode;
  /** Action or meta shown at the bottom-right (e.g. a Review button or a date). */
  bottomRight: ReactNode;
}

/** Shared list row used by both the Pending review and Expiring soon columns. */
export function KycDocumentsDocumentRow({
  distributor,
  fileName,
  topRight,
  bottomRight,
}: KycDocumentsDocumentRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#27272A] pb-4 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#FBC02D] text-xs text-[#121212]">
              {getInitials(distributor)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-white">{distributor}</span>
        </div>
        {topRight}
      </div>
      <div className="flex items-center justify-between gap-3 pl-10">
        <span className="inline-flex items-center gap-2 rounded-lg bg-[#FFFFFF14] px-3 py-1.5 text-xs text-gray-300">
          <FileText className="h-3.5 w-3.5 text-[#FBC02D]" aria-hidden="true" />
          {fileName}
        </span>
        {bottomRight}
      </div>
    </div>
  );
}
