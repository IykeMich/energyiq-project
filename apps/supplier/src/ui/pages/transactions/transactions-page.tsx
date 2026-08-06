import { ComingSoon, useAuth } from '@energyiq/ui';

export function TransactionsPage() {
  const { user, slug: stateSlug } = useAuth();
  const slug = user?.slug ?? stateSlug ?? 'demo';

  return <ComingSoon title="Transactions" backHref={`/${slug}/dashboard`} />;
}
