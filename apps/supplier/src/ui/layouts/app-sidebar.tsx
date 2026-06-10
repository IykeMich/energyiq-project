import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Ruler,
  ShoppingCart,
  Warehouse,
  DollarSign,
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
  const { user, slug: stateSlug } = useAuth();
  const slug = user?.slug ?? stateSlug ?? 'demo';

  const displayName = user?.name?.trim() ? user.name : 'Andrew Franklin';
  const displayEmail = user?.email?.trim() ? user.email : 'andrewfran@gmail.com';
  const initials = getInitials(displayName);

  const navMainItems: NavItem[] = [
    { title: 'Dashboard', url: `/${slug}/dashboard`, icon: LayoutDashboard },
    {
      title: 'Products',
      url: `/${slug}/products`,
      icon: Package,
      activePaths: [`/${slug}/products`],
      items: [
        { title: 'Catalog', url: `/${slug}/products`, icon: Package, description: 'All products' },
        {
          title: 'Categories',
          url: `/${slug}/products/categories`,
          icon: Tag,
          description: 'Group products',
        },
        {
          title: 'Units of Measure',
          url: `/${slug}/products/units`,
          icon: Ruler,
          description: 'Units & sizing',
        },
      ],
    },
    {
      title: 'Orders',
      url: `/${slug}/orders`,
      icon: ShoppingCart,
      activePaths: [`/${slug}/orders`],
    },
    { title: 'Distributors', url: `/${slug}/distributors`, icon: Users },
    { title: 'Inventory', url: `/${slug}/inventory`, icon: Warehouse },
    { title: 'Financials', url: `/${slug}/financials`, icon: DollarSign },
    { title: 'Analytics', url: `/${slug}/analytics`, icon: BarChart3 },
    { title: 'Documents', url: `/${slug}/documents`, icon: FileText },
    { title: 'Employees', url: `/${slug}/employees`, icon: UserCog },
    { title: 'Sophia', url: `/${slug}/sophia`, icon: UserCog },
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
