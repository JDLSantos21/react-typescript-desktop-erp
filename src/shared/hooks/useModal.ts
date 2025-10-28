import { useState, useCallback } from "react";

export const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export const useModalManager = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const open = useCallback((modalId: string) => {
    setActiveModal(modalId);
  }, []);

  const close = useCallback(() => {
    setActiveModal(null);
  }, []);

  const isOpen = useCallback(
    (modalId: string) => {
      return activeModal === modalId;
    },
    [activeModal]
  );

  const toggle = useCallback((modalId: string) => {
    setActiveModal((prev) => (prev === modalId ? null : modalId));
  }, []);

  return {
    activeModal,
    open,
    close,
    isOpen,
    toggle,
  };
};
