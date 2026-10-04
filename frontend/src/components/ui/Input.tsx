import React, { useId, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  fullWidth?: boolean;
  hint?: string;
  wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  hint,
  wrapperClassName = 'mb-4',
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}) => {
  const uniqueId = useId();
  const generatedId = id || `input-${uniqueId}`;
  const errorId = `${generatedId}-error`;
  const hintId = `${generatedId}-hint`;
  const descriptionIds = [describedBy, hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <div className={`flex flex-col gap-2 ${widthStyles} ${wrapperClassName}`}>
      <label htmlFor={generatedId} className="ds-label">
        {label}
      </label>
      <input
        id={generatedId}
        className={`ds-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
        {...props}
        aria-invalid={error ? true : invalid}
        aria-describedby={descriptionIds}
      />
      {hint && <span id={hintId} className="text-sm text-text-secondary">{hint}</span>}
      {error && (
        <span id={errorId} className="text-error text-sm" role="alert">{error}</span>
      )}
    </div>
  );
};

export default Input;
