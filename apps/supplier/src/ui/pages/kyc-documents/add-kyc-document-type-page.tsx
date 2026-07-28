import { useParams } from 'react-router-dom';
import { KycDocumentTypeForm } from '@/ui/components/kyc-documents/kyc-document-type-form';

export function AddKycDocumentTypePage() {
  const { documentTypeId } = useParams<{ documentTypeId: string }>();
  return <KycDocumentTypeForm documentTypeId={documentTypeId} />;
}
