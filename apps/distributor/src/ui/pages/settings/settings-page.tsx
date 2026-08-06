import { ComingSoon, useAuth } from '@energyiq/ui';

export function SettingsPage() {
  const { user, slug: stateSlug } = useAuth();
  const slug = user?.slug ?? stateSlug ?? 'demo';

  return <ComingSoon title="Settings" backHref={`/${slug}/dashboard`} />;
}
