import { Shield } from 'lucide-react';

export function SettingsSecurity() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Security</h2>
        <p className="text-sm text-[#FFFFFFCC] mt-1">
          Manage advanced security settings for your account.
        </p>
      </div>

      <div className="bg-[#6161611A] rounded-[18px] p-8 min-h-[360px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFFFFF1A] flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-[#FBC02D]" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Security settings coming soon
        </h3>
        <p className="text-sm text-[#FFFFFFCC] max-w-md">
          Advanced security controls such as active sessions, login history, and
          device management will be available here.
        </p>
      </div>
    </div>
  );
}
