import {
  Download,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';

interface BulkUploadPreviewProps {
  fileName: string;
  onCancel: () => void;
  onProceed: () => void;
}

const rows = [
  {
    id: 'SL-001',
    customer: 'Adebayo Musa',
    product: 'AGO (Diesel)',
    qty: '500L',
    price: '₦1,200',
    total: '₦600,000',
    date: 'Apr 30',
  },
  {
    id: 'SL-002',
    customer: 'Emeka Nwafor',
    product: 'PMS (Petrol)',
    qty: '300L',
    price: '₦1,000',
    total: '₦300,000',
    date: 'Apr 30',
  },
  {
    id: 'SL-003',
    customer: 'Apex Oil & Gas',
    product: 'PMS (Petrol)',
    qty: '1000L',
    price: '₦1,100',
    total: '₦1,100,000',
    date: 'Apr 30',
  },
];

export function BulkUploadPreview({
  fileName,
  onCancel,
  onProceed,
}: BulkUploadPreviewProps) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">
        Review Imported Sales
      </h3>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-[#232323] bg-[#121212] p-4">
        <div className="flex items-center gap-2">
          <FileSpreadsheet
            size={18}
            className="text-[#FBC02D]"
          />
          {fileName}
        </div>

        <button>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 inline-flex rounded-md border border-[#FBC02D33] bg-[#FBC02D1A] px-3 py-1 text-xs text-[#FBC02D]">
        {rows.length} Entries Found
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#232323]">
        <table className="w-full text-sm">
          <thead className="bg-[#171717]">
            <tr>
              <th className="p-3 text-left">Sales ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[#232323]"
              >
                <td className="p-3">{row.id}</td>
                <td className="p-3">{row.customer}</td>
                <td className="p-3">{row.product}</td>
                <td className="p-3">{row.qty}</td>
                <td className="p-3">{row.price}</td>
                <td className="p-3 text-[#FBC02D]">
                  {row.total}
                </td>
                <td className="p-3">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button className="flex items-center gap-2 text-sm text-[#A0A0A0]">
          <Download size={16} />
          Download Template
        </button>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="rounded-full bg-[#232323] px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onProceed}
            className="rounded-full bg-[#FBC02D] px-5 py-2 text-black"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}