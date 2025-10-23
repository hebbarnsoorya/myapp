import React from 'react';

const TablePagination = ({ table, pageSizeOptions }) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalRows = table.getRowCount();

  const startRow = Math.min(totalRows, pageIndex * pageSize + 1);
  const endRow = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200">
      
      {/* 1. Rows Per Page */}
      <div className="flex items-center space-x-2 text-sm text-gray-700 mb-4 sm:mb-0">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="p-1 border border-gray-300 rounded-md focus:ring-[#E98D2E] focus:border-[#E98D2E]"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Row Count Display */}
      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
        Showing **{startRow}** to **{endRow}** of **{totalRows}** results
      </div>

      {/* 3. Navigation Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className="p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          &lt;&lt;
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          &lt;
        </button>
        <div className="flex items-center px-2 text-sm text-gray-700">
          Page **{pageIndex + 1}** of **{pageCount}**
        </div>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          &gt;
        </button>
        <button
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
          className="p-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default TablePagination;