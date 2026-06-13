import { useState } from 'react';
import type { FormEvent } from 'react';
import { LoadingOverlay, Modal } from '@energyiq/ui';
import { TeamPermissionsInviteField } from './team-permissions-invite-field';
import { TeamPermissionsRoleCard } from './team-permissions-role-card';
import { EMPLOYEE_ROLE_OPTIONS } from './team-permissions-mocks';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface InvitedEmployee {
  email: string;
  /** Selected role labels joined for display, e.g. "Admin & Finance". */
  rolesLabel: string;
}

interface TeamPermissionsInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: (invited: InvitedEmployee) => void;
}

const EMPTY_TOUCHED = { fullName: false, workEmail: false, roles: false };

export function TeamPermissionsInviteModal({
  open,
  onOpenChange,
  onSubmitted,
}: TeamPermissionsInviteModalProps) {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [touched, setTouched] = useState(EMPTY_TOUCHED);
  const [submitting, setSubmitting] = useState(false);

  const fullNameValid = fullName.trim().length >= 2;
  const emailValid = EMAIL_PATTERN.test(workEmail.trim());
  const rolesValid = roles.length >= 1;
  const isValid = fullNameValid && emailValid && rolesValid;

  const fullNameError = touched.fullName && !fullNameValid ? 'Full name is required' : undefined;
  const emailError =
    touched.workEmail && !emailValid
      ? workEmail.trim()
        ? 'Enter a valid work email'
        : 'Work email is required'
      : undefined;
  const rolesError = touched.roles && !rolesValid ? 'Select at least one role' : undefined;

  const resetForm = () => {
    setFullName('');
    setWorkEmail('');
    setPhone('');
    setRoles([]);
    setTouched(EMPTY_TOUCHED);
  };

  const closeAndReset = () => {
    resetForm();
    onOpenChange(false);
  };

  const toggleRole = (value: string) => {
    setTouched((previous) => ({ ...previous, roles: true }));
    setRoles((previous) =>
      previous.includes(value)
        ? previous.filter((role) => role !== value)
        : [...previous, value],
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched({ fullName: true, workEmail: true, roles: true });
    if (!isValid || submitting) return;

    const rolesLabel = EMPLOYEE_ROLE_OPTIONS.filter((option) => roles.includes(option.value))
      .map((option) => option.label)
      .join(' & ');

    // TODO(orval): replace with the generated send-invite mutation.
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);

    const invitedEmail = workEmail.trim();
    resetForm();
    onSubmitted({ email: invitedEmail, rolesLabel });
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={(next) => (next ? onOpenChange(true) : closeAndReset())}
        onBack={closeAndReset}
        title="Invite Employee"
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <p className="-mt-1 text-sm text-muted-foreground">
            The employee will receive an email with a secure link to set up their account.
          </p>

          <div className="flex flex-col gap-5">
            <h3 className="text-base font-semibold text-foreground">Personal Information</h3>

            <TeamPermissionsInviteField
              id="invite-full-name"
              label="Full Name:"
              required
              value={fullName}
              onChange={setFullName}
              onBlur={() => setTouched((previous) => ({ ...previous, fullName: true }))}
              placeholder="e.g. Amaka Nwosu"
              error={fullNameError}
            />
            <TeamPermissionsInviteField
              id="invite-work-email"
              label="Work Email"
              type="email"
              required
              value={workEmail}
              onChange={setWorkEmail}
              onBlur={() => setTouched((previous) => ({ ...previous, workEmail: true }))}
              placeholder="e.g.a.nwosu@company.ng"
              error={emailError}
            />
            <TeamPermissionsInviteField
              id="invite-phone"
              label="Phone Number:"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="+234 800 000 000"
              hint="Optional- For sms verification"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-foreground">
              Assign Roles<span className="text-brand">*</span>{' '}
              <span className="text-sm font-normal text-muted-foreground">(Select all that apply)</span>
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {EMPLOYEE_ROLE_OPTIONS.map((role) => (
                <TeamPermissionsRoleCard
                  key={role.value}
                  role={role}
                  selected={roles.includes(role.value)}
                  onToggle={() => toggleRole(role.value)}
                />
              ))}
            </div>

            {rolesError && <p className="text-xs text-danger">{rolesError}</p>}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={closeAndReset}
              className="tap-effect h-[52px] rounded-[28px] border border-border-strong px-8 font-semibold text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="tap-effect h-[52px] flex-1 rounded-[28px] bg-brand font-semibold text-brand-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>

      {submitting && <LoadingOverlay message="Sending invitation…" />}
    </>
  );
}
