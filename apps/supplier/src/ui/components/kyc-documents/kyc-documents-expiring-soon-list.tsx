import { KycDocumentsDocumentRow } from './kyc-documents-document-row';
import type { ExpiringSoonItem } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

interface KycDocumentsExpiringSoonListProps {
  title: string;
  items: ExpiringSoonItem[];
}

/** Right dashboard column: documents approaching expiry, with days-left and the expiry date. */
export function KycDocumentsExpiringSoonList({ title, items }: KycDocumentsExpiringSoonListProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <div className="flex flex-col gap-4">
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">Nothing expiring soon.</p>
        )}
        {items.map((item) => (
          <KycDocumentsDocumentRow
            key={item.id}
            distributor={item.distributor}
            fileName={item.fileName}
            topRight={
              <span className="text-xs font-medium text-[#D4A017]">{item.daysLeftLabel}</span>
            }
            bottomRight={<span className="text-xs text-gray-400">{item.expiresOnLabel}</span>}
          />
        ))}
      </div>
    </div>
  );
}
