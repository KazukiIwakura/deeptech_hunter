
import React from 'react';

const cn = (...classes: (string | undefined | null | false | 0)[]) => classes.filter(Boolean).join(' ');

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'discovery' | 'success' | 'danger';
type ButtonSize = 'large' | 'medium' | 'small' | 'x-small';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  inverted?: boolean;
  isIconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  fullWidth,
  inverted,
  isIconOnly,
  ...props
}) => {
  const needsTargetEnhancement = size === 'small' || size === 'x-small';

  const buttonClasses = cn(
    'btn',
    inverted ? `btn-${variant}-inverted` : `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'w-full',
    isIconOnly && 'btn-icon-only',
    needsTargetEnhancement && 'btn-target-enhance',
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};
