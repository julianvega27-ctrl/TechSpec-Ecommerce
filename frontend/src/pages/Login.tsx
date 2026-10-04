import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginFormValues } from '../validations/auth.schema';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthPanel, { AuthDivider } from '../components/ui/AuthPanel';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      const response = await axios.post('/auth/login', data);
      const { token, user } = response.data.data;
      login(token, user); navigate('/profile');
    } catch (error) {
      setError(axios.isAxiosError(error) ? error.response?.data?.message || 'Error al iniciar sesión' : 'Error al iniciar sesión');
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
      setError(axios.isAxiosError(error) ? error.response?.data?.message || 'Error al iniciar sesión con Google' : 'Error al iniciar sesión con Google');
    } finally { setGoogleSubmitting(false); }
  };
  const busy = isSubmitting || googleSubmitting;
  return <AuthPanel title="Iniciar sesión" description={<>Accede a tu cuenta o <Link to="/register" className="font-medium text-accent hover:underline underline-offset-4">crea una cuenta</Link>.</>} error={error}>
    <form aria-label="Iniciar sesión" className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" autoComplete="username" wrapperClassName="" error={errors.email?.message} {...register('email')} />
      <Input label="Contraseña" type="password" placeholder="Tu contraseña" autoComplete="current-password" wrapperClassName="" error={errors.password?.message} {...register('password')} />
      <div className="text-right"><Link to="/forgot-password" className="inline-flex items-center min-h-11 text-sm font-medium text-accent hover:underline underline-offset-4">¿Olvidaste tu contraseña?</Link></div>
      <Button type="submit" fullWidth size="lg" loading={busy}>{busy ? 'Iniciando sesión…' : 'Iniciar sesión'}</Button>
    </form>
    <AuthDivider />
    <div className="flex justify-center" inert={busy || undefined}><GoogleLogin width="220" onSuccess={handleGoogleSuccess} onError={() => setError('Error al iniciar sesión con Google')} /></div>
  </AuthPanel>;
}
