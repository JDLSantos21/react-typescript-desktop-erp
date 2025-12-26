import { CheckIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

export default function StepIndicator({
  currentStep,
  steps,
  onStepClick,
  canNavigateToStep,
}: StepIndicatorProps) {
  const handleStepClick = (stepNumber: number) => {
    if (
      onStepClick &&
      canNavigateToStep &&
      canNavigateToStep(stepNumber) &&
      stepNumber <= currentStep
    ) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full sticky top-0 z-10 px-6 pt-2 bg-white">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable =
            canNavigateToStep?.(step.number) && step.number <= currentStep;

          const lastStep = index === steps.length - 1;

          return (
            <div
              key={step.number}
              className={`flex items-center py-1 ${!lastStep ? "flex-1" : ""}`}
            >
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-200
                    ${
                      isCompleted
                        ? "bg-success text-white"
                        : isCurrent
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-gray-200 text-gray-500"
                    }
                    ${
                      isClickable
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-not-allowed"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </button>

                {/* Step Title */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-success"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded transition-colors duration-300 ${
                    isCompleted ? "bg-success" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
