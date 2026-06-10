import {
  LayoutDashboard,
  ShoppingCart,
  Truck,
  Wallet,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import {
  Avatar,
  AvatarFallback,
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

  const displayName = user?.name?.trim() ? user.name : 'Andrew Franklin';
  const displayEmail = user?.email?.trim() ? user.email : 'andrewfran@gmail.com';
  const initials = getInitials(displayName);

  // Slug-prefixed routes (/:slug/…). Dashboard, Orders and Complaints are wired;
  // the rest are scaffold links for the shell until those pages are built.
  const navMainItems: NavItem[] = [
    { title: 'Dashboard', url: `/${slug}/dashboard`, icon: LayoutDashboard },
    { title: 'Orders', url: `/${slug}/orders`, icon: ShoppingCart, activePaths: [`/${slug}/orders`] },
    { title: 'Deliveries', url: `/${slug}/deliveries`, icon: Truck },
    { title: 'Wallet', url: `/${slug}/wallet`, icon: Wallet },
    { title: 'Complaints', url: `/${slug}/complaints`, icon: MessageSquare },
    { title: 'Documents', url: `/${slug}/documents`, icon: FileText },
    { title: 'Analytics', url: `/${slug}/analytics`, icon: BarChart3 },
  ];

  const navSecondaryItems: NavItem[] = [
    { title: 'Settings', url: `/${slug}/settings`, icon: Settings },
    { title: 'Log out', url: '/logout', icon: LogOut },
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
