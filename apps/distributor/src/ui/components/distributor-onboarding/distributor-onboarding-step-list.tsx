interface DistributorOnboardingStepListProps {
  steps: string[];
  currentStep: number;
}

export function DistributorOnboardingStepList({
  steps,
  currentStep,
}: DistributorOnboardingStepListProps) {
  return (
    <div className="space-y-4 text-left">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCurrentStep = stepNumber === currentStep;

        return (
          <div key={step} className="flex items-center gap-3 text-sm">
            <div
              className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs ${
                isCurrentStep
                  ? 'bg-[#FBC02D] text-black font-semibold'
                  : 'border border-gray-600 text-gray-400'
              }`}
            >
              {stepNumber}
            </div>
            <span className={isCurrentStep ? 'text-white font-medium' : 'text-gray-400'}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
