import { type InputHTMLAttributes } from 'react';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import Input from './Input';

interface FormFieldProps<TFieldValues extends FieldValues> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: string;
  hint?: string;
}

export const FormField = <TFieldValues extends FieldValues>({
  label,
  name,
  register,
  error,
  hint,
  className = '',
  ...props
}: FormFieldProps<TFieldValues>) => {
  return (
    <Input
      label={label}
      error={error}
      hint={hint}
      wrapperClassName="mb-0"
      className={className}
      {...register(name)}
      {...props}
    />
  );
};
