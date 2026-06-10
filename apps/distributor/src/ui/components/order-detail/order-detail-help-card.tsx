import { Headphones } from 'lucide-react';
import type { OrderDetailData } from './order-detail-mocks';

interface OrderDetailHelpCardProps {
  help: OrderDetailData['help'];
}

/** "Need Help" support card shown under the summary card. */
export function OrderDetailHelpCard({ help }: OrderDetailHelpCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[18px] bg-[#6161611A] p-6">
      <div className="flex items-center gap-2">
        <Headphones className="h-5 w-5 text-brand" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground">Need Help</span>
      </div>
      <p className="text-xs font-normal text-foreground">
        Contact Supplier Support: {help.supportEmail}
      </p>
      <p className="text-xs font-normal text-foreground">Emergency Line: {help.emergencyLine}</p>
    </div>
  );
}
