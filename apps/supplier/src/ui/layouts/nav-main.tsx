import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  NotificationBadge,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@energyiq/ui';

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  description?: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  /** Renders the item in the gold accent color (e.g. Log Out), regardless of active state. */
  accent?: boolean;
  badge?: number;
  /** Optional: paths that should keep this nav item active (e.g. child routes). */
  activePaths?: string[];
  items?: NavSubItem[];
}

interface NavMainProps {
  items: NavItem[];
  /** Optional uppercase section header rendered above the group (e.g. "TRADE"). */
  label?: string;
  extraClass?: string;
  containerExtraClass?: string;
}

export function NavMain({ items, label, extraClass, containerExtraClass }: NavMainProps) {
  return (
    <SidebarGroup className={`h-auto ${containerExtraClass ?? ''}`}>
      {label && (
        <SidebarGroupLabel className="px-4 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu className={`space-y-0 ${extraClass ?? ''}`}>
        {items.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavMainItem({ item }: { item: NavItem }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { state } = useSidebar();

  const isActivePath =
    currentPath === item.url ||
    (item.activePaths?.some((path) => currentPath.startsWith(path)) ?? false);
  const isChildActive = item.items?.some((subItem) => currentPath === subItem.url) ?? false;
  const hasChildren = (item.items?.length ?? 0) > 0;

  // Seed the open state from the route (so a deep link / reload onto a child
  // lands expanded), then let the user freely toggle it like a dropdown.
  const [open, setOpen] = useState(isActivePath || isChildActive || Boolean(item.isActive));

  const handleParentClick = () => {
    // Leaf items navigate. Parents with children just toggle the dropdown
    // (the wrapping CollapsibleTrigger flips `open`), except when the sidebar
    // is collapsed to icons — there is no panel to show, so navigate instead.
    if (!hasChildren || state === 'collapsed') navigate(item.url);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild className="group/collapsible">
      <SidebarMenuItem className="flex flex-row items-center gap-x-2 relative">
        <div
          className={`${isActivePath ? 'flex' : 'hidden'} ${
            state === 'expanded' ? 'flex' : 'hidden'
          } bg-[#FBC02D] w-1.5 h-8 rounded-r-lg absolute -left-2`}
        />
        <div className="flex flex-col w-full">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActivePath}
              onClick={handleParentClick}
              tooltip={item.title}
              className={`tap-effect h-[42px]! ${state === 'expanded' ? 'ml-4' : 'ml-0'}`}
            >
              {item.icon && (
                <item.icon
                  className={`transition-colors ${
                    item.accent
                      ? 'text-[#FBC02D] stroke-[#FBC02D]'
                      : isActivePath
                        ? 'stroke-white'
                        : 'text-gray-400 stroke-gray-400'
                  } ${isActivePath && state === 'collapsed' ? '-ml-1' : ''}`}
                />
              )}
              <span
                className={`text-sm font-normal leading-6 transition-colors ${
                  item.accent ? 'text-[#FBC02D]' : !isActivePath ? 'text-gray-400' : ''
                }`}
              >
                {item.title}
              </span>
              {item.badge && <NotificationBadge count={item.badge} />}
              {hasChildren && (
                <ChevronDown className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {hasChildren && (
            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <SidebarMenuSub className="mx-0 translate-x-0 border-l-0 px-0">
                {item.items?.map((subItem) => {
                  const isSubActive = currentPath === subItem.url;
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isSubActive}
                        className="[&>svg]:size-3.5 text-gray-400 data-[active=true]:bg-[#FBC02D]/10 data-[active=true]:text-[#FBC02D] data-[active=true]:font-medium"
                      >
                        <button
                          type="button"
                          onClick={() => navigate(subItem.url)}
                          className="w-full text-left"
                        >
                          {subItem.icon && <subItem.icon />}
                          <span className="truncate">{subItem.title}</span>
                          {subItem.description && !isSubActive && (
                            <span className="ml-auto text-[10px] text-gray-500 hidden xl:block truncate">
                              {subItem.description}
                            </span>
                          )}
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  );
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </div>
      </SidebarMenuItem>
    </Collapsible>
  );
}
