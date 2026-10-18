import React from 'react';
import { Link } from 'react-router-dom';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const brandMarkStyles = cva(
  'rounded-lg bg-primary text-on-primary flex items-center justify-center font-mono font-bold shadow-sm transition-transform group-hover:scale-105',
  {
    variants: {
      compact: {
        true: 'w-5 h-5 text-[10px]',
        false: 'w-8 h-8 text-[18px]',
      },
    },
    defaultVariants: { compact: false },
  },
);

const brandVersionStyles = 'hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] tracking-wide border border-slate-200';

interface BrandProps {
  compact?: boolean;
  showVersion?: boolean;
  className?: string;
  linkTo?: string;
}

const Brand: React.FC<BrandProps> = ({
  compact = false,
  showVersion = true,
  className,
  linkTo = '/',
}) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Link to={linkTo} className="flex items-center gap-2 group text-primary">
        <div className={brandMarkStyles({ compact })}>
          <span className="material-symbols-outlined">keyboard</span>
        </div>
        {!compact && (
          <span className="font-headline font-bold text-xl tracking-tight text-primary">fasType</span>
        )}
      </Link>
      {showVersion && (
        <span className={brandVersionStyles}>
          v2.4
        </span>
      )}
    </div>
  );
};

export default Brand;
