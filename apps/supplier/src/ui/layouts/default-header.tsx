import { useLocation } from 'react-router-dom';
import { BadgeCheck, Bell, LogOut } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useAuth,
} from '@energyiq/ui';
import { getInitials } from '@energyiq/shared';
import ProfileImage from '@/assets/employee-image.png';

const ROUTE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard Overview',
  distributors: 'Distributors',
  inventory: 'Inventory',
  orders: 'Orders',
  financials: 'Financials',
  complaints: 'Complaints',
  analytics: 'Analytics',
  documents: 'Documents',
  employees: 'Employees',
  sophia: 'Sophia',
  settings: 'Settings',
};

function resolveTitle(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const tail = segments[segments.length - 1] ?? '';
  return ROUTE_TITLES[tail] ?? 'Dashboard Overview';
}

export function DefaultHeader() {
  const location = useLocation();
  const currentRouteTitle = resolveTitle(location.pathname);
  const { user, logout } = useAuth();

  const displayName = user?.name?.trim() ? user.name : 'Emily Franklin';
  const displayEmail = user?.email?.trim() ? user.email : 'emily@energyiq.com';
  const initials = getInitials(displayName);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-1 pr-5">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-[16px] leading-[100%] text-[#FFFFFF] font-semibold tracking-[-0.02em]">
              {currentRouteTitle}
            </h3>
          </div>
        </div>

        <div className="flex flex-row items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 bg-[#6161611A]! hover:bg-[#6161611A]! rounded-full inline-flex items-center justify-center px-4! py-1"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-[35px] w-[35px] rounded-full shrink-0">
                    <AvatarImage src={ProfileImage} alt={displayName} />
                    <AvatarFallback className="rounded-full bg-[#FBC02D] text-[#121212]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-sm:hidden flex flex-col gap-1 justify-start items-start">
                    <h3 className="font-normal text-sm leading-none text-[#FAFAFA]">{displayName}</h3>
                    <h3 className="font-normal text-xs leading-none text-[#616161B2]">Executive</h3>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={ProfileImage} alt={displayName} />
                    <AvatarFallback className="rounded-lg bg-[#FBC02D] text-[#121212]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs">{displayEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
}
