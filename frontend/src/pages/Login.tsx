import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { loginSchema, type LoginFormValues } from '../validations/auth.schema';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      const response = await axios.post('/auth/login', data);
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError('');
      const response = await axios.post('/auth/google', { idToken: credentialResponse.credential });
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-surface)]">
      <div className="max-w-md w-full space-y-8 bg-white p-10 border border-[var(--color-outline-subtle)] rounded-[var(--radius-soft)]">
        <div>
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-[var(--color-obsidian)]">
            INICIAR SESIÓN
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-obsidian-light)]">
            o <Link to="/register" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">crear cuenta</Link>
          </p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm text-center">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="CORREO ELECTRÓNICO"
              type="email"
              placeholder="usuario@empresa.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="CONTRASEÑA"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* <div className="flex items-center">
              <input id="rememberMe" type="checkbox" className="h-4 w-4 accent-[var(--color-primary)] rounded-[var(--radius-badge)] border-[var(--color-outline-subtle)]" {...register('rememberMe')} />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-[var(--color-obsidian-light)]">
                Mantener sesión
              </label>
            </div> */}

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">
                ¿Olvidó su contraseña?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" fullWidth className="h-12" disabled={isSubmitting}>
              {isSubmitting ? 'AUTENTICANDO...' : 'INGRESAR'}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-outline-subtle)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[var(--color-obsidian-light)] label-caps">O</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Error al iniciar sesión con Google')}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
