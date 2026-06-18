import { useState } from 'react';

import { DocumentManagementCard } from './document-management-card';
import { DocumentDetails } from './document-details';
import { DocumentUploadModal } from './document-upload-modal';
import { DocumentSubmittedModal } from './document-submitted-modal';

export function DocumentsOverview() {
  const [selectedDocument, setSelectedDocument] =
    useState<any>(null);

  const [uploadDocument, setUploadDocument] =
    useState<any>(null);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const handleAction = (doc: any) => {
    if (
      doc.status === 'rejected' ||
      doc.status === 'pending'
    ) {
      setUploadDocument(doc);
      return;
    }

    setSelectedDocument(doc);
  };

  return (
    <section className="space-y-6">
      {!selectedDocument && (
        <DocumentManagementCard
          onViewDocument={handleAction}
        />
      )}

      {selectedDocument && (
        <DocumentDetails
          document={selectedDocument}
          onBack={() =>
            setSelectedDocument(null)
          }
        />
      )}

      {uploadDocument && (
        <DocumentUploadModal
          document={uploadDocument}
          onClose={() =>
            setUploadDocument(null)
          }
          onSuccess={() => {
            setUploadDocument(null);
            setShowSuccess(true);
          }}
        />
      )}

      {showSuccess && (
        <DocumentSubmittedModal
          onClose={() =>
            setShowSuccess(false)
          }
        />
      )}
    </section>
  );
}