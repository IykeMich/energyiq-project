import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

import { RecordSalesForm } from './record-sales-form';
import { SalesSummaryCard } from './sales-summary-card';
import { BulkUploadModal } from './bulk-upload-modal';

export function RecordSalesOverview() {
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const [formData, setFormData] = useState({
    product: '',
    quantity: 0,
    unitPrice: 0,
    paymentMethod: '',
    customerName: '',
    customerPhone: '',
    notes: '',
    date: '',
    location: '',
  });

  return (
    <>
      <section className="`max-w-[980px] space-y-5">
        {/* Header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4A62A] text-black">
              <ArrowLeft size={14} />
            </button>

            <h1 className="text-[24px] font-semibold text-white">
              Record Sales
            </h1>
          </div>

          <p className="ml-9 text-sm text-[#8B8B8B]">
            Enter the sales to your end customer.
          </p>
        </div>

        {/* Content */}
       <div className="flex gap-6">
  {/* Form */}
  <div className="w-95 shrink-0">
    <RecordSalesForm
      formData={formData}
      setFormData={setFormData}
      onBulkUpload={() => setShowBulkUpload(true)}
    />
  </div>

  {/* Summary */}
  <div className="w-140 shrink-0">
    <SalesSummaryCard formData={formData} />
  </div>
</div>
      </section>

      <BulkUploadModal
        open={showBulkUpload}
        onOpenChange={setShowBulkUpload}
        onUploadSuccess={() => {
          console.log('Sales uploaded successfully');
        }}
      />
    </>
  );
}