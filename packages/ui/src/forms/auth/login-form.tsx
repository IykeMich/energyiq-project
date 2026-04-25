import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/use-auth';
import { loginSchema, type LoginFormData } from '../../validation/auth/login';
import { InputField, PasswordField } from '../../fields';
import { FormError } from '../../components/feedback/form-error';
import { Button } from '../../primitives/button';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login({ email: data.email, password: data.password });
    if (success) navigate('/dashboard');
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormError message={error} />

      <InputField control={form.control} name="email" label="Email" type="email" placeholder="you@company.com" />
      <PasswordField control={form.control} name="password" label="Password" />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}
