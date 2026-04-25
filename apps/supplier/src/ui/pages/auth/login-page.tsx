import { Link } from 'react-router-dom';
import { LoginForm } from '@energyiq/ui';

export function LoginPage() {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h2>
      <p className="text-sm text-muted-foreground mb-8">Sign in to your EnergyIQ account</p>

      <LoginForm />

      <div className="flex justify-between text-sm mt-6">
        <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
          Forgot password?
        </Link>
        <Link to="/register" className="text-primary font-medium hover:underline">
          Create account
        </Link>
      </div>
    </>
  );
}
