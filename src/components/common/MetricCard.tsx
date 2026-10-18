import React from 'react';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  unit?: React.ReactNode;
  icon: string;
  iconClassName?: string;
  className?: string;
  footer?: React.ReactNode;
  decorative?: React.ReactNode;
  children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon,
  iconClassName = 'bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed',
  className,
  footer,
  decorative,
  children,
}) => {
  return (
    <div className={cn('bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-sm hover:border-outline transition-all flex flex-col justify-between relative overflow-hidden group', className)}>
      {decorative && <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-low rounded-bl-full pointer-events-none opacity-50 group-hover:scale-110 transition-transform" />}
      <div className="flex items-center justify-between relative z-10">
        <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg', iconClassName)}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <div className="my-unit-md relative z-10">
        <div className="flex items-baseline gap-unit-xs">
          <span className="text-stat-metric-lg font-stat-metric-lg text-on-surface tracking-tight">{value}</span>
          {unit && <span className="text-body-md font-label-mono-sm text-on-surface-variant font-medium">{unit}</span>}
        </div>
      </div>
      {footer && (
        <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant relative z-10">
          {footer}
        </div>
      )}
      {children}
    </div>
  );
};

export default MetricCard;
