import { cn } from '@energyiq/shared';

export interface ProductWizardStep {
  title: string;
  subtitle: string;
}

interface ProductVerticalStepperProps {
  steps: ProductWizardStep[];
  currentStep: number;
}

/** Left-panel vertical numbered stepper for the "Add New Product" wizard. */
export function ProductVerticalStepper({ steps, currentStep }: ProductVerticalStepperProps) {
  return (
    <div className="bg-[#6161611A] border border-[#616161B2] rounded-[48px] p-7 w-full md:w-[365px] shrink-0">
      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          // Completed and current steps both render gold; only the line into an
          // upcoming step stays gray (confirmed against the step-2 design, where
          // step 1's label/connector are still gold while step 2 is active).
          const isHighlighted = stepNumber <= currentStep;
          const isConnectorHighlighted = stepNumber < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.title} className="flex flex-col">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#121212]',
                    isHighlighted ? 'bg-brand' : 'bg-[#616161B2]',
                  )}
                >
                  {stepNumber}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5 pb-2">
                  <span className={cn('text-sm font-medium', isHighlighted ? 'text-brand' : 'text-foreground')}>
                    {step.title}
                  </span>
                  <span className={cn('text-xs', isHighlighted ? 'text-brand' : 'text-muted-foreground')}>
                    {step.subtitle}
                  </span>
                </div>
              </div>
              {!isLast && (
                <span className={cn('ml-3 h-5.5 w-px', isConnectorHighlighted ? 'bg-brand' : 'bg-[#616161B2]')} />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
