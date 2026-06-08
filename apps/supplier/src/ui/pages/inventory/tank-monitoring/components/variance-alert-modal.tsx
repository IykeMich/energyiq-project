import { Modal } from '@energyiq/ui';

interface VarianceAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tankAffected: string;
  expectedL: number;
  actualL: number;
  onConfirm: () => void;
  onReenter: () => void;
}

export function VarianceAlertModal({
  open,
  onOpenChange,
  tankAffected,
  expectedL,
  actualL,
  onConfirm,
  onReenter,
}: VarianceAlertModalProps) {
  const diff = actualL - expectedL;
  const sign = diff >= 0 ? '+' : '−';

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Variance Alert"
      onBack={() => onOpenChange(false)}
      size="md"
    >
      <div className="flex flex-col gap-6">
        <p className="text-sm text-foreground">
          Stock variance flagged - Actual reading differs from expected. Review before confirming.
        </p>

        <div className="border-t border-border-subtle pt-5">
          <p className="text-sm font-semibold text-foreground mb-4">Variance Details:</p>
          <dl className="flex flex-col gap-2.5 text-sm text-foreground">
            <div className="flex items-center justify-between">
              <dt>Tank affected:</dt>
              <dd className="font-semibold">{tankAffected}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Expected Stock:</dt>
              <dd className="font-semibold">{expectedL.toLocaleString()} L</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Dip reading:</dt>
              <dd className="font-semibold">{actualL.toLocaleString()} L</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Difference:</dt>
              <dd className="font-semibold text-danger">
                {sign}
                {Math.abs(diff).toLocaleString()} L
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={onReenter}
            className="h-[53px] rounded-[28px] border border-border-strong text-foreground font-semibold"
          >
            Re-enter reading
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold"
          >
            Confirm Reading
          </button>
        </div>
      </div>
    </Modal>
  );
}
