import React, { useEffect, useRef } from 'react';
import { cn } from '../../../utils/cn';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  icon,
  className,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.body.style.overflow = 'hidden';
      window.setTimeout(() => dialogRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      returnFocusRef.current?.focus();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined} className={cn('w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto bg-surface-container-lowest border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-2xl transform transition-all duration-200', className)}>
        {title && (
          <div className="flex items-start justify-between mb-unit-md">
            <div className="flex items-center gap-unit-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                {icon ?? <span className="material-symbols-outlined text-[24px]">keyboard</span>}
              </div>
              <div>
                <h2 id="modal-title" className="text-headline-sm font-headline-sm font-bold text-primary">{title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
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

export default AppModal;
