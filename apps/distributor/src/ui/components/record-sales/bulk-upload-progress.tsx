import { useEffect, useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';

interface BulkUploadProgressProps {
  fileName: string;
  onNext: () => void;
  onClose: () => void;
}

export function BulkUploadProgress({
  fileName,
  onNext,
  onClose,
}: BulkUploadProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }

        return prev + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onNext();
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [progress, onNext]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 border-b border-[#232323] pb-4">
        <button onClick={onClose}>
          <ArrowLeft className="h-5 w-5 text-[#FBC02D]" />
        </button>

        <div>
          <h3 className="text-lg font-semibold">Validating Upload</h3>
          <p className="text-xs text-[#8F8F8F]">
            Processing uploaded records
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-[#232323] bg-[#121212] p-5">
        <div className="flex items-center gap-2 text-sm">
          <Info size={16} className="text-[#FBC02D]" />
          {fileName}
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#2B2B2B]">
          <div
            className="h-full bg-[#FBC02D] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 text-xs text-[#8F8F8F]">
          {progress}% Complete
        </div>
      </div>
    </div>
  );
}