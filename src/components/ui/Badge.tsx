import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full font-label-mono-sm';

  const variants = {
    default: 'bg-surface-container-high text-on-surface-variant border border-outline-variant',
    primary: 'bg-secondary text-on-secondary',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    error: 'bg-error-container text-error border border-error/20',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;