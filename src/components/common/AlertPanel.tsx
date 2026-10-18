import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const alertPanelStyles = cva(
  ['p-unit-base rounded-xl'],
  {
    variants: {
      tone: {
        success: 'bg-surface-container border border-secondary text-on-surface',
        error: 'bg-error-container border border-error/30 text-on-error-container',
        info: 'bg-surface-container-low border border-outline-variant text-on-surface',
      },
    },
    defaultVariants: { tone: 'error' },
  },
);

const iconColorMap = {
  success: 'text-secondary',
  error: 'text-error',
  info: 'text-on-surface-variant',
} as const;

interface AlertPanelProps extends VariantProps<typeof alertPanelStyles> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  id?: string;
  className?: string;
}

const AlertPanel: React.FC<AlertPanelProps> = ({
  children,
  icon,
  title,
  tone = 'error',
  id,
  className,
}) => {
  return (
    <div id={id} className={cn(alertPanelStyles({ tone }), className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <span className={`material-symbols-outlined ${iconColorMap[tone!]}`}>{icon}</span>
        )}
        <div>
          {title && (
            <div className="font-semibold text-body-md font-body-md text-primary">{title}</div>
          )}
          <div className="text-body-sm font-body-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;
