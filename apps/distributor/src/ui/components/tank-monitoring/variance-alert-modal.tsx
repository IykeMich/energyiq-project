import {
  Dialog,
  DialogContent,
} from '@energyiq/ui';
import { AlertCircle, X } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

export function VarianceAlertModal({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-[450px] rounded-[24px] border-none bg-[#0B0B0B] p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-[#FBC02D]" />

            <h2 className="font-semibold">
              Variance Alert
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

        <p className="mt-4 text-sm text-[#FFFFFF80]">
          More volume dispensed than
          reading entered from tank dip.
        </p>

        <div className="mt-6 space-y-4 rounded-[16px] bg-[#121212] p-5">
          <div className="flex justify-between">
            <span>
              Tank affected
            </span>

            <span>
              Main Depot Tank A
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              Expected Stock
            </span>

            <span>32,000L</span>
          </div>

          <div className="flex justify-between">
            <span>
              Dip Reading
            </span>

            <span>28,400L</span>
          </div>

          <div className="flex justify-between text-red-500">
            <span>
              Difference
            </span>

            <span>-3,600L</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 rounded-full bg-[#2A2A2A] py-3">
            Re-enter Reading
          </button>

          <button className="flex-1 rounded-full bg-[#FBC02D] py-3 font-medium text-black">
            Confirm Reading
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}