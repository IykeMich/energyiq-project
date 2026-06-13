import { z } from 'zod';

/**
 * Validation for the "Add new document type" form. Selects are required strings;
 * `description` is the only optional field. `mode: 'onTouched'` in the form means
 * these messages surface once a field has been touched/dirtied, and `isValid`
 * gates the submit button.
 */
export const kycDocumentTypeSchema = z.object({
  documentName: z.string().trim().min(2, 'Document name is required'),
  documentCategory: z.string().min(1, 'Select a category'),
  required: z.string().min(1, 'Select an option'),
  expiryRequired: z.string().min(1, 'Select an option'),
  validityPeriod: z.string().min(1, 'Select a validity period'),
  allowedFileType: z.string().min(1, 'Select the allowed file types'),
  maxFileSize: z.string().min(1, 'Select a maximum file size'),
  description: z.string().optional(),
});

export type KycDocumentTypeFormData = z.infer<typeof kycDocumentTypeSchema>;

export const KYC_DOCUMENT_TYPE_DEFAULTS: KycDocumentTypeFormData = {
  documentName: '',
  documentCategory: '',
  required: '',
  expiryRequired: '',
  validityPeriod: '',
  allowedFileType: '',
  maxFileSize: '',
  description: '',
};
