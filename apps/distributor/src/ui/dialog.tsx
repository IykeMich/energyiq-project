import type { ReactNode } from 'react';


interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}


export function Dialog({
  open,
  children,
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {children}
    </div>
  );
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({
  children,
  className = '',
}: DialogContentProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70" />

      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2">
        <div className={className}>
          {children}
        </div>
      </div>
    </>
  );
}

interface DialogHeaderProps {
  children: ReactNode;
}

export function DialogHeader({
  children,
}: DialogHeaderProps) {
  return <div>{children}</div>;
}

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export function DialogTitle({
  children,
  className,
}: DialogTitleProps) {
  return (
    <h2
      className={`text-lg font-semibold ${className}`}
    >
      {children}
    </h2>
  );
}