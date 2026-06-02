import { Link } from 'react-router-dom';
import { AuthLayout, RegisterForm } from '@energyiq/ui';

export function RegisterPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Set up your organization on EnergyIQ">
      <RegisterForm />

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FBC02D] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
