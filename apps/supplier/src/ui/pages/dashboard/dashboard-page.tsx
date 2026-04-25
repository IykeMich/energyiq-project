import { useAuth } from '@energyiq/ui';

export function DashboardPage() {
  const { user, loginType } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Overview</h3>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Account Number</dt>
            <dd className="font-medium text-gray-900">{user?.account_number}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Login Type</dt>
            <dd className="font-medium text-gray-900">
              {loginType === 'account' ? 'Account Owner' : `Staff (${user?.role})`}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Organization</dt>
            <dd className="font-medium text-gray-900">{user?.slug}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium text-gray-900 capitalize">{user?.role}</dd>
          </div>
        </dl>
      </div>

      <p className="text-gray-400 text-sm mt-8">
        Dashboard modules will be built out as each phase is implemented.
      </p>
    </div>
  );
}
