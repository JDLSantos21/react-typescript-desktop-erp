import { useState } from "react";

export interface OrderStepData {
  // Step 1: Customer Info
  customerId?: string;
  customerAddressId?: number;

  // Step 2: Products (OrderItems)
  orderItems: Array<{
    productId: number;
    productName?: string;
    requestedQuantity: number;
    notes?: string;
  }>;

  // Step 3: Delivery Details (optional)
  scheduledDate?: string;
  deliveryNotes?: string;
  notes?: string;

  // User ID (required for backend)
  userId?: string;
}

interface UseOrderStepsReturn {
  currentStep: number;
  orderData: OrderStepData;
  updateOrderData: (data: Partial<OrderStepData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  canAdvanceToStep: (step: number) => boolean;
  isStepValid: (step: number) => boolean;
  resetOrder: () => void;
}

const TOTAL_STEPS = 4;

export const useOrderSteps = (
  initialCustomerId?: string,
  initialStep: number = 1,
): UseOrderStepsReturn => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [orderData, setOrderData] = useState<OrderStepData>({
    customerId: initialCustomerId,
    orderItems: [],
  });

  const updateOrderData = (data: Partial<OrderStepData>) => {
    setOrderData((prev) => ({ ...prev, ...data }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Customer Info
        return !!(orderData.customerId && orderData.customerAddressId);
      case 2: // Products
        return orderData.orderItems.length > 0;
      case 3: // Delivery Details - Optional, always valid
        return true;
      case 4: // Summary - valid if previous steps are valid
        return isStepValid(1) && isStepValid(2);
      default:
        return false;
    }
  };

  const canAdvanceToStep = (targetStep: number): boolean => {
    if (targetStep <= 1) return true;
    if (targetStep > TOTAL_STEPS) return false;

    // Check all previous steps are valid
    for (let i = 1; i < targetStep; i++) {
      if (!isStepValid(i)) return false;
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS && isStepValid(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS && canAdvanceToStep(step)) {
      setCurrentStep(step);
    }
  };

  const resetOrder = () => {
    setOrderData({
      customerId: initialCustomerId,
      orderItems: [],
    });
    setCurrentStep(1);
  };

  return {
    currentStep,
    orderData,
    updateOrderData,
    nextStep,
    prevStep,
    goToStep,
    canAdvanceToStep,
    isStepValid,
    resetOrder,
  };
};
