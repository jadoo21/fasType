import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'interactive';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
}) => {
  const baseStyles = 'bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-level-1';

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variants = {
    default: '',
    interactive: 'hover:shadow-md transition-shadow duration-200',
  };

  return (
    <div className={`${baseStyles} ${paddings[padding]} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;