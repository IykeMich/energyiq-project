import { Loader2 } from "lucide-react";
import { DistributorOnboardingStepList } from "./distributor-onboarding-step-list";

const ONBOARDING_STEPS = [
  "Create your account",
  "Verify your email",
  "Business Information",
  "Document Verification",
  "Submitted for review",
];

export type DistributorOnboardingInviteStatus = "loading" | "invalid" | "valid";

interface DistributorOnboardingInviteCardProps {
  status: DistributorOnboardingInviteStatus;
  supplierName?: string;
  onGetStarted: () => void;
}

export function DistributorOnboardingInviteCard({
  status,
  supplierName,
  onGetStarted,
}: DistributorOnboardingInviteCardProps) {
  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-[#FFFFFF1A] bg-[#161616] overflow-hidden">
      <div className="h-28 bg-[#FBC02D]" />

      <div className="px-8 py-8 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="w-6 h-6 text-[#FBC02D] animate-spin" />
            <p className="text-sm text-gray-400">Verifying your invite…</p>
          </div>
        )}

        {status === "invalid" && (
          <div className="py-6 space-y-2">
            <h1 className="font-semibold text-xl text-white">
              Invite link invalid
            </h1>
            <p className="text-sm text-gray-400">
              This invitation link is invalid or has expired. Please contact
              your supplier for a new invite.
            </p>
          </div>
        )}

        {status === "valid" && (
          <>
            <h1 className="font-semibold text-xl text-white">
              Join <span className="text-[#FBC02D]">{supplierName}</span> on
              Energy IQ
            </h1>
            <p className="text-sm text-gray-400 mt-2 mb-8">
              You&apos;ve been invited to become a certified distributor
            </p>

            <DistributorOnboardingStepList
              steps={ONBOARDING_STEPS}
              currentStep={1}
            />

            <button
              type="button"
              onClick={onGetStarted}
              className="tap-effect w-full mt-10 h-12 rounded-full bg-[#FBC02D] text-black font-semibold hover:bg-[#FBC02D]/90"
            >
              Get Started
            </button>

            <p className="text-xs text-gray-500 mt-4">
              I didn&apos;t expect this invite?
            </p>
          </>
        )}
      </div>
    </div>
  );
}
