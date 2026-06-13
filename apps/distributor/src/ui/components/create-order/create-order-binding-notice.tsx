import { cn } from '@energyiq/shared';

interface CreateOrderBindingNoticeProps {
  /**
   * 'inline' renders just the text (used inside the summary card for the create
   * flow); 'card' wraps it in a standalone gold-tinted panel (edit flow).
   */
  variant?: 'inline' | 'card';
  className?: string;
}

/** "Orders are binding once submitted…" cancellation notice. */
export function CreateOrderBindingNotice({ variant = 'inline', className }: CreateOrderBindingNoticeProps) {
  return (
    <p
      className={cn(
        'text-xs leading-relaxed text-[#FFFFFFCC]',
        variant === 'card' && 'rounded-[18px] bg-[#FBC02D14] p-6 text-[#FBC02DCC]',
        className,
      )}
    >
      Orders are binding once submitted. You may cancel within{' '}
      <span className="font-semibold">2 hours</span> before the supplier begins processing.
    </p>
  );
}
