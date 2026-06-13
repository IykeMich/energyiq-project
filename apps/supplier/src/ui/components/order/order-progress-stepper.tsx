import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';

const DISPATCH_STEPS = [
  'Order Approved',
  'Preparing Goods',
  'Quality Check',
  'Dispatched',
  'Delivered',
] as const;

interface OrderProgressStepperProps {
  /** Index of the last completed step (0-based). Nodes at or before it render filled gold. */
  activeIndex: number;
}

/** Horizontal fulfillment stepper shown at the top of the dispatch flow. */
export function OrderProgressStepper({ activeIndex }: OrderProgressStepperProps) {
  return (
    <div className="rounded-[18px] border border-brand/60 bg-brand/5 px-8 py-5">
      <div className="flex items-start">
        {DISPATCH_STEPS.map((label, stepIndex) => {
          const isComplete = stepIndex <= activeIndex;
          const isLast = stepIndex === DISPATCH_STEPS.length - 1;
          return (
            <div key={label} className="flex flex-1 last:flex-none flex-col">
              <div className="flex items-center">
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    isComplete
                      ? 'border-brand bg-brand text-brand-foreground'
                      : 'border-[#616161B2] bg-transparent text-transparent',
                  )}
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      'mx-2 h-[2px] flex-1 rounded-full transition-colors',
                      stepIndex < activeIndex ? 'bg-brand' : 'bg-[#616161B2]',
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isComplete ? 'text-brand' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
