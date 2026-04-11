import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E3A5F] text-white flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-4">EnergyIQ</h1>
        <p className="text-lg text-white/80 leading-relaxed">
          Digitize and automate the entire downstream energy value chain — from
          wholesale trade to retail operations to financial intelligence.
        </p>
      </div>

      {/* Right: auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
