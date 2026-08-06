import { useEffect, useMemo, useState } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { Modal } from '@energyiq/ui';
import type { OrderDetail, OrderLineItem } from './order-detail-mapper';

const NGN = new Intl.NumberFormat('en-NG');

interface ModifyOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: OrderDetail;
  onSave: (lineItems: OrderLineItem[]) => void;
}

interface DraftLineItem extends OrderLineItem {
  quantityInput: string;
  priceInput: string;
}

function toDraft(li: OrderLineItem): DraftLineItem {
  return {
    ...li,
    quantityInput: li.quantityLabel,
    priceInput: String(li.unitPriceNGN),
  };
}

export function ModifyOrderModal({ open, onOpenChange, detail, onSave }: ModifyOrderModalProps) {
  const [drafts, setDrafts] = useState<DraftLineItem[]>(() => detail.lineItems.map(toDraft));

  useEffect(() => {
    if (open) setDrafts(detail.lineItems.map(toDraft));
  }, [open, detail.lineItems]);

  const totals = useMemo(
    () =>
      drafts.map((d) => {
        const qty = parseFloat(d.quantityInput.replace(/[^\d.]/g, '')) || 0;
        const price = parseFloat(d.priceInput) || 0;
        return Math.round(qty * price);
      }),
    [drafts],
  );

  const updateDraft = (idx: number, patch: Partial<DraftLineItem>) =>
    setDrafts((prev) => prev.map((d, i) => (i === idx ? { ...d, ...patch } : d)));

  const handleSave = () => {
    const updated = drafts.map((d, i) => ({
      ...d,
      quantity: parseFloat(d.quantityInput.replace(/[^\d.]/g, '')) || 0,
      quantityLabel: d.quantityInput,
      unitPriceNGN: parseFloat(d.priceInput) || 0,
      totalNGN: totals[i],
    }));
    onSave(updated);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      showClose={false}
      className="bg-[#121212] rounded-[36px] max-w-226 border-0"
    >
      <div className="px-16 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <span className="h-8.75 w-1.25 rounded-xs bg-brand" />
            <h2 className="text-[22px] font-semibold text-[#FAFAFA] m-0">
              {`Modify Order- ${detail.summary.id}`}
            </h2>
          </div>
          <DialogPrimitive.Close
            aria-label="Close"
            className="tap-effect flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </div>
      </div>

      <div className="px-16 pb-10 flex flex-col gap-6">
        <dl className="flex flex-col gap-2 text-lg font-medium text-[#FAFAFA]">
          <Row label="Distributor:" value={`${detail.distributor.name} (Tier: ${detail.tierLabel})`} />
          <Row
            label="Original Subtotal:"
            value={<span className="text-brand italic">₦{NGN.format(detail.payment.subtotal)}</span>}
          />
          <Row label="Requested Delivery Date:" value={detail.requestedDeliveryDate} />
          <Row
            label="Reason for Modification:"
            value={<span className="text-brand italic">Required</span>}
          />
        </dl>

        <div className="flex flex-col gap-5">
          {drafts.map((draft, idx) => (
            <div
              key={draft.id}
              className="border-t border-t-[#616161B2] pt-5 first:border-0 first:pt-0"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-lg font-medium text-[#FAFAFA]">
                  {draft.name.split(' (')[0]}:
                </p>
                <p className="text-lg font-medium text-brand">
                  Total: ₦{NGN.format(totals[idx])}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldInput
                  label="Quantity:"
                  value={draft.quantityInput}
                  onChange={(v) => updateDraft(idx, { quantityInput: v })}
                />
                <FieldInput
                  label="Price Per Unit (₦):"
                  value={draft.priceInput}
                  onChange={(v) => updateDraft(idx, { priceInput: v })}
                  placeholder={String(draft.unitPriceNGN)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="tap-effect w-39.5 h-13.25 rounded-[34px] bg-brand text-brand-foreground font-semibold hover:bg-brand/90"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap">
      <dt className="font-medium mr-2">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

interface FieldInputProps {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

function FieldInput({ label, value, onChange, placeholder }: FieldInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-lg font-medium text-[#FAFAFA]">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#6161611A] h-11.75 rounded-[33px] px-5 text-base text-[#FAFAFA] placeholder:text-muted-foreground outline-none focus:outline focus:outline-brand"
      />
    </div>
  );
}
