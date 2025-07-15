
import React from 'react';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'opaque';
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', ...props }) => {
  const baseClasses = 'border rounded-4xl shadow-sm transition-all duration-300';
  
  const colorClasses = 'border-slate-300';

  const variantClasses = {
    default: 'bg-white/70 backdrop-blur-md',
    opaque: 'bg-white',
  };

  return (
    <div
      className={cn(
        baseClasses,
        colorClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
