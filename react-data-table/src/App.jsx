import React from 'react';
import CustomDataTable from './components/CustomDataTable/CustomDataTable';
import data from './data/users.json';

// --- Rich Visualization Components/Styling ---

const StatusPill = ({ status }) => {
  const colorMap = {
    'Active': 'bg-green-100 text-green-800',
    'Inactive': 'bg-red-100 text-red-800',
    'Pending': 'bg-[#FFD700] text-yellow-900', // Secondary Accent Color
  };
  return (
    <span 
      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        style={{ width: `${progress}%` }} 
        className="h-2 rounded-full bg-[#E98D2E]" // Primary Accent Color
      ></div>
    </div>
  );
};

// --- Column Configuration (Reusable) ---

const userColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
    isVisible: false, // Hidden by default
  },
  {
    accessorKey: 'name',
    header: 'User Name',
    // Custom renderer for rich visualization (e.g., bolding)
    cellRenderer: ({ value, row }) => (
      <div className="font-semibold text-lg text-[#E98D2E]">
        {value}
        <p className="text-xs text-gray-500 font-normal">{row.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    // Rich visualization: Status Pill
    cellRenderer: ({ value }) => <StatusPill status={value} />,
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    // Rich visualization: Progress Bar
    cellRenderer: ({ value }) => <ProgressBar progress={value} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined Date',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    enableSorting: false, // Disable sorting for action column
    // Rich visualization: Action button
    cellRenderer: () => (
      <button className="text-sm text-[#E98D2E] hover:text-opacity-80 font-medium">
        View
      </button>
    ),
  },
];


function App() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-[#E98D2E] mb-6">
        Production Standard User Management Table
      </h1>
      
      <CustomDataTable 
        dataList={data} 
        columnsConfig={userColumns} 
        pageSizeOptions={[5, 10, 20]} // Override default page size options
      />
    </div>
  );
}

export default App;