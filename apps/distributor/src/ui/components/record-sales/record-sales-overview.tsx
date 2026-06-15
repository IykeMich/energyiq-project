import { useState } from 'react';
// import { Upload } from 'lucide-react';

// import { PageHeaderContent } from '@/ui/layouts/page-header';

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
      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Record Sales
            </h1>

            <p className="mt-1 text-sm text-[#FFFFFF80]">
              Enter the sales to your end customer.
            </p>
          </div>

         
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <RecordSalesForm
  formData={formData}
  setFormData={setFormData}
  onBulkUpload={() => setShowBulkUpload(true)}
/>

          <SalesSummaryCard
            formData={formData}
          />
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