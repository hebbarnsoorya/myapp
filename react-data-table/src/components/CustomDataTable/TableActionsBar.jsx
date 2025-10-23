import React, { useState } from 'react';
import ExportMenu from './ExportMenu';

const TableActionsBar = ({ table, dataList, columnsConfig }) => {
  const [globalFilter, setGlobalFilter] = useState('');

  // Updates TanStack Table's global filter state
  const handleSearch = (value) => {
    setGlobalFilter(value);
    table.setGlobalFilter(value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 p-2">
      
      {/* 1. Search Input */}
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search all columns..."
        className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:ring-[#E98D2E] focus:border-[#E98D2E]"
      />

      {/* 2. Actions: Column Visibility and Export */}
      <div className="flex space-x-3">
        {/* Column Visibility Toggle */}
        <div className="relative inline-block text-left">
          <button
            onClick={table.getToggleAllColumnsVisibilityHandler()}
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E98D2E]"
          >
            Columns ({table.getVisibleLeafColumns().length}/{table.getAllColumns().length})
          </button>
          
          {/* Note: In a production app, this should be a proper dropdown/modal */}
          {/* We'll use a hidden checkbox for simplicity here */}
          {/*
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="p-2">
              {table.getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <div key={column.id} className="text-sm">
                    <label>
                      <input
                        {...{
                          type: 'checkbox',
                          checked: column.getIsVisible(),
                          onChange: column.getToggleVisibilityHandler(),
                        }}
                      />{' '}
                      {column.columnDef.header}
                    </label>
                  </div>
                ))}
            </div>
          </div>
          */}
        </div>
        
        {/* 3. Export Menu (Reusable) */}
        <ExportMenu 
          dataList={dataList} 
          columnsConfig={columnsConfig} 
          filename="Users_Report" 
        />
      </div>
    </div>
  );
};

export default TableActionsBar;