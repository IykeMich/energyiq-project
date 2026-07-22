import type {
  DomainDocumentType,
  HttpDocumentTypeCreateRequest,
  HttpDocumentTypeUpdateRequest,
} from '@energyiq/api/generated/schemas';
import type { DocumentTypeConfig } from '@/ui/pages/kyc-documents/kyc-documents-mocks';
import type { KycDocumentTypeFormData } from './kyc-document-type-schema';

/**
 * `documentCategory` and the exact allowed-file-type/max-size/validity-period option
 * lists exist only in this UI's form — `DomainDocumentType` has no category field, and
 * stores `file_types`/`max_size_mb`/`expiry_months` as raw values rather than the
 * form's fixed option strings. These maps translate between the two.
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

function expiryMonthsToOption(expiryMonths: number | undefined): string {
  if (!expiryMonths) return 'No Expiry';
  const match = Object.entries(VALIDITY_OPTION_TO_MONTHS).find(([, months]) => months === expiryMonths);
  return match?.[0] ?? '';
}

// TODO(orval): `documentCategory` has no field on `DomainDocumentType` yet, so it
// can't round-trip through the API on its own. Until the backend adds one, persist
// the chosen category locally (keyed by document type id) so it survives a reload
// and reopens prefilled on edit; swap this for the real field once it ships.
const CATEGORY_STORAGE_KEY_PREFIX = 'eiq_doctype_category:';

export function getStoredDocumentCategory(documentTypeId: string | undefined): string {
  if (!documentTypeId) return '';
  try {
    return localStorage.getItem(`${CATEGORY_STORAGE_KEY_PREFIX}${documentTypeId}`) ?? '';
  } catch {
    return '';
  }
}

export function setStoredDocumentCategory(documentTypeId: string | undefined, category: string): void {
  if (!documentTypeId) return;
  try {
    if (category) {
      localStorage.setItem(`${CATEGORY_STORAGE_KEY_PREFIX}${documentTypeId}`, category);
    } else {
      localStorage.removeItem(`${CATEGORY_STORAGE_KEY_PREFIX}${documentTypeId}`);
    }
  } catch {
    // localStorage unavailable (e.g. private mode) — category prefill is best-effort only.
  }
}

/** `GET /v1/doctype/list` row -> the "Document Types" list card shape. */
export function mapDocumentTypeToConfig(documentType: DomainDocumentType): DocumentTypeConfig {
  const renewal =
    documentType.expiry_months && documentType.expiry_months > 0
      ? `Renew every ${documentType.expiry_months} months`
      : 'No Expiry';
  const reminder =
    documentType.auto_remind_days && documentType.auto_remind_days > 0
      ? `Reminder: ${documentType.auto_remind_days} days before`
      : 'Reminder: Never';

  return {
    id: documentType.id ?? '',
    name: documentType.label ?? documentType.name ?? '',
    required: documentType.required ?? false,
    allowedFileTypes: fileTypesToOption(documentType.file_types),
    renewal,
    reminder,
  };
}

/** Prefills the "Add/Edit document type" form when opening an existing type for edit. */
export function mapDocumentTypeToFormDefaults(documentType: DomainDocumentType): KycDocumentTypeFormData {
  return {
    documentName: documentType.name ?? '',
    documentCategory: getStoredDocumentCategory(documentType.id),
    required: documentType.required ? 'Required' : 'Optional',
    expiryRequired: documentType.expiry_months ? 'Yes' : 'No',
    validityPeriod: expiryMonthsToOption(documentType.expiry_months),
    allowedFileType: fileTypesToOption(documentType.file_types),
    maxFileSize: maxSizeToOption(documentType.max_size_mb),
    description: documentType.description ?? '',
  };
}

/** Form data -> `POST /v1/doctype/create` body. `documentCategory` has no API slot — not sent (persisted locally instead, see `setStoredDocumentCategory`). */
export function mapFormToCreateRequest(form: KycDocumentTypeFormData): HttpDocumentTypeCreateRequest {
  return {
    name: form.documentName,
    label: form.documentName,
    description: form.description || undefined,
    file_types: FILE_TYPE_OPTION_TO_API[form.allowedFileType] as HttpDocumentTypeCreateRequest['file_types'],
    max_size_mb: MAX_SIZE_OPTION_TO_MB[form.maxFileSize],
    required: form.required === 'Required',
    expiry_months:
      form.expiryRequired === 'Yes' ? VALIDITY_OPTION_TO_MONTHS[form.validityPeriod] : undefined,
  };
}

/** Form data -> `PUT /v1/doctype/update/{id}` body. `name` is immutable and omitted. */
export function mapFormToUpdateRequest(form: KycDocumentTypeFormData): HttpDocumentTypeUpdateRequest {
  return {
    label: form.documentName,
    description: form.description || undefined,
    file_types: FILE_TYPE_OPTION_TO_API[form.allowedFileType] as HttpDocumentTypeUpdateRequest['file_types'],
    max_size_mb: MAX_SIZE_OPTION_TO_MB[form.maxFileSize],
    required: form.required === 'Required',
    expiry_months:
      form.expiryRequired === 'Yes' ? VALIDITY_OPTION_TO_MONTHS[form.validityPeriod] : undefined,
  };
}
