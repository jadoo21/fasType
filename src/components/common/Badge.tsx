import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const badgeStyles = cva(
  ['inline-flex items-center gap-1.5 rounded-full font-label-mono-sm'],
  {
    variants: {
      variant: {
        default: 'bg-surface-container-high text-on-surface-variant border border-outline-variant',
        primary: 'bg-secondary text-on-secondary',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        error: 'bg-error-container text-error border border-error/20',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
      },
      size: { sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-1 text-xs' },
    },
    defaultVariants: { variant: 'default', size: 'sm' },
  },
);

type BadgeStyleProps = VariantProps<typeof badgeStyles>;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeStyleProps {
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}) => {
  return (
    <span className={cn(badgeStyles({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
