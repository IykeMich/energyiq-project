import { useMemo } from 'react';
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridOptions,
} from 'ag-grid-community';
import { cn } from '@energyiq/shared';

ModuleRegistry.registerModules([AllCommunityModule]);

// Theme params reference CSS variables so the grid re-themes automatically when
// the .dark class toggles (or tenant branding overrides --brand-accent).
const energyiqTheme = themeQuartz.withParams({
  fontFamily: "'Montserrat Variable', sans-serif",
  backgroundColor: 'var(--surface-modal)',
  foregroundColor: 'var(--foreground)',
  headerBackgroundColor: 'var(--surface-canvas)',
  headerTextColor: 'var(--foreground)',
  rowHoverColor: 'color-mix(in oklab, var(--brand-accent) 8%, transparent)',
  selectedRowBackgroundColor: 'color-mix(in oklab, var(--brand-accent) 16%, transparent)',
  accentColor: 'var(--brand-accent)',
  borderColor: 'var(--border-subtle)',
});

export interface DataGridProps<TData> extends AgGridReactProps<TData> {
  rowData: TData[];
  columnDefs: ColDef<TData>[];
  className?: string;
}

export function DataGrid<TData>({
  className,
  defaultColDef,
  ...rest
}: DataGridProps<TData>) {
  const mergedDefaultColDef = useMemo<ColDef<TData>>(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
      ...defaultColDef,
    }),
    [defaultColDef],
  );

  return (
    <div className={cn('h-[600px] w-full', className)}>
      <AgGridReact<TData>
        theme={energyiqTheme}
        defaultColDef={mergedDefaultColDef}
        pagination
        paginationPageSize={20}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        animateRows
        suppressCellFocus
        {...rest}
      />
    </div>
  );
}

export type { ColDef, GridOptions };
