import { useState } from 'react';

import { DocumentManagementCard } from './document-management-card';
import { DocumentDetails } from './document-details';

export function DocumentsOverview() {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  return (
    <section className="space-y-6">
      {!selectedDocument ? (
        <DocumentManagementCard
          onViewDocument={setSelectedDocument}
        />
      ) : (
        <DocumentDetails
          document={selectedDocument}
          onBack={() => setSelectedDocument(null)}
        />
      )}
    </section>
  );
}