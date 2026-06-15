import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  Download,
} from 'lucide-react';

interface BulkUploadInitialProps {
  onFileSelect: (file: File) => void;
  onClose: () => void;
}

export function BulkUploadInitial({
  onFileSelect,
  onClose,
}: BulkUploadInitialProps) {
  const requirements = [
    'Product',
    'Quantity',
    'Unit Price',
    'Payment Method',
    'Date / Time',
    'Customer Name (Optional)',
    'Customer Phone (Optional)',
    'Notes (Optional)',
  ];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 border-b border-[#232323] pb-4">
        <button onClick={onClose}>
          <ArrowLeft className="h-5 w-5 text-[#FBC02D]" />
        </button>

        <div>
          <h3 className="text-lg font-semibold">Bulk Upload</h3>
          <p className="text-xs text-[#8F8F8F]">
            Import multiple sales using CSV or Excel
          </p>
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#3B3B3B] bg-[#141414] p-10">
        <CloudUpload className="h-10 w-10 text-[#FBC02D]" />

        <p className="mt-3 text-sm">
          <span className="font-medium text-[#FBC02D] underline">
            Click to upload
          </span>{' '}
          or drag and drop
        </p>

        <p className="mt-1 text-xs text-[#8F8F8F]">
          CSV, XLSX • Max 10MB
        </p>

        <input
          hidden
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) =>
            e.target.files?.[0] && onFileSelect(e.target.files[0])
          }
        />
      </label>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-[#161616] p-4">
        <span className="text-sm">Need Template?</span>

        <button className="flex items-center gap-2 rounded-full bg-[#FBC02D] px-4 py-2 text-black">
          <Download size={14} />
          Download Template
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-[#232323] bg-[#121212] p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[#FBC02D]">
          Template Requirements
        </h4>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {requirements.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-sm"
            >
              <CheckCircle2
                className="text-[#FBC02D]"
                size={16}
              />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}