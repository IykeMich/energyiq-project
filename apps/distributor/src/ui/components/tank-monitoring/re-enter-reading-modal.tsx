import {
  Dialog,
  DialogContent,
  Input,
  Textarea,
  Button,
} from '@energyiq/ui';

interface Props {
  open: boolean;
  onOpenChange: (
    open: boolean,
  ) => void;
}

export function ReEnterReadingModal({
  open,
  onOpenChange,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-112.5 rounded-[24px] border-none bg-[#0B0B0B] p-6 text-white">
        <h2 className="text-lg font-semibold">
          Re-enter Reading
        </h2>

        <div className="mt-6 space-y-4">
          <Input
            placeholder="Previous Reading"
          />

          <Input
            placeholder="Corrected Reading"
          />

          <Textarea
            placeholder="Reason for correction"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>

          <Button className="flex-1 bg-[#FBC02D] text-black">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}