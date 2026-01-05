import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

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
      canNavigateToStep?.(stepNumber) &&
      stepNumber <= currentStep
    ) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Línea de fondo */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10 rounded-full" />

        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isClickable =
            canNavigateToStep?.(step.number) && step.number <= currentStep;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center relative group"
            >
              {/* Línea de progreso coloreada (Solo para los completados) */}
              {index > 0 && (
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: step.number <= currentStep ? "100%" : "0%",
                  }}
                  className="absolute top-5 right-[50%] h-0.5 bg-slate-900 -z-10 origin-right w-[calc(100vw/4)]" // Ajuste visual aproximado
                  style={{ right: "50%", width: "calc(100% + 2rem)" }} // Hack visual para conectar
                />
              )}

              <button
                type="button"
                onClick={() => handleStepClick(step.number)}
                disabled={!isClickable}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2
                  ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isCurrent
                      ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200 scale-110"
                      : "bg-white border-slate-200 text-slate-400"
                  }
                  ${
                    isClickable
                      ? "cursor-pointer hover:border-slate-900"
                      : "cursor-default"
                  }
                `}
              >
                {isCompleted ? <CheckIcon className="w-5 h-5" /> : step.number}
              </button>

              <div
                className={`mt-3 text-center transition-opacity duration-300 ${
                  isCurrent ? "opacity-100" : "opacity-60 grayscale"
                }`}
              >
                <p className="text-sm font-bold text-slate-800">{step.title}</p>
                <p className="text-[10px] uppercase tracking-wide font-medium text-slate-400 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
