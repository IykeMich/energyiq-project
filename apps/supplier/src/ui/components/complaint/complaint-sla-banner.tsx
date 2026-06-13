import { Clock } from 'lucide-react';

interface ComplaintSlaBannerProps {
  message: string;
}

/** Amber SLA-deadline banner pinned to the top of the thread. */
export function ComplaintSlaBanner({ message }: ComplaintSlaBannerProps) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#3D2E0A] px-4 py-2.5 text-center text-sm font-semibold text-[#FBC02D]">
      <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </div>
  );
}
