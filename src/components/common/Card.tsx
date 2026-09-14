import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  variant?: 'default' | 'interactive';
  tag?: React.ElementType;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  tag: Tag = 'div',
}) => {
  const baseStyles = 'bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-level-1';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variants = {
    default: '',
    interactive: 'hover:shadow-md transition-shadow duration-200',
  };

  return (
    <Tag className={`${baseStyles} ${paddings[padding]} ${variants[variant]} ${className}`}>
      {children}
    </Tag>
  );
};

export default Card;
