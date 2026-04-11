import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/ui/hooks/use-auth';
import { registerSchema, type RegisterFormData } from '@/ui/validation/auth/register';
import { TextField, EmailField, PasswordField } from '@/ui/fields';
import { FormError } from '@/ui/components/feedback/form-error';
import { SubmitButton } from '@/ui/components/common/submit-button';

export function RegisterForm() {
  const navigate = useNavigate();
  const { initiate, isLoading, error, clearError } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormError message={error} />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-gray-700 mb-2">Company Information</legend>

        <TextField
          label="Company Name"
          registration={register('company_name')}
          error={errors.company_name?.message}
          placeholder="MegaEnergy Ltd"
        />

        <EmailField
          label="Company Email"
          registration={register('company_email')}
          error={errors.company_email?.message}
          placeholder="info@megaenergy.com"
          optional
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Business Type"
            registration={register('business_type')}
            error={errors.business_type?.message}
            placeholder="LPG Distribution"
          />
          <TextField
            label="Registration No."
            registration={register('registration_number')}
            error={errors.registration_number?.message}
            placeholder="RC123456"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-gray-700 mb-2">Account Owner</legend>

        <TextField
          label="Your Name"
          registration={register('account_name')}
          error={errors.account_name?.message}
          placeholder="Chioma Okonkwo"
        />

        <EmailField
          label="Email"
          registration={register('account_email')}
          error={errors.account_email?.message}
          placeholder="chioma@megaenergy.com"
        />

        <PasswordField
          label="Password"
          registration={register('password')}
          error={errors.password?.message}
          placeholder="Min 12 characters"
        />
      </fieldset>

      <SubmitButton isLoading={isLoading} label="Create Account" loadingLabel="Creating account..." />
    </form>
  );
}
