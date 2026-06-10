import { createContext, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Makes the layout header dynamic per page: a page supplies its own header
 * content (e.g. a search bar) that renders in the header's main region, while the
 * avatar menu stays persistent. Content is teleported via a portal, so it remains
 * in the page's React tree and page state keeps driving the page body.
 */
const PageHeaderSlotContext = createContext<{
  slot: HTMLElement | null;
  setSlot: (element: HTMLElement | null) => void;
} | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  return (
    <PageHeaderSlotContext.Provider value={{ slot, setSlot }}>
      {children}
    </PageHeaderSlotContext.Provider>
  );
}

/** Render target for per-page header content. Placed once by the layout header. */
export function PageHeaderSlot({ className }: { className?: string }) {
  const context = useContext(PageHeaderSlotContext);
  return <div ref={context?.setSlot ?? undefined} className={className} />;
}

/** Used by a page to render its own content in the layout header's main region. */
export function PageHeaderContent({ children }: { children: ReactNode }) {
  const context = useContext(PageHeaderSlotContext);
  if (!context?.slot) return null;
  return createPortal(children, context.slot);
}
