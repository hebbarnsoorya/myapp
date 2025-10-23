import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

import TableActionsBar from './TableActionsBar';
import TablePagination from './TablePagination';

const CustomDataTable = ({ dataList, columnsConfig, pageSizeOptions = [5, 10, 25, 50] }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState(
    columnsConfig.reduce((acc, col) => {
      acc[col.accessorKey] = col.isVisible !== false;
      return acc;
    }, {})
  );

  // TanStack Table configuration
  const table = useReactTable({
    data: dataList,
    columns: columnsConfig,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: pageSizeOptions[0] },
    },
  });

  // --- Render Logic ---

  return (
    <div className="p-4 bg-white shadow-xl rounded-lg border border-gray-100 font-sans">
      
      {/* 1. Search, Export, and Column Visibility Controls */}
      <TableActionsBar 
        table={table} 
        dataList={dataList}
        columnsConfig={columnsConfig}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          
          {/* 2. Table Header with Sort */}
          <thead className="bg-[#E98D2E] text-white">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    // Tailwind for sortable header and styling
                    className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wider ${header.column.getCanSort() ? 'cursor-pointer select-none hover:bg-opacity-90' : ''}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {/* Header Name */}
                    {header.isPlaceholder ? null : header.column.columnDef.header}
                    
                    {/* Sort Icon */}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          {/* 3. Table Body with Rich Visualization */}
          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {/* Use custom cell renderer if provided, otherwise render default value */}
                    {cell.column.columnDef.cellRenderer 
                      ? cell.column.columnDef.cellRenderer({ row: row.original, value: cell.getValue() })
                      : cell.renderValue()}
                  </td>
                ))}
              </tr>
            ))}
            
            {/* Empty State */}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columnsConfig.length} className="text-center py-8 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination and Rows per Page Controls */}
      <TablePagination 
        table={table} 
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
};

export default CustomDataTable;