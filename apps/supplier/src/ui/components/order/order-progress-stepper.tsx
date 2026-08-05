import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';
import type { OrderTimelineEvent } from './order-detail-mapper';

interface OrderProgressStepperProps {
  /** Real fulfillment steps from `supplier_order_timeline`, in order. */
  steps: OrderTimelineEvent[];
}

/** Horizontal fulfillment stepper shown at the top of the dispatch flow, driven by the order's real timeline. */
export function OrderProgressStepper({ steps }: OrderProgressStepperProps) {
  return (
    <div className="rounded-[18px] border border-brand/60 bg-brand/5 px-8 py-5">
      <div className="flex items-start">
        {steps.map((step, stepIndex) => {
          const isComplete = step.status === 'completed';
          const nextIsComplete = steps[stepIndex + 1]?.status === 'completed';
          const isLast = stepIndex === steps.length - 1;
          return (
            <div key={`${step.label}-${stepIndex}`} className="flex flex-1 last:flex-none flex-col">
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
                      isComplete && nextIsComplete ? 'bg-brand' : 'bg-[#616161B2]',
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
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
