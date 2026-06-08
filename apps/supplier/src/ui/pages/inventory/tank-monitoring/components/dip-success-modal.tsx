import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@energyiq/ui';

export interface DipSuccessDetail {
  label: string;
  value: string;
}

interface DipSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  details: DipSuccessDetail[];
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export function DipSuccessModal({
  open,
  onOpenChange,
  title,
  subtitle,
  details,
  primaryAction,
  secondaryAction,
}: DipSuccessModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm">
      <div className="flex flex-col items-center gap-2 -mt-4">
        <div className="w-[68px] h-[68px] rounded-full bg-[#388E3C33] flex items-center justify-center">
          <div className="w-[55px] h-[55px] rounded-full bg-[#388E3C66] flex items-center justify-center">
            <div className="w-[44px] h-[44px] rounded-full bg-[#388E3C] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-[#FAFAFA] mt-2">{title}</h2>
        <p className="text-sm text-[#FAFAFA] text-center max-w-[440px]">{subtitle}</p>
      </div>

      <div className="mt-6 bg-[#6161611A] border border-[#616161B2] rounded-[16px] p-6">
        <p className="text-sm font-semibold text-[#FAFAFA] mb-4">Dip Details</p>
        <dl className="flex flex-col gap-2.5 text-sm text-[#FAFAFA]">
          {details.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <dt className="text-[#FAFAFA]">{d.label}</dt>
              <dd className="font-semibold">{d.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="grid grid-cols-2 gap-3 mt-6">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="h-[53px] rounded-[28px] border border-[#9E9E9E] text-[#FAFAFA] font-semibold"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className={`h-[53px] rounded-[28px] bg-[#FBC02D] text-[#121212] font-semibold ${
                secondaryAction ? '' : 'col-span-2'
              }`}
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
