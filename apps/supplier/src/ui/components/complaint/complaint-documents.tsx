import { ComplaintDocumentRow } from './complaint-document-row';
import type { ComplaintDocument } from '@/ui/pages/complaint/mocks';

interface ComplaintDocumentsProps {
  documents: ComplaintDocument[];
}

/** Documents tab content: the list of complaint attachments. */
export function ComplaintDocuments({ documents }: ComplaintDocumentsProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 text-center">
        <p className="text-sm text-[#FFFFFFCC]">No documents attached yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {documents.map((document) => (
        <ComplaintDocumentRow
          key={document.name}
          document={document}
          onDownload={() => {
            // TODO(orval): download the attachment once the documents endpoint lands.
          }}
        />
      ))}
    </div>
  );
}
