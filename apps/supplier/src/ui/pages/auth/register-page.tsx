import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout, RegisterForm } from '@energyiq/ui';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Create your Account" onBack={() => navigate('/login')}>
      <RegisterForm />

      <p className="text-center text-sm text-[#FAFAFACC] mt-6">
        Have an account?{' '}
        <Link to="/login" className="text-[#FBC02D] font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
