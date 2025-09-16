import React from 'react';
import HeaderBar from '@/components/layout/HeaderBar';
import Sidebar from '@/components/layout/Sidebar';
import FooterBar from '@/components/layout/FooterBar';
import { useApp } from '@/store/AppContext';
import AppRoutes from './routes';

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useApp();
  return (
    <div className='min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100'>
      <HeaderBar />
      <Sidebar />
      <main
        className='container mx-auto px-4'
        style={{
          paddingTop: 'calc(var(--header-height) + 1rem)',
          paddingBottom: '2rem',
          marginLeft: state.sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-width-collapsed)',
          transition: 'margin-left .3s',
        }}
      >
        {children}
      </main>
      <FooterBar />
    </div>
  );
};

const App: React.FC = () => <AppShell><AppRoutes /></AppShell>;
export default App;
