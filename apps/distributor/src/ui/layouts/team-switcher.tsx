import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@energyiq/ui';
import EnergyIQLogo from '@energyiq/ui/assets/full-logo-image.png';
import EnergyIQMark from '@energyiq/ui/assets/auth-page-logo.png';

export function TeamSwitcher() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="mt-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-transparent!"
        >
          <div className="flex aspect-square items-center justify-center rounded-lg">
            {state === 'expanded' ? (
              <img src={EnergyIQLogo} alt="EnergyIQ Logo" className="w-full h-[34px]" />
            ) : (
              <img src={EnergyIQMark} alt="EnergyIQ Logo" className="h-[34px]" />
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
