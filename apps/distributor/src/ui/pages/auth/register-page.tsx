import { Link } from 'react-router-dom';
import { RegisterForm } from '@energyiq/ui';

export function RegisterPage() {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Create your account</h2>
      <p className="text-sm text-muted-foreground mb-8">Set up your organization on EnergyIQ</p>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </>
  );
}
