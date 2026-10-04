import React, { type ButtonHTMLAttributes } from 'react';
import { LoaderCircle } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 text-sm font-semibold leading-5 transition-[background-color,border-color,color,box-shadow,opacity] duration-[var(--motion-normal)] ease-[var(--motion-easing)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed';
  const radiusStyles = 'rounded-control';
  
  const variants = {
    primary: 'bg-primary text-white border border-transparent enabled:hover:bg-primary-hover enabled:active:bg-primary',
    secondary: 'bg-card text-primary border border-border enabled:hover:bg-surface-container enabled:active:bg-surface-container-high',
    accent: 'bg-accent text-white border border-transparent enabled:hover:bg-accent-hover enabled:active:bg-accent',
    ghost: 'bg-transparent text-primary border border-transparent enabled:hover:bg-surface-container enabled:active:bg-surface-container-high',
    danger: 'bg-error text-white border border-transparent enabled:hover:bg-error-hover enabled:active:bg-error'
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const paddingStyles = size === 'lg'
    ? 'min-h-[var(--control-height-lg)] px-6 py-3'
    : 'min-h-[var(--control-height)] px-4 py-2';

  return (
    <button
      className={`${baseStyles} ${radiusStyles} ${paddingStyles} ${variants[variant]} ${widthStyles} ${className}`}
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || props['aria-busy'] || undefined}
    >
      {loading && <LoaderCircle aria-hidden="true" className="h-4 w-4 shrink-0 ds-spinner" />}
      {children}
    </button>
  );
};

export default Button;
