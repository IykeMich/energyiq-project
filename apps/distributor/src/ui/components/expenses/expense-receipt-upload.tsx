import {
  CloudUpload,
} from 'lucide-react';

interface Props {
  file: File | null;
  onFileChange: (
    file: File | null,
  ) => void;
}

export function ExpenseReceiptUpload({
  onFileChange,
}: Props) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#616161] p-8">
      <CloudUpload className="h-8 w-8 text-[#FBC02D]" />

      <p className="mt-3 text-sm text-white">
        Click to upload or drag and drop
      </p>

      <p className="mt-1 text-xs text-[#FFFFFF80]">
        PNG, JPG, PDF
      </p>

      <input
        hidden
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        onChange={(e) =>
          onFileChange(
            e.target.files?.[0] ?? null,
          )
        }
      />
    </label>
  );
}