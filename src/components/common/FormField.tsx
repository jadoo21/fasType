import React from 'react';

interface FormFieldProps extends React.ComponentProps<'div'> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  wrapperClassName?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  error,
  icon,
  wrapperClassName = '',
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${wrapperClassName}`} {...props}>
      {label && (
        <label className="block font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p role="alert" className="text-xs text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
};

export default FormField;
