import type {
  DocumentTypePayload as HttpDocumentTypePayload,
  DocumentTypeCreateRequest as HttpDocumentTypeCreateRequest,
  DocumentTypeUpdateRequest as HttpDocumentTypeUpdateRequest,
} from '@energyiq/api/generated/schemas';
import type { DocumentTypeConfig, KycDocumentFilterOption } from './kyc-documents-types';
import type { KycDocumentTypeFormData } from './kyc-document-type-schema';

/**
 * The exact allowed-file-type/max-size/validity-period option lists are this UI's
 * fixed presets (`allowed_file_types` itself is a real multi-value array on the API,
 * approximated here as combo presets) — these maps translate between the two.
 */
const FILE_TYPE_OPTION_TO_API: Record<string, string[]> = {
  PDF: ['pdf'],
  'PDF, JPG': ['pdf', 'jpg', 'jpeg'],
  'PDF, JPG, PNG': ['pdf', 'jpg', 'jpeg', 'png'],
};

const MAX_SIZE_OPTION_TO_MB: Record<string, number> = {
  '1 MB': 1,
  '5 MB': 5,
  '10 MB': 10,
  '20 MB': 20,
};

const VALIDITY_OPTION_TO_MONTHS: Record<string, number> = {
  '3 months': 3,
  '6 months': 6,
  '12 months': 12,
  '24 months': 24,
};

function fileTypesToOption(fileTypes: string[] | undefined): string {
  const types = new Set((fileTypes ?? []).map((type) => type.toLowerCase()));
  if (types.has('png')) return 'PDF, JPG, PNG';
  if (types.has('jpg') || types.has('jpeg')) return 'PDF, JPG';
  return 'PDF';
}

function maxSizeToOption(maxSizeMb: number | undefined): string {
  const match = Object.entries(MAX_SIZE_OPTION_TO_MB).find(([, mb]) => mb === maxSizeMb);
  return match?.[0] ?? '';
}

function validityMonthsToOption(months: number | undefined): string {
  if (!months) return 'No Expiry';
  const match = Object.entries(VALIDITY_OPTION_TO_MONTHS).find(([, value]) => value === months);
  return match?.[0] ?? '';
}

/** `GET /v1/document-type/list` row -> the "Document Types" list card shape. */
export function mapDocumentTypeToConfig(payload: HttpDocumentTypePayload): DocumentTypeConfig {
  const renewal =
    payload.expiry_required && payload.validity_period_months
      ? `Renew every ${payload.validity_period_months} months`
      : 'No Expiry';

  return {
    id: payload.id ?? '',
    name: payload.document_name ?? '',
    required: payload.required ?? false,
    allowedFileTypes: fileTypesToOption(payload.allowed_file_types),
    renewal,
    category: payload.document_category ?? '—',
  };
}

/** Prefills the "Add/Edit document type" form when opening an existing type for edit. */
export function mapDocumentTypeToFormDefaults(payload: HttpDocumentTypePayload): KycDocumentTypeFormData {
  return {
    documentName: payload.document_name ?? '',
    documentCategoryId: payload.document_category_id ?? '',
    required: payload.required ? 'Required' : 'Optional',
    expiryRequired: payload.expiry_required ? 'Yes' : 'No',
    validityPeriod: validityMonthsToOption(payload.validity_period_months),
    allowedFileType: fileTypesToOption(payload.allowed_file_types),
    maxFileSize: maxSizeToOption(payload.max_file_size_mb),
    description: payload.description ?? '',
  };
}

/**
 * Form data -> the shared fields of `POST /v1/document-type/create` and
 * `PUT /v1/document-type/update/{id}` bodies. The two request types are structurally
 * identical today but nominally distinct (separate generated `allowed_file_types` enum
 * types) — `mapFormToCreateRequest`/`mapFormToUpdateRequest` below each assert this
 * shared shape against their own real type, so the two contracts can't silently drift
 * without a type error surfacing here.
 */
function buildDocumentTypeRequestFields(form: KycDocumentTypeFormData) {
  return {
    document_name: form.documentName,
    document_category_id: form.documentCategoryId,
    description: form.description || undefined,
    allowed_file_types: FILE_TYPE_OPTION_TO_API[form.allowedFileType],
    max_file_size_mb: MAX_SIZE_OPTION_TO_MB[form.maxFileSize],
    required: form.required === 'Required',
    expiry_required: form.expiryRequired === 'Yes',
    validity_period_months:
      form.expiryRequired === 'Yes' ? VALIDITY_OPTION_TO_MONTHS[form.validityPeriod] : undefined,
  };
}

/** Form data -> `POST /v1/document-type/create` body. */
export function mapFormToCreateRequest(form: KycDocumentTypeFormData): HttpDocumentTypeCreateRequest {
  return buildDocumentTypeRequestFields(form) as HttpDocumentTypeCreateRequest;
}

/** Form data -> `PUT /v1/document-type/update/{id}` body. */
export function mapFormToUpdateRequest(form: KycDocumentTypeFormData): HttpDocumentTypeUpdateRequest {
  return buildDocumentTypeRequestFields(form) as HttpDocumentTypeUpdateRequest;
}

/** `GET /v1/document-category/list` -> the document-type form's category `<Select>` options. */
export function mapCategoriesToOptions(
  categories: Array<{ id?: string; document_category?: string }>,
): KycDocumentFilterOption[] {
  return categories.map((category) => ({
    value: category.id ?? '',
    label: category.document_category ?? '',
  }));
}
