import { useState } from 'react';
import { useGetV1DocumentList } from '@energyiq/api/generated/documents/documents';
import type { DomainDocument } from '@energyiq/api/generated/schemas';

import { DocumentManagementCard } from './document-management-card';
import { DocumentDetails } from './document-details';
import { DocumentUploadModal } from './document-upload-modal';
import { DocumentSubmittedModal } from './document-submitted-modal';
import { opensReuploadFlow } from './document-mappers';

export function DocumentsOverview() {
  const { data, isLoading } = useGetV1DocumentList();
  const documents = data?.data?.data ?? [];

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [uploadDocument, setUploadDocument] = useState<DomainDocument | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAction = (document: DomainDocument) => {
    if (opensReuploadFlow(document)) {
      setUploadDocument(document);
      return;
    }
    setSelectedDocumentId(document.id ?? null);
  };

  return (
    <section className="w-full px-6 py-6">
      {!selectedDocumentId && (
        <DocumentManagementCard
          documents={documents}
          isLoading={isLoading}
          onViewDocument={handleAction}
        />
      )}

      {selectedDocumentId && (
        <DocumentDetails documentId={selectedDocumentId} onBack={() => setSelectedDocumentId(null)} />
      )}

      {uploadDocument && (
        <DocumentUploadModal
          document={uploadDocument}
          onClose={() => setUploadDocument(null)}
          onSuccess={() => {
            setUploadDocument(null);
            setShowSuccess(true);
          }}
        />
      )}

      {showSuccess && (
        <DocumentSubmittedModal onClose={() => setShowSuccess(false)} />
      )}
    </section>
  );
}
