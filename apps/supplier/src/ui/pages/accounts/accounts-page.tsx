import { ComingSoon, useAuth } from '@energyiq/ui';

export function AccountsPage() {
  const { user, slug: stateSlug } = useAuth();
  const slug = user?.slug ?? stateSlug ?? 'demo';

  return <ComingSoon title="Accounts" backHref={`/${slug}/dashboard`} />;
}
