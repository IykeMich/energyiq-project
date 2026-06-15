import type { RecordSaleForm } from './types';

interface Props {
  formData: RecordSaleForm;
}

export function SalesSummaryCard({
  formData,
}: Props) {
  const total =
    formData.quantity *
    formData.unitPrice;

  return (
    <div className="h-fit rounded-[24px] border border-[#262626] bg-[#121212] p-5">
      <h2 className="mb-6 text-sm font-medium text-[#FBC02D]">
        Sales Summary
      </h2>

      <div className="space-y-5 text-sm">
        <Row
          label="Product"
          value={formData.product}
        />

        <Row
          label="Quantity"
          value={`${formData.quantity}`}
        />

        <Row
          label="Unit Price"
          value={`₦${formData.unitPrice.toLocaleString()}`}
        />

        <Row
          label="Payment Method"
          value={
            formData.paymentMethod
          }
        />

        <Row
          label="Customer"
          value={
            formData.customerName
          }
        />

        <hr className="border-[#262626]" />

        <Row
          label="Total Amount"
          value={`₦${total.toLocaleString()}`}
        />
      </div>

      <div className="mt-10 flex gap-3">
        <button className="flex-1 rounded-full bg-[#3A3A3A] py-3 text-white">
          Back
        </button>

        <button className="flex-1 rounded-full bg-[#FBC02D] py-3 font-medium text-black">
          Submit Sales
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-[#FFFFFF80]">
        {label}
      </span>

      <span className="text-white">
        {value || '-'}
      </span>
    </div>
  );
}