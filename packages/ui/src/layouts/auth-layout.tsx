import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left: brand panel — fixed width, doesn't stretch */}
      <div className="hidden lg:flex lg:w-[480px] bg-[#1E3A5F] text-white flex-col justify-center px-12 shrink-0">
        <div>
          <h1 className="text-3xl font-bold mb-3">EnergyIQ</h1>
          <div className="w-10 h-0.5 bg-white/30 mb-6" />
          <p className="text-base text-white/70 leading-relaxed">
            Digitize and automate the entire downstream energy value chain — from
            wholesale trade to retail operations to financial intelligence.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              Real-time supply chain visibility
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              Automated financial reconciliation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
              Bank-grade transaction integrity
            </li>
          </ul>
        </div>
      </div>

      {/* Right: auth form — centered, constrained */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <h1 className="text-2xl font-bold text-[#1E3A5F]">EnergyIQ</h1>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
