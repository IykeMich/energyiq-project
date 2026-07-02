import { ArrowRight } from 'lucide-react';

interface SettingsEmptyProfileProps {
  onFillProfile: () => void;
}

export function SettingsEmptyProfile({ onFillProfile }: SettingsEmptyProfileProps) {
  return (
    <div className="bg-[#6161611A] rounded-[18px] p-8 min-h-[360px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-white mb-2">
          Complete your company profile
        </h3>
        <p className="text-sm text-[#FFFFFFCC] mb-6 leading-relaxed">
          Add your business details, registration number, and contact info to unlock full
          platform features and appear in supplier searches.
        </p>
        <button
          type="button"
          onClick={onFillProfile}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FBC02D] hover:underline"
        >
          Fill in Profile
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
