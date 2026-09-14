import React from 'react';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  fullWidth?: boolean;
}

const PageShell: React.FC<PageShellProps> = ({
  children,
  className = '',
  as: Tag = 'div',
  fullWidth = false,
}) => {
  return (
    <Tag className={`max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop ${fullWidth ? '' : ''} ${className}`}>
      {children}
    </Tag>
  );
};

export default PageShell;
