import type { ReactNode } from 'react';
import { CheckCircle2, type LucideIcon } from 'lucide-react';
import { Modal } from './modal';

export interface SuccessModalDetail {
  label: string;
  value: string;
}

export interface SuccessModalAction {
  label: string;
  onClick: () => void;
}

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: ReactNode;
  /** A single highlighted label/value (e.g. "Order Reference: PO-XXXX"). */
  highlight?: { label: string; value: string };
  /** Multiple label/value rows in a card (e.g. dip details). */
  details?: SuccessModalDetail[];
  /** Optional heading shown above the details rows (e.g. "Audit Summary"). */
  detailsTitle?: string;
  /** Muted note shown below the highlight/details (e.g. an SLA reminder). */
  footerNote?: ReactNode;
  primaryAction?: SuccessModalAction;
  secondaryAction?: SuccessModalAction;
  /** 'row' (side by side) or 'stack' (full-width, stacked). Defaults to 'row'. */
  buttonLayout?: 'row' | 'stack';
  /** Badge colour: 'success' (green, default), 'brand' (gold), or 'danger' (red). */
  tone?: 'success' | 'brand' | 'danger';
  /** Badge icon; defaults to a check mark. Pass e.g. `X` for a rejection. */
  icon?: LucideIcon;
}

/** Concentric badge ring + icon classes per tone. */
const TONE_CLASSES: Record<NonNullable<SuccessModalProps['tone']>, {
  outer: string;
  middle: string;
  inner: string;
  icon: string;
}> = {
  success: {
    outer: 'bg-success/20',
    middle: 'bg-success/40',
    inner: 'bg-success',
    icon: 'text-success-foreground',
  },
  brand: {
    outer: 'bg-brand/20',
    middle: 'bg-brand/40',
    inner: 'bg-brand',
    icon: 'text-brand-foreground',
  },
  danger: {
    outer: 'bg-danger/20',
    middle: 'bg-danger/40',
    inner: 'bg-danger',
    icon: 'text-danger-foreground',
  },
};

export function SuccessModal({
  open,
  onOpenChange,
  title,
  subtitle,
  highlight,
  details,
  detailsTitle,
  footerNote,
  primaryAction,
  secondaryAction,
  buttonLayout = 'row',
  tone = 'success',
  icon: Icon = CheckCircle2,
}: SuccessModalProps) {
  const badge = TONE_CLASSES[tone];

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm" showClose={false}>
      <div className="flex flex-col items-center gap-2 -mt-4">
        <div className={`w-[68px] h-[68px] rounded-full ${badge.outer} flex items-center justify-center`}>
          <div className={`w-[55px] h-[55px] rounded-full ${badge.middle} flex items-center justify-center`}>
            <div className={`w-[44px] h-[44px] rounded-full ${badge.inner} flex items-center justify-center`}>
              <Icon className={`w-7 h-7 ${badge.icon}`} />
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-foreground mt-2 text-center">{title}</h2>
        <p className="text-sm text-foreground text-center max-w-[440px]">{subtitle}</p>
      </div>

      {highlight && (
        <div className="mt-6 bg-surface-card border border-border-subtle rounded-[16px] p-6 flex flex-col items-center gap-1">
          <p className="text-sm text-foreground">{highlight.label}</p>
          <p className="text-2xl font-bold text-brand">{highlight.value}</p>
        </div>
      )}

      {details && details.length > 0 && (
        <div className="mt-6 bg-surface-card border border-border-subtle rounded-[16px] p-6">
          {detailsTitle && (
            <p className="mb-3 text-sm font-semibold text-foreground">{detailsTitle}</p>
          )}
          <dl className="flex flex-col gap-2.5 text-sm text-foreground">
            {details.map((d) => (
              <div key={d.label} className="flex items-center justify-between">
                <dt>{d.label}</dt>
                <dd className="font-semibold">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {footerNote && (
        <p className="mt-4 text-center text-sm text-foreground/70">{footerNote}</p>
      )}

      {(primaryAction || secondaryAction) && (
        <div
          className={
            buttonLayout === 'stack'
              ? 'flex flex-col gap-3 mt-6'
              : 'grid grid-cols-2 gap-3 mt-6'
          }
        >
          {primaryAction && (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold"
            >
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className={
                buttonLayout === 'stack'
                  ? 'h-[53px] rounded-[28px] bg-foreground/10 text-foreground font-semibold'
                  : 'h-[53px] rounded-[28px] border border-border-strong text-foreground font-semibold'
              }
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
