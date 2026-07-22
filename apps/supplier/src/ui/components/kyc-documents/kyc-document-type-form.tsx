import { useEffect, useState } from 'react';
import { ArrowLeft, XCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { shared } from '@energyiq/domain';
import { SuccessModal } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
import {
  useGetV1DoctypeReadId,
  usePostV1DoctypeCreate,
  usePutV1DoctypeUpdateId,
  getGetV1DoctypeListQueryKey,
  getGetV1DoctypeReadIdQueryKey,
} from '@energyiq/api/generated/document-types/document-types';
import {
  KycTextField,
  KycSelectField,
  KycTextareaField,
} from './kyc-document-type-fields';
import {
  kycDocumentTypeSchema,
  KYC_DOCUMENT_TYPE_DEFAULTS,
  type KycDocumentTypeFormData,
} from './kyc-document-type-schema';
import {
  mapDocumentTypeToFormDefaults,
  mapFormToCreateRequest,
  mapFormToUpdateRequest,
  setStoredDocumentCategory,
} from './kyc-document-type-mappers';
import {
  DOCUMENT_CATEGORY_OPTIONS,
  REQUIRED_OPTIONS,
  EXPIRY_REQUIRED_OPTIONS,
  VALIDITY_PERIOD_OPTIONS,
  ALLOWED_FILE_TYPE_OPTIONS,
  MAX_FILE_SIZE_OPTIONS,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

const { DomainError, ResponseCodes } = shared;

interface KycDocumentTypeFormProps {
  /** When set, the form edits this existing document type instead of creating a new one. */
  documentTypeId?: string;
}

/**
 * "Add / Edit document type" form. Uses react-hook-form + zod with `mode: 'onTouched'`
 * so per-field errors surface once a field is touched/dirtied, and the Save button
 * stays disabled until the whole form is valid. Submit result (success or failure,
 * e.g. a 401/403 from the API) surfaces via a `SuccessModal` rather than being silent.
 */
export function KycDocumentTypeForm({ documentTypeId }: KycDocumentTypeFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug = 'demo' } = useParams<{ slug: string }>();
  const isEditing = Boolean(documentTypeId);

  const { data: existingDocumentType } = useGetV1DoctypeReadId(documentTypeId ?? '', {
    query: { enabled: isEditing, queryKey: getGetV1DoctypeReadIdQueryKey(documentTypeId ?? '') },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<KycDocumentTypeFormData>({
    resolver: zodResolver(kycDocumentTypeSchema),
    mode: 'onTouched',
    defaultValues: KYC_DOCUMENT_TYPE_DEFAULTS,
  });

  useEffect(() => {
    if (existingDocumentType?.data) {
      reset(mapDocumentTypeToFormDefaults(existingDocumentType.data.data ?? {}));
    }
  }, [existingDocumentType, reset]);

  const createDocumentType = usePostV1DoctypeCreate();
  const updateDocumentType = usePutV1DoctypeUpdateId();

  const [successState, setSuccessState] = useState<{ documentName: string } | null>(null);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  const typesListPath = `/${slug}/kyc-documents/types`;

  const describeSubmitError = (error: unknown): string => {
    if (error instanceof DomainError) {
      if (error.code === ResponseCodes.UNAUTHORIZED) {
        return 'Your session has expired. Please sign in again and retry.';
      }
      if (error.code === ResponseCodes.FORBIDDEN) {
        return 'You do not have permission to perform this action.';
      }
      return error.message;
    }
    return 'Something went wrong while saving. Please try again.';
  };

  const onSubmit = async (data: KycDocumentTypeFormData) => {
    try {
      if (isEditing && documentTypeId) {
        await updateDocumentType.mutateAsync({ id: documentTypeId, data: mapFormToUpdateRequest(data) });
        setStoredDocumentCategory(documentTypeId, data.documentCategory ?? '');
      } else {
        const created = await createDocumentType.mutateAsync({ data: mapFormToCreateRequest(data) });
        setStoredDocumentCategory(created.data.data?.id, data.documentCategory ?? '');
      }
      await queryClient.invalidateQueries({ queryKey: getGetV1DoctypeListQueryKey() });
      setSuccessState({ documentName: data.documentName });
    } catch (error) {
      setFailureMessage(describeSubmitError(error));
    }
  };

  return (
    <>
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate(typesListPath)}
          aria-label="Back to document types"
          className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-[#FBC02D] text-[#121212]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <h1 className="text-2xl font-semibold text-white">
          {isEditing ? 'Edit document type' : 'Add new document type'}
        </h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[18px] bg-[#6161611A] p-6 sm:p-8"
      >
        <h2 className="text-base font-semibold text-white">Document Details</h2>
        <div className="mt-4 mb-6 h-px w-full bg-[#27272A]" />

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <KycTextField
            control={control}
            name="documentName"
            label="Document Name:"
            placeholder="e.g. Business License, Tax Certificate"
            required
            disabled={isEditing}
          />
          <KycSelectField
            control={control}
            name="documentCategory"
            label="Document Category:"
            placeholder="Select category"
            options={DOCUMENT_CATEGORY_OPTIONS}
          />
          <KycSelectField
            control={control}
            name="required"
            label="Required:"
            placeholder="Select option"
            options={REQUIRED_OPTIONS}
            required
          />
          <KycSelectField
            control={control}
            name="expiryRequired"
            label="Expiry required:"
            placeholder="Select option"
            options={EXPIRY_REQUIRED_OPTIONS}
            required
          />
          <KycSelectField
            control={control}
            name="validityPeriod"
            label="Validity Period:"
            placeholder="Select validity period"
            options={VALIDITY_PERIOD_OPTIONS}
            required
          />
          <KycSelectField
            control={control}
            name="allowedFileType"
            label="Allowed file type:"
            placeholder="Select file types"
            options={ALLOWED_FILE_TYPE_OPTIONS}
            required
          />
          <KycSelectField
            control={control}
            name="maxFileSize"
            label="Max File Size:"
            placeholder="Select max size"
            options={MAX_FILE_SIZE_OPTIONS}
            required
          />
          <KycTextareaField
            control={control}
            name="description"
            label="Description:"
            placeholder="Short description (optional)"
          />
        </div>

        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(typesListPath)}
            className="tap-effect rounded-full px-8 py-3 text-sm font-semibold text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={cn(
              'rounded-full px-8 py-3 text-sm font-semibold text-[#121212] transition-colors',
              !isValid || isSubmitting
                ? 'cursor-not-allowed bg-[#FBC02D] opacity-50'
                : 'tap-effect bg-[#FBC02D]',
            )}
          >
            {isSubmitting ? 'Saving...' : 'Save Document Type'}
          </button>
        </div>
      </form>
    </section>

    <SuccessModal
      open={successState !== null}
      onOpenChange={(open) => !open && setSuccessState(null)}
      title={isEditing ? 'Document Type Updated' : 'Document Type Created'}
      subtitle={
        isEditing
          ? `'${successState?.documentName}' has been updated.`
          : `'${successState?.documentName}' has been added to the required documents.`
      }
      primaryAction={{ label: 'Done', onClick: () => navigate(typesListPath) }}
      buttonLayout="stack"
    />

    <SuccessModal
      open={failureMessage !== null}
      onOpenChange={(open) => !open && setFailureMessage(null)}
      title={isEditing ? 'Could Not Update Document Type' : 'Could Not Create Document Type'}
      subtitle={failureMessage}
      tone="danger"
      icon={XCircle}
      primaryAction={{ label: 'Try Again', onClick: () => setFailureMessage(null) }}
      buttonLayout="stack"
    />
    </>
  );
}
