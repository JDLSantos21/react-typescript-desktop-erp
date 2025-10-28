import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) onClose();
  };

  //Renderizar directamente en el body.
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50"
            onClick={handleOverlayClick}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] flex flex-col`}
            onClick={(e) => e.stopPropagation()} // Evitar que se cierre el modal al hacer clic dentro de él.
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-divider flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-danger hover:text-danger/70 transition-colors cursor-pointer"
                >
                  <IoMdClose className="w-7 h-7" />
                </button>
              </div>
            )}

            <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

Modal.Header = ({ children }: { children: ReactNode }) => (
  <div className="mb-4">{children}</div>
);

Modal.Body = ({ children }: { children: ReactNode }) => (
  <div className="mb-4">{children}</div>
);

Modal.Footer = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-end gap-2 px-6 py-4 border-t border-divider flex-shrink-0">
    {children}
  </div>
);
