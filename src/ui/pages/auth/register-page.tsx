import { Link } from 'react-router-dom';
import { RegisterForm } from '@/ui/forms/auth/register-form';

export function RegisterPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
      <p className="text-gray-500 mb-8">Set up your organization on EnergyIQ</p>

      <RegisterForm />

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#1E3A5F] font-medium hover:underline">Sign in</Link>
      </p>
    </>
  );
}
