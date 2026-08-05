import { useState } from "react";
import { toast } from "@energyiq/ui";
import type {
  OnboardingDocumentRequest,
  PresignUploadUrlRequest,
  PresignUploadUrlResult,
} from "@energyiq/domain/auth";
import {
  registrationDocumentFields,
  type RegistrationDocumentKey,
} from "./use-registration-documents";

type DocumentState = Record<RegistrationDocumentKey, File | null>;

interface UseOnboardingDocumentsOptions {
  presignOnboardingDocument: (
    req: PresignUploadUrlRequest,
  ) => Promise<PresignUploadUrlResult | null>;
  createSupplierOnboardingDocument: (
    req: OnboardingDocumentRequest,
  ) => Promise<unknown>;
  clearError: () => void;
  onSuccess: () => void;
}

// Authenticated (post-OTP) counterpart of useRegistrationDocuments: same
// presign → upload to storage → register metadata pattern, but using the
// Bearer-token-scoped endpoints (no registration_token) since account
// creation and OTP verification have already completed by this step.
export function useOnboardingDocuments({
  presignOnboardingDocument,
  createSupplierOnboardingDocument,
  clearError,
  onSuccess,
}: UseOnboardingDocumentsOptions) {
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

  const uploadOnboardingDocument = async (file: File, documentType: string) => {
    const presign = await presignOnboardingDocument({
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

    const created = await createSupplierOnboardingDocument({
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
            uploadOnboardingDocument(documents[key] as File, documentType),
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
