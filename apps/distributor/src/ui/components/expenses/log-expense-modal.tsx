import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@energyiq/ui';
import {
  Calendar,
  UploadCloud,
  X,
} from 'lucide-react';

interface LogExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogExpenseModal({
  open,
  onOpenChange,
}: LogExpenseModalProps) {
  const [step, setStep] = useState(1);
  const [receipt, setReceipt] =
    useState<File | null>(null);

  const [form, setForm] = useState({
    category: '',
    description: '',
    amount: '',
    date: '',
    notes: '',
  });

  const updateField = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReceipt = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      e.target.files?.[0] ?? null;

    setReceipt(file);
  };

  const handleClose = () => {
    setStep(1);
    setReceipt(null);

    setForm({
      category: '',
      description: '',
      amount: '',
      date: '',
      notes: '',
    });

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-130 border-none bg-[#0B0B0B] p-0 text-white">
        <div className="rounded-[24px] p-6">
          {/* Header */}
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-white">
                Log Expenses
              </DialogTitle>

              <button
                onClick={handleClose}
              >
                <X className="h-4 w-4 text-[#FBC02D]" />
              </button>
            </div>
          </DialogHeader>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="mt-6 space-y-4">
              {/* Category */}
              <div>
                <label className="mb-2 block text-xs text-[#FFFFFF80]">
                  Category
                </label>

                <Select
  value={form.category}
  onValueChange={(value) =>
    updateField('category', value ?? '')
  }
>
                  <SelectTrigger className="h-12 border-none bg-[#121212]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="staff">
                      Staff Costs
                    </SelectItem>

                    <SelectItem value="maintenance">
                      Maintenance
                    </SelectItem>

                    <SelectItem value="utilities">
                      Utilities
                    </SelectItem>

                    <SelectItem value="security">
                      Security
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs text-[#FFFFFF80]">
                  Description
                </label>

                <Input
                  value={
                    form.description
                  }
                  onChange={(e) =>
                    updateField(
                      'description',
                      e.target.value,
                    )
                  }
                  placeholder="Pump 2 nozzle repair"
                  className="h-12 border-none bg-[#121212]"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-xs text-[#FFFFFF80]">
                  Amount (₦)
                </label>

                <Input
                  value={form.amount}
                  onChange={(e) =>
                    updateField(
                      'amount',
                      e.target.value,
                    )
                  }
                  placeholder="₦2500"
                  className="h-12 border-none bg-[#121212]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-xs text-[#FFFFFF80]">
                  Date
                </label>

                <div className="relative">
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      updateField(
                        'date',
                        e.target.value,
                      )
                    }
                    className="h-12 border-none bg-[#121212]"
                  />

                  <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FFFFFF80]" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-xs text-[#FFFFFF80]">
                  Note (Optional)
                </label>

                <Textarea
                  value={form.notes}
                  onChange={(e) =>
                    updateField(
                      'notes',
                      e.target.value,
                    )
                  }
                  placeholder="Enter note..."
                  className="min-h-[90px] border-none bg-[#121212]"
                />
              </div>

              {/* Upload */}
              <div>
                <label className="mb-2 block text-xs text-[#FFFFFF80]">
                  Upload receipt
                </label>

                <div className="rounded-[16px] border border-dashed border-[#616161] p-8">
                  <label className="flex cursor-pointer flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8 text-[#FBC02D]" />

                    <p className="text-sm text-white">
                      Click to upload
                      or drag and drop
                    </p>

                    <p className="text-xs text-[#FFFFFF80]">
                      PNG, JPG, PDF
                    </p>

                    <input
                      type="file"
                      hidden
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={
                        handleReceipt
                      }
                    />
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-none bg-[#2A2A2A] text-white"
                  onClick={
                    handleClose
                  }
                >
                  Back
                </Button>

                <Button
                  className="flex-1 rounded-full bg-[#FBC02D] text-black"
                  onClick={() =>
                    setStep(2)
                  }
                >
                  Review Expense
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="mt-6 space-y-5">
              <div className="rounded-[16px] border border-[#2A2A2A] p-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#163C22]">
                    <UploadCloud className="h-5 w-5 text-[#4ADE80]" />
                  </div>

                  <p className="font-medium text-white">
                    {receipt?.name ??
                      'Receipt uploaded'}
                  </p>

                  <p className="mt-1 text-xs text-[#FFFFFF80]">
                    Ready for
                    submission
                  </p>

                  <button
                    className="mt-4 rounded-full bg-[#FBC02D] px-4 py-2 text-xs font-medium text-black"
                    onClick={() =>
                      setStep(1)
                    }
                  >
                    Replace File
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-none bg-[#2A2A2A] text-white"
                >
                  Save as Draft
                </Button>

                <Button
                  className="flex-1 rounded-full bg-[#FBC02D] text-black"
                  onClick={
                    handleClose
                  }
                >
                  Submit for Approval
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}