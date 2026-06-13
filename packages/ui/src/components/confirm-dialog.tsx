import type { ReactNode } from 'react';
import { Modal } from './modal';
import { cn } from '@energyiq/shared';

export type ConfirmIntent = 'primary' | 'danger';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  intent?: ConfirmIntent;
  onCancel?: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  intent = 'primary',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="sm"
      showClose={false}
      className="max-w-[680px] bg-[linear-gradient(296.54deg,#212121_76.08%,#FBC02D_144.17%)]"
    >
      <div className="flex flex-col gap-6">
        <p className="text-sm text-foreground">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="h-11 px-6 rounded-full bg-foreground/10 text-foreground font-semibold text-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'h-11 px-8 rounded-full font-semibold text-sm',
              intent === 'danger'
                ? 'bg-danger text-danger-foreground'
                : 'bg-brand text-brand-foreground',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
