// src/components/Layout.tsx
import React, { useState } from 'react';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-[var(--sidebar-width-expanded)]' : 'md:ml-[var(--sidebar-width-collapsed)]'
        } ml-0`}
      >
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="p-8 mt-16 mb-16">
          {children}
        </main>
        <Footer isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default Layout;