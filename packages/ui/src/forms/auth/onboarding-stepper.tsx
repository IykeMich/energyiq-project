interface OnboardingStepperProps {
  steps: string[];
  currentStep: number;
}

// Matches the .pen stepper exactly: 16x16 dots, no distinct "current" style
// (current and upcoming both render as a plain gray ring — only the eyebrow
// text above communicates which step is active). A step only turns gold once
// it's actually completed.
export function OnboardingStepper({ steps, currentStep }: OnboardingStepperProps) {
  return (
    <div className="flex mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isLastStep = stepNumber === steps.length;

        return (
          <div
            key={step}
            className={`flex items-start ${isLastStep ? "flex-none" : "flex-1"}`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                  isCompleted ? "bg-[#FBC02D] border-[#FBC02D]" : "border-[#9E9E9E]"
                }`}
              />
              <span
                className={`text-xs mt-2 whitespace-nowrap ${
                  isCompleted ? "text-[#FBC02D]" : "text-[#FAFAFA]"
                }`}
              >
                {step}
              </span>
            </div>
            {!isLastStep && (
              <div
                className={`flex-1 h-px mt-2 ${isCompleted ? "bg-[#FBC02D]" : "bg-[#9E9E9E]"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
