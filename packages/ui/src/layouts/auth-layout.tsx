import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import EnergyIQLogo from '../assets/auth-page-logo.png';

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
        className="absolute top-6 right-6 lg:right-40 sm:top-10 sm:right-10 h-8 sm:h-10 z-10"
      />

      <div className="min-h-screen flex flex-col justify-center px-6 py-24 sm:py-32 lg:px-56 lg:py-24">
        <div className="w-full mx-auto max-w-160 lg:max-w-none">
          {(title || subtitle) && (
            <div className="mb-10 space-y-2">
              {title && (
                <h1 className="font-semibold text-4xl leading-none text-white">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="font-medium text-lg leading-none text-[#FFFFFFCC]">{subtitle}</p>
              )}
            </div>
          )}
          <div className="w-full mx-auto lg:max-w-218.75">
            {children ?? <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}
