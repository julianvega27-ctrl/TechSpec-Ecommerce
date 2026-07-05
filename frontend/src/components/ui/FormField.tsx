import { type InputHTMLAttributes } from 'react';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<TFieldValues extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: string;
}

export const FormField = <TFieldValues extends FieldValues>({
  label,
  name,
  register,
  error,
  className = '',
  ...props
}: FormFieldProps<TFieldValues>) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-[var(--color-obsidian-light)]">
        {label}
      </label>
      <input
        {...register(name)}
        className={`w-full rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-obsidian)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
};
