import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/use-auth';
import { registerSchema, type RegisterFormData } from '../../validation/auth/register';
import { InputField, PasswordField } from '../../fields';
import { FormError } from '../../components/feedback/form-error';
import { Button } from '../../primitives/button';

export function RegisterForm() {
  const navigate = useNavigate();
  const { initiate, isLoading, error, clearError } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company_name: '',
      company_email: '',
      business_type: '',
      registration_number: '',
      account_name: '',
      account_email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const success = await initiate({
      company: {
        name: data.company_name,
        email: data.company_email || undefined,
        business_type: data.business_type,
        registration_number: data.registration_number,
      },
      account: {
        name: data.account_name,
        email: data.account_email,
        password: data.password,
      },
    });

    if (success) navigate('/verify');
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormError message={error} />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold mb-2">Company Information</legend>

        <InputField control={form.control} name="company_name" label="Company Name" placeholder="MegaEnergy Ltd" />
        <InputField control={form.control} name="company_email" label="Company Email" type="email" placeholder="info@megaenergy.com" optional />

        <div className="grid grid-cols-2 gap-4">
          <InputField control={form.control} name="business_type" label="Business Type" placeholder="LPG Distribution" />
          <InputField control={form.control} name="registration_number" label="Registration No." placeholder="RC123456" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold mb-2">Account Owner</legend>

        <InputField control={form.control} name="account_name" label="Your Name" placeholder="Chioma Okonkwo" />
        <InputField control={form.control} name="account_email" label="Email" type="email" placeholder="chioma@megaenergy.com" />
        <PasswordField control={form.control} name="password" label="Password" placeholder="Min 12 characters" />
      </fieldset>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  );
}
