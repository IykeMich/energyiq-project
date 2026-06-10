import { SidebarTrigger } from '@energyiq/ui';
import { HeaderUserMenu } from './header-user-menu';
import { PageHeaderSlot } from './page-header';

/**
 * Layout header. The main region is dynamic per page: a page's `PageHeaderContent`
 * renders there (e.g. a search bar). The account menu stays persistent on the
 * right; pages that supply no header content leave the main region empty.
 */
export function LayoutHeader() {
  return (
    <header className="flex pt-2 md:pt-3 md:pb-3 px-2 shrink-0 items-start md:items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-auto border-b border-b-[#D9D9D9] ">
      <div className="hidden md:flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex-1 pr-1">
        <div className="flex md:hidden justify-end items-center gap-2">
          <SidebarTrigger className="-ml-1 mt-1" />
        </div>
        <div className="flex items-center justify-between gap-4">
          {/* Main region: per-page content (PageHeaderSlot). */}
          <div className="min-w-0 flex-1">
            <PageHeaderSlot className="empty:hidden" />
          </div>
          <HeaderUserMenu />
        </div>
      </div>
    </header>
  );
}
