import { useState } from 'react';
import { ChevronDown, X, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@energyiq/ui';

interface AddTankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTankModal({
  open,
  onOpenChange,
}: AddTankModalProps) {
  const [productType] = useState('');

  const [tankName, setTankName] =
    useState('');

  const [capacity, setCapacity] =
    useState('');

  const [threshold, setThreshold] =
    useState('');

  const [dailyUse, setDailyUse] =
    useState('');

  const [openingStock, setOpeningStock] =
    useState('');

  const handleSubmit = () => {
    // save tank here
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="
          `max-w-[460px]
          rounded-[24px]
          border-none
          bg-[#090909]
          p-0
          text-white
        "
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-[#FBC02D]" />

              <h2 className="text-sm font-semibold">
                Add New Tank
              </h2>
            </div>

            <button
              onClick={() =>
                onOpenChange(false)
              }
            >
              <X className="h-4 w-4 text-[#FBC02D]" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Product Type */}
            <div>
              <label className="mb-2 block text-[11px] text-[#FFFFFF99]">
                Product Type
              </label>

              <button
                type="button"
                className="
                  flex
                  h-11
                  w-full
                  items-center
                  justify-between
                  rounded-full
                  bg-[#121212]
                  px-4
                  text-sm
                "
              >
                <span
                  className={
                    productType
                      ? 'text-white'
                      : 'text-[#FFFFFF66]'
                  }
                >
                  {productType ||
                    'Select a Product'}
                </span>

                <ChevronDown className="h-4 w-4 text-[#FFFFFF66]" />
              </button>
            </div>

            {/* Tank Name */}
            <div>
              <label className="mb-2 block text-[11px] text-[#FFFFFF99]">
                Tank Name / ID
              </label>

              <input
                value={tankName}
                onChange={(e) =>
                  setTankName(
                    e.target.value,
                  )
                }
                placeholder="PMS Tank #1"
                className="
                  h-11
                  w-full
                  rounded-full
                  bg-[#121212]
                  px-4
                  text-sm
                  text-white
                  placeholder:text-[#FFFFFF55]
                  focus:outline-none
                "
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="mb-2 block text-[11px] text-[#FFFFFF99]">
                Total Capacity (Litres)
              </label>

              <input
                type="number"
                value={capacity}
                onChange={(e) =>
                  setCapacity(
                    e.target.value,
                  )
                }
                placeholder="0"
                className="
                  h-11
                  w-full
                  rounded-full
                  bg-[#121212]
                  px-4
                  text-sm
                  text-white
                  placeholder:text-[#FFFFFF55]
                  focus:outline-none
                "
              />
            </div>

            {/* Threshold */}
            <div>
              <label className="mb-2 block text-[11px] text-[#FFFFFF99]">
                Reorder Threshold (%)
              </label>

              <input
                type="number"
                value={threshold}
                onChange={(e) =>
                  setThreshold(
                    e.target.value,
                  )
                }
                placeholder="0"
                className="
                  h-11
                  w-full
                  rounded-full
                  bg-[#121212]
                  px-4
                  text-sm
                  text-white
                  placeholder:text-[#FFFFFF55]
                  focus:outline-none
                "
              />
            </div>

            {/* Average Daily Use */}
            <div>
              <label className="mb-2 block text-[11px] text-[#FFFFFF99]">
                Average Daily Sales (Litres)
              </label>

              <input
                type="number"
                value={dailyUse}
                onChange={(e) =>
                  setDailyUse(
                    e.target.value,
                  )
                }
                placeholder="1,600"
                className="
                  h-11
                  w-full
                  rounded-full
                  bg-[#121212]
                  px-4
                  text-sm
                  text-white
                  placeholder:text-[#FFFFFF55]
                  focus:outline-none
                "
              />
            </div>

            {/* Opening Stock */}
            <div>
              <label className="mb-2 block text-[11px] text-[#FFFFFF99]">
                Opening Stock (Today's Dip)
              </label>

              <input
                type="number"
                value={openingStock}
                onChange={(e) =>
                  setOpeningStock(
                    e.target.value,
                  )
                }
                placeholder="14,500 L"
                className="
                  h-11
                  w-full
                  rounded-full
                  bg-[#121212]
                  px-4
                  text-sm
                  text-white
                  placeholder:text-[#FFFFFF55]
                  focus:outline-none
                "
              />

              <p className="mt-2 text-[10px] text-[#22C55E]">
                ✓ 9.0 days left
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() =>
                onOpenChange(false)
              }
              className="
                flex-1
                rounded-full
                bg-[#3A3A3A]
                py-3
                text-sm
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="
                flex-1
                rounded-full
                bg-[#FBC02D]
                py-3
                text-sm
                font-medium
                text-[#121212]
              "
            >
              Save & Add another
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}