import { AuthLayout, LoginForm } from '@energyiq/ui';

export function LoginPage() {
  return (
    <AuthLayout
      title="Log In to EnergyIQ"
      subtitle="Use your corporate email and password to access the platform."
    >
      <LoginForm />
    </AuthLayout>
  );
}
