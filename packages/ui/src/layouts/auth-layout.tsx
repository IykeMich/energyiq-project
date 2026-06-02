import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import EnergyIQLogo from '../assets/full-logo-image.png';

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  useEffect(() => {
    document.body.classList.add('app-dark-canvas');
    return () => document.body.classList.remove('app-dark-canvas');
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] relative">
      <img
        src={EnergyIQLogo}
        alt="EnergyIQ"
        className="absolute top-6 right-6 sm:top-10 sm:right-10 h-8 sm:h-10 z-10"
      />

      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 sm:py-32">
        <div className="w-full max-w-[640px]">
          {(title || subtitle) && (
            <div className="mb-10 space-y-2">
              {title && (
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          )}
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
}
