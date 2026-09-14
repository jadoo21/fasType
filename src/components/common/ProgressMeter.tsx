import React from 'react';

interface ProgressMeterProps {
  label: React.ReactNode;
  value: React.ReactNode;
  percent: number;
  indigo?: boolean;
  className?: string;
  barClassName?: string;
}

const ProgressMeter: React.FC<ProgressMeterProps> = ({
  label,
  value,
  percent,
  indigo = false,
  className = '',
  barClassName = '',
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-slate-600">{label}</span>
        <span className={`font-mono font-bold ${indigo ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</span>
      </div>
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${indigo ? 'bg-indigo-600' : 'bg-slate-900'} h-full rounded-full ${barClassName}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressMeter;
