// src/components/MainContent.jsx
import React from 'react';

const MainContent = () => {
  return (
    <main className="flex-1 p-8 bg-neutral-light overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6 text-neutral-dark">Dashboard</h1>
      <p className="text-lg text-gray-700">This is the main content area. You can display rich visualizations and data here.</p>
      {/* Placeholder for charts, tables, etc. */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
          <span className="text-gray-400">Chart Placeholder</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
          <span className="text-gray-400">Table Placeholder</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md h-64 flex items-center justify-center">
          <span className="text-gray-400">Card Placeholder</span>
        </div>
      </div>
    </main>
  );
};

export default MainContent;