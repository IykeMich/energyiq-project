import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOverlay, SuccessModal } from '@energyiq/ui';
import type { DistributorInvitePayload } from '@/ui/pages/distributor/mocks';
import { InviteFormField } from './invite-form-field';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  distributorName: '',
  email: '',
  phone: '',
  contactPerson: '',
  location: '',
  assuranceAmount: '',
};

type InviteFormState = typeof EMPTY_FORM;

export function InviteDistributorForm() {
  const navigate = useNavigate();
  const { slug = '' } = useParams<{ slug: string }>();
  const [form, setForm] = useState<InviteFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [invitedName, setInvitedName] = useState('');

  const setField = (key: keyof InviteFormState) => (next: string) =>
    setForm((prev) => ({ ...prev, [key]: next }));

  const isValid =
    form.distributorName.trim().length >= 2 &&
    EMAIL_PATTERN.test(form.email) &&
    form.phone.trim().length >= 7 &&
    form.contactPerson.trim().length >= 2 &&
    form.location.trim().length >= 2;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid || submitting) return;

    const payload: DistributorInvitePayload = {
      distributorName: form.distributorName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      contactPerson: form.contactPerson.trim(),
      location: form.location.trim(),
      assuranceAmountNGN: form.assuranceAmount ? Number(form.assuranceAmount) : undefined,
    };

    // TODO(orval): replace with the generated send-invite mutation.
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setInvitedName(payload.distributorName);
    setSuccessOpen(true);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-[28px] border border-border-subtle p-7"
      >
        <h2 className="text-base text-muted-foreground">Distributor Details</h2>

        <div className="flex flex-col gap-5">
          <InviteFormField
            id="distributorName"
            label="Distributor Name:"
            value={form.distributorName}
            onChange={setField('distributorName')}
            placeholder="Starlink Oil & Gas Limited"
          />
          <InviteFormField
            id="email"
            label="Email Address:"
            type="email"
            value={form.email}
            onChange={setField('email')}
            placeholder="chinedu@gmail.com"
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <InviteFormField
              id="phone"
              label="Phone Number:"
              type="tel"
              value={form.phone}
              onChange={setField('phone')}
              placeholder="08035552134"
            />
            <InviteFormField
              id="contactPerson"
              label="Contact Person:"
              value={form.contactPerson}
              onChange={setField('contactPerson')}
              placeholder="Chinedu Okafor"
            />
            <InviteFormField
              id="location"
              label="Location:"
              value={form.location}
              onChange={setField('location')}
              placeholder="Lagos State"
            />
            <InviteFormField
              id="assuranceAmount"
              label="Assurance Amount"
              optional
              currency
              value={form.assuranceAmount}
              onChange={setField('assuranceAmount')}
              placeholder="50,000"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="h-[52px] rounded-[28px] bg-brand px-8 font-semibold text-brand-foreground disabled:opacity-40"
          >
            Send Invite
          </button>
        </div>
      </form>

      {submitting && <LoadingOverlay message="Sending Invite…" />}

      <SuccessModal
        open={successOpen}
        onOpenChange={(open) => !open && setSuccessOpen(false)}
        title="Invite Sent"
        subtitle={`${invitedName} has been invited. They have 7 days to accept the invitation.`}
        primaryAction={{ label: 'Done', onClick: () => navigate(`/${slug}/distributors`) }}
        buttonLayout="stack"
      />
    </>
  );
}
