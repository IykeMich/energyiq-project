import {
  LayoutDashboard,
  Users,
  Package,
  Tag,
  Ruler,
  ShoppingCart,
  Warehouse,
  Award,
  Wallet,
  ArrowLeftRight,
  Receipt,
  FileCheck,
  ScrollText,
  MessageSquareWarning,
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

  // Dashboard sits above the labelled sections (matches the design).
  const navTopItems: NavItem[] = [
    { title: 'Dashboard', url: `/${slug}/dashboard`, icon: LayoutDashboard },
  ];

  const navTradeItems: NavItem[] = [
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
    { title: 'Inventory', url: `/${slug}/inventory`, icon: Warehouse },
    {
      title: 'Orders',
      url: `/${slug}/orders`,
      icon: ShoppingCart,
      activePaths: [`/${slug}/orders`],
    },
  ];

  // TODO: Tier Management has no page yet — link will 404 until that page lands.
  const navNetworkItems: NavItem[] = [
    { title: 'Distributors', url: `/${slug}/distributors`, icon: Users },
    { title: 'Tier Management', url: `/${slug}/tier-management`, icon: Award },
  ];

  // TODO: Accounts / Transactions / Sales Entry have no pages yet — links will 404 until they land.
  const navFinanceItems: NavItem[] = [
    { title: 'Accounts', url: `/${slug}/accounts`, icon: Wallet },
    { title: 'Transactions', url: `/${slug}/transactions`, icon: ArrowLeftRight },
    { title: 'Sales Entry', url: `/${slug}/sales-entry`, icon: Receipt },
  ];

  const navComplianceItems: NavItem[] = [
    { title: 'KYC Documents', url: `/${slug}/kyc-documents`, icon: FileCheck },
    {
      title: 'Complaints',
      url: `/${slug}/complaints`,
      icon: MessageSquareWarning,
      activePaths: [`/${slug}/complaints`],
    },
    { title: 'Audit Logs', url: `/${slug}/audit-logs`, icon: ScrollText },
  ];

  // TODO: Team & Permissions has no page yet — link will 404 until that page lands.
  const navSecondaryItems: NavItem[] = [
    { title: 'Team & Permissions', url: `/${slug}/team-permissions`, icon: UserCog },
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
        <NavMain items={navTopItems} containerExtraClass="pb-0" />
        <NavMain items={navTradeItems} label="Trade" containerExtraClass="py-0" />
        <NavMain items={navNetworkItems} label="Network" containerExtraClass="py-0" />
        <NavMain items={navFinanceItems} label="Finances" containerExtraClass="py-0" />
        <NavMain
          items={navComplianceItems}
          label="Compliance"
          extraClass="pb-8 border-b border-gray-800"
          containerExtraClass="py-0"
        />
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
