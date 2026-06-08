import type { ReactNode } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { ArrowLeft, X } from 'lucide-react';
import { cn } from '@energyiq/shared';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-[560px]',
  md: 'max-w-[680px]',
  lg: 'max-w-[760px]',
  xl: 'max-w-[920px]',
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  onBack?: () => void;
  size?: ModalSize;
  showClose?: boolean;
  className?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  onBack,
  size = 'md',
  showClose = true,
  className,
  children,
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-surface-overlay backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          className={cn(
            'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full bg-surface-modal border border-border-subtle rounded-[24px] outline-none',
            'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            SIZE_CLASSES[size],
            className,
          )}
        >
          {(title || onBack || showClose) && (
            <div className="flex items-center justify-between px-8 pt-8">
              <div className="flex items-center gap-3.5">
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back"
                    className="w-[31px] h-[31px] rounded-full border border-border-strong flex items-center justify-center text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                {title && (
                  <DialogPrimitive.Title className="text-xl font-semibold text-foreground m-0">
                    {title}
                  </DialogPrimitive.Title>
                )}
              </div>
              {showClose && (
                <DialogPrimitive.Close
                  aria-label="Close"
                  className="w-8 h-8 rounded-full border border-border-strong flex items-center justify-center text-foreground"
                >
                  <X className="w-4 h-4" />
                </DialogPrimitive.Close>
              )}
            </div>
          )}
          <div className="px-8 pb-8 pt-6">{children}</div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
