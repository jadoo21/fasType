import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const cardStyles = cva(
  ['bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-level-1'],
  {
    variants: {
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      variant: {
        default: '',
        interactive: 'hover:shadow-md transition-shadow duration-200',
      },
    },
    defaultVariants: { padding: 'md', variant: 'default' },
  },
);

type CardStyleProps = VariantProps<typeof cardStyles>;

interface CardProps extends CardStyleProps {
  children: React.ReactNode;
  className?: string;
  tag?: React.ElementType;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  variant = 'default',
  tag: Tag = 'div',
}) => {
  return (
    <Tag className={cn(cardStyles({ padding, variant }), className)}>
      {children}
    </Tag>
  );
};

export default Card;
