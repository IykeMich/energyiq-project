import { Link } from 'react-router-dom';
import { LoginForm } from '@/ui/forms/auth/login-form';

export function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
      <p className="text-gray-500 mb-8">Sign in to your EnergyIQ account</p>

      <LoginForm />

      <div className="flex justify-between text-sm text-gray-500 mt-6">
        <Link to="/forgot-password" className="text-[#1E3A5F] hover:underline">Forgot password?</Link>
        <Link to="/register" className="text-[#1E3A5F] font-medium hover:underline">Create account</Link>
      </div>
    </>
  );
}
