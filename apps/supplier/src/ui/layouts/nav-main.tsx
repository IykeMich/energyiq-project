import { ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  NotificationBadge,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@energyiq/ui';

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
  items?: { title: string; url: string }[];
}

interface NavMainProps {
  items: NavItem[];
  extraClass?: string;
  containerExtraClass?: string;
}

export function NavMain({ items, extraClass, containerExtraClass }: NavMainProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { state } = useSidebar();

  return (
    <SidebarGroup className={`h-auto ${containerExtraClass ?? ''}`}>
      <SidebarMenu className={`space-y-0 ${extraClass ?? ''}`}>
        {items.map((item) => {
          const isActivePath =
            currentPath === item.url ||
            (item.activePaths?.some((path) => currentPath.startsWith(path)) ?? false);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActivePath || item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="flex flex-row items-center gap-x-2 relative">
                <div
                  className={`${isActivePath ? 'flex' : 'hidden'} ${
                    state === 'expanded' ? 'flex' : 'hidden'
                  } bg-[#FBC02D] w-1.5 h-8 rounded-r-lg absolute -left-2`}
                />
                <div className={`${state === 'expanded' ? 'flex' : ''} w-full`}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isActivePath}
                      onClick={() => navigate(item.url)}
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
                      {(item.items?.length ?? 0) > 0 && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {(item.items?.length ?? 0) > 0 && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <button
                                type="button"
                                onClick={() => navigate(subItem.url)}
                                className="w-full text-left"
                              >
                                <span>{subItem.title}</span>
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </div>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
