import React from 'react';

interface SegmentedControlProps<T extends string | number> {
  value: T;
  options: ReadonlyArray<{ value: T; label: React.ReactNode }>;
  onChange: (value: T) => void;
  leadingIcon?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  ariaLabel?: string;
}

function SegmentedControl<T extends string | number>({
  value,
  options,
  onChange,
  leadingIcon,
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <div className={`inline-flex items-center ${className}`} role="radiogroup" aria-label={ariaLabel}>
      {leadingIcon && (
        <span className="flex items-center px-2 text-slate-400">
          {leadingIcon}
        </span>
      )}
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`transition-all ${
            value === option.value
              ? activeItemClassName
              : itemClassName
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default SegmentedControl;
