import React from 'react';
import { cn } from '../../utils/cn';

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badgeText?: React.ReactNode;
  badgeDot?: boolean;
  align?: 'left' | 'center';
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badgeText,
  badgeDot = true,
  align = 'center',
  className,
  children,
}: PageHeaderProps) {
  const alignmentClass = align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left';

  return (
    <div className={cn('max-w-3xl flex flex-col', alignmentClass, className)}>
      {badgeText && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-3 py-1 text-label-mono-sm font-label-mono-sm text-on-surface-variant shadow-sm">
          {badgeDot && <span className="inline-block h-2 w-2 rounded-full bg-secondary animate-pulse" />}
          <span className="tracking-wider uppercase">{badgeText}</span>
        </div>
      )}

      <h1 className="mb-3 text-headline-lg font-headline font-bold tracking-tight text-primary sm:text-display-hero-mobile md:text-display-hero">
        {title}
      </h1>

      {subtitle && (
        <p className="max-w-2xl text-body-md font-body text-on-surface-variant leading-relaxed sm:text-body-lg">
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}

export default PageHeader;
