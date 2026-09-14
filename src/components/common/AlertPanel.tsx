import React from 'react';

interface AlertPanelProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  tone?: 'success' | 'error' | 'info';
  id?: string;
  className?: string;
}

const AlertPanel: React.FC<AlertPanelProps> = ({
  children,
  icon,
  title,
  tone = 'error',
  id,
  className = '',
}) => {
  const tones = {
    success: 'bg-surface-container border border-secondary rounded-xl text-on-surface',
    error: 'bg-error-container border border-error/30 rounded-xl text-on-error-container',
    info: 'bg-surface-container-low border border-outline-variant rounded-xl text-on-surface',
  };

  const iconColors = {
    success: 'text-secondary',
    error: 'text-error',
    info: 'text-on-surface-variant',
  };

  return (
    <div id={id} className={`p-unit-base ${tones[tone]} ${className}`}>
      <div className="flex items-start gap-3">
        {icon && (
          <span className={`material-symbols-outlined ${iconColors[tone]}`}>{icon}</span>
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
