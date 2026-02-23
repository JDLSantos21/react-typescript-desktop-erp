import { Button } from "@/shared/components/core/Button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface StepIndicatorNavigationProps {
  currentStep: number;
  prevStep: () => void;
  nextStep: () => void;
  canGoNext: boolean;
}

export default function StepIndicatorNavigation({
  currentStep,
  prevStep,
  nextStep,
  canGoNext,
}: StepIndicatorNavigationProps) {
  return (
    <div className="absolute bottom-0 w-full">
      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex justify-between  px-6 py-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            icon={ArrowLeftIcon}
            iconPosition="left"
          >
            Anterior
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canGoNext}
            icon={ArrowRightIcon}
            iconPosition="right"
          >
            {currentStep === 3 ? "Ver Resumen" : "Siguiente"}
          </Button>
        </div>
      )}
    </div>
  );
}
