import { KycDocumentsDocumentRow } from './kyc-documents-document-row';
import { EXPIRING_SOON_ITEMS } from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/** Right dashboard column: documents approaching expiry, with days-left and the expiry date. */
export function KycDocumentsExpiringSoonList() {
  return (
    <div className="flex flex-col gap-5 rounded-[18px] bg-[#6161611A] p-6">
      <h2 className="text-base font-semibold text-white">Expiring Soon</h2>
      <div className="flex flex-col gap-4">
        {EXPIRING_SOON_ITEMS.map((item) => (
          <KycDocumentsDocumentRow
            key={item.id}
            distributor={item.distributor}
            fileName={item.fileName}
            topRight={
              <span className="text-xs font-medium text-[#D4A017]">{item.daysLeft} Days</span>
            }
            bottomRight={<span className="text-xs text-gray-400">{item.expiresOn}</span>}
          />
        ))}
      </div>
    </div>
  );
}
