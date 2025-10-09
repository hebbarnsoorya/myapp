// src/components/LeftNav.tsx
import React from 'react';
import { Home, BarChart2, Briefcase, Settings } from 'lucide-react';
import '../styles/LeftNav.scss';

// Define the props interface for the component
interface LeftNavProps {
  isOpen: boolean;
}

const LeftNav: React.FC<LeftNavProps> = ({ isOpen }) => {
  return (
    <nav className={`fixed md:sticky top-16 md:top-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="p-4 flex flex-col space-y-2">
        <a href="#" className="nav-item flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors">
          <Home className="mr-3 h-5 w-5" />
          <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors">
          <BarChart2 className="mr-3 h-5 w-5" />
          <span>Analytics</span>
        </a>
        <a href="#" className="nav-item flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors">
          <Briefcase className="mr-3 h-5 w-5" />
          <span>Projects</span>
        </a>
        <hr className="my-2" />
        <a href="#" className="nav-item flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors">
          <Settings className="mr-3 h-5 w-5" />
          <span>Settings</span>
        </a>
      </div>
    </nav>
  );
};

export default LeftNav;