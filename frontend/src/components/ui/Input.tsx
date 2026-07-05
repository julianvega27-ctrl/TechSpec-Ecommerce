import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const generatedId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <div className={`flex flex-col mb-4 ${widthStyles}`}>
      <label htmlFor={generatedId} className="label-caps mb-2 text-[var(--color-obsidian-light)]">
        {label}
      </label>
      <input
        id={generatedId}
        className={`px-4 py-2 bg-[var(--color-surface-container)] text-[var(--color-obsidian)] border-b-2 rounded-[var(--radius-soft)] transition-colors duration-200 outline-none
          ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)]' : 'border-transparent focus:border-[var(--color-primary)]'} 
          ${className}`}
        {...props}
      />
      {error && (
        <span className="text-[var(--color-error)] text-sm mt-1">{error}</span>
      )}
    </div>
  );
};

export default Input;
