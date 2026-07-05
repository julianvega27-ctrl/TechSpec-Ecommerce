import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { passwordRecoverySchema, type PasswordRecoveryFormValues } from '../validations/auth.schema';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const PasswordRecovery: React.FC = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordRecoveryFormValues>({
    resolver: zodResolver(passwordRecoverySchema)
  });

  const onSubmit = async (data: PasswordRecoveryFormValues) => {
    try {
      setError('');
      setSuccess('');
      const response = await axios.post('/auth/recover-password', data);
      setSuccess(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[var(--color-obsidian)]">
            RECUPERAR ACCESO
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-obsidian-light)]">
            Se enviarán instrucciones a su correo electrónico
          </p>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">{error}</div>}
        
        {!success ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <Input 
                label="CORREO ELECTRÓNICO" 
                type="email" 
                placeholder="usuario@empresa.com" 
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div>
              <Button type="submit" fullWidth className="h-12" disabled={isSubmitting}>
                {isSubmitting ? 'PROCESANDO...' : 'ENVIAR INSTRUCCIONES'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-8 bg-[var(--color-surface-container)] p-6 rounded-[var(--radius-soft)] border border-[var(--color-outline-subtle)] text-center">
            <h3 className="text-lg font-medium text-[var(--color-obsidian)] mb-2">Instrucciones Enviadas</h3>
            <p className="text-sm text-[var(--color-obsidian-light)] mb-4">
              {success}
            </p>
            <Button variant="secondary" onClick={() => setSuccess('')}>
              INTENTAR NUEVAMENTE
            </Button>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] label-caps">
            VOLVER AL LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
