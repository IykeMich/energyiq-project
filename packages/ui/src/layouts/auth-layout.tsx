import { useEffect, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EnergyIQLogo from '../assets/auth-page-logo.png';

interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onBack?: () => void;
}

export function AuthLayout({ title, subtitle, children, onBack }: AuthLayoutProps) {
  useEffect(() => {
    document.body.classList.add('app-dark-canvas');
    return () => document.body.classList.remove('app-dark-canvas');
  }, []);

  const logo = (
    <img src={EnergyIQLogo} alt="EnergyIQ" className="h-8 sm:h-10 shrink-0" />
  );

  // Pages that pass `onBack` (the new step-based onboarding flow) render the
  // logo inline with the title on one row, per the .pen design. Every other
  // auth page keeps its original layout: logo absolutely pinned top-right,
  // title/subtitle in their own block below.
  return (
    <div className="h-screen overflow-hidden bg-[#121212] relative">
      {!onBack && (
        <div className="absolute top-6 right-6 lg:right-40 sm:top-10 sm:right-10 z-10">{logo}</div>
      )}

      <div className="h-screen flex flex-col justify-center px-6 py-24 sm:py-32 lg:px-56 lg:py-24">
        <div className="w-full mx-auto max-w-160 lg:max-w-none flex flex-col min-h-0 max-h-full">
          {(title || subtitle) && (
            <div className="mb-10 space-y-2 shrink-0">
              {title && (
                <div className={onBack ? 'flex items-center justify-between gap-4' : undefined}>
                  <h1 className="flex items-center gap-3 font-semibold text-4xl leading-none text-white">
                    {onBack && (
                      <button
                        type="button"
                        onClick={onBack}
                        aria-label="Go back"
                        className="tap-effect hover:opacity-90 flex items-center justify-center w-7.75 h-7.75 rounded-full bg-[#FBC02DB2] text-[#121212] shrink-0"
                      >
                        <ArrowLeft size={19} />
                      </button>
                    )}
                    {title}
                  </h1>
                  {onBack && logo}
                </div>
              )}
              {subtitle && (
                <p className="font-medium text-lg leading-none text-[#FFFFFFCC]">{subtitle}</p>
              )}
            </div>
          )}
          <div className={`w-full mx-auto min-h-0 overflow-y-auto ${onBack ? '' : 'lg:max-w-218.75'}`}>
            {children ?? <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}
