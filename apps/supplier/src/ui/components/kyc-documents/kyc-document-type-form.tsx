import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@energyiq/ui';
import { cn } from '@energyiq/shared';
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
  DOCUMENT_CATEGORY_OPTIONS,
  REQUIRED_OPTIONS,
  EXPIRY_REQUIRED_OPTIONS,
  VALIDITY_PERIOD_OPTIONS,
  ALLOWED_FILE_TYPE_OPTIONS,
  MAX_FILE_SIZE_OPTIONS,
  mockCreateDocumentType,
} from '@/ui/pages/kyc-documents/kyc-documents-mocks';

/**
 * "Add new document type" form. Uses react-hook-form + zod with `mode: 'onTouched'`
 * so per-field errors surface once a field is touched/dirtied, and the Save button
 * stays disabled until the whole form is valid. A successful submit fires a smooth
 * sonner toast and returns to the Document Types list.
 */
export function KycDocumentTypeForm() {
  const navigate = useNavigate();
  const { slug = 'demo' } = useParams<{ slug: string }>();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<KycDocumentTypeFormData>({
    resolver: zodResolver(kycDocumentTypeSchema),
    mode: 'onTouched',
    defaultValues: KYC_DOCUMENT_TYPE_DEFAULTS,
  });

  const typesListPath = `/${slug}/kyc-documents/types`;

  const onSubmit = async (data: KycDocumentTypeFormData) => {
    // TODO(orval): replace with the generated create-document-type mutation.
    await mockCreateDocumentType();
    toast.success('Document type created', {
      description: `'${data.documentName}' has been added to the required documents.`,
    });
    navigate(typesListPath);
  };

  return (
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
        <h1 className="text-2xl font-semibold text-white">Add new document type</h1>
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
          />
          <KycSelectField
            control={control}
            name="documentCategory"
            label="Document Category:"
            placeholder="Select category"
            options={DOCUMENT_CATEGORY_OPTIONS}
            required
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
  );
}
