
import React from 'react';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'opaque';
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', ...props }) => {
  const baseClasses = 'card transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-bg-primary',
    opaque: 'bg-bg-primary',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
