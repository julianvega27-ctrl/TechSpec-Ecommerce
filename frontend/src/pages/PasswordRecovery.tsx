import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { passwordRecoverySchema, type PasswordRecoveryFormValues } from '../validations/auth.schema';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthPanel from '../components/ui/AuthPanel';
import { Notice } from '../components/ui/Interior';
import { actionLinkClass } from '../utils/storefront';

export default function PasswordRecovery() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordRecoveryFormValues>({ resolver: zodResolver(passwordRecoverySchema) });
  const onSubmit = async (data: PasswordRecoveryFormValues) => {
    try {
      setError(''); setSuccess('');
      const response = await axios.post('/auth/recover-password', data);
      setSuccess(response.data.message);
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.response?.data?.message || 'Error al procesar la solicitud' : 'Error al procesar la solicitud');
    }
  };
  return <AuthPanel title="Recuperar contraseña" description="Se enviarán instrucciones a tu correo electrónico." error={error}>
    {!success ? <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Correo electrónico" type="email" autoComplete="email" placeholder="tu@correo.com" wrapperClassName="" error={errors.email?.message} {...register('email')} />
      <Button type="submit" fullWidth size="lg" loading={isSubmitting}>{isSubmitting ? 'Procesando…' : 'Enviar instrucciones'}</Button>
    </form> : <div className="space-y-5"><Notice variant="success">{success}</Notice><Button type="button" variant="secondary" onClick={() => setSuccess('')}>Intentar nuevamente</Button></div>}
    <Link to="/login" className={`${actionLinkClass} w-full mt-6`}>Volver al inicio de sesión</Link>
  </AuthPanel>;
}