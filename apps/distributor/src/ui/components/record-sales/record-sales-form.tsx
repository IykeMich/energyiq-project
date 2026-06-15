import {
  Upload,
  Plus,
  Calendar,
} from 'lucide-react';
import type { RecordSaleForm } from './types';
import { PaymentMethodSelector } from './payment-method-selector';

interface Props {
  formData: RecordSaleForm;
  setFormData: React.Dispatch<
    React.SetStateAction<RecordSaleForm>
  >;
  onBulkUpload: () => void;
}

export function RecordSalesForm({
  formData,
  setFormData,
  onBulkUpload,
}: Props) {
  const total =
    formData.quantity *
    formData.unitPrice;

  return (
    <div className="rounded-[24px] border border-[#262626] bg-[#121212] p-5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">
          New Sales Entry: SAL-010
        </h2>

       <button
  onClick={onBulkUpload}
  className="rounded-full bg-[#FBC02D] px-4 py-2 text-xs text-black"
>
  <Upload className="mr-2 inline h-3 w-3" />
  Bulk Upload
</button>

      </div>

      {/* Product */}
      <label className="mb-2 block text-xs text-[#FFFFFF80]">
        Product
      </label>

      <input
        value={formData.product}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            product: e.target.value,
          }))
        }
        placeholder="Select Product..."
        className="mb-4 h-11 w-full rounded-full bg-[#1A1A1A] px-4 text-white"
      />

      {/* Quantity */}
      <label className="mb-2 block text-xs text-[#FFFFFF80]">
        Quantity (litres)
      </label>

      <div className="mb-4 flex h-11 overflow-hidden rounded-full bg-[#1A1A1A]">
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              quantity:
                Number(e.target.value),
            }))
          }
          className="flex-1 bg-transparent px-4 text-white outline-none"
        />

        <button className="flex w-11 items-center justify-center border-l border-[#262626]">
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Price */}
      <label className="mb-2 block text-xs text-[#FFFFFF80]">
        Selling price / litre (₦)
      </label>

      <input
        type="number"
        value={formData.unitPrice}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            unitPrice:
              Number(e.target.value),
          }))
        }
        className="mb-4 h-11 w-full rounded-full bg-[#1A1A1A] px-4 text-white"
      />

      {/* Total */}
      <div className="mb-5 rounded-full bg-[#7A5A0D] px-5 py-3">
        <div className="flex justify-between">
          <span className="text-sm text-white">
            Total Amount:
          </span>

          <span className="font-semibold text-white">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      <PaymentMethodSelector
        formData={formData}
        setFormData={setFormData}
      />

      {/* Date */}
      <label className="mb-2 mt-5 block text-xs text-[#FFFFFF80]">
        Sales Date & Time
      </label>

      <div className="mb-4 flex h-11 items-center rounded-full bg-[#1A1A1A] px-4">
        <input
          type="datetime-local"
          className="flex-1 bg-transparent text-white outline-none"
        />

        <Calendar className="h-4 w-4 text-[#FFFFFF80]" />
      </div>

      {/* Customer */}
      <input
        placeholder="Customer Name"
        className="mb-4 h-11 w-full rounded-full bg-[#1A1A1A] px-4 text-white"
      />

      <input
        placeholder="Customer Phone"
        className="mb-4 h-11 w-full rounded-full bg-[#1A1A1A] px-4 text-white"
      />

      <input
        placeholder="Location"
        className="mb-4 h-11 w-full rounded-full bg-[#1A1A1A] px-4 text-white"
      />

      <textarea
        placeholder="Notes"
        className="h-28 w-full rounded-[20px] bg-[#1A1A1A] p-4 text-white"
      />
    </div>
  );
}