import React, { useState } from 'react';
import { exportToPdf, exportToCsv, exportToExcel } from './utils/exportHandlers';

// Note: Assumes columnsConfig includes the header and accessorKey
const ExportMenu = ({ dataList, columnsConfig, filename = 'table_data' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format) => {
    switch (format) {
      case 'csv':
        exportToCsv(dataList, columnsConfig, filename);
        break;
      case 'excel':
        exportToExcel(dataList, columnsConfig, filename);
        break;
      case 'pdf':
        exportToPdf(dataList, columnsConfig, filename);
        break;
      default:
        console.error('Unsupported export format');
    }
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'CSV', format: 'csv' },
    { label: 'Excel (XLSX)', format: 'excel' },
    { label: 'PDF', format: 'pdf' }
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E98D2E]"
      >
        Export
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {menuItems.map(({ label, format }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#E98D2E]"
                role="menuitem"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;