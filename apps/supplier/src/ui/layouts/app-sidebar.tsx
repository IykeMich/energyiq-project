import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  BarChart3,
  FileText,
  UserCog,
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
  const { user } = useAuth();

  const displayName = user?.name?.trim() ? user.name : 'Andrew Franklin';
  const displayEmail = user?.email?.trim() ? user.email : 'andrewfran@gmail.com';
  const initials = getInitials(displayName);

  const navMainItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Distributors', url: '/distributors', icon: Users },
    { title: 'Inventory', url: '/inventory', icon: Package },
    { title: 'Orders', url: '/orders', icon: ShoppingCart },
    { title: 'Financials', url: '/financials', icon: DollarSign },
    { title: 'Complaints', url: '/complaints', icon: MessageSquare },
    { title: 'Analytics', url: '/analytics', icon: BarChart3 },
    { title: 'Documents', url: '/documents', icon: FileText },
    { title: 'Employees', url: '/employees', icon: UserCog },
  ];

  const navSecondaryItems: NavItem[] = [
    { title: 'Settings', url: '/settings', icon: Settings },
    { title: 'Log Out', url: '/logout', icon: LogOut, accent: true },
  ];

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="border border-[#27272A] border-s-0 bg-[#121212]"
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        <NavMain items={navMainItems} extraClass="pb-8 border-b border-gray-800" />
        <NavMain items={navSecondaryItems} extraClass="pb-8" />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={undefined} alt={displayName} />
            <AvatarFallback className="bg-[#FBC02D] text-[#121212]">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
