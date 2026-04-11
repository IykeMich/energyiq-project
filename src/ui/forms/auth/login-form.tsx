import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/ui/hooks/use-auth';
import { loginSchema, type LoginFormData } from '@/ui/validation/auth/login';
import { EmailField, PasswordField } from '@/ui/fields';
import { FormError } from '@/ui/components/feedback/form-error';
import { SubmitButton } from '@/ui/components/common/submit-button';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login({ email: data.email, password: data.password });
    if (success) navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormError message={error} />

      <EmailField
        label="Email"
        registration={register('email')}
        error={errors.email?.message}
        placeholder="you@company.com"
      />

      <PasswordField
        label="Password"
        registration={register('password')}
        error={errors.password?.message}
      />

      <SubmitButton isLoading={isLoading} label="Sign In" loadingLabel="Signing in..." />
    </form>
  );
}
