import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@energyiq/ui';
import EnergyIQLogo from '@energyiq/ui/assets/full-logo-image.png';
import EnergyIQMark from '@energyiq/ui/assets/auth-page-logo.png';

interface TeamSwitcherProps {
  distributorName: string;
}

export function TeamSwitcher({ distributorName }: TeamSwitcherProps) {
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
      {state === 'expanded' && (
        <SidebarMenuItem className="px-2">
          <div className="flex items-center gap-2 rounded-[8px] border border-[#FFFFFFCC] bg-[#6161611A] px-4 py-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FBC02D]" />
            <span className="truncate text-xs font-semibold text-white">{distributorName}</span>
          </div>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
