import { useEffect, type CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@energyiq/ui';
import { AppSidebar } from './app-sidebar';
import { LayoutHeader } from './layout-header';
import { PageHeaderProvider } from './page-header';

export function DashboardLayout() {
  useEffect(() => {
    document.body.classList.add('app-dark-canvas', 'dark');
    return () => document.body.classList.remove('app-dark-canvas', 'dark');
  }, []);

  return (
    <PageHeaderProvider>
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
          <LayoutHeader />
          <div className="flex flex-1 flex-col gap-4 py-4 px-4 lg:px-8 bg-surface-canvas">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PageHeaderProvider>
  );
}
