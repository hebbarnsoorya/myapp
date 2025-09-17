import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/DashboardPage'));
const Analytics = lazy(() => import('./pages/AnalyticsPage'));
const Messages = lazy(() => import('./pages/MessagesPage'));
const Settings = lazy(() => import('./pages/SettingsPage'));

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
