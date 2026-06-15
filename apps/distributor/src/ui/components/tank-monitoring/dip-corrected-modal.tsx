import {
  Dialog,
  DialogContent,
  Button,
} from '@energyiq/ui';

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

export function DipCorrectedModal({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-[420px] rounded-[24px] border-none bg-[#0B0B0B] p-6 text-white">
        <h2 className="text-lg font-semibold">
          Dip Corrected
        </h2>

        <div className="mt-6 space-y-3 rounded-[16px] bg-[#121212] p-5">
          <div className="flex justify-between">
            <span>Tank Name</span>
            <span>
              Main Depot Tank A
            </span>
          </div>

          <div className="flex justify-between">
            <span>Dip Date</span>
            <span>Jun 5</span>
          </div>

          <div className="flex justify-between">
            <span>
              Previous Stock
            </span>
            <span>28,400L</span>
          </div>

          <div className="flex justify-between">
            <span>
              Corrected Reading
            </span>
            <span>32,000L</span>
          </div>

          <div className="flex justify-between text-green-500">
            <span>Variance</span>
            <span>0.00L</span>
          </div>
        </div>

        <Button className="mt-6 w-full rounded-full bg-[#FBC02D] text-black">
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}