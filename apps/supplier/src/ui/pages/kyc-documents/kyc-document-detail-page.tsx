import { useParams } from 'react-router-dom';
import { KycDocumentDetailOverview } from '@/ui/components/kyc-documents/kyc-document-detail-overview';

export function KycDocumentDetailPage() {
  const { documentId = '' } = useParams<{ documentId: string }>();
  return <KycDocumentDetailOverview documentId={documentId} />;
}
