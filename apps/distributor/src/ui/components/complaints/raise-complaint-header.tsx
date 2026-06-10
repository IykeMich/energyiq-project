import { ComplaintCloseButton } from './complaint-close-button';

interface RaiseComplaintHeaderProps {
  onClose: () => void;
}

/** Title + subtitle + gold close, shown at the top of every wizard step. */
export function RaiseComplaintHeader({ onClose }: RaiseComplaintHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-5 w-1 rounded-full bg-[#FBC02D]" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-[#FAFAFA]">Raise a Complaint</h2>
          <p className="text-sm text-[#FFFFFFCC]">Document an issue with your delivery or product</p>
        </div>
      </div>
      <ComplaintCloseButton onClick={onClose} />
    </div>
  );
}
