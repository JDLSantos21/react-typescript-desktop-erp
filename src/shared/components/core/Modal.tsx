import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m, LazyMotion, domAnimation } from "motion/react";
import { CloseIcon } from "../icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  className,
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
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50"
              onClick={handleOverlayClick}
            />

            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative bg-white rounded-xl overflow-hidden shadow-xl ${
                sizeClasses[size]
              } w-full max-h-[90vh] flex flex-col ${className || ""}`}
              onClick={(e) => e.stopPropagation()} // Evitar que se cierre el modal al hacer clic dentro de él.
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 pt-6 shrink-0">
                  <h2 className="text-xl font-bold text-gray-700 font-midimi">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-text-primary hover:text-danger/70 transition-colors cursor-pointer p-2 rounded-md bg-gray-50 hover:bg-red-50"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}

              <div className="overflow-y-auto scrollbar-hide flex-1">
                {children}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>,
    document.body
  );
};

Modal.Header = ({ children }: { children: ReactNode }) => (
  <div className="mb-4">{children}</div>
);

Modal.Body = ({
  children,
  className,
  padding,
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) => <div className={`mb-4 p-${padding || 6} ${className}`}>{children}</div>;

Modal.Footer = ({ children }: { children: ReactNode }) => (
  <div className="flex justify-end gap-3 bg-gray-100 p-3 flex-shrink-0 w-full">
    {children}
  </div>
);
