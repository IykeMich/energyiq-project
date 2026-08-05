import { ArrowLeft } from 'lucide-react';

interface ProductAddHeaderProps {
  currentStep: number;
  totalSteps: number;
  subtitle: string;
  onBack: () => void;
  onSaveDraft: () => void;
}

/** Page header for the "Add New Product" flow: back button, title, step subtitle, progress bar, save-as-draft. */
export function ProductAddHeader({ currentStep, totalSteps, subtitle, onBack, onSaveDraft }: ProductAddHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to products"
            className="tap-effect flex h-7 w-7 items-center justify-center rounded-full bg-brand/70 text-[#121212] transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Add New Product</h1>
        </div>
        <button
          type="button"
          onClick={onSaveDraft}
          className="tap-effect h-11.25 shrink-0 rounded-[34px] border border-brand px-6 text-base font-semibold text-brand hover:bg-brand/10"
        >
          Save as Draft
        </button>
      </div>

      <p className="pl-9 text-base text-foreground/80">{subtitle}</p>

      <div className="h-1 w-full rounded-full bg-[#616161B2]">
        <div className="h-1 rounded-full bg-brand transition-[width]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
