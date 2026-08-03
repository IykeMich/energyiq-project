import { Link, useLocation } from 'react-router-dom';
import { AuthLayout, RegisterForm, DistributorForm, AccountTypeSelect } from '@energyiq/ui';

export function RegisterPage() {
  const { pathname } = useLocation();

  let form;
  if (pathname === '/register/supplier') {
    form = <RegisterForm />;
  } else if (pathname === '/register/distributor') {
    form = <DistributorForm />;
  } else {
    form = <AccountTypeSelect />;
  }

  return (
    <AuthLayout
      title={pathname === '/register' ? 'Create your Account' : 'Create your Account'}
      subtitle={
        pathname === '/register'
          ? 'Choose how you want to get started with EnergyIQ'
          : 'Enter your details to get started with real-time insights'
      }
    >
      {form}

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FBC02D] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
