import { AuthLayout, ForgotPasswordForm } from '@energyiq/ui';

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your Password"
      subtitle="We'll email you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
