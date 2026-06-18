import { CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function DocumentSubmittedModal({
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[520px] rounded-[32px] bg-[#080808] p-10 text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4B400]/20">
          <CheckCircle2 className="text-[#F4B400]" />
        </div>

        <h2 className="text-3xl text-white">
          Document submitted
        </h2>

        <p className="mt-4 text-sm text-gray-400">
          Your document has been received and is
          now pending review.
        </p>

        <div className="mt-8 rounded-2xl bg-[#121212] p-6 text-left">
          <p className="mb-4 text-white">
            Submission Details
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Status
              </span>

              <span className="text-white">
                Pending Review
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Expected Review
              </span>

              <span className="text-white">
                Within 24 hours
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            className="flex-1 rounded-full border border-[#F4B400] py-3 text-[#F4B400]"
          >
            Upload Another
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-[#F4B400] py-3 text-black"
          >
            Back to documents
          </button>
        </div>
      </div>
    </div>
  );
}