import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Sheet, SheetContent } from '@energyiq/ui';
import { TeamPermissionsDetailsContent } from './team-permissions-details-content';
import { TeamPermissionsEditContent } from './team-permissions-edit-content';
import type { EmployeeRow } from './team-permissions-mocks';

export type EmployeeDrawerMode = 'view' | 'edit';

interface TeamPermissionsEmployeeDrawerProps {
  employee: EmployeeRow | null;
  initialMode: EmployeeDrawerMode;
  onOpenChange: (open: boolean) => void;
  onSaved: (employee: EmployeeRow) => void;
  onDeactivate: (employee: EmployeeRow) => void;
}

/** Right slide-over showing a single employee's details, switchable between view and edit. */
export function TeamPermissionsEmployeeDrawer({
  employee,
  initialMode,
  onOpenChange,
  onSaved,
  onDeactivate,
}: TeamPermissionsEmployeeDrawerProps) {
  return (
    <Sheet open={employee !== null} onOpenChange={onOpenChange}>
      {/* Tall frame: a fixed header over a scrolling body that cuts crisply behind
          solid top/bottom bands (mirrors the product details sheet). */}
      <SheetContent
        side="right"
        showClose={false}
        overlayClassName="bg-[#121212]/40"
        className="inset-y-3 mr-4 h-auto w-full gap-0 overflow-hidden rounded-[28px] border-l-0 bg-[#121212] p-0 sm:max-w-[520px]"
      >
        {employee && (
          <EmployeeDrawerBody
            key={`${employee.id}-${initialMode}`}
            employee={employee}
            initialMode={initialMode}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
            onDeactivate={onDeactivate}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

interface EmployeeDrawerBodyProps {
  employee: EmployeeRow;
  initialMode: EmployeeDrawerMode;
  onClose: () => void;
  onSaved: (employee: EmployeeRow) => void;
  onDeactivate: (employee: EmployeeRow) => void;
}

/** Inner content, keyed by employee id + mode so per-employee state resets on selection. */
function EmployeeDrawerBody({
  employee,
  initialMode,
  onClose,
  onSaved,
  onDeactivate,
}: EmployeeDrawerBodyProps) {
  const [mode, setMode] = useState<EmployeeDrawerMode>(initialMode);

  return (
    <>
      <div className="shrink-0 px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-1 rounded-full bg-brand" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-foreground">Employee Details</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="h-full overflow-y-auto overscroll-contain px-8 py-6">
          {mode === 'view' ? (
            <TeamPermissionsDetailsContent employee={employee} onEdit={() => setMode('edit')} />
          ) : (
            <TeamPermissionsEditContent
              employee={employee}
              onCancel={onClose}
              onSave={onSaved}
              onDeactivate={() => onDeactivate(employee)}
            />
          )}
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#121212]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#121212]" />
      </div>
    </>
  );
}
