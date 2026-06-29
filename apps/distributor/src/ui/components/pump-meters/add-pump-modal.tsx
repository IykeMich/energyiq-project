import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

export function AddPumpModal({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-125 rounded-[24px] border border-[#2A2A2A] bg-[#121212]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Add Pump
          </DialogTitle>
        </DialogHeader>

        {/* form fields */}

        <button className="mt-6 h-12 w-full rounded-xl bg-[#FFB800] font-medium text-black">
          Save Settings
        </button>
      </DialogContent>
    </Dialog>
  );
}