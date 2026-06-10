import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import { COMPLIANCE_OFFICERS } from '@/ui/pages/product/mocks';
import { Field, SelectField } from './wizard-fields';

interface ComplianceOfficerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (data: { officer: string; note: string }) => void;
}

export function ComplianceOfficerModal({
  open,
  onOpenChange,
  onAssign,
}: ComplianceOfficerModalProps) {
  const [officer, setOfficer] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setOfficer('');
      setNote('');
    }
  }, [open]);

  const canAssign = officer.trim().length > 0;

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Assign To Compliance Team" size="lg">
      <p className="text-sm text-foreground mb-5">Select an officer for the review product</p>

      <Field label="Select Officer:" required>
        <SelectField
          value={officer}
          onChange={setOfficer}
          placeholder="Choose an officer"
          options={COMPLIANCE_OFFICERS}
        />
      </Field>

      <div className="mt-4">
        <Field label="Note:">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Review this details and get back to me."
            rows={5}
            className="bg-surface-card border border-border-strong rounded-[24px] p-5 text-foreground placeholder:text-muted-foreground outline-none focus:border-brand resize-none w-full"
          />
        </Field>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => canAssign && onAssign({ officer, note })}
          disabled={!canAssign}
          className="h-[53px] rounded-[28px] bg-brand text-brand-foreground font-semibold px-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Assign Officer
        </button>
      </div>
    </Modal>
  );
}
