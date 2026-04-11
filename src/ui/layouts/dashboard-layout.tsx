import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/ui/hooks/use-auth';

export function DashboardLayout() {
  const { user, loginType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-[#1E3A5F] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">EnergyIQ</h1>
          {user && (
            <span className="text-sm text-white/60">
              {user.account_number} &middot; {loginType === 'account' ? 'Account Owner' : user.role}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm">{user.name || user.email}</span>}
          <button
            onClick={handleLogout}
            className="text-sm text-white/80 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
