import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Messages = lazy(() => import('@/pages/Messages'));
const Settings = lazy(() => import('@/pages/Settings'));

const AppRoutes: React.FC = () => (
  <Suspense fallback={<div className='p-6'>Loadingâ€¦</div>}>
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/analytics' element={<Analytics />} />
      <Route path='/messages' element={<Messages />} />
      <Route path='/settings' element={<Settings />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
