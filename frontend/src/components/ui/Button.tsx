import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';
  const radiusStyles = 'rounded-[var(--radius-soft)]';
  
  const variants = {
    primary: 'bg-[var(--color-obsidian)] text-white hover:shadow-[0_0_8px_var(--color-primary-container)] hover:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] border border-transparent',
    secondary: 'bg-transparent text-[var(--color-obsidian)] border border-[var(--color-outline-subtle)] hover:border-[var(--color-obsidian)] focus:ring-2 focus:ring-[var(--color-primary)]'
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const paddingStyles = 'px-4 py-2';

  return (
    <button
      className={`${baseStyles} ${radiusStyles} ${paddingStyles} ${variants[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
