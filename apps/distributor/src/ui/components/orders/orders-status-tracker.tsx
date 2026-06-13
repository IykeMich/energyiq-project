import { ArrowUpRight } from 'lucide-react';
import { cn } from '@energyiq/shared';
import {
  ORDER_TRACKER_ACTIVE_INDEX,
  ORDER_TRACKER_REFERENCE,
  ORDER_TRACKER_STEPS,
} from './orders-mocks';

/** Connector between two steps: three small bars that fill gold as progress passes. */
function StepConnector({ filledBars }: { filledBars: number }) {
  return (
    <div className="flex flex-1 items-center gap-1 px-2">
      {[0, 1, 2].map((barIndex) => (
        <span
          key={barIndex}
          className={cn(
            'h-[5px] flex-1 rounded-full',
            barIndex < filledBars ? 'bg-[#FBC02D]' : 'bg-[#616161B2]',
          )}
        />
      ))}
    </div>
  );
}

/** Order status stepper card (#ORD-003): Pickup → On Transit → On Delivery → Delivered. */
export function OrdersStatusTracker({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-5 rounded-[15px] bg-[#6161611A] p-5', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-[17px] w-1 rounded-sm bg-[#FBC02D]" />
          <h2 className="text-sm font-semibold text-white">
            Order Status - {ORDER_TRACKER_REFERENCE}
          </h2>
        </div>
        <button
          type="button"
          className="tap-effect hidden items-center gap-1 text-sm text-[#FBC02D] hover:underline"
        >
          See all
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

<div className="flex w-full items-start">
  {ORDER_TRACKER_STEPS.map((step, stepIndex) => {
    const isComplete = stepIndex <= ORDER_TRACKER_ACTIVE_INDEX;
    const isLast = stepIndex === ORDER_TRACKER_STEPS.length - 1;

    // Connectors before the active step are fully gold; the one trailing the active
    // step shows 2 gold bars; connectors after it stay grey.
    const filledBars =
      stepIndex < ORDER_TRACKER_ACTIVE_INDEX
        ? 3
        : stepIndex === ORDER_TRACKER_ACTIVE_INDEX
          ? 2
          : 0;

    return (
      <div
        key={step.label}
        className={cn(
          'flex flex-1',
          isLast && 'flex-initial',
        )}
      >
        <div className="flex w-full flex-col items-center">
          {/* Timeline Row — top-aligned so the connector can center on the circle. */}
          <div className="flex w-full items-start">
            {/* Circle */}
            <div className="z-10 flex flex-col shrink-0 items-center justify-center">
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-[#121212]',
                  isComplete ? 'bg-[#FBC02D]' : 'bg-[#616161B2]',
                )}
              >
                {stepIndex + 1}
              </span>
          {/* Labels */}
          <div className="mt-2 flex flex-col items-center">
            <span className="text-center text-xs font-semibold text-white">
              {step.label}
            </span>

            <span className="text-[9px] text-white">
              {step.timestamp}
            </span>
          </div>
            </div>

            {/* Connector — match the circle height (h-10) so its bars sit at the circle's middle. */}
            {!isLast && (
              <div className="flex h-10 flex-1 items-center">
                <StepConnector filledBars={filledBars} />
              </div>
            )}
          </div>

        </div>
      </div>
    );
  })}
</div>
    </div>
  );
}
