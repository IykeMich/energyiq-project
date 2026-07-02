import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { Button, InputField, PasswordField } from '@energyiq/ui';
import {
  userProfilePageSchema,
  type UserProfilePageFormData,
} from '@/ui/validation/settings/user-profile';
import { USER_PROFILE_MOCK } from './settings-mocks';
import { SettingsToggle } from './settings-toggle';

interface SettingsUserProfileProps {
  onSwitchToCompany: () => void;
}

export function SettingsUserProfile({ onSwitchToCompany }: SettingsUserProfileProps) {
  const { control, handleSubmit } = useForm<UserProfilePageFormData>({
    resolver: zodResolver(userProfilePageSchema),
    defaultValues: {
      full_name: USER_PROFILE_MOCK.full_name,
      email: USER_PROFILE_MOCK.email,
      phone_number: USER_PROFILE_MOCK.phone_number,
      role: USER_PROFILE_MOCK.role,
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(true);

  const onSubmit = (data: UserProfilePageFormData) => {
    // TODO(orval): wire PATCH user profile + change password endpoints once they land.
    // eslint-disable-next-line no-console
    console.log('Save user profile', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">User Profile</h2>
          <p className="text-sm text-[#FFFFFFCC] mt-1">
            Personal account settings and security.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onSwitchToCompany}
            className="border-[#FBC02D] text-[#FBC02D] bg-transparent hover:bg-[#FBC02D]/10"
          >
            Go to Company Profile
          </Button>
          <Button
            type="submit"
            className="bg-[#FBC02D] text-[#121212] hover:bg-[#FBC02D]/90"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-[#6161611A] rounded-[18px] p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-8">
            <section>
              <h3 className="text-base font-medium text-white mb-4">Basic Information</h3>
              <div className="bg-[#FFFFFF1A] rounded-2xl p-5 flex items-start gap-4 mb-5">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-[#FBC02D] flex items-center justify-center text-[#121212] text-xl font-bold">
                    {USER_PROFILE_MOCK.avatar_initials}
                  </div>
                  <button
                    type="button"
                    className="text-xs text-[#FBC02D] hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    Upload New Logo
                  </button>
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-base font-medium text-white">{USER_PROFILE_MOCK.full_name}</p>
                  <p className="text-sm text-[#FFFFFFCC]">
                    {USER_PROFILE_MOCK.sub_role} • {USER_PROFILE_MOCK.role}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <InputField
                  control={control}
                  name="full_name"
                  label="Full Name:"
                  placeholder="Enter full name"
                />
                <InputField
                  control={control}
                  name="email"
                  label="Email Address:"
                  type="email"
                  placeholder="Enter email address"
                />
                <InputField
                  control={control}
                  name="phone_number"
                  label="Phone Number:"
                  type="tel"
                  placeholder="Enter phone number"
                />
                <InputField
                  control={control}
                  name="role"
                  label="Role:"
                  placeholder="Enter role"
                />
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <section>
              <h3 className="text-base font-medium text-white mb-4">Change Password</h3>
              <div className="bg-[#FFFFFF1A] rounded-2xl p-5 space-y-4">
                <PasswordField
                  control={control}
                  name="current_password"
                  label="Current Password:"
                  placeholder="Enter current password"
                />
                <PasswordField
                  control={control}
                  name="new_password"
                  label="New Password"
                  placeholder="Min 8 characters"
                />
                <PasswordField
                  control={control}
                  name="confirm_password"
                  label="Confirm Password:"
                  placeholder="Re-type new password"
                />
              </div>
            </section>

            <section>
              <h3 className="text-base font-medium text-white mb-4">Two Factor Authentication</h3>
              <div className="bg-[#FFFFFF1A] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Enable 2FA</p>
                    <p className="text-xs text-[#FFFFFFCC] mt-0.5">
                      Secure your account with SMS or Authenticator
                    </p>
                  </div>
                  <SettingsToggle
                    checked={isTwoFactorEnabled}
                    onCheckedChange={setIsTwoFactorEnabled}
                    label="Enable two factor authentication"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#616161B2]">
                  <div>
                    <p className="text-sm font-medium text-white">Method:</p>
                    <p className="text-xs text-[#FFFFFFCC] mt-0.5">
                      SMS to +234 804 657 3456
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-[#FBC02D] hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </form>
  );
}
