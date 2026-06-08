import { useEffect, type CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@energyiq/ui';
import { AppSidebar } from './app-sidebar';
import { DefaultHeader } from './default-header';

export function DashboardLayout() {
  useEffect(() => {
    document.body.classList.add('app-dark-canvas', 'dark');
    return () => document.body.classList.remove('app-dark-canvas', 'dark');
  }, []);

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
          '--sidebar-width-mobile': '8rem',
        } as CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="bg-surface-canvas">
        <header className="flex pt-2 md:pt-3 md:pb-3 px-2 shrink-0 items-start md:items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto border-b border-border-subtle">
          <div className="hidden md:flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex-1 pr-1">
            <div className="flex md:hidden justify-end items-center gap-2">
              <SidebarTrigger className="-ml-1 mt-1" />
            </div>
            <DefaultHeader />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-8 bg-surface-canvas">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
