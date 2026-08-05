import { useState } from "react";
import { toast } from "@energyiq/ui";
import type {
  PresignRegistrationDocumentRequest,
  PresignUploadUrlResult,
  RegistrationDocumentRequest,
} from "@energyiq/domain/auth";

export type RegistrationDocumentKey =
  "cac" | "tax" | "directorId" | "utilityBill";

type DocumentState = Record<RegistrationDocumentKey, File | null>;

interface DocumentFieldConfig {
  key: RegistrationDocumentKey;
  label: string;
  description: string;
  hint?: string;
  required: boolean;
  documentType: string;
}

export const registrationDocumentFields: DocumentFieldConfig[] = [
  {
    key: "cac",
    label: "CAC Certificate",
    description: "Certificate of Incorporation",
    required: true,
    documentType: "cac_certificate",
  },
  {
    key: "tax",
    label: "Tax Clearance Certificate",
    description: "Current TCC from FIRS",
    required: true,
    documentType: "tax_clearance_certificate",
  },
  {
    key: "directorId",
    label: "Director's Government ID",
    description: "NIN slip, passport, driver's license",
    hint: "Both sides required",
    required: true,
    documentType: "directors_government_id",
  },
  {
    key: "utilityBill",
    label: "Utility Bill",
    description: "Not older than 3 months",
    required: false,
    documentType: "utility_bill",
  },
];

interface UseRegistrationDocumentsOptions {
  registrationToken: string | null;
  presignRegistrationDocument: (
    req: PresignRegistrationDocumentRequest,
  ) => Promise<PresignUploadUrlResult | null>;
  createRegistrationDocument: (
    req: RegistrationDocumentRequest,
  ) => Promise<unknown>;
  clearError: () => void;
  onSuccess: () => void;
}

// Uploads each selected file via the registration_token-scoped presign
// flow (presign → upload to storage → register metadata), mirroring
// distributor-form.tsx's uploadFileToPresign.
export function useRegistrationDocuments({
  registrationToken,
  presignRegistrationDocument,
  createRegistrationDocument,
  clearError,
  onSuccess,
}: UseRegistrationDocumentsOptions) {
  const [documents, setDocuments] = useState<DocumentState>({
    cac: null,
    tax: null,
    directorId: null,
    utilityBill: null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (
    key: RegistrationDocumentKey,
    file: File | null,
  ) => {
    setDocuments((prev) => ({ ...prev, [key]: file }));
  };

  const uploadRegistrationDocument = async (
    file: File,
    documentType: string,
  ) => {
    if (!registrationToken) throw new Error("Missing registration session");

    const presign = await presignRegistrationDocument({
      registration_token: registrationToken,
      file_name: file.name,
      content_type: file.type || "application/octet-stream",
    });
    if (!presign)
      throw new Error(`Failed to get an upload URL for ${file.name}`);

    const uploadResponse = await fetch(presign.upload_url, {
      method: presign.method,
      body: file,
      headers: presign.headers,
    });

    if (!uploadResponse.ok) throw new Error(`Upload failed for ${file.name}`);

    const created = await createRegistrationDocument({
      registration_token: registrationToken,
      document_type: documentType,
      file_name: file.name,
      file_size: file.size,
      file_url: presign.public_url,
      mime_type: file.type || "application/octet-stream",
    });
    if (!created) throw new Error(`Failed to register ${file.name}`);
  };

  const handleDocumentSubmit = async () => {
    // Only CAC, Tax, and Director ID are required. Utility Bill is optional.
    if (!documents.cac || !documents.tax || !documents.directorId) {
      toast.error("Missing required documents", {
        description: "Please upload all required KYC documents.",
      });
      return;
    }

    setIsUploading(true);
    clearError();

    try {
      await Promise.all(
        registrationDocumentFields
          .filter(({ key }) => documents[key])
          .map(({ key, documentType }) =>
            uploadRegistrationDocument(documents[key] as File, documentType),
          ),
      );

      toast.success("Documents submitted", {
        description: "Your KYC documents have been uploaded.",
      });
      onSuccess();
    } catch (err) {
      toast.error("Upload failed", {
        description:
          err instanceof Error ? err.message : "Please try again later.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadedCount = Object.values(documents).filter(Boolean).length;

  return {
    documents,
    documentFields: registrationDocumentFields,
    isUploading,
    uploadedCount,
    handleFileChange,
    handleDocumentSubmit,
  };
}
