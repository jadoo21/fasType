import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in">
      <div role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined} className="w-full max-w-lg bg-surface-container-lowest border border-outline rounded-2xl p-xl shadow-2xl transform transition-all duration-200">
        {title && (
          <div className="flex items-start justify-between mb-unit-md">
            <div className="flex items-center gap-unit-sm">
              <div className="w-10 h-10 rounded-xl bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">keyboard</span>
              </div>
              <div>
                <h2 id="modal-title" className="text-headline-sm font-headline-sm font-bold text-primary">{title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;