import { cn } from '@energyiq/shared';
import type { OrderTimelineStep } from './order-detail-mocks';

interface OrderDetailTimelineProps {
  steps: OrderTimelineStep[];
}

/** Vertical progress timeline: dot + connector line, label + sub-text per step. */
export function OrderDetailTimeline({ steps }: OrderDetailTimelineProps) {
  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const StepIcon = step.Icon;
        return (
          <div key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full',
                  step.done ? 'bg-[#FBC02D]' : 'bg-[#616161B2]',
                )}
              >
                <StepIcon
                  className={cn('h-2 w-2', step.done ? 'text-[#121212]' : 'text-[#FAFAFACC]')}
                />
              </span>
              {!isLast && <span className="my-1 w-px flex-1 bg-[#FAFAFACC]" />}
            </div>
            <div className={cn('flex flex-col gap-1', isLast ? 'pb-0' : 'pb-6')}>
              <span className="text-sm font-normal text-foreground">{step.label}</span>
              <span className="text-sm font-normal text-foreground">{step.detail}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
