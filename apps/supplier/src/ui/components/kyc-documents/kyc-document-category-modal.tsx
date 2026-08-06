import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import { TextField, FormActionButton } from '@/ui/components/product/wizard-fields';

export interface DocumentCategoryModalTarget {
  id?: string;
  name: string;
}

interface KycDocumentCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when editing an existing category; absent when creating a new one. */
  target: DocumentCategoryModalTarget | null;
  onSave: (name: string) => void;
  isSaving?: boolean;
}

/** Create/edit modal for a single document category — `POST/PUT /v1/document-category/*`. */
export function KycDocumentCategoryModal({
  open,
  onOpenChange,
  target,
  onSave,
  isSaving,
}: KycDocumentCategoryModalProps) {
  const [name, setName] = useState('');
  const isEditing = Boolean(target?.id);

  useEffect(() => {
    if (open) setName(target?.name ?? '');
  }, [open, target]);

  const canSave = name.trim().length >= 2 && !isSaving;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Document Category' : 'Add Document Category'}
      size="sm"
    >
      <div className="flex flex-col gap-6">
        <TextField label="Category Name:" required value={name} onChange={setName} placeholder="e.g. Legal, Financial, Identity" className="w-full" />

        <div className="flex items-center justify-end gap-3">
          <FormActionButton variant="cancel" onClick={() => onOpenChange(false)}>
            Cancel
          </FormActionButton>
          <FormActionButton variant="forward" disabled={!canSave} onClick={() => canSave && onSave(name.trim())}>
            {isSaving ? 'Saving...' : 'Save'}
          </FormActionButton>
        </div>
      </div>
    </Modal>
  );
}
