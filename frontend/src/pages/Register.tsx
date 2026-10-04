import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { registerSchema, type RegisterFormValues } from '../validations/auth.schema';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthPanel, { AuthDivider } from '../components/ui/AuthPanel';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      const response = await axios.post('/auth/register', data);
      const { token, user } = response.data.data;
      login(token, user); navigate('/profile');
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.response?.data?.message || 'Error al registrarse' : 'Error al registrarse');
    }
  };
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setGoogleSubmitting(true);
    try {
      setError('');
      const response = await axios.post('/auth/google', { idToken: credentialResponse.credential });
      const { token, user } = response.data.data;
      login(token, user); navigate('/profile');
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.response?.data?.message || 'Error al registrarse con Google' : 'Error al registrarse con Google');
    } finally { setGoogleSubmitting(false); }
  };
  const busy = isSubmitting || googleSubmitting;
  return <AuthPanel title="Crear cuenta" description={<>¿Ya tienes una cuenta? <Link to="/login" className="font-medium text-accent hover:underline underline-offset-4">Inicia sesión</Link>.</>} error={error}>
    <form aria-label="Crear cuenta" className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Nombre completo" type="text" placeholder="Tu nombre" autoComplete="name" wrapperClassName="" error={errors.name?.message} {...register('name')} />
      <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" autoComplete="email" wrapperClassName="" error={errors.email?.message} {...register('email')} />
      <Input label="Contraseña" type="password" placeholder="Crea tu contraseña" autoComplete="new-password" hint="Al menos 6 caracteres." wrapperClassName="" error={errors.password?.message} {...register('password')} />
      <Input label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" autoComplete="new-password" wrapperClassName="" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <Button type="submit" fullWidth size="lg" loading={busy}>{busy ? 'Creando cuenta…' : 'Crear cuenta'}</Button>
    </form>
    <AuthDivider />
    <div className="flex justify-center" inert={busy || undefined}><GoogleLogin width="220" onSuccess={handleGoogleSuccess} onError={() => setError('Error al registrarse con Google')} /></div>
  </AuthPanel>;
}
