import {
  LayoutDashboard,
  ClipboardList,
  Receipt,
  BarChart3,
  Fuel,
  Gauge,
  Wallet,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useAuth,
} from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import { NavMain, type NavItem } from './nav-main';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const { user, slug: stateSlug } = useAuth();

  const slug = user?.slug ?? stateSlug ?? 'demo';

  const displayName =
    user?.name?.trim() || 'Andrew Franklin';

  const displayEmail =
    user?.email?.trim() || 'andrewfran@gmail.com';

  const initials = getInitials(displayName);

  // Dashboard
  const navTopItems: NavItem[] = [
    {
      title: 'Dashboard',
      url: `/${slug}/dashboard`,
      icon: LayoutDashboard,
    },
  ];

  // TRADE
  const navTradeItems: NavItem[] = [
    {
      title: 'Record Sale',
      url: `/${slug}/record-sales`,
      icon: Receipt,
    },
    {
      title: 'Sales History',
      url: `/${slug}/sales-history`,
      icon: BarChart3,
    },
  ];

  // ORDER
  const navOrderItems: NavItem[] = [
   
    {
      title: 'Orders',
      url: `/${slug}/orders`,
      icon: ClipboardList,
      activePaths: [`/${slug}/orders`],
    },
  ];

  // STATION OPS
  const navStationOpsItems: NavItem[] = [
    {
      title: 'Tank Monitoring',
      url: `/${slug}/tank-monitoring`,
      icon: Fuel,
    },
    {
      title: 'Pump & Meters',
      url: `/${slug}/pump-meters`,
      icon: Gauge,
    },
    {
      title: 'Expenses',
      url: `/${slug}/expenses`,
      icon: Wallet,
    },
  ];

  // FINANCE
  

  // COMPLIANCE
  const navComplianceItems: NavItem[] = [
    {
      title: 'KYC Documents',
      url: `/${slug}/documents`,
      icon: FileText,
    },
    {
      title: 'Complaints',
      url: `/${slug}/complaints`,
      icon: MessageSquare,
      activePaths: [`/${slug}/complaints`],
    },
  ];

  // Bottom Items
  const navSecondaryItems: NavItem[] = [
    {
      title: 'Settings',
      url: `/${slug}/settings`,
      icon: Settings,
    },
    {
      title: 'Log out',
      url: '/logout',
      icon: LogOut,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border-r border-[#27272A] bg-[#121212]"
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent className="no-scrollbar">

        <NavMain
          items={navTopItems}
          containerExtraClass="pb-0"
        />

        <NavMain
          label="TRADE"
          items={navTradeItems}
          containerExtraClass="py-0"
        />

        <NavMain
          label="ORDER"
          items={navOrderItems}
          containerExtraClass="py-0"
        />

        <NavMain
          label="STATION OPS"
          items={navStationOpsItems}
          containerExtraClass="py-0"
        />

      

        <NavMain
          label="COMPLIANCE"
          items={navComplianceItems}
          extraClass="pb-8 border-b border-[#27272A]"
          containerExtraClass="py-0"
        />

        <NavMain
          items={navSecondaryItems}
          extraClass="pb-8"
        />
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />

        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={undefined}
              alt={displayName}
            />
            <AvatarFallback className="bg-[#FBC02D] text-[#121212]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex flex-col">
            <p className="truncate text-sm font-medium text-white">
              {displayName}
            </p>

            <p className="truncate text-xs text-gray-400">
              {displayEmail}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}