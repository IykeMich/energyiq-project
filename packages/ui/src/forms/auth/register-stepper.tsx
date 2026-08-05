interface RegisterStepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function RegisterStepper({
  steps,
  currentStep,
  className = "mb-10",
}: RegisterStepperProps) {
  return (
    <div className={`flex ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isCurrent = currentStep === stepNumber;
        const isActive = isCompleted || isCurrent;
        const isLastStep = stepNumber === steps.length;

        return (
          <div
            key={step}
            className={`flex items-start ${isLastStep ? "flex-none" : "flex-1"}`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isCompleted
                    ? "bg-[#FBC02D] border-[#FBC02D]"
                    : isCurrent
                      ? "border-[#FBC02D]"
                      : "border-gray-500"
                }`}
              >
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-[#FBC02D]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-2 whitespace-nowrap ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
            {!isLastStep && (
              <div
                className={`flex-1 h-[1px] mt-[11.5px] ${
                  isCompleted ? "bg-[#FBC02D]" : "bg-gray-500"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
