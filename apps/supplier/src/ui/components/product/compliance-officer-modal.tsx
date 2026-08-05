import { useEffect, useState } from 'react';
import { Modal } from '@energyiq/ui';
import { COMPLIANCE_OFFICERS } from '@/ui/pages/product/mocks';
import { SelectField, TextAreaField } from './wizard-fields';

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

      <SelectField
        label="Select Officer:"
        required
        value={officer}
        onChange={setOfficer}
        placeholder="Choose an officer"
        options={COMPLIANCE_OFFICERS}
      />

      <div className="mt-4">
        <TextAreaField
          label="Note:"
          value={note}
          onChange={setNote}
          placeholder="Review this details and get back to me."
          rows={5}
          className="bg-surface-card w-full"
        />
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
