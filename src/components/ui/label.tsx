import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={`mb-1 block text-sm font-medium text-slate-700 ${className}`} {...props}>
      {children}
    </label>
  );
}
