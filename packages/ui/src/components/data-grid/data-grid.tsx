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

const energyiqTheme = themeQuartz.withParams({
  fontFamily: "'Montserrat Variable', sans-serif",
  backgroundColor: '#1F1F1F',
  foregroundColor: '#FFFFFF',
  headerBackgroundColor: '#121212',
  headerTextColor: '#FFFFFF',
  rowHoverColor: 'rgba(251, 192, 45, 0.08)',
  selectedRowBackgroundColor: 'rgba(251, 192, 45, 0.16)',
  accentColor: '#FBC02D',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  rowBorder: { color: 'rgba(255, 255, 255, 0.06)' },
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
