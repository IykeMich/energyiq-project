import { Check } from 'lucide-react';
import { cn } from '@energyiq/shared';

export interface WizardStepPillsProps {
  steps: string[];
  current: number; // 0-based
  className?: string;
}

export function WizardStepPills({ steps, current, className }: WizardStepPillsProps) {
  return (
    <div className={cn('flex items-start justify-between gap-2 px-4', className)}>
      {steps.map((label, idx) => {
        const state: 'done' | 'current' | 'upcoming' =
          idx < current ? 'done' : idx === current ? 'current' : 'upcoming';
        const isLast = idx === steps.length - 1;
        return (
          <div key={label} className="flex-1 flex items-start">
            <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                  state === 'done' && 'bg-brand text-brand-foreground',
                  state === 'current' && 'border-2 border-brand bg-transparent',
                  state === 'upcoming' && 'border-2 border-muted-foreground bg-transparent',
                )}
              >
                {state === 'done' && <Check className="w-3 h-3" />}
                {state === 'current' && <span className="w-2 h-2 rounded-full bg-brand" />}
              </div>
              <p
                className={cn(
                  'text-xs text-center px-1 whitespace-nowrap',
                  state === 'current' ? 'text-brand font-semibold' : 'text-foreground/80',
                )}
              >
                {label}
              </p>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'h-px flex-1 mt-2.5',
                  idx < current ? 'bg-brand' : 'bg-border-strong',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
