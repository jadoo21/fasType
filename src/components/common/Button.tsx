import React from 'react';
import { Button as ReactstrapButton } from 'reactstrap';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  tag?: React.ElementType;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  tag,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-body text-body-sm font-medium rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-on-surface-variant shadow-sm',
    secondary: 'border border-outline bg-surface-container-lowest text-primary hover:bg-surface-container-low',
    ghost: 'text-primary hover:bg-surface-container-low',
    danger: 'bg-error text-on-error hover:bg-error/90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <ReactstrapButton
      type={props.type ?? 'button'}
      color="link"
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      tag={tag}
      {...(props as any)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
        </svg>
      ) : icon ? (
        <span className="text-[18px]">{icon}</span>
      ) : null}
      {children}
    </ReactstrapButton>
  );
};

export default Button;
