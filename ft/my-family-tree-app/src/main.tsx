import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { FamilyTreeProvider } from './context/FamilyTreeProvider.tsx';
import { mockFamilyData } from './data/mockFamilyData'; // <--- Import mock data here too

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Pass the initial mock data to the FamilyTreeProvider */}
    <FamilyTreeProvider initialData={mockFamilyData}>
      <App />
    </FamilyTreeProvider>
  </React.StrictMode>,
);