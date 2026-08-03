import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout, useAuth } from '@energyiq/ui';
import { DistributorOnboardingInviteCard } from '@/ui/components/distributor-onboarding/distributor-onboarding-invite-card';
import type { DistributorOnboardingInviteStatus } from '@/ui/components/distributor-onboarding/distributor-onboarding-invite-card';

export function OnboardingInvitePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { invitation, isLoading, error, verifyInvitation } = useAuth();

  useEffect(() => {
    if (token) verifyInvitation(token);
  }, [token, verifyInvitation]);

  const status: DistributorOnboardingInviteStatus = !token
    ? 'invalid'
    : error
      ? 'invalid'
      : isLoading || !invitation
        ? 'loading'
        : 'valid';

  const handleGetStarted = () => {
    navigate(`/register/distributor?token=${encodeURIComponent(token)}`);
  };

  return (
    <AuthLayout>
      <DistributorOnboardingInviteCard
        status={status}
        supplierName={invitation?.supplier_name}
        onGetStarted={handleGetStarted}
      />
    </AuthLayout>
  );
}
