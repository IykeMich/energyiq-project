import { useState } from 'react';
import { Dialog, DialogContent } from '@energyiq/ui';

import { BulkUploadInitial } from './bulk-upload-initial';
import { BulkUploadProgress } from './bulk-upload-progress';
import { BulkUploadPreview } from './bulk-upload-preview';

interface BulkUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

export function BulkUploadModal({
  open,
  onOpenChange,
  onUploadSuccess,
}: BulkUploadModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleClose = () => {
    setStep(1);
    setUploadedFile(null);
    onOpenChange(false);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setStep(2);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[850px] border-none bg-[#0B0B0B] p-0 text-white overflow-hidden rounded-[24px]">
        {step === 1 && (
          <BulkUploadInitial
            onFileSelect={handleFileSelect}
            onClose={handleClose}
          />
        )}

        {step === 2 && (
          <BulkUploadProgress
            fileName={uploadedFile?.name ?? 'sales_upload.xlsx'}
            onNext={() => setStep(3)}
            onClose={handleClose}
          />
        )}

        {step === 3 && (
          <BulkUploadPreview
            fileName={uploadedFile?.name ?? 'sales_upload.xlsx'}
            onCancel={() => setStep(1)}
            onProceed={() => {
              onUploadSuccess?.();
              handleClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}