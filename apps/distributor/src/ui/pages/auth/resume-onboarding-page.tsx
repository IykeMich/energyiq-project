import { useEffect, useState } from "react";
import { AuthLayout, DistributorForm, useAuth } from "@energyiq/ui";
import type { DistributorOnboardingSummary } from "@energyiq/domain/auth";

export function ResumeOnboardingPage() {
  const { getDistributorOnboarding } = useAuth();
  const [summary, setSummary] = useState<DistributorOnboardingSummary | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDistributorOnboarding().then((result) => {
      setSummary(result);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <AuthLayout>
        <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
          Loading your onboarding progress…
        </div>
      </AuthLayout>
    );
  }

  const initialStep =
    summary?.distributor?.status === "pending_review"
      ? 5
      : summary?.distributor?.tax_id
        ? 4
        : 3;

  return (
    <AuthLayout>
      <DistributorForm
        mode="resume"
        initialStep={initialStep}
        resumeSummary={summary ?? undefined}
      />
    </AuthLayout>
  );
}
