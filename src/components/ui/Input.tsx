import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
            <span className="text-[18px]">{icon}</span>
          </div>
        )}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`w-full px-3.5 py-2.5 bg-surface-container-lowest border rounded-xl text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all ${
            error
              ? 'border-error'
              : 'border-outline-variant'
          } ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
};

export default Input;